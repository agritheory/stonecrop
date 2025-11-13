# Stonecrop Nuxt Playground

An example showcasing Stonecrop integration with Nuxt 4, featuring permission management, DocTypes, and XState-powered state machines.

## Features Demonstrated

### 1. **Table Views (ATable)**
Editable tables with Excel-like navigation for listing records:
- `/users` - User accounts table
- `/roles` - Roles hierarchy table
- `/role-profiles` - Role profiles grouping
- `/ability-rules` - Permission rules table
- `/doctypes` - DocType definitions table (view only)

### 2. **Form Views (AForm)**
Schema-driven forms with HST (Hierarchical State Tree) integration:
- `/users/:id` - User form with embedded HasRole table
- `/roles/:id` - Role form with parent role selector
- `/role-profiles/:id` - Profile form with role assignments
- `/ability-rules/:id` - Ability rule configuration

### 3. **Effective Permissions Component**
Custom Vue component that displays computed permissions based on SQL functions from Orpin:
- Visualizes permissions inherited through role hierarchy
- Shows allow/deny rules from ability_rule table
- Implements `GET_USER_EFFECTIVE_PERMISSIONS` PostgreSQL function logic

### 4. **DocBuilder**
Visual builder at `/builder/:doctype` for comprehensive doctype management:
- DocType metadata and field definitions
- Associated Ability Rules filtered by doctype
- Integrated State Machine visualization with XState/Vue Flow
- State and transition editor with visual node positioning
- Available for: `/builder/user`, `/builder/role`, `/builder/role-profile`, `/builder/ability-rule`

### 5. **State Machines**
XState-powered FSM workflow integration using @stonecrop/node-editor:
- Visual node editor with Vue Flow for state machines
- States (atomic/final) with custom display names
- Transitions with events and guards
- Automatic layout generation (250px horizontal spacing)
- Chart controls for adding nodes and centering view
- Fully integrated into DocBuilder pages

### 6. **HST Integration**
Hierarchical State Tree for advanced state management:
- `useStonecrop` composable with dual modes (basic/HST)
- Path-based state addressing (e.g., `"user.123.username"`)
- Reactive form data synchronized with HST
- Record management with `addRecord`, `getRecordById`

## Technology Stack

- **Nuxt 4** - Latest Nuxt framework with auto-imports and file-based routing
- **Stonecrop** - Schema-driven UI framework with HST state management
- **AForm & ATable** - Powerful form and table components from Stonecrop
- **@stonecrop/node-editor** - Visual state machine editor with Vue Flow
- **XState 5.20+** - Finite state machine workflow engine
- **@vue-flow/core** - Interactive node-based diagrams for state visualization
- **PostgreSQL** - Orpin schema for RBAC and state machines (backend)
- **Vue 3.5+** - Composition API with TypeScript
- **Pinia** - State management (provided by Stonecrop plugin)

## Directory Structure

```
playground/
├── pages/                          # File-based routing
│   ├── index.vue                   # Home with navigation
│   ├── users/
│   │   ├── index.vue              # Users table
│   │   └── [id].vue               # User form
│   ├── roles/
│   │   ├── index.vue              # Roles table
│   │   └── [id].vue               # Role form
│   ├── role-profiles/
│   │   ├── index.vue              # Profiles table
│   │   └── [id].vue               # Profile form
│   ├── ability-rules/
│   │   ├── index.vue              # Rules table
│   │   └── [id].vue               # Rule form
│   ├── doctypes/
│   │   └── index.vue              # DocTypes table (view only)
│   └── builder/
│       └── [doctype].vue          # DocBuilder with state machine editor
├── components/
│   └── EffectivePermissions.vue   # Custom permissions component
├── layouts/
│   └── default.vue                # App layout with navigation
├── doctypes/                       # DocType JSON schemas
│   ├── user.json
│   ├── role.json
│   ├── role-profile.json
│   ├── ability-rule.json
│   └── doctype.json
├── server/
│   └── api/                        # Nuxt server routes (mock data)
│       ├── permissions/
│       │   └── effective/[id].get.ts  # Effective permissions for user
│       ├── doctypes/
│       │   └── [doctype].ts           # DocType definitions
│       ├── ability-rules/
│       │   └── index.get.ts           # Ability rules by doctype
│       └── state-machines/
│           └── index.get.ts           # State machines by entity_type
├── utils/
│   └── schema.ts                   # Schema hydration utility
└── app.vue                         # Root component
```

## DocType Schemas

All DocType schemas are JSON files in `/playground/doctypes/` that match the PostgreSQL schema from Orpin:

### User (`user.json`)
- `username` (Data, required)
- `disabled` (Check)
- `has_roles` (Table) - Embedded HasRole records

