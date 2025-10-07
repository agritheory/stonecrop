# Transactional Field Triggers

This document describes the transactional rollback functionality added to the Stonecrop field trigger system.

## Overview

The field trigger system now supports **transactional execution** with automatic rollback capabilities. When a sequence of actions is executed and one fails, the system can automatically roll back the effects of previously successful actions.

## Key Features

### 1. **Rollback Functions**
Actions can optionally return a `rollback` function that undoes their effects:

```typescript
import { registerGlobalAction } from '@stonecrop/stonecrop'
import type { FieldChangeContext, ActionResult } from '@stonecrop/stonecrop'

registerGlobalAction('createUser', (context: FieldChangeContext): ActionResult => {
  const userId = `user_${Date.now()}`
  database.set(userId, { email: context.afterValue })

  return {
    mutations: { userId, userCreated: true },
    rollback: () => {
      database.delete(userId)  // Undo the user creation
    }
  }
})
```

### 2. **Mutation Tracking**
Actions can track what they changed for assertions and verification:

```typescript
registerGlobalAction('updateProfile', (context: FieldChangeContext): ActionResult => {
  const profileData = updateUserProfile(context.afterValue)

  return {
    mutations: {
      profileId: profileData.id,
      fieldsUpdated: ['email', 'lastLogin'],
      previousValues: { email: context.beforeValue }
    },
    rollback: () => restoreProfile(profileData.id, context.beforeValue)
  }
})
```

### 3. **Automatic Rollback on Failure**
When any action in a sequence fails, all previously successful actions with rollback functions are automatically executed in reverse order (LIFO):

```typescript
// This sequence: [createUser, sendEmail, notifyService]
// If notifyService fails, the system automatically calls:
// 1. sendEmail.rollback()
// 2. createUser.rollback()
```

## Usage Patterns

### Basic Transactional Actions

```typescript
import { FieldTriggerEngine } from '@stonecrop/stonecrop'

const engine = new FieldTriggerEngine()

// Register actions with rollback capability
engine.registerAction('step1', (context) => ({
  mutations: { step1Completed: true },
  rollback: () => undoStep1()
}))

engine.registerAction('step2', (context) => ({
  mutations: { step2Completed: true },
  rollback: () => undoStep2()
}))

engine.registerAction('step3', (context) => {
  throw new Error('Step 3 failed')  // This will trigger rollbacks
})

// Register field triggers
engine.registerDoctypeActions('MyDoctype', new Map([
  ['myField', ['step1', 'step2', 'step3']]
]))

const result = await engine.executeFieldTriggers(context)

// Result will show:
// - result.allSucceeded = false
// - result.rolledBack = true
// - result.rollbackResults = [/* rollback execution results */]
```

### Testing Transactional Behavior

```typescript
import { describe, it, expect } from 'vitest'

describe('My Transactional Triggers', () => {
  it('should rollback on failure', async () => {
    // Setup actions with tracked mutations
    const createAction = vi.fn().mockImplementation(() => ({
      mutations: { created: true },
      rollback: vi.fn()
    }))

    const failAction = vi.fn().mockImplementation(() => {
      throw new Error('Expected failure')
    })

    // Execute triggers
    const result = await engine.executeFieldTriggers(context)

    // Assertions
    expect(result.allSucceeded).toBe(false)
    expect(result.rolledBack).toBe(true)
    expect(result.actionResults[0].rollback).toHaveBeenCalled()
  })
})
```

## API Reference

### ActionResult Interface

```typescript
interface ActionResult {
  /** Optional rollback function to undo this action */
  rollback?: RollbackFunction
  /** Any data that was mutated/created that can be tracked for assertions */
  mutations?: Record<string, any>
}
```

### FieldTriggerExecutionResult (Enhanced)

```typescript
interface FieldTriggerExecutionResult {
  // ... existing properties
  /** Whether rollbacks were executed due to failures */
  rolledBack: boolean
  /** Results of rollback operations if any were performed */
  rollbackResults?: Array<{
    success: boolean
    error?: Error
    executionTime: number
  }>
}
```

### ActionExecutionResult (Enhanced)

```typescript
interface ActionExecutionResult {
  // ... existing properties
  /** Rollback function if the action supports rollback */
  rollback?: RollbackFunction
  /** Mutations made by this action for tracking/assertions */
  mutations?: Record<string, any>
}
```

## Best Practices

### 1. **Design Idempotent Rollbacks**
Rollback functions should be safe to call multiple times:

```typescript
rollback: () => {
  if (database.has(userId)) {
    database.delete(userId)
  }
}
```

### 2. **Track Critical Mutations**
Include enough information in mutations for testing and debugging:

```typescript
return {
  mutations: {
    entityId: createdId,
    entityType: 'user',
    timestamp: Date.now(),
    affectedFields: ['email', 'status']
  },
  rollback: () => removeEntity(createdId)
}
```

### 3. **Handle Rollback Failures**
Rollback functions themselves can fail. Design them defensively:

```typescript
rollback: async () => {
  try {
    await apiCall.delete(resourceId)
  } catch (error) {
    // Log but don't throw - other rollbacks should still execute
    console.error('Rollback failed:', error)
  }
}
```

### 4. **Mixed Rollback Scenarios**
Not all actions need rollback functions. The system handles mixed scenarios gracefully:

```typescript
// This is fine - only actions with rollback functions will be rolled back
engine.registerDoctypeActions('Mixed', new Map([
  ['field', [
    'logActivity',      // No rollback function
    'createUser',       // Has rollback function
    'sendEmail',        // Has rollback function
    'failingAction'     // Will trigger rollback of createUser and sendEmail only
  ]]
]))
```

## Error Handling

- **Action Failures**: Stop execution and trigger rollbacks
- **Rollback Failures**: Logged but don't prevent other rollbacks
- **Timeout Handling**: Applies to both actions and rollback functions
- **Error Propagation**: Original action errors are preserved alongside rollback results

## Performance Considerations

- **LIFO Rollback Order**: Rollbacks execute in reverse order for proper dependency handling
- **Async Support**: Both actions and rollbacks can be async
- **Parallel Execution**: Actions execute sequentially, but rollbacks are also sequential to maintain order
- **Memory Usage**: Rollback functions are held in memory until execution completes

## Migration Guide

Existing field triggers continue to work unchanged. To add transactional support:

1. **Return ActionResult** instead of void from action functions
2. **Provide rollback functions** for reversible operations
3. **Add mutation tracking** for testing and verification
4. **Update tests** to assert on rollback behavior

The system is fully backward compatible - actions that don't return rollback functions work exactly as before.