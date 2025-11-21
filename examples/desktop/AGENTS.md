# Desktop Example - Agent Architecture Documentation

## Overview

The Desktop example demonstrates a **schema-driven UI framework** with **event-driven workflows** using Stonecrop's Hierarchical State Tree (HST) and XState finite state machines. This example showcases how agents (FSMs) control application behavior through structured workflows and state management.

## Test Coverage & Quality Assurance

### Testing Architecture Patterns
1. **Plugin Testing**: Considerable coverage of auto-initialization, callback handling, error handling, custom component registration, and router logic
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

### Framework Agnosticism Principle
**Critical Learning**: Framework components must remain completely agnostic to application-specific doctype patterns and organization structures.

**Problem**: The `useStonecrop` composable was making hard-coded assumptions about doctype naming conventions:
- Automatically appending `-form` and `-list` suffixes to route segments
- Determining doctype variants based on URL pattern analysis
- Embedding business logic about form vs. list views into the framework

**Solution**:
- **Route-Centric Resolution**: Pass the entire route path to `registry.getMeta()` and let the application determine the doctype
- **Application-Controlled Mapping**: The application's `getMeta` function decides how routes map to doctypes
- **No Framework Assumptions**: Framework code never assumes specific naming patterns or doctype structures

```typescript
// BEFORE (Framework making assumptions)
const isFormView = recordId && recordId !== 'new'
const actualDoctypeSlug = isFormView ? `${doctypeSlug}-form` : `${doctypeSlug}-list`
const doctype = await registry.getMeta?.(actualDoctypeSlug)

// AFTER (Application controls mapping)
const routePath = route.path  // "/todo/1" or "/todo"
const doctype = await registry.getMeta?.(routePath)  // App decides todo-form vs todo-list
```

### Field Trigger Context Resolution
**Critical Learning**: HST doctype context must be resolved consistently across all operations, including field triggers.

**Problem**: Field triggers were using the root HST node's doctype ("StonecropStore") instead of the path-specific doctype:
```typescript
// WRONG: Uses root doctype
const doctype = this.doctype  // Always "StonecropStore"
```

**Solution**: Apply the same doctype resolution logic used in `getNode()` to field trigger execution:
```typescript
// CORRECT: Resolve doctype from path
let doctype = this.doctype
if (this.doctype === 'StonecropStore' && pathSegments.length >= 1) {
  doctype = pathSegments[0]  // Extract actual doctype from path
}
```

**Impact**: Field triggers now execute with the correct doctype context (e.g., "todo-form" instead of "StonecropStore"), enabling proper action registration and execution.

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

### 6. Operation Log Agent (`useOperationLog` composable)
**Primary Responsibility**: Undo/redo state management and operation history tracking

The Operation Log Agent provides a complete audit trail system integrated with HST. It tracks all field changes and FSM state transitions, enables keyboard shortcuts for undo/redo, and provides visual feedback for operation history.

**Pinia Integration Architecture**:
The operation log is now automatically initialized by the Stonecrop plugin when Pinia is available:

```typescript
// Stonecrop Plugin (plugins/index.ts)
// Initialize operation log store if Pinia is available
try {
  const pinia = app.config.globalProperties.$pinia as Pinia | undefined
  if (pinia) {
    // Initialize the operation log store with the app's Pinia instance
    const operationLogStore = useOperationLogStore(pinia)

    // Provide the store so components can access it
    app.provide('$operationLogStore', operationLogStore)
    app.config.globalProperties.$operationLogStore = operationLogStore
  }
} catch (error) {
  // Pinia not available - operation log won't work, but app should still function
}
```

**Component Integration**:
```typescript
// View.vue - Desktop example
import { useOperationLog } from '@stonecrop/stonecrop'

// Use the real operation log composable
// The Stonecrop plugin has already initialized the store with the app's Pinia instance
const { operations, currentIndex, canUndo, canRedo } = useOperationLog()

// Operation log is always ready since it's injected by the Stonecrop plugin
const operationLogReady = computed(() => true)
```

**Composable Architecture**:
```typescript
// operation-log.ts composable
export function useOperationLog(config?: Partial<OperationLogConfig>) {
  // Try to use the injected store from the Stonecrop plugin first
  // This ensures we use the same Pinia instance as the app
  const injectedStore = inject<ReturnType<typeof useOperationLogStore> | undefined>('$operationLogStore', undefined)
  const store = injectedStore || useOperationLogStore()

  // Apply configuration if provided
  if (config) {
    store.configure(config)
  }

  // Return operation log interface...
}
```

