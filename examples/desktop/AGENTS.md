# Desktop Example - Agent Architecture Documentation

## Overview

The Desktop example demonstrates a comprehensive **schema-driven UI framework** with **event-driven workflows** using Stonecrop's Hierarchical State Tree (HST) and XState finite state machines. This example showcases how agents (FSMs) control application behavior through structured workflows and state management.

## Test Coverage & Quality Assurance

### Testing Architecture Patterns
1. **Plugin Testing**: Comprehensive coverage of auto-initialization, callback handling, error handling, custom component registration, and router logic
2. **Store Testing**: HST singleton patterns, HSTProxy path navigation, tree operations, and error boundary testing
3. **Integration Testing**: HST-Vue reactivity, component composition, and real-world workflow scenarios
4. **Error Handling**: Graceful degradation patterns, malformed data handling, and recovery mechanisms

### Test Quality Guidelines
- **Error-first Testing**: Every major code path includes error scenarios and edge cases
- **Callback Coverage**: All plugin initialization callbacks and error handling are tested
- **Tree Navigation**: Full HST path-based access patterns and hierarchical relationships
- **Vue Integration**: Injection patterns, reactivity sync, and component lifecycle testing

## Key Architectural Lessons

### Separation of Concerns Principle
**Critical Learning**: Framework code (Stonecrop core) should never make assumptions about user-specific concepts like API endpoints, data structures, or business logic patterns.

**What Changed**:
- Initially, StonecropPlugin tried to handle doctype hierarchy initialization automatically
- This created tight coupling between the framework and specific API patterns
- **Refactored** to make StonecropPlugin purely generic, handling only the initialization callback mechanism
- User-specific logic (like `/api/doctype-hierarchy` calls) now belongs in the example/application code

### Plugin Architecture Best Practices
1. **Framework Responsibility**: Provide initialization hooks and event mechanisms
2. **User Responsibility**: Define specific initialization logic, API calls, and business patterns
3. **Scoped Reference Management**: Use closures and function parameters instead of global state
4. **No Backwards Compatibility Burden**: All code is subject to change; focus on clean architecture over compatibility

### Router Initialization Strategy
**Final Pattern**: Scoped reference management replaces global state
```typescript
// Framework provides the hook with instances
app.use(StonecropPlugin, {
  autoInitializeRouter: true,
    onRouterInitialized: async (registry, stonecrop) => {
    // Setup router context with provided instances (no global state)
    await setupRouterContext(registry, stonecrop)

    // User defines what initialization means for their app
    const response = await fetch('/api/doctype-hierarchy')
    // ... handle user-specific logic
  }
})
```

**Key Learning**: Instead of global references and event listeners, the router now receives Registry and Stonecrop instances directly through the initialization callback, eliminating the need for global state management.

## Agent Architecture Components

### 1. Application Agent (`index.ts`)
**Primary Responsibility**: Application orchestration and user-specific initialization

```typescript
// Key dependencies and initialization sequence
import { StonecropDesktop } from '@stonecrop/desktop'
import StonecropPlugin, { DoctypeMeta } from '@stonecrop/stonecrop'

// Agent capabilities:
// - Plugin installation and dependency management
// - Registry setup with getMeta function
// - User-specific initialization logic (doctype hierarchies, etc.)
// - Clean separation between framework and application concerns
```

**Agent Workflow**:
1. **Setup Phase**: Install Pinia → Stonecrop Plugin (with user callback) → Component plugins
2. **Mount Phase**: Create app instance and mount to DOM
3. **Auto-Initialize Phase**: Framework triggers user-defined initialization callback
4. **Runtime Phase**: Handle workflow state changes and route navigation

**Key Learning**: The application agent now owns all business-specific logic, while the framework provides only the initialization hooks.

### 2. Router Agent (`router.ts`)
**Primary Responsibility**: Dynamic route registration and state management

