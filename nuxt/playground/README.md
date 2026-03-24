# Nuxt Stonecrop Playground

A demonstration of Stonecrop's schema-driven UI framework integrated with Nuxt 4. This playground implements a complete permission management system (RBAC) with visual state machine editing to showcase real-world patterns.

## What You'll Learn

This playground demonstrates concepts that may be new if you haven't used a schema-driven framework before:

### Schema-Driven Development
**What it is:** Instead of manually coding each form field and validation rule, you define your data structure in JSON. The framework generates the UI automatically.

**Why it matters:** Reduces boilerplate, ensures consistency, and makes your data models self-documenting. Change the schema, and the UI updates automatically.

**See it in action:** Check `/doctypes/*.json` files - each one generates both list and detail views.

### Hierarchical State Tree (HST)
**What it is:** A tree-based state management system where every piece of data has a path (like `user.123.username`).

**Why it matters:** Traditional state management gets messy with nested data. HST provides a clean way to navigate relationships (parent/child), compute breadcrumbs, and manage complex forms.

**See it in action:** User forms show embedded HasRole tables - all managed through HST paths.

### Finite State Machines (FSM)
**What it is:** A way to model workflows with explicit states (draft → pending → approved) and valid transitions between them.

**Why it matters:** Business logic often has rules about what actions are valid in what situations. FSMs make these rules explicit and enforceable.

**See it in action:** The DocBuilder pages include visual state machine editors where you can see/edit workflow states.

### DocTypes (Document Types)
**What it is:** A meta-model that describes other data models. It's the "schema for schemas."

**Why it matters:** Allows dynamic form generation and makes your system extensible without code changes.

**See it in action:** Visit `/doctypes` to see the DocType definitions themselves, then visit any other page to see DocTypes in action.

## Features Demonstrated

### Table Views (ATable)
Editable tables with Excel-like navigation for listing records:
- `/users` - User accounts table
- `/roles` - Roles hierarchy table
- `/role-profiles` - Role profiles grouping
- `/ability-rules` - Permission rules table
- `/doctypes` - DocType definitions table (view only)

### Form Views (AForm)
Schema-driven forms with HST (Hierarchical State Tree) integration:
- `/users/:id` - User form with embedded HasRole table
- `/roles/:id` - Role form with parent role selector
- `/role-profiles/:id` - Profile form with role assignments
- `/ability-rules/:id` - Ability rule configuration

### Effective Permissions Component
Custom Vue component that displays computed permissions based on SQL functions from Orpin:
- Visualizes permissions inherited through role hierarchy
- Shows allow/deny rules from ability_rule table
- Implements `GET_USER_EFFECTIVE_PERMISSIONS` PostgreSQL function logic

### DocBuilder
Visual builder at `/builder/:doctype` for doctype management:
- DocType metadata and field definitions
- Associated Ability Rules filtered by doctype
- Integrated State Machine visualization with XState/Vue Flow
- State and transition editor with visual node positioning
- Available for: `/builder/user`, `/builder/role`, `/builder/role-profile`, `/builder/ability-rule`

### State Machines
XState-powered FSM workflow integration using @stonecrop/node-editor:
- Visual node editor with Vue Flow for state machines
- States (atomic/final) with custom display names
- Transitions with events and guards
- Automatic layout generation (250px horizontal spacing)
- Chart controls for adding nodes and centering view
- Fully integrated into DocBuilder pages

### HST Integration
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
```

The playground will be available at `http://localhost:3000`

## Key Patterns Explained

### Schema Hydration
**What it does:** Converts generic fieldtype names from your schema into specific Vue component names.

```typescript
import { hydrateSchema } from '~/utils/schema'

// Before hydration (from JSON)
const schema = [
  { fieldname: 'username', fieldtype: 'Data' },
  { fieldname: 'disabled', fieldtype: 'Check' }
]

// After hydration
const hydratedSchema = hydrateSchema(schema)
// [
//   { fieldname: 'username', component: 'ATextInput' },
//   { fieldname: 'disabled', component: 'ACheckbox' }
// ]

// AForm uses these component names to render the right inputs
```

**Why it's needed:** The schema is framework-agnostic (just describes data), but the UI needs to know which Vue components to render.

**Field type mappings:**
- `Data` → `ATextInput` (text input)
- `Text` → `ATextInput` with multiline (textarea)
- `Check` → `ACheckbox` (boolean)
- `Select` → `ASelect` (dropdown)
- `Link` → `ALink` (relationship to another DocType)
- `Table` → `ATable` (embedded child records)
- `Code` → `ACodeEditor` (JSON/code input)

### HST-Reactive Forms
**What it does:** Connects your form to the Hierarchical State Tree for automatic state synchronization.

```typescript
// Basic setup
const { stonecrop, handleHSTChange, formData } = useStonecrop({
  doctype: userDoctype,              // Schema definition
  recordId: userId.value,             // Which record to load
})

// stonecrop.buildHSTPath generates paths like "user.123.username"
const fieldPath = stonecrop.value?.buildHSTPath('user', userId.value, 'username') // → "user.123.username"

// handleHSTChange updates both local state and HST
handleHSTChange({
  path: fieldPath,
  value: 'newvalue',
  fieldname: 'username'
})

// formData is reactive - changes appear immediately in UI
```

**Why it's useful:** Traditional forms require manual state management. HST-reactive forms automatically:
- Load data from the state tree
- Sync changes back to the tree
- Handle nested/embedded records
- Maintain relationships between records