**Agent Features**:
- **Automatic Operation Tracking**: All HST field changes and FSM transitions are automatically logged
- **Field Change Operations**: Tracks SET operations for field value changes
- **FSM Transition Operations**: Tracks TRANSITION operations for workflow state changes (e.g., SAVE, CANCEL, DELETE)
- **Keyboard Shortcuts**: VueUse-based shortcuts (Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y, Meta key variants)
- **Visual Feedback**: Undo/redo buttons show operation count and disabled state
- **Operation History**: Debug panel displays full operation log with timestamps and operation types
- **State Management**: Pinia store maintains operation history across components
- **Framework Integration**: Initialized automatically by Stonecrop plugin when Pinia is available

**UI Integration**:
```typescript
// Action elements for record view
elements.push(
  {
    type: 'button',
    label: `⟲ Undo${undoCount.value > 0 ? ` (${undoCount.value})` : ''}`,
    action: handleUndo,
    disabled: !canUndo.value,
  },
  {
    type: 'button',
    label: `⟳ Redo${redoCount.value > 0 ? ` (${redoCount.value})` : ''}`,
    action: handleRedo,
    disabled: !canRedo.value,
  }
)
```

**Operation Log Panel** (`components/OperationLogPanel.vue`):
- Displays operation history with type (SET or TRANSITION), path, field name, and value changes
- Shows current operation index and undo/redo availability
- Visual distinction for past operations vs current state
- Real-time updates as operations are performed
- Supports both field change operations and FSM transition operations

**Operation Types**:
1. **SET Operations**: Field value changes tracked automatically
   - Type: `SET`
   - Shows: Path, field name, before/after values
   - Reversible: Yes (can be undone/redone)
   - Example: Editing form fields, updating record properties

2. **DELETE Operations**: Record or field deletions tracked automatically
   - Type: `DELETE`
   - Shows: Path, field name, before value (deleted data), after value (undefined)
   - Reversible: Yes (can be undone to restore deleted data)
   - Example: Deleting records via `removeRecord()`, setting fields to `undefined`
   - **Auto-Detection**: Automatically logged when `set(path, undefined)` is called on an existing value
   - **Note**: Setting `undefined` on non-existent paths logs as SET, not DELETE

3. **TRANSITION Operations**: FSM state transitions tracked automatically
   - Type: `TRANSITION`
   - Shows: Path, transition name (as field), before/after states
   - Reversible: No (workflow transitions are one-way)
   - Example: SAVE (editing → saved), CANCEL (editing → cancelled)
   - Metadata: Includes transition details, FSM context

4. **BATCH Operations**: Grouped operations tracked as single unit
   - Type: `BATCH`
   - Contains multiple child operations (SET, DELETE, or both)
   - Reversible: Yes (undoing/redoing batch affects all child operations)
   - Example: Form submission with multiple field changes

**HST Integration for FSM Transitions**:
```typescript
// HST Store (stores/hst.ts)
async triggerTransition(
  transition: string,
  context?: { currentState?: string; targetState?: string; fsmContext?: Record<string, any> }
): Promise<any> {
  // ... FSM context building ...

  // Log FSM transition operation
  const logStore = getOperationLogStore()
  if (logStore && typeof logStore.addOperation === 'function') {
    logStore.addOperation(
      {
        type: 'transition' as const,
        path: this.parentPath,
        fieldname: transition,  // e.g., "SAVE", "CANCEL"
        beforeValue: context?.currentState,  // e.g., "editing"
        afterValue: context?.targetState,    // e.g., "saved"
        doctype,
        recordId,
        reversible: false,  // FSM transitions are not reversible
        metadata: {
          transition,
          currentState: context?.currentState,
          targetState: context?.targetState,
          fsmContext: context?.fsmContext,
        },
      },
      'user'
    )
  }

  // Execute transition actions
  return await triggerEngine.executeTransitionActions(transitionContext)
}
```

**VueUse Integration**:
The keyboard shortcut system uses VueUse composables for cross-platform compatibility:
- **useMagicKeys**: Keyboard event detection with key combination support
- **whenever**: Conditional watchers for shortcut triggers
- **Cross-platform**: Supports both Ctrl (Windows/Linux) and Meta (Mac) modifiers