### Role (`role.json`)
- `role_name` (Data, required)
- `description` (Text)
- `parent_role` (Link to Role) - Tree structure support
- `active` (Check)

### RoleProfile (`role-profile.json`)
- `profile_name` (Data, required)
- `description` (Text)
- `roles` (Table) - Multiple role assignments
- `active` (Check)

### AbilityRule (`ability-rule.json`)
- `role_id` (Link to Role)
- `doctype` (Link to DocType)
- `action` (Select: create/read/update/delete)
- `subject` (Select: all/own/conditional)
- `conditions` (Code - JSON)
- `inverted` (Check) - Deny rule
- `active` (Check)

### DocType (`doctype.json`)
- `name` (Data, required)
- `module` (Data)
- `description` (Text)
- `is_submittable` (Check)
- `is_tree` (Check)
- `fields` (Table) - Field definitions

Note: DocTypes are managed through the DocBuilder interface at `/builder/:doctype` which provides integrated state machine editing.

## Server API Endpoints

All endpoints return mock data demonstrating the structure:

### Permissions
- `GET /api/permissions/effective/:id` - Get effective permissions for a user
  - Implements `GET_USER_EFFECTIVE_PERMISSIONS` SQL function logic
  - Returns array of `{ doctype, action, allowed, rule_source }`

### DocTypes
- `GET /api/doctypes/:doctype` - Get DocType by name
  - Returns full DocType definition with fields

### Ability Rules
- `GET /api/ability-rules?doctype=X` - Get ability rules (optionally filtered)
  - Returns array of ability rule records

### State Machines
- `GET /api/state-machines?entity_type=X` - Get state machines (optionally filtered)
  - Returns statechart machine with states and transitions

## Running the Playground

```bash
# From the repository root
cd nuxt/playground

# Install dependencies (if not already done)
rush update

# Start the dev server
rushx dev

# Or from the examples directory
cd examples
./dev-runner.sh nuxt
```

The playground will be available at `http://localhost:3000`

## Key Patterns

### Schema Hydration
```typescript
import { hydrateSchema } from '~/utils/schema'

// Converts fieldtype to component names for AForm
const doctype = {
  ...doctypeJson,
  schema: hydrateSchema(doctypeJson.schema)
}
// Maps: Data→ATextInput, Check→ACheckbox, Table→ATable, etc.
```

### HST-Reactive Forms
```typescript
const { stonecrop, provideHSTPath, handleHSTChange, formData } = useStonecrop({
  doctype: userDoctype,
  recordId: userId.value === 'new' ? undefined : userId.value,
})
```

### Table Navigation
```typescript
function handleRowClick(row: any) {
  router.push(`/users/${row.id}`)
}
```

### Server Route with Dynamic Parameters
```typescript
export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')
  // ... fetch and return data
})
```

### State Machine Layout Generation
```typescript
function generateLayout(machine: any): Layout {
  if (!machine || !machine.states) return {}

  const layout: Layout = {}
  machine.states.forEach((state: any, index: number) => {
    layout[state.state_key] = {
      position: { x: 250 * index, y: 150 },
      targetPosition: 'left' as any,
      sourcePosition: 'right' as any,
    }
  })
  return layout
}
```

### XState Configuration Conversion
```typescript
function convertToXStateConfig(machine: any) {
  const states: any = {}

  // Build states
  for (const state of machine.states) {
    states[state.state_key] = {
      type: state.state_type,
      meta: { displayName: state.display_name },
      on: {}
    }
  }

  // Add transitions
  for (const transition of machine.transitions) {
    states[transition.source_state_key].on[transition.event_type] = {
      target: transition.target_state_key,
      ...(transition.guard_name && { cond: transition.guard_name })
    }
  }

  return states
}
```

## Database Schema Reference

This playground implements the permission system and state machine tables from Orpin:

- **orpin.user** - User accounts with password hashing
- **orpin.role** - Roles with hierarchical parent relationships
- **orpin.has_role** - User-role assignments
- **orpin.ability_rule** - CASL-style permission rules
- **orpin.statechart_machine** - XState machine definitions
- **orpin.statechart_state** - FSM states (atomic/final)
- **orpin.statechart_transition** - FSM transitions with events/guards

Key SQL functions demonstrated:
- `GET_USER_ROLES_WITH_INHERITANCE` - Recursive role hierarchy
- `CHECK_USER_PERMISSION_ADVANCED` - Evaluate permission rules
- `GET_USER_EFFECTIVE_PERMISSIONS` - Compute all permissions
- `GET_MACHINE_CONFIG` - Generate XState configuration

## Notes

- All API endpoints currently return mock data
- In production, these would connect to a PostgreSQL database with the `orpin` schema
- TypeScript strict mode is enabled throughout
- HST paths follow the pattern: `"doctype.recordId.fieldname"`
- State machines support flat states only (no compound/parallel states)
