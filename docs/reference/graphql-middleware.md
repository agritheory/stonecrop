---
title: GraphQL Middleware API Reference
description: PostGraphile middleware for Stonecrop
---

# Graphql_middleware API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### DoctypeMeta

Vue component exported from @stonecrop/graphql_middleware.

```typescript
import { DoctypeMeta } from '@stonecrop/graphql_middleware'
```

### ValidationError

Vue component exported from @stonecrop/graphql_middleware.

```typescript
import { ValidationError } from '@stonecrop/graphql_middleware'
```

## Other Components

### StonecropPreset

```typescript
export { StonecropPreset }
```

## Functions

### clearHandlers

Clear all registered handlers

**Signature:**

```typescript
export declare function clearHandlers(): void;
```

### clearRegistry

Clear all registered doctypes

**Signature:**

```typescript
export declare function clearRegistry(): void;
```

### createStonecropPlugin

Create a PostGraphile plugin that extends the GraphQL schema with Stonecrop functionality. No arguments required — plan step wiring is entirely internal using pgResources from build.

**Signature:**

```typescript
createStonecropPlugin: () => GraphileConfig.Plugin
```

### createStonecropPreset

Create a PostGraphile preset configured for Stonecrop.

The returned preset extends PostGraphile Amber, which provides PostgreSQL integration, Relay-style connections, and the standard PostGraphile schema structure. Stonecrop's `createStonecropPlugin` should be added to the `plugins` array to enable Stonecrop's `stonecropRecord`, `stonecropRecords`, `stonecropMeta`, and `stonecropAction` resolvers.

**Signature:**

```typescript
createStonecropPreset: (options?: StonecropPresetOptions) => GraphileConfig.Preset
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `StonecropPresetOptions` | Optional configuration for field casing |

### getAllMeta

Get all loaded doctypes

**Signature:**

```typescript
export declare function getAllMeta(): DoctypeMeta[];
```

### getHandler

Get a registered handler by name

**Signature:**

```typescript
export declare function getHandler(name: string): ActionHandler | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | Name of the action handler to retrieve |

### getMeta

Get a doctype by name

**Signature:**

```typescript
export declare function getMeta(name: string): DoctypeMeta | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | Name of the doctype to retrieve |

### hasHandler

Check if a handler is registered

**Signature:**

```typescript
export declare function hasHandler(name: string): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | Name of the action handler to check |

### hasMeta

Check if a doctype is registered

**Signature:**

```typescript
export declare function hasMeta(name: string): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | Name of the doctype to check |

### loadDoctypes

Load doctype definitions from a directory of JSON files

**Signature:**

```typescript
export declare function loadDoctypes(dir: string, options?: LoadDoctypesOptions): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| dir | `string` | Directory path containing doctype JSON files |
| options | `LoadDoctypesOptions` | Options for loading doctypes (continueOnError, onError callback) |

### loadDoctypesFromObject

Load doctypes from an object (for programmatic use)

**Signature:**

```typescript
export declare function loadDoctypesFromObject(doctypes: Record<string, unknown>, options?: LoadDoctypesOptions): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctypes | `Record<string, unknown>` | Object mapping doctype names to doctype definitions |
| options | `LoadDoctypesOptions` | Options for loading doctypes (continueOnError, onError callback) |

### registerBuiltinHandlers

Register all built-in handlers

**Signature:**

```typescript
export declare function registerBuiltinHandlers(): void;
```

### registerHandler

Register an action handler

**Signature:**

```typescript
export declare function registerHandler(name: string, handler: ActionHandler): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | Unique name for the action handler |
| handler | `ActionHandler` | Action handler function to register |

### validateReferences

Validate cross-doctype references (Link fields, inherits, etc.) Call after all doctypes are loaded.

**Signature:**

```typescript
export declare function validateReferences(): ValidationError[];
```

## Interfaces

### ActionContext

Context passed to action handlers

**Definition:**

```typescript
export interface ActionContext {
  doctype: DoctypeMeta;
  withPgClient?: WithPgClient;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| doctype | `DoctypeMeta` | Doctype metadata for the action being executed |
| withPgClient? | `WithPgClient` | Database access function; available when handler is called from a GraphQL mutation |

### LoadDoctypesOptions

Options for loading doctype definitions

**Definition:**

```typescript
export interface LoadDoctypesOptions {
  continueOnError?: boolean;
  onError?: (file: string, errors: ValidationError[]) => void;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| continueOnError? | `boolean` | Continue loading other files if one fails validation |
| onError? | `(file: string, errors: ValidationError[]) => void` | Callback for validation errors when continueOnError is true |

### StonecropPresetOptions

Options for configuring a StonecropPreset.

**Definition:**

```typescript
export interface StonecropPresetOptions {
  fieldCasing?: FieldCasing;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| fieldCasing? | `FieldCasing` | Field name casing convention for generated GraphQL field names. `'camel'` (default) produces names like `createdAt`, `taskTitle`. `'pascal'` produces names like `CreatedAt`, `TaskTitle`. |

## Type Aliases

### ActionHandler

Action handler function signature

**Definition:**

```typescript
export type ActionHandler = (args: unknown[], context: ActionContext) => Promise<unknown>;
```

### FieldCasing

Field name casing convention for generated GraphQL field names.

**Definition:**

```typescript
export type FieldCasing = 'camel' | 'pascal';
```

## Classes

### DoctypeValidationError

Error thrown when a doctype definition fails validation

**Constructor:**

```typescript
new DoctypeValidationError(file: string, errors: ValidationError[])
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| errors | `ValidationError[]` | List of validation errors found |
| file | `string` | File path or name where the validation error occurred |

## Variables

### builtinHandlers

Built-in handlers available for registration

**Type:**

```typescript
export const builtinHandlers: Record<string, ActionHandler>
```

### typeDefs

GraphQL type definitions for Stonecrop's middleware API. Includes stonecropMeta, stonecropRecord, stonecropRecords, stonecropAction, and related types.

**Type:**

```typescript
export const typeDefs: import("graphql").DocumentNode
```