**Key Benefits**:
- **Non-intrusive**: Automatically tracks changes without requiring explicit operation registration
- **HST Integration**: Works seamlessly with existing HST field change system
- **Debug-friendly**: Optional operation log panel for development and troubleshooting
- **Accessible**: Keyboard shortcuts follow standard conventions
- **Reactive**: UI updates automatically based on operation log state

**Testing Keyboard Shortcuts**:
```bash
# Start desktop example
cd examples && rushx dev:desktop

# Navigate to any record view (e.g., /todo/1)
# Make field changes
# Press Ctrl+Z to undo (or Cmd+Z on Mac)
# Press Ctrl+Shift+Z or Ctrl+Y to redo (or Cmd+Shift+Z on Mac)
# Toggle operation log panel with debug button
```

## Workflow State Machines

### XState Transition Integration

The desktop example demonstrates **automatic XState transition triggering** using HST integration. When workflow transitions occur, registered transition actions are automatically executed.

**Benefits**:
- **Declarative Workflows**: Define workflow behavior in transition actions, not scattered throughout components
- **Consistent Side Effects**: All SAVE operations execute the same validation, logging, and notification logic
- **Testable**: Transition actions can be unit tested independently of components
- **Reusable**: Shared transition actions work across all doctypes (SAVE, CANCEL, DELETE)
- **Context-Aware**: Actions receive full FSM state context (currentState, targetState, fsmContext)

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

### 3. Component → HST Agent Flow
```typescript
// useStonecrop composable provides HST integration
const { stonecrop, provideHSTPath, handleHSTChange, formData } = useStonecrop({
  doctype: myDoctype,
  recordId: 'record-123'
})
```

### 4. Operation Log → HST Agent Flow
```typescript
// Operation log automatically tracks HST changes
// When a field changes in HST:
hstStore.set('todo-form.1.title', 'Updated Title')  // HST change

// ↓ Operation Log intercepts through HST middleware
// ↓ Creates operation record with beforeValue/afterValue
// ↓ Stores in operation history

// User triggers undo
handleUndo()  // Calls undo(hstStore)

// ↓ Operation Log retrieves last operation
// ↓ Reverts HST to previous state
// ↓ Updates currentIndex in operation history

hstStore.get('todo-form.1.title')  // Returns original value
```

**Flow Diagram**:
```
User Input → Component → HST Store → Operation Log (record)
                                   ↓
                              Pinia Store (persist)
                                   ↓
Keyboard Shortcut → useUndoRedoShortcuts → Operation Log (undo/redo)
                                                ↓
                                           HST Store (revert)
                                                ↓
                                           Component (update)
```

## Action Agent System

### Server-Defined Actions
```typescript
actions: {
  // XState transition actions (uppercase convention) - MUST be arrays
  SAVE: ['SAVE'],     // Triggers XState transition action
  CANCEL: ['CANCEL'], // Triggers XState transition action
  DELETE: ['DELETE'], // Triggers XState transition action
  CREATE: ['CREATE'], // Triggers XState transition action

  // Field trigger actions (lowercase/camelCase convention)
  first_name: ['validateName', 'updateFullName', 'logFieldChange'],
  last_name: ['validateName', 'updateFullName', 'logFieldChange'],
  phone: ['validatePhoneFormat', 'notifyPhoneChange', 'logFieldChange']
}
```

### XState Transition Actions

The desktop example demonstrates **XState transition integration** using the uppercase convention pattern. Transition actions are automatically triggered when FSM state transitions occur.

#### Transition Action Registration
```typescript
// Register transition actions using registerTransitionAction
registerTransitionAction('SAVE', (context: TransitionChangeContext) => {
  const { transition, doctype, recordId, currentState, targetState, fsmContext } = context

  console.log('💾 SAVE Transition:', {
    doctype,
    recordId,
    from: currentState,
    to: targetState,
    fsmContext,
  })

  addNotification(`💾 Saving ${doctype} record ${recordId}...`, 'info')

  // Simulate save operation
  setTimeout(() => {
    addNotification(`✅ ${doctype} record ${recordId} saved successfully!`, 'success')
  }, 500)
})
```

#### Available Transition Actions
- **SAVE**: Triggered when saving a record (editing → saved)
- **CANCEL**: Triggered when canceling edits (editing → cancelled)
- **DELETE**: Triggered when deleting a record (editing → deleted)
- **CREATE**: Triggered when creating a new record (loaded → creating)
- **EDIT**: Triggered when editing a record (saved → editing)
- **VALIDATE**: Triggered for validation workflows
- **SUBMIT**: Triggered for submission workflows

