# Field-Level Action Triggers

The Stonecrop field trigger system enables automatic execution of actions when specific HST paths are mutated. This provides a declarative, reactive way to respond to data changes with sequential action execution and comprehensive error handling.

## Overview

The field trigger system leverages the Registry architecture with these key components:

- **Unified Actions Map**: Field triggers are defined alongside regular actions in the doctype's actions Map
- **Field Trigger Engine**: Singleton instance that executes actions when field changes occur
- **HST Integration**: Automatic detection and triggering on `set()` operations
- **Pattern Matching**: Support for wildcards and complex path patterns
- **Sequential Execution**: Actions run in order with stop-on-error behavior
- **Error Tracking**: Comprehensive result tracking for debugging and monitoring

## Table of Contents

- [Architecture](#architecture)
- [Basic Usage](#basic-usage)
- [Action Function Interface](#action-function-interface)
- [Execution Model](#execution-model)
- [Pattern Matching](#pattern-matching)
- [Advanced Configuration](#advanced-configuration)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Schema Composability](#schema-composability)
- [API Reference](#api-reference)
- [Migration Guide](#migration-guide)

## Architecture

The `FieldTriggerEngine` uses a **singleton pattern**:

```typescript
// Creating new instances returns the same singleton
const engine1 = new FieldTriggerEngine()
const engine2 = new FieldTriggerEngine()
// engine1 === engine2 === FieldTriggerEngine._root

// Alternatively, use the helper function
const engine = getGlobalTriggerEngine()
```

This ensures:
- Consistent action registry across the application
- Shared doctype action mappings
- Single source of truth for field trigger configuration

## Basic Usage

### 1. Register Actions (Optional)

You can optionally register global action functions for reuse across doctypes:

```typescript
import { registerGlobalAction } from '@stonecrop/stonecrop'

// Register a global action function
registerGlobalAction('validateEmailPrimary', (context) => {
  console.log('Email primary validation triggered:', context.afterValue)
  // Validation logic here
})

registerGlobalAction('updateTimestamp', async (context) => {
  // Async action example
  await updateModifiedTime(context.doctype, context.recordId)
})
```

### 2. Define Actions and Field Triggers in Doctype

Add both regular actions and field triggers to your doctype's actions Map:

```typescript
import { DoctypeMeta } from '@stonecrop/stonecrop'
import { Map } from 'immutable'

const actions = Map({
  // Regular actions (triggered manually)
  'save': ['updateTimestamp', 'validateData'],
  'delete': ['confirmDelete', 'cleanupReferences'],

  // Field triggers (triggered automatically on field changes)
  'status': ['updateTimestamp'],                     // Simple field trigger
  'emailAddress.*.is_primary': ['validateEmailPrimary'], // Wildcard pattern
  'profile.name': ['validateName', 'updateTimestamp'], // Multiple actions
  'title': ['(context) => console.log("Title changed:", context.afterValue)'], // Inline function
})

const doctype = new DoctypeMeta(
  'Contact',
  schema,
  workflow,
  actions,
  component
)
```

### 3. HST Operations Trigger Actions

Field triggers are automatically executed when HST paths are modified:

```typescript
const store = stonecrop.getStore()

// This will trigger the 'validateEmailPrimary' action
store.set('Contact.contact-1.emailAddress.0.is_primary', true)

// This will trigger the 'updateTimestamp' action
store.set('Contact.contact-1.status', 'completed')
```

## Action Function Interface

Action functions are simple, focused functions that receive a `FieldChangeContext` object:

```typescript
interface FieldChangeContext {
  path: string          // Full HST path that changed
  fieldname: string     // Last segment of the path
  beforeValue: any      // Value before the change
  afterValue: any       // Value after the change
  operation: 'set' | 'delete' | 'patch'
  doctype: string       // The doctype name
  recordId?: string     // The record ID if applicable
  timestamp: Date       // When the change occurred
}

// Action function signature
type FieldActionFunction = (context: FieldChangeContext) => void | Promise<void>

// Example action function
const validateEmail: FieldActionFunction = (context) => {
  if (context.fieldname === 'email' && !isValidEmail(context.afterValue)) {
    throw new Error('Invalid email format')
  }
}
```

Actions execute sequentially in the order defined. If an action throws an error, execution stops and subsequent actions do not run.

## Execution Model

### Sequential Execution

Actions execute in the order they're defined:

```typescript
const actions = Map({
  'emailAddress': ['validateEmail', 'sendNotification', 'updateTimestamp']
})
```

If `validateEmail` succeeds, `sendNotification` runs. If `sendNotification` fails, `updateTimestamp` never runs.

### Stop on Error

By default, execution stops when an action fails:

```typescript
registerGlobalAction('validateEmail', (context) => {
  if (!isValidEmail(context.afterValue)) {
    throw new Error('Invalid email format')
  }
})

const result = await engine.executeFieldTriggers(context)

// result.allSucceeded = false
// result.stoppedOnError = true
// result.actionResults[0].success = false
// result.actionResults[0].error = Error('Invalid email format')
```

### Action Results

Each action execution returns a result:

```typescript
interface ActionExecutionResult {
  success: boolean           // Did the action complete?
  error?: Error             // Error if failed
  executionTime: number     // How long it took (ms)
  action: FieldAction       // Which action was executed
}
```

The overall execution result:

```typescript
interface FieldTriggerExecutionResult {
  path: string                        // The field path that triggered
  actionResults: ActionExecutionResult[]  // Results for each action
  totalExecutionTime: number          // Total time for all actions
  allSucceeded: boolean               // Did all actions succeed?
  stoppedOnError: boolean             // Did execution stop due to error?
}
```

## Pattern Matching

Field trigger patterns support powerful matching capabilities:

### Basic Patterns

```typescript
{
  // Exact field match
  'name': ['validateName'],

  // Nested field
  'profile.bio': ['updateProfile'],

  // Deep nesting
  'settings.notifications.email.enabled': ['updateNotificationSettings']
}
```

### Wildcard Patterns

```typescript
{
  // Single wildcard (*) matches one segment
  'emails.*.address': ['validateEmailFormat'],

  // Multiple wildcards
  'items.*.details.*.value': ['validateItemValue'],

  // Mixed patterns
  'contacts.*.profile.name': ['updateContactName']
}
```

### Path Format

- **HST Path**: `doctype.recordId.field.subfield...`
- **Trigger Pattern**: `doctype.field.subfield...` (recordId is automatically handled)

The system automatically handles the `recordId` segment, so your patterns only need to specify the field path relative to the record.

## Advanced Configuration

### Action Execution

Field triggers support both global registered actions and inline function strings:

```typescript
const actions = Map({
  // Global registered actions
  'status': ['updateTimestamp', 'notifyUsers'],

  // Inline function strings
  'title': ['(context) => console.log("Title:", context.afterValue)'],

  // Mix of both
  'price': ['validatePrice', '(context) => { console.log("Price changed:", context.afterValue); }']
})
```

## Action Types

### 1. Registered Functions

```typescript
import { registerGlobalAction } from '@stonecrop/stonecrop'

// Register globally
registerGlobalAction('myAction', (context) => {
  // Action logic
})

// Use in field trigger
const actions = Map({
  'field': ['myAction']
})
```

### 2. Inline Functions

```typescript
const actions = Map({
  // Arrow function
  'title': ['(context) => console.log("Title:", context.afterValue)'],

  // Function expression
  'status': ['function(context) { updateStatus(context.afterValue); }'],

  // Function body only
  'count': ['console.log("Count changed to:", context.afterValue);']
})
```

### 3. Async Actions

Both registered and inline functions can be async:

```typescript
import { registerGlobalAction } from '@stonecrop/stonecrop'

registerGlobalAction('asyncAction', async (context) => {
  await fetch('/api/update', {
    method: 'POST',
    body: JSON.stringify(context)
  })
})

// Inline async
const actions = Map({
  'field': ['async (context) => { await saveToServer(context); }']
})
```

## Error Handling

### 1. Validation Actions

Throw errors to prevent further processing:

```typescript
registerGlobalAction('validateRequired', (context) => {
  if (!context.afterValue) {
    throw new Error(`${context.fieldname} is required`)
  }
})
```

### 2. Global Error Handler

Handle all action errors in one place:

```typescript
import { getGlobalTriggerEngine } from '@stonecrop/stonecrop'

getGlobalTriggerEngine({
  errorHandler: (error, context, action) => {
    console.error(`Action ${action} failed on ${context.path}:`, error)
    logToMonitoring(error, context)
  }
})
```

### 3. Defensive Actions

Handle errors internally instead of throwing:

```typescript
registerGlobalAction('sendEmail', async (context) => {
  try {
    await emailService.send(context.afterValue)
  } catch (error) {
    // Log but don't throw - allow execution to continue
    console.warn('Email send failed:', error)
  }
})
```

### 4. Timeouts

Actions have configurable timeouts to prevent hanging:

```typescript
const engine = new FieldTriggerEngine({
  defaultTimeout: 5000  // 5 seconds
})

// Or per-execution:
await engine.executeFieldTriggers(context, { timeout: 10000 })
```

### 5. Testing Error Scenarios

```typescript
import { describe, it, expect, vi } from 'vitest'

describe('Field Trigger Error Handling', () => {
  it('should stop execution on first error', async () => {
    const action1 = vi.fn()  // This should run
    const action2 = vi.fn().mockImplementation(() => {
      throw new Error('Action 2 failed')
    })
    const action3 = vi.fn()  // This should NOT run

    engine.registerAction('action1', action1)
    engine.registerAction('action2', action2)
    engine.registerAction('action3', action3)

    const result = await engine.executeFieldTriggers(context)

    expect(result.allSucceeded).toBe(false)
    expect(result.stoppedOnError).toBe(true)
    expect(action1).toHaveBeenCalled()
    expect(action2).toHaveBeenCalled()
    expect(action3).not.toHaveBeenCalled()  // Stopped after action2 failed
  })
})
```

## Best Practices

### 1. Action Naming

Use descriptive names for global actions:

```typescript
import { registerGlobalAction } from '@stonecrop/stonecrop'

// Good
registerGlobalAction('validateEmailUniqueness', validator)
registerGlobalAction('updateContactLastModified', updater)

// Avoid
registerGlobalAction('validate', validator)
registerGlobalAction('update', updater)
```

### 2. Design for Failure

Actions should be small, focused, and handle their own edge cases:

```typescript
// Good: Focused, handles edge cases
registerGlobalAction('validateEmail', (context) => {
  const email = context.afterValue
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email format')
  }
})

// Bad: Too broad, unclear failure points
registerGlobalAction('processUser', (context) => {
  validateEmail(context.afterValue)
  sendWelcomeEmail(context.afterValue)
  updateDatabase(context.afterValue)
  notifyAdmins(context.afterValue)
})
```

### 3. Order Matters

Put validation actions first, side-effects last:

```typescript
const actions = Map({
  'emailAddress': [
    'validateEmail',      // Validation first
    'checkDuplicates',    // More validation
    'sendWelcomeEmail',   // Side effects after validation
    'updateTimestamp'     // Final housekeeping
  ]
})
```

### 4. Don't Assume State

Each action receives only the field change context. Don't assume previous actions succeeded:

```typescript
// Good: Self-contained
registerGlobalAction('sendEmail', (context) => {
  if (!isValidEmail(context.afterValue)) {
    throw new Error('Cannot send to invalid email')
  }
  emailService.send(context.afterValue)
})

// Bad: Assumes validation already happened
registerGlobalAction('sendEmail', (context) => {
  // Assumes validateEmail already ran - dangerous!
  emailService.send(context.afterValue)
})
```

### 5. Use Error Handler for Cross-Cutting Concerns

Don't repeat logging/monitoring in every action:

```typescript
const engine = new FieldTriggerEngine({
  errorHandler: (error, context, action) => {
    // Centralized logging
    logger.error({
      action,
      path: context.path,
      error: error.message,
      timestamp: context.timestamp
    })

    // Centralized monitoring
    monitor.recordError('field_trigger_failure', {
      doctype: context.doctype,
      field: context.fieldname
    })
  }
})
```

### 6. Error Resilience

Design actions to be resilient when appropriate:

```typescript
import { registerGlobalAction } from '@stonecrop/stonecrop'

const robustAction = async (context) => {
  try {
    await performAction(context)
  } catch (error) {
    // Log but don't throw - let other actions continue
    console.warn('Action failed:', error)
  }
}

registerGlobalAction('robustAction', robustAction)
```

### 7. Performance Considerations

- Keep actions lightweight for frequently changed fields
- Avoid expensive operations in field triggers
- Consider debouncing for rapid changes

```typescript
import { Map } from 'immutable'

const actions = Map({
  // Lightweight action for frequently changed field
  'frequentlyChangedField': ['lightweightAction'],

  // Avoid heavy operations
  'status': ['updateTimestamp']  // Good
  // 'status': ['heavyDatabaseOperation']  // Avoid
})
```

### 8. Testing Actions

Test your actions in isolation:

```typescript
import type { FieldChangeContext } from '@stonecrop/stonecrop'

const mockContext: FieldChangeContext = {
  path: 'Contact.test-1.email',
  fieldname: 'email',
  beforeValue: 'old@example.com',
  afterValue: 'new@example.com',
  operation: 'set',
  doctype: 'Contact',
  recordId: 'test-1',
  timestamp: new Date()
}

// Test your action
await myAction(mockContext)
```

## Schema Composability

The trigger system integrates with the existing Registry architecture for schema composability:

### Mixin Pattern

```typescript
import { Map } from 'immutable'

// Define common action sets
const timestampActions = {
  'created_at': ['validateTimestamp'],
  'updated_at': ['validateTimestamp']
}

const auditActions = {
  '*': ['auditLog']  // Audit all field changes
}

// Compose in doctype actions Map
const actions = Map({
  // Regular actions
  'save': ['updateTimestamp', 'validateData'],
  'delete': ['confirmDelete'],

  // Field triggers from mixins
  ...timestampActions,
  ...auditActions,

  // Doctype-specific field triggers
  'status': ['updateWorkflow']
})
```

### Base Doctype Pattern

```typescript
import { Map } from 'immutable'

class BaseDoctype {
  static getCommonActions() {
    return {
      // Regular actions
      'save': ['updateTimestamp'],
      'delete': ['auditDelete'],

      // Common field triggers
      'modified': ['updateTimestamp'],
      'modified_by': ['validateUser']
    }
  }
}

// Extend in specific doctypes
const contactActions = Map({
  ...BaseDoctype.getCommonActions(),
  'email': ['validateEmail'],
  'phone': ['validatePhone']
})
```

## API Reference

### Global Functions

```typescript
// Get or create the global trigger engine with options
getGlobalTriggerEngine(options?: FieldTriggerOptions): FieldTriggerEngine

// Register a global action function
registerGlobalAction(name: string, fn: FieldActionFunction): void
```

### Types

All types are exported from the main package:

```typescript
import type {
  FieldChangeContext,
  FieldActionFunction,
  FieldTriggerExecutionResult,
  FieldTriggerOptions,
  ActionExecutionResult
} from '@stonecrop/stonecrop'
```

### Integration with Registry

Field triggers are automatically registered when you add a doctype to the Registry:

```typescript
import { Registry, DoctypeMeta } from '@stonecrop/stonecrop'
import { Map } from 'immutable'

const registry = new Registry()
const actions = Map({
  'save': ['updateTimestamp'],
  'email': ['validateEmail']  // This field trigger is automatically registered
})

const doctype = new DoctypeMeta('Contact', schema, workflow, actions, component)
registry.addDoctype(doctype)  // Field triggers are registered here
```
