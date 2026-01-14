# Global HST Operation Log - Quick Start Guide

## Overview

The HST Operation Log is a complete time-travel debugging and undo/redo system for Stonecrop applications. It automatically tracks all state mutations with full metadata, enabling undo/redo, cross-tab sync, and audit trails.

**New in 2025**: Now powered by VueUse composables (`useMagicKeys`, `useLocalStorage`) for improved reliability and reduced maintenance.

## Installation

The operation log is included in `@stonecrop/stonecrop` v0.4.35+. No additional packages needed.

## Quick Start

### 1. Basic Setup with Undo/Redo

```vue
<script setup lang="ts">
import { useStonecrop, useOperationLog, useUndoRedoShortcuts } from '@stonecrop/stonecrop'

// Your doctype and record
const doctype = myDoctype
const recordId = 'task-123'

// Initialize Stonecrop with HST
const { stonecrop, hstStore, formData } = useStonecrop({ doctype, recordId })

// Initialize operation log
const { undo, redo, canUndo, canRedo, undoCount, redoCount } = useOperationLog()

// Set up keyboard shortcuts - now automatic with VueUse!
// Just call the composable, cleanup is handled automatically
useUndoRedoShortcuts(hstStore.value!)

// Manual undo/redo
function handleUndo() {
  if (hstStore.value && canUndo.value) {
    undo(hstStore.value)
  }
}

function handleRedo() {
  if (hstStore.value && canRedo.value) {
    redo(hstStore.value)
  }
}
</script>

<template>
  <div>
    <button @click="handleUndo" :disabled="!canUndo">
      Undo ({{ undoCount }}) - Ctrl+Z
    </button>
    <button @click="handleRedo" :disabled="!canRedo">
      Redo ({{ redoCount }}) - Ctrl+Shift+Z
    </button>
  </div>
</template>
```

**Key improvements:**
- No more manual `onMounted`/`onUnmounted` for shortcuts
- Cross-platform keyboard support (Ctrl/Cmd)
- Automatic cleanup when component unmounts

### 2. Configure Operation Log

```typescript
import { useOperationLog } from '@stonecrop/stonecrop'

const { configure } = useOperationLog()

configure({
  // Keep last 50 operations (default: 100)
  maxOperations: 50,

  // Enable cross-tab sync (default: true)
  enableCrossTabSync: true,

  // Save operations to localStorage (default: false)
  enablePersistence: true,
  persistenceKeyPrefix: 'my-app-ops',

  // Set user ID for tracking
  userId: getCurrentUserId(),

  // Filter which operations to track
  operationFilter: (operation) => {
    // Only track specific doctypes
    return ['task', 'project', 'invoice'].includes(operation.doctype)
  }
})
```

### 3. Batch Multiple Operations

```typescript
import { withBatch } from '@stonecrop/stonecrop'

// All operations are undone/redone together as one unit
async function updateTaskCompletely() {
  await withBatch(() => {
    hstStore.value.set('task.123.title', 'Updated Title')
    hstStore.value.set('task.123.status', 'completed')
    hstStore.value.set('task.123.completedDate', new Date())
    hstStore.value.set('task.123.assignee', 'john@example.com')
  }, 'Complete task update')
}
```

### 4. Mark Operations as Irreversible

```typescript
import { registerGlobalAction, markOperationIrreversible } from '@stonecrop/stonecrop'

// Register a field trigger that makes API calls
registerGlobalAction('submitInvoice', async (context) => {
  // Make irreversible external API call
  const response = await fetch('/api/invoices/submit', {
    method: 'POST',
    body: JSON.stringify({ invoiceId: context.recordId })
  })

  // Mark this operation as irreversible
  // Users won't be able to undo past this point
  markOperationIrreversible(
    context.metadata?.operationId,
    'Invoice submitted to payment processor'
  )

  return response.json()
})
```

### 5. XState Integration

```typescript
import { registerTransitionAction, markOperationIrreversible } from '@stonecrop/stonecrop'

// Register XState transition action
registerTransitionAction('COMMIT_TO_DATABASE', async (context) => {
  // Save to database
  await database.commitTransaction(context.fsmContext?.transactionId)

  // Mark as irreversible since it's committed
  markOperationIrreversible(
    context.metadata?.operationId,
    'Data committed to database'
  )
})

// In your XState machine:
const machine = createMachine({
  states: {
    draft: {
      on: {
        SUBMIT: 'submitted'
      }
    },
    submitted: {
      entry: 'COMMIT_TO_DATABASE',  // Will be marked as irreversible
      type: 'final'
    }
  }
})
```

### 6. View Operation History

