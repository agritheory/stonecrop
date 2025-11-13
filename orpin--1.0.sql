-- orpin--1.0.sql
CREATE SCHEMA IF NOT EXISTS orpin;
SET search_path = orpin, public;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS temporal_tables;
CREATE EXTENSION IF NOT EXISTS unit;

CREATE OR REPLACE FUNCTION orpin.GENERATED_TIMESTAMP()
RETURNS TIMESTAMP WITH TIME ZONE
AS $$
BEGIN
  RETURN timezone('UTC', current_timestamp);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Base audit table
CREATE TABLE IF NOT EXISTS base_table (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID,
	modified_at TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (GENERATED_TIMESTAMP()) STORED,
	modified_by UUID
);

-- User table inheriting audit fields
CREATE TABLE IF NOT EXISTS orpin."user" (
	username TEXT NOT NULL UNIQUE,
	password_hash BYTEA NOT NULL,
	refresh_token BYTEA,
	disabled BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (id),
	CONSTRAINT fk_user_created_by FOREIGN KEY (created_by) REFERENCES orpin."user" (id),
	CONSTRAINT fk_user_modified_by FOREIGN KEY (modified_by) REFERENCES orpin."user" (id)
) INHERITS (base_table);


-- Role table inheriting audit fields
CREATE TABLE IF NOT EXISTS role (
	role_name TEXT NOT NULL UNIQUE,
	description TEXT,
	parent_role UUID,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY (id),
	CONSTRAINT valid_parent CHECK (
		id != parent_role OR parent_role IS NULL
	),
	CONSTRAINT fk_parent_role FOREIGN KEY (parent_role) REFERENCES orpin.role (id) ON DELETE SET NULL,
	CONSTRAINT fk_user_created_by FOREIGN KEY (created_by) REFERENCES orpin."user" (id),
	CONSTRAINT fk_user_modified_by FOREIGN KEY (modified_by) REFERENCES orpin."user" (id)
) INHERITS (base_table);


-- Function to check for circular role dependencies
CREATE OR REPLACE FUNCTION CHECK_ROLE_CIRCULAR_DEPENDENCY()
RETURNS TRIGGER AS $$
DECLARE
    v_current_role UUID;
    v_visited_roles UUID[];
    v_max_depth INTEGER := 1000; -- Prevent infinite loops
    v_depth INTEGER := 0;
BEGIN
    -- Only check if parent_role is being set
    IF NEW.parent_role IS NULL THEN
        RETURN NEW;
    END IF;

    -- Start traversal from the new parent role
    v_current_role := NEW.parent_role;
    v_visited_roles := ARRAY[NEW.id]; -- Include the role being updated

    -- Traverse up the hierarchy to check for cycles
    WHILE v_current_role IS NOT NULL AND v_depth < v_max_depth LOOP
        -- If we encounter the original role, we have a cycle
        IF v_current_role = NEW.id THEN
            RAISE EXCEPTION 'Role hierarchy violates check constraint: circular dependency detected'
                USING ERRCODE = 'check_violation';
        END IF;

        -- If we've seen this role before, we have a cycle
        IF v_current_role = ANY(v_visited_roles) THEN
            RAISE EXCEPTION 'Role hierarchy violates check constraint: circular dependency detected'
                USING ERRCODE = 'check_violation';
        END IF;

        -- Add current role to visited list
        v_visited_roles := v_visited_roles || v_current_role;

        -- Get the parent of the current role
        SELECT parent_role INTO v_current_role
        FROM role
        WHERE id = v_current_role;

        v_depth := v_depth + 1;
    END LOOP;

    -- If we hit max depth, something is wrong
    IF v_depth >= v_max_depth THEN
        RAISE EXCEPTION 'Role hierarchy too deep, possible circular dependency'
            USING ERRCODE = 'check_violation';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent circular dependencies when updating role parent
CREATE TRIGGER trg_check_role_circular_dependency
BEFORE INSERT OR UPDATE ON role
FOR EACH ROW
WHEN (new.parent_role IS NOT NULL)
EXECUTE FUNCTION CHECK_ROLE_CIRCULAR_DEPENDENCY();

-- Ability rules table inheriting audit fields
CREATE TABLE IF NOT EXISTS ability_rule (
	role_id UUID NOT NULL,
	doctype TEXT NOT NULL,
	action TEXT NOT NULL,
	subject TEXT NOT NULL,
	conditions JSONB,
	inverted BOOLEAN NOT NULL DEFAULT FALSE,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES orpin.role (id) ON DELETE CASCADE,
	CONSTRAINT fk_user_created_by FOREIGN KEY (created_by) REFERENCES orpin."user" (id),
	CONSTRAINT fk_user_modified_by FOREIGN KEY (modified_by) REFERENCES orpin."user" (id)
) INHERITS (base_table);

-- User-role assignment table inheriting audit fields
CREATE TABLE IF NOT EXISTS has_role (
	user_id UUID NOT NULL,
	role_id UUID NOT NULL,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	CONSTRAINT pk_user_role PRIMARY KEY (user_id, role_id),
	CONSTRAINT fk_user_created_by FOREIGN KEY (created_by) REFERENCES orpin."user" (id),
	CONSTRAINT fk_user_modified_by FOREIGN KEY (modified_by) REFERENCES orpin."user" (id)
) INHERITS (base_table);