```typescript
// Agent state management - no more global references
const registeredDoctypes = new Set<string>()
const doctypeHierarchyCache: Record<string, any> = {}

// Scoped references set during initialization
let scopedRegistry: any = null
let scopedStonecrop: any = null

// Direct initialization with instances (replaces event listeners)
export function setupRouterContext(registry: any, stonecrop: any): Promise<void> {
  scopedRegistry = registry
  scopedStonecrop = stonecrop
  return preloadDoctypeHierarchies()
}
```

**Agent Capabilities**:
- **Scoped Instance Management**: Receives Registry and Stonecrop instances directly
- **Doctype Discovery**: Fetches and caches doctype hierarchies from user-defined APIs
- **Dynamic Registration**: Registers routes on-demand based on route patterns
- **State Preparation**: Sets up HST state before route navigation
- **Workflow Integration**: Connects routes to XState workflow states

**Key Learning**: Router agent now uses scoped references instead of global state, eliminating the need for event-driven initialization timing.

**Key Agent Functions**:

#### `setupRouterContext()` Agent
- Sets up scoped references to Registry and Stonecrop instances
- Provides router functions with access to core framework instances

#### `preloadDoctypeHierarchies()` Agent
- Preloads all doctype hierarchies for performance optimization
- Caches route configurations to avoid repeated API calls

#### `setupDoctypeData()` Agent
- Loads doctype metadata into Registry
- Populates HST with all records for the doctype
- Manages data freshness and state synchronization

#### `setupRecordData()` Agent
- Handles individual record state management
- Sets current record context in HST
- Manages new vs. existing record workflows

#### `registerDoctypeRoutes()` Agent
- Dynamic route pattern registration based on server configuration
- Creates Vue Router routes with HST state guards
- Manages route-to-workflow mapping

### 3. Server Agent (`server.ts`)
**Primary Responsibility**: Mock data and workflow simulation using MirageJS

**Agent Configuration**:
```typescript
// Doctype hierarchy defines workflow routing patterns
doctypeHierarchy: {
  todo: {
    route: '/todo',
    currentDoctype: 'todo-list',
    descendantDoctypes: ['todo-list', 'todo-form'],
    routePatterns: {
      list: {
        pattern: '/todo',
        doctype: 'todo-list',
        component: 'View',
        meta: { title: 'Todo List', type: 'list' }
      },
      form: {
        pattern: '/todo/:recordId',
        doctype: 'todo-form',
        component: 'View',
        meta: { title: 'Todo Form', type: 'form' }
      }
    }
  }
}
```

**Workflow Definitions**:
- **List Workflows**: `loaded` → `creating` → `loaded`
- **Form Workflows**: `editing` → `saved`/`cancelled`/`deleted`

### 4. Desktop Component Agent (`components/View.vue`)
**Primary Responsibility**: UI state management and workflow execution

```vue
<template>
  <div class="view-wrapper">
    <Desktop :available-doctypes="availableDoctypes" :show-debug="showDebug" />
  </div>
</template>
```

**Agent Features**:
- Integrates with `@stonecrop/desktop` component system
- Provides debug visibility into HST state changes
- Manages available doctype contexts for workflows

### 5. Home Agent (`components/Home.vue`)
**Primary Responsibility**: Application landing page and doctype discovery

```typescript
// Schema-driven table for doctype navigation
const schema = ref([{
  component: 'ATable',
  config: { view: 'list' },
  columns: [
    { name: 'name', label: 'Name', fieldtype: 'Data' },
    { name: 'slug', label: 'Slug', fieldtype: 'Data' },
    { name: 'description', label: 'Description', fieldtype: 'Data' },
    { name: 'routes', label: 'Available Routes', fieldtype: 'Data' }
  ],
  rows: doctypes.map(doctype => ({
    // Dynamic route information generation
  }))
}])
```

## Workflow State Machines

### Todo Workflow Agents

