# Field-Level Action Triggers

The Stonecrop field trigger system enables automatic execution of actions when specific HST paths are mutated. This bridges browser-side mutations with the Stonecrop action system, providing a reactive way to respond to data changes.

## Overview

The field trigger system leverages the existing Registry architecture with these key components:

- **Unified Actions Map**: Field triggers are defined alongside regular actions in the doctype's actions Map
- **Field Trigger Engine**: Singleton instance that executes actions when field changes occur
- **HST Integration**: Automatic detection and triggering on `set()` operations
- **Pattern Matching**: Support for wildcards and complex path patterns

## Architecture

The `FieldTriggerEngine` uses a **singleton pattern** similar to the Registry:

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

Action functions receive a `FieldChangeContext` object:

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

// Example action function
const validateEmail: FieldActionFunction = (context) => {
  if (context.fieldname === 'email' && !isValidEmail(context.afterValue)) {
    throw new Error('Invalid email format')
  }
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

### Global Error Handler

You can configure global error handling when getting the trigger engine:

```typescript
import { getGlobalTriggerEngine } from '@stonecrop/stonecrop'

getGlobalTriggerEngine({
  errorHandler: (error, context, action) => {
    console.error('Field trigger error:', error)
    // Custom error handling logic
  }
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

### 2. Error Resilience

Design actions to be resilient:

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

### 3. Performance Considerations

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

### 4. Testing Actions

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

## Migration Guide

If you're migrating from a manual event system:

### Before

```typescript
// Manual event handling
store.on('change', (path, value) => {
  if (path.endsWith('.email')) {
    validateEmail(value)
  }
})
```

### After

```typescript
// Declarative field triggers in doctype actions
import { Map } from 'immutable'

const actions = Map({
  'email': ['validateEmail']
})

const doctype = new DoctypeMeta('Contact', schema, workflow, actions, component)
```

This provides better type safety, automatic pattern matching, cleaner organization, and seamless integration with the existing Stonecrop Registry system.