--  hash function
CREATE OR REPLACE FUNCTION HASH_USER_PASSWORD()
RETURNS TRIGGER AS $$
BEGIN
  -- Only hash password if it's being set/changed
  IF (TG_OP = 'INSERT') OR
     (TG_OP = 'UPDATE' AND NEW.password_hash != OLD.password_hash) THEN

    NEW.password_hash := convert_to(
      crypt(
        convert_from(NEW.password_hash, 'UTF8'),
        gen_salt('bf', 12)
      ),
      'UTF8'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- attach hash function to user table
CREATE TRIGGER trg_hash_password
BEFORE INSERT OR UPDATE ON orpin."user"
FOR EACH ROW
EXECUTE FUNCTION HASH_USER_PASSWORD();

-- login validation function
CREATE OR REPLACE FUNCTION VALIDATE_LOGIN(
	p_username TEXT,
	p_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_password_hash BYTEA;
    v_disabled BOOLEAN;
BEGIN
    -- Get the stored password hash and disabled status for the user
    SELECT password_hash, disabled
    INTO v_password_hash, v_disabled
    FROM orpin."user"
    WHERE username = p_username;

    -- Check if user exists and is not disabled
    IF v_password_hash IS NULL OR v_disabled = TRUE THEN
        RETURN FALSE;
    END IF;

    -- Verify password using crypt function
    RETURN convert_from(v_password_hash, 'UTF8') = crypt(p_password, convert_from(v_password_hash, 'UTF8'));
END;
$$ LANGUAGE plpgsql;

-- Generate refresh token for password reset
CREATE OR REPLACE FUNCTION RESET_PASSWORD(
	p_username TEXT,
	p_password TEXT
)
RETURNS BYTEA AS $$
DECLARE
    v_user_id UUID;
    v_password_hash BYTEA;
    v_disabled BOOLEAN;
    v_refresh_token BYTEA;
BEGIN
    -- Get user details for validation
    SELECT id, password_hash, disabled
    INTO v_user_id, v_password_hash, v_disabled
    FROM orpin."user"
    WHERE username = p_username;

    -- Check if user exists and is not disabled
    IF v_user_id IS NULL OR v_disabled = TRUE THEN
        RETURN NULL;
    END IF;

    -- Verify password
    IF NOT (convert_from(v_password_hash, 'UTF8') = crypt(p_password, convert_from(v_password_hash, 'UTF8'))) THEN
        RETURN NULL;
    END IF;

    -- Generate refresh token
    v_refresh_token := gen_random_bytes(32);

    -- Update user with refresh token
    UPDATE orpin."user"
    SET refresh_token = v_refresh_token
    WHERE id = v_user_id;

    RETURN v_refresh_token;
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_role_user ON has_role (user_id) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_role_role ON has_role (role_id) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_role_active ON role (active);
CREATE INDEX IF NOT EXISTS idx_role_parent ON role (parent_role) WHERE parent_role IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ability_role ON ability_rule (role_id) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_ability_doctype ON ability_rule (doctype) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_ability_conditions ON ability_rule USING gin (conditions) WHERE conditions IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ability_role_doctype ON ability_rule (role_id, doctype) WHERE active = TRUE;

-- Core Statechart Definition Tables
-- Maps directly to XState statechart concepts for flat state machines
-- To be added to orpin--1.0.sql

SET search_path = orpin, public;

-- Core machine definition
CREATE TABLE statechart_machine (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	entity_type TEXT NOT NULL UNIQUE, -- maps to table names that use this FSM
	machine_id TEXT NOT NULL,         -- XState machine identifier
	name TEXT NOT NULL,               -- Human-readable name
	version TEXT NOT NULL DEFAULT '1.0.0',
	initial_state TEXT NOT NULL,
	context_schema JSONB,             -- JSON Schema for context validation
	description TEXT,
	is_active BOOLEAN DEFAULT TRUE,
	CONSTRAINT fk_user_created_by FOREIGN KEY (created_by) REFERENCES orpin."user" (id),
	CONSTRAINT fk_user_modified_by FOREIGN KEY (modified_by) REFERENCES orpin."user" (id)
) INHERITS (base_table);

-- States (atomic or final only - no compound states)
CREATE TABLE statechart_state (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	machine_id UUID NOT NULL REFERENCES statechart_machine (id) ON DELETE CASCADE,
	state_key TEXT NOT NULL,          -- state identifier (no dots - flat only)
	state_type TEXT NOT NULL DEFAULT 'atomic'
	CHECK (state_type IN ('atomic', 'final')),
	display_name TEXT,
	description TEXT,
	meta JSONB DEFAULT '{}',          -- XState meta information
	entry_actions TEXT [] DEFAULT '{}', -- array of action names
	exit_actions TEXT [] DEFAULT '{}',  -- array of action names

	UNIQUE (machine_id, state_key),

	-- Ensure state_key doesn't contain dots (no nested states)
	CONSTRAINT no_dots_in_state_key CHECK (state_key !~ '\.'),
	CONSTRAINT fk_user_created_by FOREIGN KEY (created_by) REFERENCES orpin."user" (id),
	CONSTRAINT fk_user_modified_by FOREIGN KEY (modified_by) REFERENCES orpin."user" (id)
) INHERITS (base_table);

-- Events that can trigger transitions
CREATE TABLE statechart_event (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	machine_id UUID NOT NULL REFERENCES statechart_machine (id) ON DELETE CASCADE,
	event_type TEXT NOT NULL,
	event_schema JSONB,               -- JSON Schema for event payload validation
	description TEXT,

	UNIQUE (machine_id, event_type),
	CONSTRAINT fk_user_created_by FOREIGN KEY (created_by) REFERENCES orpin."user" (id),
	CONSTRAINT fk_user_modified_by FOREIGN KEY (modified_by) REFERENCES orpin."user" (id)
) INHERITS (base_table);

-- Transitions between states
CREATE TABLE statechart_transition (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	machine_id UUID NOT NULL REFERENCES statechart_machine (id) ON DELETE CASCADE,
	source_state_key TEXT NOT NULL,
	target_state_key TEXT NOT NULL,
	event_type TEXT,                  -- NULL for eventless transitions
	guard_name TEXT,                  -- guard function name (optional)
	actions TEXT [] DEFAULT '{}',      -- actions to execute during transition
	description TEXT,
	priority INTEGER DEFAULT 0,       -- for ordering when multiple transitions possible
	is_active BOOLEAN DEFAULT TRUE,

	-- Foreign key constraints
	FOREIGN KEY (machine_id, source_state_key)
	REFERENCES statechart_state (machine_id, state_key) ON DELETE CASCADE,
	FOREIGN KEY (machine_id, target_state_key)
	REFERENCES statechart_state (machine_id, state_key) ON DELETE CASCADE,
	FOREIGN KEY (machine_id, event_type)
	REFERENCES statechart_event (machine_id, event_type) ON DELETE CASCADE,

	-- Ensure we don't have duplicate transitions for same source/event combination
	UNIQUE (machine_id, source_state_key, event_type, priority),
	CONSTRAINT fk_user_created_by FOREIGN KEY (created_by) REFERENCES orpin."user" (id),
	CONSTRAINT fk_user_modified_by FOREIGN KEY (modified_by) REFERENCES orpin."user" (id)
) INHERITS (base_table);

-- Create indexes for performance
CREATE INDEX idx_statechart_machine_entity_type ON statechart_machine (entity_type);
CREATE INDEX idx_statechart_machine_active ON statechart_machine (is_active) WHERE is_active = TRUE;

CREATE INDEX idx_statechart_state_machine ON statechart_state (machine_id);
CREATE INDEX idx_statechart_state_type ON statechart_state (state_type);

CREATE INDEX idx_statechart_event_machine ON statechart_event (machine_id);
CREATE INDEX idx_statechart_event_type ON statechart_event (machine_id, event_type);

CREATE INDEX idx_statechart_transition_machine ON statechart_transition (machine_id);
CREATE INDEX idx_statechart_transition_source ON statechart_transition (machine_id, source_state_key);
CREATE INDEX idx_statechart_transition_target ON statechart_transition (machine_id, target_state_key);
CREATE INDEX idx_statechart_transition_event ON statechart_transition (machine_id, event_type);
CREATE INDEX idx_statechart_transition_active ON statechart_transition (machine_id, source_state_key, is_active)
WHERE is_active = TRUE;

-- Helper function to validate that initial_state exists in states
CREATE OR REPLACE FUNCTION VALIDATE_INITIAL_STATE()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if initial_state exists as a state for this machine
    IF NOT EXISTS (
        SELECT 1 FROM statechart_state
        WHERE machine_id = NEW.id AND state_key = NEW.initial_state
    ) THEN
        RAISE EXCEPTION 'Initial state "%" does not exist for machine "%"',
            NEW.initial_state, NEW.machine_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to validate initial state when machine is updated
DROP TRIGGER IF EXISTS validate_machine_initial_state ON statechart_machine;

-- Trigger to validate initial state when machine is updated
CREATE CONSTRAINT TRIGGER validate_machine_initial_state
AFTER INSERT OR UPDATE OF initial_state ON statechart_machine
INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION VALIDATE_INITIAL_STATE();

-- Helper function to get machine by entity type
CREATE OR REPLACE FUNCTION GET_STATECHART_MACHINE(p_entity_type TEXT)
RETURNS STATECHART_MACHINE AS $$
DECLARE
    machine_record statechart_machine;
BEGIN
    SELECT * INTO machine_record
    FROM statechart_machine
    WHERE entity_type = p_entity_type AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No active statechart machine found for entity type: %', p_entity_type;
    END IF;

    RETURN machine_record;
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper function to get valid transitions from a state
CREATE OR REPLACE FUNCTION GET_VALID_TRANSITIONS(
	p_entity_type TEXT,
	p_current_state TEXT
) RETURNS TABLE (
	target_state TEXT,
	event_type TEXT,
	guard_name TEXT,
	actions TEXT [],
	description TEXT
) AS $$
DECLARE
    machine_record statechart_machine;
BEGIN
    machine_record := get_statechart_machine(p_entity_type);

    RETURN QUERY
    SELECT
        t.target_state_key,
        t.event_type,
        t.guard_name,
        t.actions,
        t.description
    FROM statechart_transition t
    WHERE t.machine_id = machine_record.id
      AND t.source_state_key = p_current_state
      AND t.is_active = true
    ORDER BY t.priority DESC, t.created_at ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper function to validate a transition is allowed
CREATE OR REPLACE FUNCTION IS_VALID_TRANSITION(
	p_entity_type TEXT,
	p_from_state TEXT,
	p_to_state TEXT,
	p_event_type TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    machine_record statechart_machine;
    transition_exists BOOLEAN;
BEGIN
    machine_record := get_statechart_machine(p_entity_type);

    SELECT EXISTS(
        SELECT 1 FROM statechart_transition
        WHERE machine_id = machine_record.id
          AND source_state_key = p_from_state
          AND target_state_key = p_to_state
          AND (event_type = p_event_type OR (event_type IS NULL AND p_event_type IS NULL))
          AND is_active = true
    ) INTO transition_exists;

    RETURN transition_exists;
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper function to get machine configuration as JSON (XState compatible)
CREATE OR REPLACE FUNCTION GET_MACHINE_CONFIG(p_entity_type TEXT)
RETURNS JSONB AS $$
DECLARE
    machine_record statechart_machine;
    config JSONB;
    states_json JSONB;
    events_json JSONB;
    transitions_json JSONB;
BEGIN
    machine_record := get_statechart_machine(p_entity_type);

    -- Build events array
    SELECT jsonb_agg(DISTINCT t.event_type ORDER BY t.event_type) INTO events_json
    FROM statechart_transition t
    WHERE t.machine_id = machine_record.id
      AND t.event_type IS NOT NULL
      AND t.is_active = true;

    -- Build transitions within states and merge with states
    WITH transition_groups AS (
        SELECT
            t.source_state_key,
            jsonb_agg(
                jsonb_build_object(
                    'target', t.target_state_key,
                    'event', t.event_type,
                    'guard', t.guard_name,
                    'actions', CASE WHEN array_length(t.actions, 1) > 0 THEN to_jsonb(t.actions) ELSE NULL END
                ) - 'guard' - 'actions' - 'event' ||
                CASE WHEN t.guard_name IS NOT NULL THEN jsonb_build_object('guard', t.guard_name) ELSE '{}'::jsonb END ||
                CASE WHEN array_length(t.actions, 1) > 0 THEN jsonb_build_object('actions', to_jsonb(t.actions)) ELSE '{}'::jsonb END ||
                CASE WHEN t.event_type IS NOT NULL THEN jsonb_build_object('event', t.event_type) ELSE '{}'::jsonb END
                ORDER BY t.priority DESC, t.created_at ASC
            ) as transitions
        FROM statechart_transition t
        WHERE t.machine_id = machine_record.id AND t.is_active = true
        GROUP BY t.source_state_key
    )
    SELECT jsonb_object_agg(
        state_key,
        COALESCE(state_config, '{}'::jsonb) || CASE
            WHEN tg.transitions IS NOT NULL THEN jsonb_build_object('on', tg.transitions)
            ELSE '{}'::jsonb
        END
    ) INTO states_json
    FROM (
        SELECT
            s.state_key,
            CASE
                WHEN s.state_type = 'atomic' THEN
                    jsonb_build_object(
                        'meta', s.meta,
                        'entry', CASE WHEN array_length(s.entry_actions, 1) > 0 THEN to_jsonb(s.entry_actions) ELSE NULL END,
                        'exit', CASE WHEN array_length(s.exit_actions, 1) > 0 THEN to_jsonb(s.exit_actions) ELSE NULL END
                    )
                ELSE
                    jsonb_build_object(
                        'type', s.state_type,
                        'meta', s.meta,
                        'entry', CASE WHEN array_length(s.entry_actions, 1) > 0 THEN to_jsonb(s.entry_actions) ELSE NULL END,
                        'exit', CASE WHEN array_length(s.exit_actions, 1) > 0 THEN to_jsonb(s.exit_actions) ELSE NULL END
                    )
            END as state_config
        FROM statechart_state s
        WHERE s.machine_id = machine_record.id
    ) states
    LEFT JOIN transition_groups tg ON states.state_key = tg.source_state_key;

    -- Build final config
    config := jsonb_build_object(
        'id', machine_record.machine_id,
        'version', machine_record.version,
        'initial', machine_record.initial_state,
        'context', CASE WHEN machine_record.context_schema IS NOT NULL THEN machine_record.context_schema ELSE '{}'::jsonb END,
        'states', states_json
    );

    RETURN config;
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper function to list all machines
CREATE OR REPLACE FUNCTION LIST_STATECHART_MACHINES()
RETURNS TABLE (
	entity_type TEXT,
	machine_id TEXT,
	name TEXT,
	version TEXT,
	initial_state TEXT,
	state_count BIGINT,
	event_count BIGINT,
	transition_count BIGINT,
	is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.entity_type,
        m.machine_id,
        m.name,
        m.version,
        m.initial_state,
        COALESCE(s.state_count, 0) as state_count,
        COALESCE(e.event_count, 0) as event_count,
        COALESCE(t.transition_count, 0) as transition_count,
        m.is_active
    FROM statechart_machine m
    LEFT JOIN (
        SELECT ss.machine_id, COUNT(*) as state_count
        FROM statechart_state ss
        GROUP BY ss.machine_id
    ) s ON m.id = s.machine_id
    LEFT JOIN (
        SELECT se.machine_id, COUNT(*) as event_count
        FROM statechart_event se
        GROUP BY se.machine_id
    ) e ON m.id = e.machine_id
    LEFT JOIN (
        SELECT st.machine_id, COUNT(*) as transition_count
        FROM statechart_transition st
        WHERE st.is_active = true
        GROUP BY st.machine_id
    ) t ON m.id = t.machine_id
    ORDER BY m.entity_type;
END;
$$ LANGUAGE plpgsql STABLE;

-- Business Logic Functions for Permission System

-- Get all roles for a user including inherited roles through hierarchy
CREATE OR REPLACE FUNCTION GET_USER_ROLES_WITH_INHERITANCE(p_user_id UUID)
RETURNS TABLE (role_id UUID, role_name TEXT, level INTEGER) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE role_hierarchy AS (
        -- Base case: direct roles assigned to user
        SELECT hr.role_id, r.role_name, r.parent_role, 0 as level
        FROM has_role hr
        JOIN role r ON hr.role_id = r.id
        WHERE hr.user_id = p_user_id
          AND hr.active = true
          AND r.active = true

        UNION ALL

        -- Recursive case: parent roles
        SELECT pr.id as role_id, pr.role_name, pr.parent_role, rh.level + 1
        FROM role_hierarchy rh
        JOIN role pr ON rh.parent_role = pr.id
        WHERE pr.active = true
    )
    SELECT DISTINCT rh.role_id, rh.role_name, rh.level
    FROM role_hierarchy rh
    ORDER BY rh.level, rh.role_name;
END;
$$ LANGUAGE plpgsql STABLE;

-- Check if a user has permission for a specific action on a doctype with conditions
CREATE OR REPLACE FUNCTION CHECK_USER_PERMISSION(
	p_user_id UUID,
	p_action TEXT,
	p_doctype TEXT,
	p_resource_conditions JSONB DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_has_permission BOOLEAN := FALSE;
    v_rule RECORD;
    v_condition_match BOOLEAN;
BEGIN
    -- Get all ability rules for user's roles (including inherited)
    FOR v_rule IN
        SELECT ar.action, ar.doctype, ar.subject, ar.conditions, ar.inverted, ar.active
        FROM ability_rule ar
        JOIN GET_USER_ROLES_WITH_INHERITANCE(p_user_id) ur ON ar.role_id = ur.role_id
        WHERE ar.doctype = p_doctype
          AND ar.action = p_action
          AND ar.active = true
        ORDER BY ur.level ASC  -- Process more specific roles first
    LOOP
        -- Check if conditions match
        v_condition_match := TRUE;

        IF v_rule.conditions IS NOT NULL AND p_resource_conditions IS NOT NULL THEN
            -- Simple JSONB containment check for now
            -- In production, you'd want more sophisticated condition evaluation
            v_condition_match := p_resource_conditions @> v_rule.conditions;
        ELSIF v_rule.conditions IS NOT NULL AND p_resource_conditions IS NULL THEN
            v_condition_match := FALSE;
        END IF;

        -- Apply rule if conditions match
        IF v_condition_match THEN
            IF v_rule.inverted THEN
                -- Inverted rule denies permission
                v_has_permission := FALSE;
                EXIT; -- Deny rules are final
            ELSE
                -- Allow rule grants permission
                v_has_permission := TRUE;
                -- Continue checking for potential deny rules
            END IF;
        END IF;
    END LOOP;

    RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql STABLE;

-- Advanced permission check with subject evaluation
CREATE OR REPLACE FUNCTION CHECK_USER_PERMISSION_WITH_SUBJECT(
	p_user_id UUID,
	p_action TEXT,
	p_doctype TEXT,
	p_resource_conditions JSONB DEFAULT NULL,
	p_subject_context JSONB DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_has_permission BOOLEAN := FALSE;
    v_rule RECORD;
    v_condition_match BOOLEAN;
    v_subject_match BOOLEAN;
BEGIN
    -- Get all ability rules for user's roles (including inherited)
    FOR v_rule IN
        SELECT ar.action, ar.doctype, ar.subject, ar.conditions, ar.inverted, ar.active
        FROM ability_rule ar
        JOIN GET_USER_ROLES_WITH_INHERITANCE(p_user_id) ur ON ar.role_id = ur.role_id
        WHERE ar.doctype = p_doctype
          AND ar.action = p_action
          AND ar.active = true
        ORDER BY ur.level ASC
    LOOP
        -- Check subject constraints
        v_subject_match := TRUE;

        IF v_rule.subject = 'own' AND p_subject_context IS NOT NULL THEN
            -- For "own" subject, check if created_by matches user
            v_subject_match := (p_subject_context->>'created_by')::UUID = p_user_id;
        ELSIF v_rule.subject = 'conditional' THEN
            -- Subject depends on conditions evaluation
            v_subject_match := TRUE; -- Will be evaluated in condition check
        END IF;

        -- Check conditions
        v_condition_match := TRUE;

        IF v_rule.conditions IS NOT NULL AND p_resource_conditions IS NOT NULL THEN
            v_condition_match := p_resource_conditions @> v_rule.conditions;
        ELSIF v_rule.conditions IS NOT NULL AND p_resource_conditions IS NULL THEN
            v_condition_match := FALSE;
        END IF;

        -- Apply rule if both subject and conditions match
        IF v_subject_match AND v_condition_match THEN
            IF v_rule.inverted THEN
                v_has_permission := FALSE;
                EXIT; -- Deny rules are final
            ELSE
                v_has_permission := TRUE;
            END IF;
        END IF;
    END LOOP;

    RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get all effective permissions for a user (for caching)
CREATE OR REPLACE FUNCTION GET_USER_EFFECTIVE_PERMISSIONS(p_user_id UUID)
RETURNS TABLE (doctype TEXT, action TEXT, subject TEXT, conditions JSONB, inverted BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ar.doctype, ar.action, ar.subject, ar.conditions, ar.inverted
    FROM ability_rule ar
    JOIN GET_USER_ROLES_WITH_INHERITANCE(p_user_id) ur ON ar.role_id = ur.role_id
    WHERE ar.active = true
    ORDER BY ar.doctype, ar.action;
END;
$$ LANGUAGE plpgsql STABLE;

-- Trigger function for permission cache invalidation
CREATE OR REPLACE FUNCTION INVALIDATE_USER_PERMISSIONS_CACHE()
RETURNS TRIGGER AS $$
BEGIN
    -- In a real implementation, this would notify cache invalidation systems
    -- For now, we'll use NOTIFY to signal cache invalidation

    IF TG_TABLE_NAME = 'has_role' THEN
        -- User role assignment changed
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
            PERFORM pg_notify('permissions_changed', NEW.user_id::TEXT);
        ELSIF TG_OP = 'DELETE' THEN
            PERFORM pg_notify('permissions_changed', OLD.user_id::TEXT);
        END IF;
    ELSIF TG_TABLE_NAME = 'ability_rule' THEN
        -- Ability rule changed - need to invalidate all users with this role
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
            PERFORM pg_notify('role_permissions_changed', NEW.role_id::TEXT);
        ELSIF TG_OP = 'DELETE' THEN
            PERFORM pg_notify('role_permissions_changed', OLD.role_id::TEXT);
        END IF;
    ELSIF TG_TABLE_NAME = 'role' THEN
        -- Role hierarchy changed
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
            PERFORM pg_notify('role_hierarchy_changed', NEW.id::TEXT);
        ELSIF TG_OP = 'DELETE' THEN
            PERFORM pg_notify('role_hierarchy_changed', OLD.id::TEXT);
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for cache invalidation
CREATE TRIGGER trg_invalidate_permissions_has_role
AFTER INSERT OR UPDATE OR DELETE ON has_role
FOR EACH ROW EXECUTE FUNCTION INVALIDATE_USER_PERMISSIONS_CACHE();

CREATE TRIGGER trg_invalidate_permissions_ability_rule
AFTER INSERT OR UPDATE OR DELETE ON ability_rule
FOR EACH ROW EXECUTE FUNCTION INVALIDATE_USER_PERMISSIONS_CACHE();

CREATE TRIGGER trg_invalidate_permissions_role
AFTER INSERT OR UPDATE OR DELETE ON role
FOR EACH ROW EXECUTE FUNCTION INVALIDATE_USER_PERMISSIONS_CACHE();

-- Advanced Permission Business Logic Functions

-- Validate and evaluate complex JSONB conditions (MongoDB-style operators)
CREATE OR REPLACE FUNCTION EVALUATE_CONDITIONS(
	p_resource_data JSONB,
	p_rule_conditions JSONB
) RETURNS BOOLEAN AS $$
DECLARE
    condition_key TEXT;
    condition_value JSONB;
    resource_value JSONB;
    operator_key TEXT;
    operator_value JSONB;
BEGIN
    -- If no conditions, always match
    IF p_rule_conditions IS NULL THEN
        RETURN TRUE;
    END IF;

    -- If no resource data but conditions exist, no match
    IF p_resource_data IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Iterate through each condition
    FOR condition_key, condition_value IN SELECT key, value FROM jsonb_each(p_rule_conditions)
    LOOP
        resource_value := p_resource_data -> condition_key;

        -- Handle different condition types
        IF jsonb_typeof(condition_value) = 'object' THEN
            -- Handle operators like {"$lt": 5}, {"$in": ["blog", "social"]}, etc.
            FOR operator_key, operator_value IN SELECT key, value FROM jsonb_each(condition_value)
            LOOP
                CASE operator_key
                    WHEN '$lt' THEN
                        IF jsonb_typeof(resource_value) = 'number' AND jsonb_typeof(operator_value) = 'number' THEN
                            IF NOT ((resource_value)::numeric < (operator_value)::numeric) THEN
                                RETURN FALSE;
                            END IF;
                        ELSE
                            IF NOT ((resource_value #>> '{}') < (operator_value #>> '{}')) THEN
                                RETURN FALSE;
                            END IF;
                        END IF;
                    WHEN '$lte' THEN
                        IF jsonb_typeof(resource_value) = 'number' AND jsonb_typeof(operator_value) = 'number' THEN
                            IF NOT ((resource_value)::numeric <= (operator_value)::numeric) THEN
                                RETURN FALSE;
                            END IF;
                        ELSE
                            IF NOT ((resource_value #>> '{}') <= (operator_value #>> '{}')) THEN
                                RETURN FALSE;
                            END IF;
                        END IF;
                    WHEN '$gt' THEN
                        IF jsonb_typeof(resource_value) = 'number' AND jsonb_typeof(operator_value) = 'number' THEN
                            IF NOT ((resource_value)::numeric > (operator_value)::numeric) THEN
                                RETURN FALSE;
                            END IF;
                        ELSE
                            IF NOT ((resource_value #>> '{}') > (operator_value #>> '{}')) THEN
                                RETURN FALSE;
                            END IF;
                        END IF;
                    WHEN '$gte' THEN
                        IF jsonb_typeof(resource_value) = 'number' AND jsonb_typeof(operator_value) = 'number' THEN
                            IF NOT ((resource_value)::numeric >= (operator_value)::numeric) THEN
                                RETURN FALSE;
                            END IF;
                        ELSE
                            IF NOT ((resource_value #>> '{}') >= (operator_value #>> '{}')) THEN
                                RETURN FALSE;
                            END IF;
                        END IF;
                    WHEN '$in' THEN
                        IF NOT (resource_value <@ operator_value OR operator_value ? (resource_value #>> '{}')) THEN
                            RETURN FALSE;
                        END IF;
                    WHEN '$nin' THEN
                        IF resource_value <@ operator_value OR operator_value ? (resource_value #>> '{}') THEN
                            RETURN FALSE;
                        END IF;
                    ELSE
                        -- Unknown operator, treat as exact match
                        IF resource_value != operator_value THEN
                            RETURN FALSE;
                        END IF;
                END CASE;
            END LOOP;
        ELSIF jsonb_typeof(condition_value) = 'array' THEN
            -- Handle array conditions like "status": ["draft", "published"]
            IF NOT (resource_value <@ condition_value OR condition_value ? (resource_value #>> '{}')) THEN
                RETURN FALSE;
            END IF;
        ELSE
            -- Handle simple equality
            IF resource_value != condition_value THEN
                RETURN FALSE;
            END IF;
        END IF;
    END LOOP;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Enhanced permission check with advanced condition evaluation
CREATE OR REPLACE FUNCTION CHECK_USER_PERMISSION_ADVANCED(
	p_user_id UUID,
	p_action TEXT,
	p_doctype TEXT,
	p_resource_data JSONB DEFAULT NULL,
	p_context JSONB DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_has_permission BOOLEAN := FALSE;
    v_rule RECORD;
    v_condition_match BOOLEAN;
    v_subject_match BOOLEAN;
BEGIN
    -- Get all ability rules for user's roles (including inherited)
    FOR v_rule IN
        SELECT ar.action, ar.doctype, ar.subject, ar.conditions, ar.inverted, ar.active, ur.level
        FROM ability_rule ar
        JOIN GET_USER_ROLES_WITH_INHERITANCE(p_user_id) ur ON ar.role_id = ur.role_id
        WHERE ar.doctype = p_doctype
          AND ar.action = p_action
          AND ar.active = true
        ORDER BY ur.level ASC, ar.inverted DESC  -- Process denies first within each level
    LOOP
        -- Check subject constraints
        v_subject_match := TRUE;

        IF v_rule.subject = 'own' THEN
            -- For "own" subject, check if user owns the resource
            IF p_resource_data IS NULL OR (p_resource_data->>'created_by')::UUID != p_user_id THEN
                v_subject_match := FALSE;
            END IF;
        ELSIF v_rule.subject = 'conditional' THEN
            -- Subject depends on conditions evaluation
            v_subject_match := TRUE;
        END IF;

        -- Check conditions using advanced evaluation
        v_condition_match := EVALUATE_CONDITIONS(p_resource_data, v_rule.conditions);

        -- Apply rule if both subject and conditions match
        IF v_subject_match AND v_condition_match THEN
            IF v_rule.inverted THEN
                v_has_permission := FALSE;
                EXIT; -- Deny rules are final
            ELSE
                v_has_permission := TRUE;
                -- Continue checking for potential deny rules
            END IF;
        END IF;
    END LOOP;

    RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get user permissions for a specific resource with evaluation context
CREATE OR REPLACE FUNCTION GET_USER_RESOURCE_PERMISSIONS(
	p_user_id UUID,
	p_doctype TEXT,
	p_resource_data JSONB DEFAULT NULL
) RETURNS TABLE (action TEXT, allowed BOOLEAN, rule_source TEXT) AS $$
DECLARE
    v_actions TEXT[] := ARRAY['create', 'read', 'update', 'delete'];
    v_action TEXT;
    v_allowed BOOLEAN;
    v_rule_info TEXT;
BEGIN
    -- Check each standard action
    FOREACH v_action IN ARRAY v_actions
    LOOP
        v_allowed := CHECK_USER_PERMISSION_ADVANCED(p_user_id, v_action, p_doctype, p_resource_data);

        -- Get rule source information
        SELECT COALESCE(
            (SELECT CONCAT(r.role_name, ' (',
                CASE WHEN ar.inverted THEN 'DENY' ELSE 'ALLOW' END, ')')
             FROM ability_rule ar
             JOIN GET_USER_ROLES_WITH_INHERITANCE(p_user_id) ur ON ar.role_id = ur.role_id
             JOIN role r ON ur.role_id = r.id
             WHERE ar.doctype = p_doctype
               AND ar.action = v_action
               AND ar.active = true
               AND EVALUATE_CONDITIONS(p_resource_data, ar.conditions)
             ORDER BY ur.level ASC, ar.inverted DESC
             LIMIT 1),
            'No applicable rule'
        ) INTO v_rule_info;

        RETURN QUERY SELECT v_action, v_allowed, v_rule_info;
    END LOOP;
END;
$$ LANGUAGE plpgsql STABLE;

-- Batch permission check for multiple resources
CREATE OR REPLACE FUNCTION BATCH_CHECK_USER_PERMISSIONS(
	p_user_id UUID,
	p_action TEXT,
	p_doctype TEXT,
	p_resource_ids UUID [],
	p_resource_data_lookup JSONB DEFAULT NULL
) RETURNS TABLE (resource_id UUID, allowed BOOLEAN) AS $$
DECLARE
    v_resource_id UUID;
    v_resource_data JSONB;
    v_allowed BOOLEAN;
BEGIN
    FOREACH v_resource_id IN ARRAY p_resource_ids
    LOOP
        -- Extract resource data for this ID if provided
        v_resource_data := NULL;
        IF p_resource_data_lookup IS NOT NULL THEN
            v_resource_data := p_resource_data_lookup -> v_resource_id::TEXT;
        END IF;

        v_allowed := CHECK_USER_PERMISSION_ADVANCED(p_user_id, p_action, p_doctype, v_resource_data);

        RETURN QUERY SELECT v_resource_id, v_allowed;
    END LOOP;
END;
$$ LANGUAGE plpgsql STABLE;

-- Permission debugging function to show rule evaluation steps
CREATE OR REPLACE FUNCTION DEBUG_PERMISSION_EVALUATION(
	p_user_id UUID,
	p_action TEXT,
	p_doctype TEXT,
	p_resource_data JSONB DEFAULT NULL
) RETURNS TABLE (
	step_order INTEGER,
	role_name TEXT,
	rule_type TEXT,
	rule_subject TEXT,
	rule_conditions JSONB,
	condition_match BOOLEAN,
	subject_match BOOLEAN,
	rule_applies BOOLEAN,
	inverted BOOLEAN,
	cumulative_result BOOLEAN
) AS $$
DECLARE
    v_rule RECORD;
    v_condition_match BOOLEAN;
    v_subject_match BOOLEAN;
    v_rule_applies BOOLEAN;
    v_current_result BOOLEAN := FALSE;
    v_step INTEGER := 0;
BEGIN
    -- Get all ability rules for user's roles (including inherited)
    FOR v_rule IN
        SELECT ar.action, ar.doctype, ar.subject, ar.conditions, ar.inverted, ar.active,
               ur.level, ur.role_name
        FROM ability_rule ar
        JOIN GET_USER_ROLES_WITH_INHERITANCE(p_user_id) ur ON ar.role_id = ur.role_id
        WHERE ar.doctype = p_doctype
          AND ar.action = p_action
          AND ar.active = true
        ORDER BY ur.level ASC, ar.inverted DESC
    LOOP
        v_step := v_step + 1;

        -- Check subject constraints
        v_subject_match := TRUE;
        IF v_rule.subject = 'own' THEN
            IF p_resource_data IS NULL OR (p_resource_data->>'created_by')::UUID != p_user_id THEN
                v_subject_match := FALSE;
            END IF;
        END IF;

        -- Check conditions
        v_condition_match := EVALUATE_CONDITIONS(p_resource_data, v_rule.conditions);

        -- Determine if rule applies
        v_rule_applies := v_subject_match AND v_condition_match;

        -- Update cumulative result
        IF v_rule_applies THEN
            IF v_rule.inverted THEN
                v_current_result := FALSE;
            ELSE
                v_current_result := TRUE;
            END IF;
        END IF;

        RETURN QUERY SELECT
            v_step,
            v_rule.role_name,
            CASE WHEN v_rule.inverted THEN 'DENY' ELSE 'ALLOW' END,
            v_rule.subject,
            v_rule.conditions,
            v_condition_match,
            v_subject_match,
            v_rule_applies,
            v_rule.inverted,
            v_current_result;

        -- For debugging, we don't exit early so we can see all rule evaluations
    END LOOP;
END;
$$ LANGUAGE plpgsql STABLE;
