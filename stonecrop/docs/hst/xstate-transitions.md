# XState Transition Integration

## Overview

Stonecrop supports automatic triggering of XState FSM transitions through the HST (Hierarchical State Tree) system. This allows you to define transition actions that execute when state changes occur, to coordinate application logic with your state machine workflows.

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

### 1. Defining Transition Actions

```typescript
import { Doctype, registerTransitionAction } from '@stonecrop/stonecrop'
import { Map, List } from 'immutable'

// Register transition action functions
registerTransitionAction('validateData', async (context) => {
  console.log(`Validating for transition: ${context.transition}`)
  console.log(`Current state: ${context.currentState}`)
  console.log(`Target state: ${context.targetState}`)

  // Access FSM context
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
const todoDoctype = new Doctype(
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

### 2. Triggering Transitions from HST

```typescript
import { createHST } from '@stonecrop/stonecrop'

// Create HST store
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

// Get record node
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

### 3. Programmatic Transition Triggering

```typescript
import { triggerTransition } from '@stonecrop/stonecrop'

// Trigger a transition programmatically
const results = await triggerTransition('Todo', 'SUBMIT', {
  recordId: 'todo-123',
  currentState: 'saved',
  targetState: 'submitted',
  fsmContext: {
    submittedBy: 'user@example.com',
    validated: true,
  },
})

// Check results
if (results.every(r => r.success)) {
  console.log('Transition completed successfully')
} else {
  const failed = results.find(r => !r.success)
  console.error('Transition failed:', failed?.error)
}
```

### 4. Complex Workflow Example

```typescript
import { registerTransitionAction, triggerTransition } from '@stonecrop/stonecrop'

// Define workflow actions
registerTransitionAction('validateForm', async (context) => {
  const record = context.store?.get(`${context.doctype}.${context.recordId}`)

  if (!record.title || record.title.length < 3) {
    throw new Error('Title must be at least 3 characters')
  }

  if (!record.email || !record.email.includes('@')) {
    throw new Error('Invalid email address')
  }
})

registerTransitionAction('saveToDB', async (context) => {
  const record = context.store?.get(`${context.doctype}.${context.recordId}`)

  await database.save({
    id: context.recordId,
    data: record,
    timestamp: context.timestamp,
  })
})

registerTransitionAction('notifyUsers', async (context) => {
  await notificationService.send({
    event: context.transition,
    recordId: context.recordId,
    users: context.fsmContext?.notifyList || [],
  })
})

// Define doctype with sequential actions
const formDoctype = new Doctype(
  'ContactForm',
  List([...]),
  workflow,
  Map({
    // Transitions execute actions sequentially
    VALIDATE: ['validateForm'],
    SAVE: ['validateForm', 'saveToDB'],
    SUBMIT: ['validateForm', 'saveToDB', 'notifyUsers'],

    // Field triggers (separate from transitions)
    email: ['validateEmailFormat'],
    phone: ['formatPhoneNumber'],
  })
)
```

### 5. Sharing Actions Between Field Triggers and Transitions

```typescript
import { registerGlobalAction } from '@stonecrop/stonecrop'

// Register a shared action (can be used by both field triggers and transitions)
registerGlobalAction('validateEmail', async (context) => {
  const email = context.afterValue || context.fsmContext?.email

  if (!email || !email.includes('@')) {
    throw new Error('Invalid email format')
  }
})

const doctype = new Doctype(
  'User',
  List([...]),
  workflow,
  Map({
    // Used as a transition action
    VALIDATE: ['validateEmail'],

    // Also used as a field trigger
    email: ['validateEmail'],
  })
)
```

## TransitionChangeContext Interface

When a transition action is executed, it receives a `TransitionChangeContext` object:

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
    console.error(`Action: ${action}`)
    console.error(`Doctype: ${context.doctype}`)

    // Send to error tracking service
    errorTracker.capture(error, { context, action })
  },
})

// Transitions stop on first error by default
registerTransitionAction('failingAction', async () => {
  throw new Error('Something went wrong')
})

// Subsequent actions won't execute
const doctype = new Doctype(
  'Doc',
  List([]),
  workflow,
  Map({
    SAVE: ['validateData', 'failingAction', 'saveData'], // saveData won't execute
  })
)
```

## Best Practices

### 1. Use Uppercase for Transitions
Always use UPPERCASE for XState transition names to ensure proper categorization:
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
    // Log and re-throw to stop transition chain
    console.error('Save failed:', error)
    throw new Error(`Failed to save: ${error.message}`)
  }
})
```

## Integration with XState Machines

While transition actions are defined separately, they work seamlessly with XState workflows:

```typescript
import { createMachine, interpret } from 'xstate'

const todoMachine = createMachine({
  id: 'todo',
  initial: 'editing',
  states: {
    editing: {
      on: {
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
})

const service = interpret(todoMachine)

// When state changes, trigger corresponding actions
service.onTransition((state) => {
  if (state.changed) {
    const event = state.event.type

    // Trigger Stonecrop transition actions
    triggerTransition('Todo', event, {
      recordId: 'todo-123',
      currentState: state.history?.value,
      targetState: state.value,
      fsmContext: state.context,
    })
  }
})

service.start()
service.send('SAVE') // Triggers SAVE transition actions
```

## API Reference

### Functions

- **`registerTransitionAction(name: string, fn: TransitionActionFunction)`**: Register a global transition action
- **`triggerTransition(doctype, transition, options?)`**: Manually trigger a transition
- **`HSTNode.triggerTransition(transition, context?)`**: Trigger transition from HST node

### Types

- **`TransitionChangeContext`**: Context passed to transition actions
- **`TransitionActionFunction`**: Transition action function type
- **`TransitionExecutionResult`**: Result of transition execution
