# HST Operation Log System

## Overview

The HST Operation Log is a global Pinia-based store that tracks all HST mutations with comprehensive metadata, enabling:

- **Time Travel**: Undo/redo operations with full state restoration
- **Cross-Tab Synchronization**: Sync operations across browser tabs (via VueUse's `useBroadcastChannel`)
- **Audit Trail**: Complete history of all changes
- **XState Integration**: Mark FSM transitions as irreversible
- **Keyboard Shortcuts**: Built-in undo/redo shortcuts (via VueUse's `useMagicKeys`)
- **Persistence**: Automatic localStorage persistence (via VueUse's `useLocalStorage`)

## Architecture

### Core Components

1. **`useOperationLogStore`** - Global Pinia store for operation tracking
2. **`HSTOperation`** - Complete metadata interface for each mutation
   - **Types**: `SET` (field changes), `TRANSITION` (FSM state changes), `DELETE` (record deletion), `BATCH` (grouped operations)
   - **Reversibility**: SET/DELETE/BATCH operations can be undone, TRANSITION operations cannot
3. **`useOperationLog`** - Vue composable for easy integration
4. **`useUndoRedoShortcuts`** - Keyboard shortcut handler (powered by VueUse)
5. **`withBatch`** - Batch operation helper

### Integration Points

- **HSTProxy**: Automatically logs all `set()` operations as `SET` type
- **Field Triggers**: Can mark operations as irreversible
- **XState Transitions**: Automatically logs FSM transitions as `TRANSITION` type (non-reversible)
- **VueUse Integration**: Leverages `useMagicKeys`, `useLocalStorage` for reduced maintenance
- **Cross-Tab Sync**: Uses `BroadcastChannel` API (transparent to users)
- **LocalStorage**: Automatic persistence with custom serializers

## Usage

### Basic Setup

```typescript
import { useStonecrop } from '@stonecrop/stonecrop'

// Single composable with HST and operation log
const {
  stonecrop,
  hstStore,
  formData,
  provideHSTPath,
  handleHSTChange,
  operationLog  // All operation log functionality nested here
} = useStonecrop({ doctype, recordId })

// Destructure what you need from operationLog
const {
  undo,
  redo,
  canUndo,
  canRedo,
  configure,
  operations,
  currentIndex
} = operationLog

// Configure the operation log
configure({
  maxOperations: 100,
  enableCrossTabSync: true,
  enablePersistence: true,
  persistenceKeyPrefix: 'my-app-ops'
})

// Undo/redo
if (canUndo.value) {
  undo(hstStore.value)
}

if (canRedo.value) {
  redo(hstStore.value)
}
```

### Keyboard Shortcuts

Keyboard shortcuts use VueUse's `useMagicKeys` composable for better reliability and cross-platform support.

```typescript
import { useStonecrop, useUndoRedoShortcuts } from '@stonecrop/stonecrop'

const { hstStore } = useStonecrop({ doctype, recordId })

// Setup keyboard shortcuts (cleanup is automatic when the component unmounts)
useUndoRedoShortcuts(hstStore.value)

// Keyboard shortcuts are automatically active:
// - Ctrl+Z / Cmd+Z = undo
// - Ctrl+Shift+Z / Cmd+Shift+Z = redo
// - Ctrl+Y = redo (Windows/Linux)

// Optionally disable shortcuts
useUndoRedoShortcuts(hstStore.value, false)
```

### Batch Operations

```typescript
import { useStonecrop, withBatch } from '@stonecrop/stonecrop'

const { hstStore } = useStonecrop({ doctype, recordId })

// All operations in the batch are treated as a single undo/redo unit
const batchId = await withBatch(() => {
  hstStore.value.set('task.123.title', 'New Title')
  hstStore.value.set('task.123.status', 'active')
  hstStore.value.set('task.123.priority', 'high')
}, 'Update task details')
```

### Marking Operations as Irreversible

```typescript
import { registerGlobalAction, markOperationIrreversible, useOperationLogStore } from '@stonecrop/stonecrop'

// Register a field trigger that makes an API call
registerGlobalAction('submitOrder', async (context) => {
  // Make irreversible API call
  const response = await api.submitOrder(context.afterValue)

  // Mark the triggering operation irreversible so undo skips it. There is no
  // operation id on the trigger context — read it from the operation log, whose
  // most recent entry is the field change that fired this trigger.
  const opLog = useOperationLogStore()
  markOperationIrreversible(opLog.operations.at(-1)?.id, 'Order submitted to external system')

  return response
})
```

### XState Integration

FSM transitions are automatically logged as `TRANSITION` operations:

```typescript
// FSM transitions are logged automatically by HSTNode.triggerTransition()
// No manual setup required - just trigger transitions normally

// In your component:
const node = hstStore.value.getNode('task.123')
await node?.triggerTransition('SAVE')  // Automatically logged as TRANSITION

// The operation log will capture:
// - type: 'transition'
// - fieldname: 'SAVE' (transition name)
// - beforeValue: 'editing' (current FSM state)
// - afterValue: 'saved' (target FSM state)
// - reversible: false (FSM transitions cannot be undone)
// - metadata: { transition, currentState, targetState, fsmContext }
```

**Manual Irreversibility for Transition Actions:**

If you need to mark specific transition actions as irreversible:

```typescript
import { registerTransitionAction, markOperationIrreversible, useOperationLogStore } from '@stonecrop/stonecrop'

// Register a transition action that commits data
registerTransitionAction('COMMIT_INVOICE', async (context) => {
  // Save to database
  await database.saveInvoice(context.fsmContext?.invoice)

  // Mark the most recent logged operation irreversible. Operation ids come from
  // the log — there is none on the transition context.
  const opLog = useOperationLogStore()
  markOperationIrreversible(opLog.operations.at(-1)?.id, 'Invoice committed to database')
})
```

**Operation Types:**

- **`SET`**: Field value changes (reversible)
  - Example: Editing form fields, updating properties
  - Can be undone/redone

- **`DELETE`**: Record or field deletions (reversible)
  - Example: Deleting records, removing field values (setting to undefined)
  - Automatically detected when setting a value to `undefined` (if previousValue was not undefined)
  - Can be undone to restore deleted data
  - **Note**: Setting `undefined` on a non-existent path logs as SET, not DELETE

- **`TRANSITION`**: FSM state transitions (non-reversible)
  - Example: SAVE (editing → saved), CANCEL (editing → cancelled), DELETE (active → deleted)
  - Cannot be undone (workflow transitions are one-way)
  - Metadata includes transition details and FSM context

- **`BATCH`**: Grouped operations (reversible)
  - Multiple operations treated as single undo/redo unit

### Cross-Tab Synchronization

Cross-tab sync is enabled by default and uses the `BroadcastChannel` API:

```typescript
import { useStonecrop } from '@stonecrop/stonecrop'

const { operationLog } = useStonecrop({ doctype, recordId })

operationLog.configure({
  enableCrossTabSync: true  // Default: true
})

// Operations from other tabs are automatically synced
// Changes in one tab will be reflected in all open tabs
```

### Persistence

```typescript
import { useStonecrop } from '@stonecrop/stonecrop'

const { operationLog } = useStonecrop({ doctype, recordId })

operationLog.configure({
  enablePersistence: true,
  persistenceKeyPrefix: 'stonecrop-ops'
})

// Operations are automatically saved to localStorage
// and restored on page reload
```

### Advanced: Operation Filtering

```typescript
import { useStonecrop } from '@stonecrop/stonecrop'

const { operationLog } = useStonecrop({ doctype, recordId })

operationLog.configure({
  operationFilter: (operation) => {
    // Only track operations for specific doctypes
    return ['task', 'project', 'invoice'].includes(operation.doctype)
  }
})
```

### Debugging

```typescript
import { useStonecrop } from '@stonecrop/stonecrop'

const { operationLog } = useStonecrop({ doctype, recordId })

// Get a snapshot for debugging
const snapshot = operationLog.getSnapshot()
console.log('Total operations:', snapshot.totalOperations)
console.log('Reversible:', snapshot.reversibleOperations)
console.log('Irreversible:', snapshot.irreversibleOperations)

// Access raw operations array
console.log('All operations:', operationLog.operations.value)
```

## Configuration Options

```typescript
interface OperationLogConfig {
  maxOperations?: number              // Default: 100
  enableCrossTabSync?: boolean        // Default: true
  enablePersistence?: boolean         // Default: false
  persistenceKeyPrefix?: string       // Default: 'stonecrop-ops'
  userId?: string
  operationFilter?: (operation: HSTOperation) => boolean
}
```

## Best Practices

### 1. Irreversible Operations

Always mark operations as irreversible when they:
- Make API calls to external systems
- Commit data to databases
- Send emails or notifications
- Trigger external workflows

```typescript
registerGlobalAction('sendEmail', async (context) => {
  await emailService.send(context.afterValue)
  const opLog = useOperationLogStore()
  markOperationIrreversible(opLog.operations.at(-1)?.id, 'Email sent')
})
```

### 2. Batch Related Changes

Group related field changes into batches:

```typescript
const { hstStore } = useStonecrop({ doctype, recordId })

await withBatch(() => {
  hstStore.value.set('invoice.123.status', 'paid')
  hstStore.value.set('invoice.123.paidDate', new Date())
  hstStore.value.set('invoice.123.paymentMethod', 'credit_card')
}, 'Mark invoice as paid')
```

### 3. Limit Operation History

Configure appropriate limits based on memory constraints:

```typescript
const { operationLog } = useStonecrop({ doctype, recordId })

operationLog.configure({
  maxOperations: 50,  // Keep last 50 operations
  operationFilter: (op) => {
    // Only track user-initiated changes
    return op.source === 'user'
  }
})
```

## Performance Considerations

- Operation log adds minimal overhead (~1-2ms per operation)
- Batching reduces memory usage for bulk operations
- Cross-tab sync uses efficient `BroadcastChannel` API
- Persistence is debounced to avoid excessive writes
- Filter operations to reduce memory footprint

## Browser Compatibility

- **Undo/Redo**: All modern browsers
- **Cross-Tab Sync**: Requires `BroadcastChannel` API (Chrome 54+, Firefox 38+, Safari 15.4+)
- **Persistence**: Requires `localStorage` (all modern browsers)