#### Todo List FSM
```typescript
workflow: {
  id: 'todoList',
  initial: 'loaded',
  states: {
    loaded: { on: { CREATE: 'creating' } },
    creating: { on: { SAVE: 'loaded', CANCEL: 'loaded' } }
  }
}
```

#### Todo Form FSM
```typescript
workflow: {
  id: 'todoForm',
  initial: 'editing',
  states: {
    editing: {
      on: { SAVE: 'saved', CANCEL: 'cancelled', DELETE: 'deleted' }
    },
    saved: { on: { EDIT: 'editing' } },
    cancelled: {},
    deleted: {}
  }
}
```

### Issue Workflow Agents

#### Issue List FSM
```typescript
workflow: {
  id: 'issueList',
  initial: 'loaded',
  states: {
    loaded: { on: { CREATE: 'creating' } },
    creating: { on: { SAVE: 'loaded', CANCEL: 'loaded' } }
  }
}
```

#### Issue Form FSM
```typescript
workflow: {
  id: 'issueForm',
  initial: 'editing',
  states: {
    editing: {
      on: { SAVE: 'saved', CANCEL: 'cancelled', DELETE: 'deleted' }
    },
    saved: { on: { EDIT: 'editing' } },
    cancelled: {},
    deleted: {}
  }
}
```

## HST Agent Integration

### Hierarchical State Tree Structure
```
stonecrop/
├── todo-list/
│   ├── records/
│   │   ├── 1/ (record data)
│   │   ├── 2/ (record data)
│   │   └── current → "1"
│   └── workflow/ (FSM state)
├── todo-form/
│   ├── records/
│   │   ├── 1/ (form data)
│   │   ├── 2/ (form data)
│   │   └── current → "1"
│   └── workflow/ (FSM state)
└── registry/ (doctype definitions)
```

### HST Agent Operations
- **Path Navigation**: `stonecrop.getNode('todo-list.records.1')`
- **State Synchronization**: `stonecrop.setCurrentRecord('todo-list', recordId)`
- **Workflow Management**: HST integrates with XState actors for workflow execution
- **Tree Traversal**: Parent/child relationships for breadcrumb navigation

## Agent Communication Patterns

### 1. Router → HST Agent Flow
```typescript
// Route guard triggers HST state preparation
beforeEnter: async (to, from, next) => {
  if (pattern.meta.type === 'list') {
    await setupDoctypeData(routeDoctype, actualDoctype)
  } else if (pattern.meta.type === 'form') {
    const recordId = to.params.recordId as string
    await setupRecordData(routeDoctype, recordId, actualDoctype)
  }
  next()
}
```

### 2. Server → Registry Agent Flow
```typescript
// getMeta function bridges server data to Registry
const getMeta = async (doctype: string) => {
  const response = await fetch(`/api/${doctype}/meta`)
  const data = await response.json()
  return new DoctypeMeta(data.doctype, List(data.schema), data.workflow, Map(data.actions))
}
```

### 3. Component → HST Agent Flow
```typescript
// useStonecrop composable provides HST integration
const { stonecrop, provideHSTPath, handleHSTChange, formData } = useStonecrop({
  doctype: myDoctype,
  recordId: 'record-123'
})
```

## Action Agent System

### Server-Defined Actions
```typescript
actions: {
  CREATE: ['() => console.log("Creating new todo")'],
  EDIT: ['() => console.log("Editing todo")'],
  DELETE: ['() => console.log("Deleting todo")'],
  SAVE: ['() => console.log("Saving todo")'],
  CANCEL: ['() => console.log("Cancelling todo edit")']
}
```

### Mock Action Elements (`mocks/elements.ts`)
```typescript
export const actionElements = [
  {
    type: 'button',
    label: 'Show Alert',
    action: buttonClicked
  },
  {
    type: 'dropdown',
    label: 'Action Menu',
    actions: [
      { label: 'Show Current Timestamp', action: showCurrentTime },
      { label: 'Show Random Number', action: showRandomNumber }
    ]
  }
]
```

