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
- **Further Evolution**: Removed pre-configured hierarchy endpoints to enable on-demand route setup
- **Route-Based API**: Evolved to route-centric metadata resolution (`/api/meta?route=/path`)
- Routes are now registered dynamically as needed, with metadata determined by URL patterns

### Plugin Architecture Best Practices
1. **Framework Responsibility**: Provide initialization hooks and event mechanisms
2. **User Responsibility**: Define specific initialization logic, API calls, and business patterns
3. **Scoped Reference Management**: Use closures and function parameters instead of global state
4. **On-Demand Route Registration**: Routes are created when needed rather than pre-configured
5. **Route-Centric API Design**: APIs organized around URL patterns rather than internal doctypes
6. **No Backwards Compatibility Burden**: All code is subject to change; focus on clean architecture over compatibility

### Router Initialization Strategy
**Final Pattern**: Scoped reference management with on-demand route setup
```typescript
// Framework provides the hook with instances
app.use(StonecropPlugin, {
  autoInitializeRouter: true,
    onRouterInitialized: async (registry, stonecrop) => {
    // Setup router context with provided instances (no global state)
    await setupRouterContext(registry, stonecrop)

    // Routes are now registered on-demand during navigation
    // No upfront hierarchy loading required
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
**Primary Responsibility**: On-demand route registration and state management

```typescript
// Agent state management - simplified for on-demand approach
const registeredDoctypes = new Set<string>()

// Scoped references set during initialization
let scopedRegistry: any = null
let scopedStonecrop: any = null

// Direct initialization with instances (no preloading)
export function setupRouterContext(registry: any, stonecrop: any): Promise<void> {
  scopedRegistry = registry
  scopedStonecrop = stonecrop
  // Routes are registered when needed, not preloaded
  return Promise.resolve()
}
```

**Agent Capabilities**:
- **Scoped Instance Management**: Receives Registry and Stonecrop instances directly
- **On-Demand Registration**: Routes are created only when accessed, reducing initial load
- **Dynamic Route Creation**: Builds routes based on doctype patterns during navigation
- **State Preparation**: Sets up HST state before route navigation
- **Workflow Integration**: Connects routes to XState workflow states
- **Simplified Architecture**: No upfront hierarchy caching or preloading

**Key Learning**: Router agent now uses on-demand route creation, eliminating the need for hierarchy preloading and caching.

**Key Agent Functions**:

#### `setupRouterContext()` Agent
- Sets up scoped references to Registry and Stonecrop instances
- Provides router functions with access to core framework instances
- No longer requires hierarchy preloading

#### `setupDoctypeData()` Agent
- Loads doctype metadata into Registry on-demand
- Populates HST with records for the doctype when needed
- Manages data freshness and state synchronization

#### `setupRecordData()` Agent
- Handles individual record state management
- Sets current record context in HST
- Manages new vs. existing record workflows

#### `registerDoctypeRoutes()` Agent
- On-demand route pattern registration when routes are accessed
- Creates Vue Router routes with HST state guards dynamically
- Manages route-to-workflow mapping as needed

### 3. Server Agent (`server.ts`)
**Primary Responsibility**: Mock data and workflow simulation using MirageJS

**Agent Configuration** (Simplified):
```typescript
// Direct doctype definitions without hierarchy preloading
doctypes: [
  {
    id: 'todo',
    name: 'Todo',
    slug: 'todo',
    description: 'Task management - /todo/ (list), /todo/1 (form)',
    actions: 'View',
  },
  {
    id: 'issue',
    name: 'Issue',
    slug: 'issue',
    description: 'Issue tracking - /issue/ (list), /issue/1 (form)',
    actions: 'View',
  },
]
```

**Key Changes**:
- **Removed**: `/api/doctype-hierarchy` endpoints for preloading route configurations
- **Removed**: `/api/resolve-route` endpoint for centralized route resolution
- **Added**: Route-based meta endpoint `/api/meta?route=/path` for automatic doctype resolution
- **Simplified**: Direct doctype definitions without complex hierarchy structures
- **On-Demand**: Routes are now created based on navigation patterns rather than server configuration

**Route-Based Meta Endpoint**:
```typescript
// Single endpoint that determines doctype from route path
GET /api/meta?route=/todo              // Returns todo-list metadata
GET /api/meta?route=/todo/1            // Returns todo-form metadata
GET /api/meta?route=/issue             // Returns issue-list metadata
GET /api/meta?route=/issue/1           // Returns issue-form metadata
```

**Automatic Type Detection**:
- **List Routes**: Single path segment (`/todo`) → `todo-list` doctype
- **Form Routes**: Two path segments (`/todo/1`) → `todo-form` doctype
- **Error Handling**: Invalid routes return appropriate error messages

**Route-Based Benefits**:
- **Intuitive**: Route parameter matches exactly what appears in browser URL
- **Automatic Resolution**: No need to specify doctype variant - determined by route structure
- **Single Endpoint**: All metadata requests follow the same pattern
- **Error Resilient**: Clear error messages for invalid route formats
- **URL-Centric**: API is organized around routes rather than internal doctype names

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
│   ├── 1/ (record data)
│   ├── 2/ (record data)
│   └── workflow/ (FSM state)
├── todo-form/
│   ├── 1/ (form data)
│   ├── 2/ (form data)
│   └── workflow/ (FSM state)
└── registry/ (doctype definitions)
```

