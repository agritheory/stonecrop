# Field-Level Action Triggers

The Stonecrop field trigger system enables automatic execution of actions when specific HST paths are mutated. This provides a declarative, reactive way to respond to data changes with sequential action execution and comprehensive error handling.

## Overview

The field trigger system leverages the Registry architecture with these key components:

- **Unified Actions Map**: Field triggers are defined alongside regular actions in the doctype's actions Map
- **Field Trigger Engine**: Singleton instance that executes actions when field changes occur
- **HST Integration**: Automatic detection and triggering on `set()` operations
- **Pattern Matching**: Support for wildcards and complex path patterns
- **Sequential Execution**: Actions run in order with stop-on-error behavior
- **Automatic Rollback**: Snapshot-based rollback ensures data integrity when actions fail (enabled by default)
- **Error Tracking**: Comprehensive result tracking for debugging and monitoring

## Table of Contents

- [Architecture](#architecture)
- [Basic Usage](#basic-usage)
- [Action Function Interface](#action-function-interface)
- [Execution Model](#execution-model)
- [Pattern Matching](#pattern-matching)
- [Advanced Configuration](#advanced-configuration)
- [Error Handling](#error-handling)
- [Automatic Rollback](#automatic-rollback)
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

## Automatic Rollback

The field trigger system includes **snapshot-based automatic rollback** to ensure data integrity when actions fail. This provides transactional-like behavior at the record level.

### How Rollback Works

1. **Snapshot Capture**: Before executing actions, the system creates a deep copy of the entire record
2. **Sequential Execution**: Actions run one at a time in order
3. **Stop on Error**: If an action fails, execution stops immediately
4. **Automatic Rollback**: The record is restored to the captured snapshot state

This ensures that either all actions succeed, or no changes persist - preventing partial updates.

### Configuration

Rollback is **enabled by default** and can be controlled at three levels with priority order:

**Execution-Level > Field-Level > Global-Level**

#### Global Configuration (Default for All)

```typescript
import { FieldTriggerEngine, getGlobalTriggerEngine } from '@stonecrop/stonecrop'

// Rollback enabled (default)
const engine = new FieldTriggerEngine({
  enableRollback: true,  // default: true
  debug: true            // includes snapshot in result for debugging
})

// Disable rollback globally
const noRollbackEngine = new FieldTriggerEngine({
  enableRollback: false
})

// Or use the global instance (rollback enabled by default)
const globalEngine = getGlobalTriggerEngine()
```

#### Field-Level Configuration (Per Field Trigger)

```typescript
import { setFieldRollback } from '@stonecrop/stonecrop'

// Disable rollback for specific fields (overrides global)
setFieldRollback('Contact', 'auditLog', false)   // No rollback for auditLog
setFieldRollback('Contact', 'lastSeen', false)   // No rollback for lastSeen

// Keep rollback for other fields (use global default)
// 'email', 'phone', etc. will use global setting
```

#### Execution-Level Configuration (Per Execution)

```typescript
// Override rollback for specific execution (highest priority)
const result = await engine.executeFieldTriggers(context, {
  enableRollback: false  // Disables rollback just for this execution
})

// Or force enable
const result2 = await engine.executeFieldTriggers(context, {
  enableRollback: true  // Enables rollback even if disabled at field/global level
})
```

### Rollback Result

The execution result includes rollback information:

```typescript
interface FieldTriggerExecutionResult {
  rolledBack: boolean      // Whether rollback was performed
  snapshot?: any           // The captured snapshot (debug mode only)
  allSucceeded: boolean    // Whether all actions succeeded
  stoppedOnError: boolean  // Whether execution stopped due to error
  actionResults: ActionExecutionResult[]
  // ... other properties
}
```

### Example: Actions Modify State Then Fail

```typescript
import { registerGlobalAction } from '@stonecrop/stonecrop'
import { Map } from 'immutable'

// First action modifies the record
registerGlobalAction('validateAndUpdate', (context) => {
  if (context.store) {
    // These changes will be rolled back if a later action fails
    context.store.set('Contact.contact-1.status', 'validating')
    context.store.set('Contact.contact-1.lastChecked', new Date())
    context.store.set('Contact.contact-1.validationCount',
      context.store.get('Contact.contact-1.validationCount') + 1
    )
  }
})

// Second action fails
registerGlobalAction('sendEmail', () => {
  throw new Error('Email service unavailable')
})

// Define field triggers
const actions = Map({
  'email': ['validateAndUpdate', 'sendEmail']
})

// When email field changes:
// 1. Snapshot captured: { status: 'active', email: 'old@example.com', validationCount: 0, ... }
// 2. validateAndUpdate runs: modifies status, lastChecked, and validationCount
// 3. sendEmail fails: Error thrown
// 4. Automatic rollback: Record restored to original snapshot state
// Result: All changes reverted - it's all or nothing!
```

### Rollback Behavior

**What Gets Rolled Back:**
- All field changes made by any executed actions
- Changes to nested objects and arrays
- The entire record state is restored atomically

**What Doesn't Get Rolled Back:**
- External side effects (API calls, database operations)
- Changes to other records in the store
- File system operations
- Console logs or monitoring calls

### Limitations and Considerations

1. **Record-Level Only**: Rollback restores the entire record, not individual fields
2. **Requires HST Store**: Rollback only works when `context.store` is available (automatic when triggered by HST)
3. **Deep Copy Limitation**: Uses `JSON.parse(JSON.stringify())` - functions and special objects are not preserved
4. **No Cross-Record Rollback**: Only rolls back the changed record, not related records
5. **Side Effects Not Reversed**: External operations cannot be automatically undone

**Example of non-rolled-back side effects:**
```typescript
registerGlobalAction('logAndFail', async (context) => {
  // This API call happens but won't be reversed
  await fetch('/api/audit-log', {
    method: 'POST',
    body: JSON.stringify({ change: context.path })
  })

  // This console.log happens but won't be "undone"
  console.log('Field changed:', context.path)

  throw new Error('Action failed')
})
// The record will rollback, but the API call and console.log already happened
```

### When to Disable Rollback

Consider disabling rollback when:

- **No Record Mutations**: Actions only perform external operations (logging, notifications)
- **Manual State Management**: You're handling state rollback at the application level
- **Performance Critical**: Snapshot overhead is unacceptable for high-frequency changes
- **External Systems**: Actions work primarily with APIs where rollback doesn't apply

Rollback can be controlled at three levels with this priority:

**1. Execution-Level (Highest Priority)**
```typescript
// Override rollback for a specific execution
await engine.executeFieldTriggers(context, {
  enableRollback: false  // Disables rollback for this execution only
})
```

**2. Field-Level**
```typescript
import { setFieldRollback } from '@stonecrop/stonecrop'

// Disable rollback for specific field triggers
setFieldRollback('Contact', 'email', false)      // email field: no rollback
setFieldRollback('Contact', 'auditLog', false)   // auditLog field: no rollback
// Other fields use global default

// Re-enable for a field
setFieldRollback('Contact', 'email', true)
```

**3. Global-Level (Lowest Priority)**
```typescript
// Disable rollback for all field triggers by default
const engine = new FieldTriggerEngine({
  enableRollback: false,
  defaultTimeout: 1000
})

registerGlobalAction('auditLog', async (context) => {
  // Just logs - no record mutations
  await logChange(context.path, context.afterValue)
})
```

**Priority Example:**
```typescript
import { setFieldRollback, FieldTriggerEngine } from '@stonecrop/stonecrop'

// Global: rollback enabled (default)
const engine = new FieldTriggerEngine({ enableRollback: true })

// Field level: disable for 'auditLog'
setFieldRollback('Contact', 'auditLog', false)

// Execution level: force enable for specific case
await engine.executeFieldTriggers(auditContext, {
  enableRollback: true  // Overrides field-level setting
})

// Result: This execution WILL have rollback enabled
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

// Configure rollback behavior for a specific field trigger
setFieldRollback(doctype: string, fieldname: string, enableRollback: boolean): void
```

### Execution Options

```typescript
// Per-execution rollback control
await engine.executeFieldTriggers(context, {
  timeout?: number          // Override default timeout
  enableRollback?: boolean  // Override field/global rollback setting
})
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
