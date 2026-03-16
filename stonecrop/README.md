# Stonecrop
_This package is under active development / design._

## Features

- **Hierarchical State Tree (HST)**: Advanced state management with tree navigation
- **Operation Log**: Global undo/redo with time-travel debugging, automatic FSM transition tracking, and action execution tracking
- **Action Tracking**: Audit trail for stateless action executions (print, email, archive, etc.)
- **Field Triggers**: Event-driven field actions integrated with XState
- **VueUse Integration**: Leverages battle-tested VueUse composables for keyboard shortcuts and persistence

## Installation & Usage

### Vue Plugin Installation

```typescript
import { createApp } from 'vue'
import Stonecrop from '@stonecrop/stonecrop'
import router from './router'

const app = createApp(App)

// Install the Stonecrop plugin
app.use(Stonecrop, {
  router,

  // Lazy-load doctype metadata from your API given the current route context.
  // routeContext = { path, segments } — adapt segments to your doctype naming.
  getMeta: async ({ segments }) => {
    return await fetchDoctypeMeta(segments[0])
  },

  // Optional: replace the default REST fetch() stub with your own transport.
  // When provided, Stonecrop.getRecord() calls this instead of fetch(`/${slug}/${id}`).
  fetchRecord: async (doctype, id) => {
    return await myApiClient.getRecord(doctype, id)
  },

  // Optional: replace the default REST fetch() stub for lists.
  fetchRecords: async (doctype) => {
    return await myApiClient.getRecords(doctype)
  },
})

app.mount('#app')
```

### Plugin Options

| Option | Type | Description |
|--------|------|-------------|
| `router` | `Router` | Vue Router instance. Required for route-based doctype resolution. |
| `getMeta` | `(ctx: RouteContext) => DoctypeMeta \| Promise<DoctypeMeta>` | Lazy-loads doctype metadata for the current route. `ctx` has `path` and `segments`. |
| `fetchRecord` | `(doctype, id) => Promise<Record \| null>` | Injectable replacement for `Stonecrop.getRecord()`'s default REST fetch. Use this to plug in GraphQL or any other transport. |
| `fetchRecords` | `(doctype) => Promise<Record[]>` | Injectable replacement for `Stonecrop.getRecords()`'s default REST fetch. |
| `components` | `Record<string, Component>` | Additional Vue components to register globally. |
| `autoInitializeRouter` | `boolean` | Call `onRouterInitialized` automatically after mount. Default: `false`. |
| `onRouterInitialized` | `(registry, stonecrop) => void` | Callback invoked after plugin install + mount. Receives the Registry and Stonecrop instances. |

### Available Imports

```typescript
// Default export - Vue plugin (install with app.use)
import StonecropPlugin from '@stonecrop/stonecrop'

// Named exports - utilities and classes
import {
  Stonecrop,       // Core orchestration class
  Registry,        // Doctype registry (singleton)
  DoctypeMeta,     // Doctype definition class
  useStonecrop,    // Vue composable — primary integration point
  HST,             // HST store class
  createHST,       // HST factory function
} from '@stonecrop/stonecrop'
```

### Using the Composable

```typescript
import { useStonecrop } from '@stonecrop/stonecrop'

export default {
  setup() {
    // Base mode — operation log only, no HST record loading
    const { stonecrop, operationLog } = useStonecrop()

    // HST mode — pass doctype and optional recordId for full integration
    const { stonecrop, formData, provideHSTPath, handleHSTChange } = useStonecrop({
      doctype: myDoctype,
      recordId: 'record-123', // omit or pass undefined for new records
    })

    // Access HST store
    const store = stonecrop.value?.getStore()

    // Work with records directly
    const record = stonecrop.value?.getRecordById('doctype', recordId)

    return { stonecrop, formData }
  }
}
```

## Design
A Doctype defines schema, workflow, and actions.
  - **Schema** describes the data model and field layout — used by AForm for rendering.
  - **Workflow** is an XState machine config expressing the states and transitions a record can go through.
  - **Actions** are an ordered map of named functions, triggered by field changes (lowercase keys) or FSM transitions (UPPERCASE keys).
  - **Registry** is the singleton catalog — all doctypes live here. Optional Vue Router integration allows automatic route creation per doctype.
  - **Stem/`useStonecrop()`** is the Vue composable that wires components to HST and provides `formData`, `provideHSTPath`, `handleHSTChange`, and the operation log API.

The data model is **two operations**: get data and run actions. There is no CRUD. Records change state through FSM transitions; those transitions have side effects (persistence, notifications, etc.) defined in action handlers registered by the application. The framework provides the pipeline; applications define what actions exist and what they do.

HST path structure:

```
doctype.recordId.fieldname        // e.g. plan.abc-123.title
doctype.recordId.nested.field     // deep nesting supported
```

# Hierarchical State Tree (HST) Interface Requirements

## Core Requirements

### 1. Data Structure Compatibility
- **Vue Reactive Objects**: Must work seamlessly with `reactive()`, `ref()`, and `computed()` primitives
- **Pinia Store Integration**: Compatible with both Options API and Composition API Pinia stores
- **Immutable Objects**: Support for frozen/immutable configuration objects without breaking reactivity

### 2. Path-Based Addressing System
- **Dot Notation**: Full support for dot-notation paths (e.g., `"users.123.profile.settings"`)
- **Dynamic Paths**: Support for programmatically generated path strings (particularly component to HST)

### 3. Hierarchical Navigation
- **Parent/Child Relationships**: Maintain bidirectional parent-child references
- **Sibling Access**: Efficient navigation between sibling nodes
- **Root Access**: Always accessible reference to tree root from any node
- **Depth Tracking**: Know the depth level of any node in the hierarchy
- **Breadcrumb Generation**: Generate full path breadcrumbs for any node