## Development Workflow

### Agent Development Commands
```bash
# Start desktop example with hot reload
cd examples && rushx dev:desktop

# Test HST state management
cd stonecrop && rushx test:watch

# Generate API documentation
rushx docs
```

### Agent Debugging
1. **HST Debug Mode**: Set `showDebug: true` in View component
2. **Router Debug**: Console logs show route registration and navigation
3. **Workflow Debug**: XState DevTools integration for FSM inspection
4. **Network Debug**: MirageJS provides server interaction logging

## Agent Best Practices

### 1. State Management
- Use HST for all mutable application state
- Keep workflow state separate from data state
- Leverage path-based addressing for state access

### 2. Route Management
- Register routes dynamically based on server configuration
- Cache doctype hierarchies for performance
- Use route guards for state preparation

### 3. Workflow Design
- Design FSMs with clear state transitions
- Use XState actions for side effects
- Keep workflows focused on single responsibilities

### 4. Component Integration
- Use `useStonecrop` composable for HST integration
- Provide HST paths for field-level reactivity
- Handle changes through `handleHSTChange` for automatic sync

## Testing Agents

### Unit Testing Approach
```typescript
// Test HST state management
describe('HST Agent', () => {
  it('should manage record state correctly', () => {
    const stonecrop = new Stonecrop(registry)
    stonecrop.addRecord('todo-list', '1', recordData)
    expect(stonecrop.currentRecord('todo-list')).toBeDefined()
  })
})

// Test workflow transitions
describe('Workflow Agent', () => {
  it('should transition states correctly', () => {
    const actor = interpret(todoListMachine)
    actor.start()
    actor.send('CREATE')
    expect(actor.state.value).toBe('creating')
  })
})
```

### Integration Testing
- Test route registration and navigation
- Verify HST state synchronization across components
- Validate workflow state persistence during navigation
- Test dynamic doctype discovery and registration

## Cognitive Load Reduction Strategy

### Problem Solved
**Before**: Developers needed to understand Vue's mounting lifecycle, manage global state, extract global properties manually, and coordinate initialization timing between multiple modules.

**After**: Developers only need to provide their initialization logic in a callback - the framework handles all timing, coordination, and instance management.

### Implementation Pattern
```typescript
// Clean, declarative approach with scoped references
app.use(StonecropPlugin, {
  router,
  getMeta,
  autoInitializeRouter: true,
  onRouterInitialized: async (registry, stonecrop) => {
    // Initialize router with provided instances (no global state)
    await initializeRouterWithInstances(registry, stonecrop)

    // User defines what initialization means for their app
    const response = await fetch('/api/doctype-hierarchy')
    // ... handle user-specific logic
  }
})
app.mount('#app') // Everything happens automatically after this
```

### Framework vs User Responsibilities

**Framework (StonecropPlugin)**:
- Manages Vue plugin lifecycle
- Provides initialization hooks with instances
- Handles error boundaries
- Generic, reusable patterns
- No assumptions about global state

**User (Desktop Example)**:
- Manages scoped references through function parameters
- Defines specific API endpoints
- Implements business logic patterns
- Configures doctype hierarchies
- Handles application-specific initialization
- Domain-specific concerns

### Scoped Reference Management
- **Pattern**: Function parameters replace global state
- **Benefit**: Eliminates timing issues and global state pollution
- **Implementation**: `setupRouterContext(registry, stonecrop)` pattern

## Deployment Considerations

### Production Agent Configuration
- Implement proper error handling for route resolution failures
- Add authentication guards to route agents
- Configure proper caching strategies for doctype hierarchies
- Set up monitoring for HST state health

### Performance Optimization
- Preload frequently accessed doctype hierarchies
- Implement lazy loading for large record sets
- Use virtual scrolling for large tables
- Cache workflow configurations to avoid repeated compilation

This agent architecture provides a robust foundation for building complex, workflow-driven applications with predictable state management and dynamic route handling.
