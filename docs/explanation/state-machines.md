---
title: State Machines
description: XState integration and transition handling in Stonecrop
---

# XState Transition Integration

Stonecrop supports automatic triggering of XState FSM transitions through the HST (Hierarchical State Tree) system. This allows you to define transition actions that execute when state changes occur, coordinating application logic with your state machine workflows.

## Key Features

- **Uppercase Convention**: Transitions are identified by UPPERCASE naming (e.g., `SAVE`, `SUBMIT`, `VALIDATE`)
- **Automatic Separation**: Field triggers (lowercase) and transitions (uppercase) are automatically categorized
- **Context Passing**: Transitions receive context with FSM state information
- **HST Integration**: Trigger transitions directly from HST nodes
- **Error Handling**: Built-in error handling with rollback support

## Naming Convention

### XState Transitions (UPPERCASE)

```typescript
actions: {
  'VALIDATE': ['validateData'],
  'SAVE': ['saveDocument'],
  'SUBMIT': ['submitForm'],
  'CANCEL': ['cancelOperation'],
  'SAVE_DRAFT': ['saveDraftVersion'],
}
```

### Field Triggers (lowercase/mixed case)

```typescript
actions: {
  'email': ['validateEmail'],
  'first_name': ['validateName'],
  'address.street': ['validateAddress'],
}
```

## Usage Examples

### Defining Transition Actions

```typescript
import { DoctypeMeta, registerTransitionAction } from '@stonecrop/stonecrop'
import { Map, List } from 'immutable'

// Register transition action functions
registerTransitionAction('validateData', async (context) => {
  console.log(`Validating for transition: ${context.transition}`)
  console.log(`Current state: ${context.currentState}`)
  console.log(`Target state: ${context.targetState}`)

  if (context.fsmContext?.validated) {
    console.log('Data already validated')
  }
})

registerTransitionAction('saveDocument', async (context) => {
  const response = await fetch(`/api/${context.doctype}/${context.recordId}`, {
    method: 'PUT',
    body: JSON.stringify(context.fsmContext),
  })

  if (!response.ok) {
    throw new Error('Save failed')
  }
})

// Define doctype with transitions
const todoDoctype = new DoctypeMeta(
  'Todo',
  List([
    { fieldname: 'title', fieldtype: 'Data', label: 'Title' },
    { fieldname: 'description', fieldtype: 'Text', label: 'Description' },
  ]),
  {
    id: 'todoWorkflow',
    initial: 'editing',
    states: {
      editing: {
        on: {
          VALIDATE: 'editing',
          SAVE: 'saved',
          CANCEL: 'cancelled',
        },
      },
      saved: {
        on: {
          EDIT: 'editing',
          SUBMIT: 'submitted',
        },
      },
      submitted: { type: 'final' },
      cancelled: { type: 'final' },
    },
  },
  Map({
    // XState transitions (UPPERCASE)
    VALIDATE: ['validateData'],
    SAVE: ['validateData', 'saveDocument'],
    SUBMIT: ['validateData', 'saveDocument', 'submitDocument'],
    CANCEL: ['cancelDocument'],

    // Field triggers (lowercase)
    title: ['validateTitle'],
    description: ['validateDescription'],
  })
)
```

### Triggering Transitions from HST

```typescript
import { createHST } from '@stonecrop/stonecrop'

const data = {
  Todo: {
    'todo-123': {
      title: 'My Task',
      description: 'Task description',
      status: 'editing',
    },
  },
}

const store = createHST(data, 'StonecropStore')
const todoNode = store.getNode('Todo.todo-123')

// Trigger transition with context
await todoNode.triggerTransition('SAVE', {
  currentState: 'editing',
  targetState: 'saved',
  fsmContext: {
    validated: true,
    timestamp: new Date().toISOString(),
  },
})
```

### Programmatic Transition Triggering

```typescript
import { triggerTransition } from '@stonecrop/stonecrop'

const results = await triggerTransition('Todo', 'SUBMIT', {
  recordId: 'todo-123',
  currentState: 'saved',
  targetState: 'submitted',
  fsmContext: {
    submittedBy: 'user@example.com',
    validated: true,
  },
})

if (results.every(r => r.success)) {
  console.log('Transition completed successfully')
} else {
  const failed = results.find(r => !r.success)
  console.error('Transition failed:', failed?.error)
}
```

## TransitionChangeContext Interface

When a transition action executes, it receives a `TransitionChangeContext` object:

```typescript
interface TransitionChangeContext extends FieldChangeContext {
  /** The XState transition name */
  transition: string

  /** Current workflow state before transition */
  currentState?: string

  /** Target workflow state after transition */
  targetState?: string

  /** Additional FSM context data */
  fsmContext?: Record<string, any>

  // Inherited from FieldChangeContext
  path: string
  fieldname: string
  beforeValue: any
  afterValue: any
  operation: 'set' | 'delete' | 'patch'
  doctype: string
  recordId?: string
  timestamp: Date
  store?: HSTNode
}
```

## Error Handling

Transitions support the same error handling as field triggers:

```typescript
import { getGlobalTriggerEngine } from '@stonecrop/stonecrop'

const engine = getGlobalTriggerEngine({
  errorHandler: (error, context, action) => {
    console.error(`Transition ${context.transition} failed:`, error.message)
    errorTracker.capture(error, { context, action })
  },
})
```

Transitions stop on first error by default. Subsequent actions won't execute if a previous action fails.

## Best Practices

### 1. Use Uppercase for Transitions

Always use UPPERCASE for XState transition names:

```typescript
// ✅ Good
SAVE, SUBMIT, VALIDATE, CREATE_NEW, SAVE_DRAFT

// ❌ Bad (will be treated as field triggers)
save, Save, saveData
```

### 2. Sequential Action Chains

Order transition actions from validation to execution:

```typescript
Map({
  SUBMIT: [
    'validateInput',    // 1. Validate first
    'saveToDatabase',   // 2. Then persist
    'notifyUsers',      // 3. Finally notify
  ],
})
```

### 3. Provide FSM Context

Pass relevant state information when triggering transitions:

```typescript
await todoNode.triggerTransition('SUBMIT', {
  currentState: machine.state.value,
  targetState: 'submitted',
  fsmContext: {
    validated: true,
    approvedBy: currentUser.id,
    timestamp: new Date().toISOString(),
  },
})
```

### 4. Handle Errors Gracefully

Always handle potential errors in transition actions:

```typescript
registerTransitionAction('saveData', async (context) => {
  try {
    await api.save(context.recordId, context.fsmContext)
  } catch (error) {
    console.error('Save failed:', error)
    throw new Error(`Failed to save: ${error.message}`)
  }
})
```

## API Reference

### Functions

- `registerTransitionAction(name, fn)` — Register a global transition action
- `triggerTransition(doctype, transition, options?)` — Manually trigger a transition
- `HSTNode.triggerTransition(transition, context?)` — Trigger transition from HST node

### Types

- `TransitionChangeContext` — Context passed to transition actions
- `TransitionActionFunction` — Transition action function type
- `TransitionExecutionResult` — Result of transition execution

## Related Documentation

- [HST Design](./hst-design) — Understanding the Hierarchical State Tree
- [Stonecrop API Reference](/reference/stonecrop) — Full API documentation

