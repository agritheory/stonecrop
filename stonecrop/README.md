# Stonecrop
_This package is under active development / design._

## Installation & Usage

### Vue Plugin Installation

```typescript
import { createApp } from 'vue'
import Stonecrop from '@stonecrop/stonecrop'

const app = createApp(App)

// Install the Stonecrop plugin
app.use(Stonecrop, {
  router,
  components: {
    // Register custom components
  },
  getMeta: async (doctype: string) => {
    // Fetch doctype metadata from your API
    return await fetchDoctypeMeta(doctype)
  }
})

app.mount('#app')
```

### Available Imports

```typescript
// Default export - Vue plugin
import Stonecrop from '@stonecrop/stonecrop'

// Named exports - utilities and classes
import {
  Stonecrop as StonecropClass, // Core class
  Registry,                    // Doctype registry
  useStonecrop,                // Vue composable
  HST,                         // Hierarchical State Tree
  createHST,                   // HST factory
  DoctypeMeta                  // Doctype metadata class
} from '@stonecrop/stonecrop'
```### Using the Composable

```typescript
import { useStonecrop } from '@stonecrop/stonecrop'

export default {
  setup() {
    const { stonecrop } = useStonecrop()

    // Access HST store
    const store = stonecrop.value?.getStore()

    // Work with records
    const records = stonecrop.value?.records('doctype')
    const currentRecord = stonecrop.value?.currentRecord('doctype')

    return { stonecrop, records, currentRecord }
  }
}
```

## Design
A context will define schema, workflow and actions.
  - Schema describes the data model and layout of the document.
  - Workflows are the events that are registered on it and will specific to the context. An application might have 'login', 'onAppLoad', 'beforeRouteChange' and 'logout' events.  A form/document context might define CRUD events. A table component, nested inside the form component might define its own events. I think we want Events to be FSM
  - Actions are an ordered set of functions, called by Workflow
  - [Router integration](https://pinia.vuejs.org/core-concepts/plugins.html#adding-new-external-properties). Stonecrop setup should expect a router or provide a default implementation

The context will be tree-shaped with a single root. Adding more nodes at the root level isn't a problem, but multiple roots would be disallowed.

Example APIs and paths

```
app.schema <Record> // immutable
app.workflow <FSM> // immutable
app.actions <OrderedSet> // immutable
app.value <Store> // mutable
app.user // "tyler@agritheory.com"
app.name // "My First Application"
app.doctype.schema <Record> // `app.doctype` lazy loaded by Event in router?
app.doctype.workflow <FSM>
app.doctype.actions <OrderedSet>
app.doctype.actions.value <Store>
app.doctype.schema.field.workflow <FSM>
app.doctype.schema.field.actions <OrderedSet>
app.doctype.schema.field.value <Store>
app.doctype.schema.field.value.field.value <Store> // a "sub-form"
app.doctype.schema.field.value.field['a:1'].value <Store> // also a "sub-form", representing a table
```

## Base Classes
The Doctype aligns with a row, record or object in a database. It is required to specify its schema, a Finite State Machine that informs its workflow and a set of functions that are triggered by that FSM's state transitions.

Registry is a map of all Doctypes, lazy loaded and is responsible for routing within the application

Stem is a composable singleton that wraps Registry and provides application level state management


## Story / Network diagram
#### **Doctype | Record Story**

- User is redirected after successful login
- Base URL is configured at app level to serve a navigation page
- User navigates to list view of `doctype`
- Table component loads existing records of `doctype` from schema; record-level schema is added to registry with web worker
- User navigates to specific record of `doctype`: schema is loaded from registry, data is loaded from server
- User mutates data, changes are persisted to server / DB per FSM

#### **App Level**
- User is redirected after successful login
- Base URL is configured at app level to serve a navigation page
- User opens command palette from lower-right-docked tab interface
- User can search for `doctype` by name or other server-enabled capabilities

#### **Low Code**
- User can define `doctype` and schema from UI
- Fields are shown as rows in a table
- FSM is shown as an editable diagram that validates itself

___

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