#### Triggering Transitions from Components

The Desktop component integrates XState transitions with UI actions:

```typescript
const handleSave = async () => {
  if (!stonecrop.value) return

  const formData = currentViewData.value || {}
  const recordData = { id: currentRecordId.value, ...formData }
  stonecrop.value.addRecord(currentDoctype.value, currentRecordId.value, recordData)

  // Trigger SAVE transition
  const node = stonecrop.value.getRecordById(currentDoctype.value, currentRecordId.value)
  if (node) {
    await node.triggerTransition('SAVE', {
      currentState: 'editing',
      targetState: 'saved',
      fsmContext: recordData,
    })
  }
}
```

#### Transition vs Field Trigger Actions

**XState Transition Actions** (Uppercase):
- Follow uppercase convention: `SAVE`, `CANCEL`, `DELETE`, `CREATE`
- Triggered by FSM state transitions
- Receive `TransitionChangeContext` with FSM state info
- Registered using `registerTransitionAction()`
- Example: Saving a record, canceling edits, workflow validation

**Field Trigger Actions** (Lowercase/CamelCase):
- Follow lowercase/camelCase convention: `validateName`, `updateFullName`
- Triggered by field value changes
- Receive `FieldChangeContext` with field change info
- Registered using `registerGlobalAction()`
- Example: Field validation, auto-fill, change notifications

#### Context Passing

Transition actions receive field context:
```typescript
interface TransitionChangeContext extends FieldChangeContext {
  transition: string       // Transition name (e.g., "SAVE")
  currentState?: string    // Current FSM state (e.g., "editing")
  targetState?: string     // Target FSM state (e.g., "saved")
  fsmContext?: any        // FSM context data
}
```

This allows transition actions to:
- Access current record data through `path`
- Know the FSM state flow through `currentState` and `targetState`
- Receive workflow context through `fsmContext`
- Execute side effects like API calls, notifications, or state updates

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
5. **Operation Log Debug**: Toggle operation log panel to view change history

### Operation Log Debugging
The Operation Log Panel provides debugging for undo/redo functionality:

```typescript
// Enable operation log panel in View.vue
const showOperationLog = ref(false)  // Toggle with debug button
```

**Panel Features**:
- **Operation History**: View all field changes with timestamps
- **Current Index**: See position in undo/redo stack
- **State Indicators**: Visual feedback for canUndo/canRedo
- **Operation Details**: Path, field name, before/after values for each operation
- **Real-time Updates**: Panel updates as operations are performed

**Keyboard Shortcuts**:
- `Ctrl+Z` (or `Cmd+Z` on Mac): Undo last operation
- `Ctrl+Shift+Z` or `Ctrl+Y` (or `Cmd+Shift+Z` on Mac): Redo operation
- Works across all form fields automatically

## Agent Best Practices

### 1. State Management
- Use HST for all mutable application state
- Keep workflow state separate from data state
- Leverage path-based addressing for state access
- Ensure consistent doctype resolution across all HST operations
- **Enable operation log for undo/redo functionality in form views**

### 2. Route Management
- Register routes dynamically based on server configuration
- Cache doctype hierarchies for performance
- Use route guards for state preparation
- **Never embed doctype structure assumptions in framework code**

### 3. Workflow Design
- Design FSMs with clear state transitions
- Use XState actions for side effects
- Keep workflows focused on single responsibilities

### 4. Component Integration
- Use `useStonecrop` composable for HST integration
- Provide HST paths for field-level reactivity
- Handle changes through `handleHSTChange` for automatic sync
- **Integrate useOperationLog for undo/redo in data editing views**

### 5. Framework Agnosticism
- **Framework Code**: Provide generic hooks and mechanisms, never assume application patterns
- **Application Code**: Own all business logic, doctype structures, and API patterns
- **Route Resolution**: Let applications control how routes map to doctypes
- **Field Triggers**: Ensure doctype context is correctly resolved from HST paths

### 6. Operation Log Integration
- **Automatic Tracking**: Operation log automatically tracks all HST field changes
- **Keyboard Shortcuts**: Use useUndoRedoShortcuts for standard keyboard support
- **Visual Feedback**: Display undo/redo buttons with operation counts
- **Debug Panel**: Enable operation log panel for development and troubleshooting
- **State Awareness**: Disable undo/redo buttons when not available

## Testing Agents