### HST Agent Operations
- **Path Navigation**: `stonecrop.getNode('todo-list.1')`
- **Record Access**: `stonecrop.getRecordById('todo-list', recordId)`
- **Workflow Management**: HST integrates with XState actors for workflow execution
- **Tree Traversal**: Parent/child relationships for breadcrumb navigation

## Agent Communication Patterns

### 1. Router → HST Agent Flow (On-Demand)
```typescript
// Route guard triggers on-demand setup and HST state preparation
beforeEnter: async (to, from, next) => {
  const routePattern = to.path

  // Determine doctype and route type from path pattern
  if (routePattern.includes('/:')) {
    // Form route - setup record data on-demand
    const recordId = to.params.recordId as string
    await setupRecordData(doctype, recordId)
  } else {
    // List route - setup doctype data on-demand
    await setupDoctypeData(doctype)
  }
  next()
}
```

### 2. Server → Registry Agent Flow (Route-Based)
```typescript
// getMeta function uses route-based meta endpoint
const getMeta = async (doctype: string) => {
  // Default to list route when only doctype is provided
  const route = `/${doctype}`
  const response = await fetch(`/api/meta?route=${encodeURIComponent(route)}`)
  const data = await response.json()

  if ('error' in data) {
    throw new Error(`Failed to get metadata: ${data.error}`)
  }

  return new DoctypeMeta(data.doctype, List(data.schema), data.workflow, Map(data.actions))
}

// Form-specific metadata fetching in setupRecordData
const setupRecordData = async (doctype: string, recordId: string) => {
  const route = `/${doctype}/${recordId}`
  const response = await fetch(`/api/meta?route=${encodeURIComponent(route)}`)
  // ... handle form metadata
}
```

### 3. Component → HST Agent Flow (Unchanged)
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
    expect(stonecrop.getRecordById('todo-list', '1')).toBeDefined()
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
**Before**: Developers needed to understand Vue's mounting lifecycle, manage global state, extract global properties manually, coordinate initialization timing between multiple modules, and preload complex hierarchy configurations.

**After**: Developers only need to provide their initialization logic in a callback - the framework handles all timing, coordination, and instance management. Routes are created on-demand, eliminating upfront configuration overhead.

### Implementation Pattern
```typescript
// Clean, declarative approach with on-demand setup
app.use(StonecropPlugin, {
  router,
  getMeta,
  autoInitializeRouter: true,
  onRouterInitialized: async (registry, stonecrop) => {
    // Initialize router with provided instances (no hierarchy preloading)
    await setupRouterContext(registry, stonecrop)

    // Routes are registered as needed during navigation
    // No upfront configuration required
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
- No assumptions about route configuration patterns

**User (Desktop Example)**:
- Manages scoped references through function parameters
- Defines specific API endpoints
- Implements business logic patterns
- Creates routes on-demand based on navigation patterns
- Handles application-specific initialization
- Domain-specific concerns

### Scoped Reference Management
- **Pattern**: Function parameters replace global state
- **Benefit**: Eliminates timing issues and global state pollution
- **Implementation**: `setupRouterContext(registry, stonecrop)` pattern
- **On-Demand Approach**: Routes created when needed, not preloaded

## Deployment Considerations

### Production Agent Configuration
- Implement proper error handling for on-demand route creation
- Add authentication guards to route agents
- Configure appropriate caching strategies for frequently accessed routes
- Set up monitoring for HST state health
- Handle edge cases for invalid route patterns gracefully

### Performance Optimization
- Implement lazy loading for large record sets (routes created on access)
- Use virtual scrolling for large tables
- Cache workflow configurations to avoid repeated compilation
- Monitor route creation performance for frequently accessed patterns
- Consider route pre-registration for critical user paths

This agent architecture provides a robust foundation for building complex, workflow-driven applications with predictable state management and on-demand route handling.