**The two modes:**
1. **Basic mode:** `useStonecrop()` - Uses route params to determine doctype/recordId
2. **HST mode:** `useStonecrop({ doctype, recordId })` - Explicit control over which record to manage

### Table Navigation
**What it does:** Connects table row clicks to navigation for the classic list → detail pattern.

```typescript
// Composable approach
const { handleTableClick } = useTableNavigation({
  data: users,                        // Reactive data ref
  router,                             // Vue router instance
  basePath: '/users',                 // Where to navigate
  identifierField: 'username'         // Which field to use in URL
})

// Manual approach
function handleRowClick(row: any) {
  router.push(`/users/${row.username}`)
}
```

**Why it's a pattern:** Most CRUD apps follow this flow:
1. User sees a table of records
2. Clicks a row
3. Navigates to detail view
4. Edits the record
5. Returns to table

The `useTableNavigation` composable standardizes this pattern.

### Server Routes with Dynamic Parameters
**What it does:** Nuxt server routes that respond to API requests with path parameters.

```typescript
// File: server/api/users/[id].get.ts
export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')

  // In production, query your database
  const user = await db.users.findOne({ username: userId })

  return user
})

// Called from client:
// GET /api/users/john → userId = "john"
```

**Why it's useful:** Separates frontend and backend concerns while keeping them in the same codebase. The server routes act as your API layer.

**Playground note:** All server routes currently return mock data. In production, these would query a PostgreSQL database with the Orpin schema.

### Understanding DocType Relationships
**What it is:** DocTypes can reference other DocTypes, creating relationships.

```json
// role.json schema
{
  "fieldname": "parent_role",
  "fieldtype": "Link",
  "options": "role"  // ← References the "role" DocType
}

// ability-rule.json schema
{
  "fieldname": "role_id",
  "fieldtype": "Link",
  "options": "role"  // ← References the "role" DocType
},
{
  "fieldname": "doctype",
  "fieldtype": "Link",
  "options": "doctype"  // ← References the "doctype" DocType
}
```

**What happens in the UI:**
- `Link` fields render as dropdowns with options from the related DocType
- Clicking the link navigates to that record's detail page
- HST maintains the relationship paths (e.g., `ability-rule.123.role_id → role.admin`)

**Why it matters:** Real applications have interconnected data. Schema-driven frameworks need a way to express these relationships declaratively.

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

## Understanding the Permission System

This playground demonstrates a complete Role-Based Access Control (RBAC) system. Here's how the pieces fit together:

### The Permission Hierarchy

```
User
  ↓ has_role (many-to-many through has_role table)
Role
  ↓ parent_role (tree structure for inheritance)
Role Hierarchy
  ↓ ability_rule (permissions attached to roles)
Ability Rules
  → Define what actions are allowed on which DocTypes
```

### How It Works

1. **Users** can have multiple **Roles** (via `has_role` join table)
2. **Roles** can have parent roles, creating a hierarchy
   - Example: "Admin" → "Manager" → "User"
   - Child roles inherit permissions from parents
3. **Ability Rules** define permissions for each role:
   - Which DocType (e.g., "user", "task")
   - Which action (create, read, update, delete)
   - Which records (all, own, conditional)
   - Allow or deny (inverted flag)

### Example Permission Flow

```typescript
// User "john" has role "editor"
// Role "editor" has parent role "viewer"
// Role "viewer" has ability_rule: { doctype: "task", action: "read", allowed: true }
// Role "editor" has ability_rule: { doctype: "task", action: "update", allowed: true }

// Effective permissions for "john":
// ✅ Can read tasks (inherited from "viewer")
// ✅ Can update tasks (from "editor")
// ❌ Cannot delete tasks (no rule exists)
```

### The Effective Permissions Component

The `EffectivePermissions.vue` component demonstrates **computed permissions** - it shows the final result after:
1. Gathering all roles (including inherited)
2. Collecting all ability rules
3. Evaluating allow/deny rules
4. Computing the final permission set

This is what the SQL function `GET_USER_EFFECTIVE_PERMISSIONS` does in production.

### Role Profiles

**Role Profiles** are convenience groupings - instead of assigning roles one-by-one, you can:
1. Create a profile (e.g., "Sales Team")
2. Add multiple roles to it
3. Assign the profile to users

They're syntactic sugar that makes role management easier at scale.

## Database Schema Reference

This playground implements the permission system and state machine tables from Orpin:

### Permission Tables
- **orpin.user** - User accounts with password hashing
- **orpin.role** - Roles with hierarchical parent relationships (tree structure)
- **orpin.has_role** - Many-to-many join: which users have which roles
- **orpin.role_profile** - Convenience groupings of multiple roles
- **orpin.ability_rule** - CASL-style permission rules (action + subject + conditions)

### State Machine Tables
- **orpin.statechart_machine** - XState machine definitions (one per entity_type)
- **orpin.statechart_state** - FSM states (atomic/final types)
- **orpin.statechart_transition** - FSM transitions with events and guards

### Key SQL Functions
- `GET_USER_ROLES_WITH_INHERITANCE` - Recursively walks role hierarchy
- `CHECK_USER_PERMISSION_ADVANCED` - Evaluates a single permission check
- `GET_USER_EFFECTIVE_PERMISSIONS` - Computes all permissions for a user
- `GET_MACHINE_CONFIG` - Generates XState configuration from database

## Notes

- All API endpoints currently return mock data
- In production, these would connect to a PostgreSQL database with the `orpin` schema
- TypeScript strict mode is enabled throughout
- HST paths follow the pattern: `"doctype.recordId.fieldname"`
- State machines support flat states only (no compound/parallel states)