### Operation Log Testing

To test operation log integration:

```bash
# Start the desktop example
cd examples && rushx dev:desktop
```

Navigate to http://localhost:5173/ and test undo/redo functionality:

**Manual Test Cases**:

1. **Test Field Changes**:
   - Open any record (e.g., `/todo/1`)
   - Edit multiple fields (title, description, status)
   - Watch undo button show operation count: `⟲ Undo (3)`
   - Observe redo button is disabled

2. **Test Undo**:
   - Click `⟲ Undo` button or press `Ctrl+Z`
   - Field value reverts to previous state
   - Undo count decreases, redo count increases
   - Verify field changes are reversed in order

3. **Test Redo**:
   - After undo, click `⟳ Redo` button or press `Ctrl+Shift+Z`
   - Field value returns to edited state
   - Redo count decreases, undo count increases

4. **Test Keyboard Shortcuts**:
   - Mac: Press `Cmd+Z` for undo, `Cmd+Shift+Z` for redo
   - Windows/Linux: Press `Ctrl+Z` for undo, `Ctrl+Y` or `Ctrl+Shift+Z` for redo
   - Verify shortcuts work without clicking buttons

5. **Test Operation Log Panel**:
   - Click "📋 Operation Log" button (bottom-right)
   - View operation history with timestamps
   - Observe current operation highlighted
   - See before/after values for each operation
   - **Verify operation types**: SET operations show field changes, TRANSITION operations show state changes
   - **Check reversibility**: SET operations show "Can Undo: ✓", TRANSITION operations show "Can Undo: ✗"
   - Close panel with ✕ button

6. **Test Disabled States**:
   - Open new record
   - Verify undo button is disabled (no operations)
   - Make changes, undo all
   - Verify undo button disabled, redo button enabled
   - Redo all changes
   - Verify redo button disabled, undo button enabled

**Expected Behavior**:
- All field changes tracked automatically
- Undo/redo buttons show correct operation counts
- Buttons disabled when operations not available
- Keyboard shortcuts work across platforms
- Operation log panel shows detailed history
- Operations execute in correct order (LIFO for undo, FIFO for redo)

### XState Transition Testing

To test XState transition integration:

```bash
# Start the desktop example
cd examples && rushx dev:desktop
```

Then navigate to http://localhost:5173/ and:

**UI-Based Transition Triggering** (New in Desktop Example):

The desktop example includes a **Transitions dropdown** in the action bar for easy transition testing:

1. **Access the dropdown**: Open any record (e.g., `/todo/1` or `/issue/1`)
2. **Find "Transitions" dropdown**: Located in the top action bar, next to Save/Delete buttons
3. **View available transitions**: Click to see transitions for current FSM state:
   - `SAVE (→ saved)` - Save the record
   - `CANCEL (→ cancelled)` - Cancel editing
   - `DELETE (→ deleted)` - Delete the record
4. **Trigger transitions**: Click any transition to execute it with full context
5. **Watch feedback**: Notifications appear in top-right corner, console shows detailed logs

**Manual Test Cases**:

1. **Test CREATE transition**: Click on a doctype list (e.g., Todo) and click "Create New"
2. **Test SAVE transition**:
   - Edit a record and click "Save" button, OR
   - Use "Transitions" dropdown → select "SAVE (→ saved)"
   - Watch for 💾 notification → ✅ success notification
   - **Open Operation Log Panel**: Verify TRANSITION operation appears with Field: SAVE, Before: editing, After: saved
   - **Check reversibility**: TRANSITION operations show "Can Undo: ✗"
3. **Test CANCEL transition**:
   - Edit a record and click "Cancel" button, OR
   - Use "Transitions" dropdown → select "CANCEL (→ cancelled)"
   - Watch for ❌ notification
   - **Operation Log**: Verify TRANSITION operation with Field: CANCEL appears
4. **Test DELETE transition**:
   - Click "Delete" button, OR
   - Use "Transitions" dropdown → select "DELETE (→ deleted)"
   - Watch for 🗑️ notification
   - **Operation Log**: Verify TRANSITION operation with Field: DELETE appears
5. **Test Field Triggers**: Edit any field and watch for validation notifications in real-time