```typescript
import { useOperationLog } from '@stonecrop/stonecrop'

const { operations, getSnapshot, getOperationsFor } = useOperationLog()

// Get all operations
console.log('All operations:', operations.value)

// Get operations for specific doctype/record
const taskOps = getOperationsFor('task', '123')
console.log('Task operations:', taskOps)

// Get debugging snapshot
const snapshot = getSnapshot()
console.log('Snapshot:', {
  total: snapshot.totalOperations,
  reversible: snapshot.reversibleOperations,
  irreversible: snapshot.irreversibleOperations,
  oldest: snapshot.oldestOperation,
  newest: snapshot.newestOperation
})
```

## Features at a Glance

| Feature | Description | Status |
|---------|-------------|--------|
| **Undo/Redo** | Full time-travel with state restoration | ✅ |
| **Keyboard Shortcuts** | Ctrl+Z (undo), Ctrl+Shift+Z (redo) | ✅ |
| **Batch Operations** | Group related changes | ✅ |
| **Cross-Tab Sync** | Sync operations across browser tabs | ✅ |
| **Persistence** | Save to localStorage | ✅ |
| **Irreversible Ops** | Mark API calls, DB commits as irreversible | ✅ |
| **XState Integration** | FSM transition tracking | ✅ |
| **Server Sync** | Delta-based server synchronization | ✅ |
| **Filtering** | Custom operation filtering | ✅ |
| **Audit Trail** | Complete operation history | ✅ |

## Common Patterns

### Pattern 1: Form Editing with Undo

```vue
<template>
  <div>
    <div class="toolbar">
      <button @click="undo(hstStore)" :disabled="!canUndo">Undo</button>
      <button @click="redo(hstStore)" :disabled="!canRedo">Redo</button>
      <span>{{ undoCount }} operations available</span>
    </div>

    <form>
      <AField
        v-for="field in schema"
        :key="field.fieldname"
        :field="field"
        :doctype="doctype"
        :record-id="recordId"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
const { hstStore } = useStonecrop({ doctype, recordId })
const { undo, redo, canUndo, canRedo, undoCount } = useOperationLog()
</script>
```

### Pattern 2: Multi-Step Wizard with Rollback

```typescript
async function saveWizardStep(stepData: any) {
  const { startBatch, commitBatch, cancelBatch } = useOperationLog()

  try {
    startBatch()

    // Make multiple related changes
    hstStore.value.set('wizard.currentStep', stepData.step)
    hstStore.value.set(`wizard.step${stepData.step}`, stepData.values)
    hstStore.value.set('wizard.lastModified', new Date())

    // Validate
    if (!await validateStep(stepData)) {
      cancelBatch()  // Discard all changes
      return false
    }

    // Commit as single undo unit
    commitBatch(`Save wizard step ${stepData.step}`)
    return true

  } catch (error) {
    cancelBatch()  // Auto-rollback on error
    throw error
  }
}
```

### Pattern 3: Collaborative Editing

```typescript
// Configure for multi-user scenario
configure({
  userId: currentUser.id,
  enableCrossTabSync: true,
  enableServerSync: true,
  serverSyncEndpoint: '/api/operations/sync',
  autoSyncInterval: 5000  // Sync every 5 seconds
})

// Operations from other tabs/users are automatically synced
```

## Debugging

```typescript
// Enable debug mode in your app
if (import.meta.env.DEV) {
  const { operations, getSnapshot } = useOperationLog()

  // Expose to window for debugging
  window.opLog = {
    operations,
    snapshot: () => getSnapshot(),
    clear: () => useOperationLogStore().clear()
  }
}

// In browser console:
// > opLog.snapshot()
// > opLog.operations.value
// > opLog.clear()
```

## Best Practices

1. **Always configure early** - Set up operation log in your app's main component or entry point
2. **Use batches for related changes** - Group field updates that should be undone together
3. **Mark irreversible operations** - Any external API call or DB commit should be marked
4. **Set reasonable limits** - Don't track unlimited operations, use `maxOperations`
5. **Filter when needed** - Use `operationFilter` to exclude temporary/internal changes
6. **Clean up shortcuts** - Always call `cleanupShortcuts()` in `onUnmounted()`

## Troubleshooting

### Undo not working?
- Check `canUndo` is true
- Ensure operation is reversible (`!operation.irreversibleReason`)
- Verify HST store is passed to `undo()` function

### Cross-tab sync not working?
- Check browser supports BroadcastChannel API (Chrome 54+, Firefox 38+, Safari 15.4+)
- Verify `enableCrossTabSync: true` in config
- Ensure same `persistenceKeyPrefix` across tabs

### Operations not being tracked?
- Check `operationFilter` isn't excluding them
- Verify HST store integration is working
- Ensure `maxOperations` limit isn't too low

## More Information

- Full documentation: `/docs/operation-log.md`
- API documentation: `/api.md`
- Test examples: `/tests/operation-log.spec.ts`

## Support

For issues or questions:
- Create an issue on GitHub
- Check existing documentation
- Review test files for usage patterns