**Expected Behavior**:
- **Transitions dropdown** shows only valid transitions for the current FSM state
- Dropdown label shows transition name and target state (e.g., "SAVE (→ saved)")
- Transition actions trigger notifications with appropriate icons (💾, ❌, 🗑️, etc.)
- Console logs show detailed transition context including FSM states
- Notifications appear in the top-right corner with proper styling
- Field triggers continue to work alongside transition actions
- **FSM transitions logged**: All FSM transitions appear in Operation Log as TRANSITION operations
- **Operation types distinguished**: SET operations (field changes) vs TRANSITION operations (state changes)
- **Reversibility respected**: TRANSITION operations are non-reversible (can't be undone)

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

// Test operation log
describe('Operation Log Agent', () => {
  it('should track field changes', () => {
    const { operations } = useOperationLog()
    const hstStore = stonecrop.getStore()

    hstStore.set('todo-form.1.title', 'New Title')
    expect(operations.value).toHaveLength(1)
    expect(operations.value[0].fieldname).toBe('title')
  })

  it('should undo/redo operations', () => {
    const { undo, redo, canUndo, canRedo } = useOperationLog()
    const hstStore = stonecrop.getStore()

    hstStore.set('todo-form.1.title', 'New Title')
    expect(canUndo.value).toBe(true)

    undo(hstStore)
    expect(hstStore.get('todo-form.1.title')).toBe('Old Title')
    expect(canRedo.value).toBe(true)

    redo(hstStore)
    expect(hstStore.get('todo-form.1.title')).toBe('New Title')
  })
})
```

### Integration Testing
- Test route registration and navigation
- Verify HST state synchronization across components
- Validate workflow state persistence during navigation
- Test dynamic doctype discovery and registration
- **Verify operation log tracks changes across route navigation**
- **Test undo/redo functionality with multiple field changes**
- **Validate keyboard shortcuts work in different browsers**

## VueUse Integration Patterns

### Keyboard Shortcut System

The desktop example demonstrates **VueUse integration** for keyboard shortcuts using composables from `@vueuse/core` and `@vueuse/shared`.

**Architecture**:
```typescript
import { useMagicKeys } from '@vueuse/core'
import { whenever } from '@vueuse/shared'

// Initialize keyboard event detection
const keys = useMagicKeys()

// Setup conditional watchers for shortcuts
whenever(keys['Ctrl+Z'], () => {
  if (canUndo.value) {
    void undo(hstStore)
  }
})

whenever(keys['Meta+Z'], () => {  // Mac support
  if (canUndo.value) {
    void undo(hstStore)
  }
})
```

**Key Components**:
- **useMagicKeys**: Returns reactive refs for all keyboard key states
- **whenever**: Conditional watcher that executes callback when condition is true
- **Cross-platform**: Supports Ctrl (Windows/Linux) and Meta (Mac) modifiers
- **Non-blocking**: Shortcuts work without preventing default browser behavior

**Benefits**:
- **Type-safe**: Full TypeScript support with proper type definitions
- **Reactive**: Automatic cleanup when component unmounts
- **Composable**: Easy to integrate with other VueUse composables
- **Platform-aware**: Handles platform-specific key modifiers automatically

**Supported Shortcuts**:
- `Ctrl+Z` / `Cmd+Z`: Undo last operation
- `Ctrl+Shift+Z` / `Cmd+Shift+Z`: Redo operation
- `Ctrl+Y`: Alternative redo (Windows convention)

**Implementation Notes**:
- VueUse 13.6.0 requires separate imports for `useMagicKeys` and `whenever`
- TypeScript configuration requires `"moduleResolution": "bundler"` for ESM types
- `@vueuse/shared` must be added as explicit dependency

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
- **Provides operation log infrastructure**

**User (Desktop Example)**:
- Manages scoped references through function parameters
- Defines specific API endpoints
- Implements business logic patterns
- Creates routes on-demand based on navigation patterns
- Handles application-specific initialization
- Domain-specific concerns
- **Integrates operation log in UI components**

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
- **Configure operation log limits for production environments**
- **Implement operation log persistence strategies if needed**

### Performance Optimization
- Implement lazy loading for large record sets (routes created on access)
- Use virtual scrolling for large tables
- Cache workflow configurations to avoid repeated compilation
- Monitor route creation performance for frequently accessed patterns
- Consider route pre-registration for critical user paths
- **Limit operation log history size in production** (default: 50 operations)
- **Disable cross-tab sync if not needed** (reduces overhead)
- **Consider disabling persistence for high-frequency edit scenarios**

This agent architecture provides a robust foundation for building complex, workflow-driven applications with predictable state management, undo/redo functionality, and on-demand route handling.
