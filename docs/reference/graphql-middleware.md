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

## Functions

### clearFetchHandlers

Remove all registered fetch handlers. Primarily for test isolation.

**Signature:**

```typescript
export declare function clearFetchHandlers(): void;
```

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

### createDebugPlugin

Creates a PostGraphile plugin that wraps Stonecrop resolver plans with debug logging. Use it in your preset file:

Place `createDebugPlugin()` **after** `createStonecropPlugin()` in the plugins array so the wrapper sees the Stonecrop fields.

**Signature:**

```typescript
createDebugPlugin: (options?: DebugPluginOptions) => GraphileConfig.Plugin
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `DebugPluginOptions` | Optional logging configuration |

### createStonecropPlugin

Create a PostGraphile plugin that extends the GraphQL schema with Stonecrop functionality.

The `PgExecutor` is obtained automatically from `build.input.pgRegistry.pgExecutors` during schema construction — it does not need to be supplied by the caller.

**Signature:**

```typescript
createStonecropPlugin: (options?: StonecropPluginOptions) => GraphileConfig.Plugin
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `StonecropPluginOptions` | Optional plugin configuration |

### createStonecropPreset

Creates a Stonecrop-flavoured PostGraphile preset.

The returned preset extends `PostGraphileAmberPreset` and applies Stonecrop's recommended defaults. Pass it to `extends` in your PostGraphile configuration:

**Signature:**

```typescript
createStonecropPreset: (options?: {
    fieldCasing?: FieldCasing;
}) => GraphileConfig.Preset
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `{ fieldCasing?: FieldCasing; }` | Optional configuration. Pass `{ fieldCasing: 'pascal' }` to enable `MyColumn`-style field names instead of the default `myColumn` (camelCase). |

### getAllMeta

Get all loaded doctypes

**Signature:**

```typescript
export declare function getAllMeta(): DoctypeMeta[];
```

### getFetchHandler

Retrieve a registered fetch handler by name. Returns `undefined` if no handler has been registered under that name.

**Signature:**

```typescript
export declare function getFetchHandler(name: string): FetchHandler | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` |  |

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

### registerFetchHandler

Register a custom fetch handler by name. The name must match the `handler` field on a `CustomFetch` strategy declaration.

**Signature:**

```typescript
export declare function registerFetchHandler(name: string, handler: FetchHandler): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` |  |
| handler | `FetchHandler` |  |

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

Context passed to action handlers.

**Definition:**

```typescript
export interface ActionContext {
  doctype: DoctypeMeta;
  pgClient?: PgClient;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| doctype | `DoctypeMeta` | Doctype metadata for the action being executed |
| pgClient? | `PgClient` | Active database client — available when the action is dispatched via stonecropAction |

### DebugPluginOptions

Options for the Stonecrop debug plugin.

**Definition:**

```typescript
export interface DebugPluginOptions {
  logPlans?: boolean;
  logTiming?: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| logPlans? | `boolean` | Log a message when a plan is built for a Stonecrop field. Default: `true` |
| logTiming? | `boolean` | Log timing for plan construction. Default: `false` |

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

### StonecropPluginOptions

Options for creating a Stonecrop PostGraphile plugin.

**Definition:**

```typescript
export interface StonecropPluginOptions {
  debug?: boolean;
  pkField?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| debug? | `boolean` | When `true`, SQL queries executed inside `loadOneWithPgClient` callbacks are logged to `console.log` with `[StonecropSQL]` prefix. Defaults to `false`. |
| pkField? | `string` | Primary key column name used in all `stonecropRecord` lookups and linked-record fetches. Defaults to `'id'`. |

## Type Aliases

### ActionHandler

Action handler function signature

**Definition:**

```typescript
export type ActionHandler = (args: unknown[], context: ActionContext) => Promise<unknown>;
```

### FetchHandler

Handler for a custom fetch strategy on a link declaration. Called during `stonecropRecord` resolution when `link.fetch.method === 'custom'`.

**Definition:**

```typescript
export type FetchHandler = (pgClient: PgClient, parentRecord: Record<string, unknown>, link: LinkDeclaration) => Promise<Record<string, unknown> | Record<string, unknown>[]>;
```

### FieldCasing

Controls how PostgreSQL column names are mapped to GraphQL field names in the synthesized preset.

- `'camel'` (default): `my_column` → `myColumn`. This matches PostGraphile Amber's built-in behaviour. - `'pascal'`: `my_column` → `MyColumn`. Opt in via `createStonecropPreset({ fieldCasing: 'pascal' })` or `grafserv.fieldCasing: 'pascal'` in `nuxt.config.ts`.

Smart tag overrides (`@name` on column comments) are respected regardless of this setting.

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

### StonecropPreset

The default Stonecrop PostGraphile preset with camelCase field names.

Equivalent to `createStonecropPreset()` with no options. Use this when you do not need to customise field casing:

**Type:**

```typescript
export const StonecropPreset: GraphileConfig.Preset
```

### typeDefs

GraphQL type definitions for Stonecrop's middleware API. Includes stonecropMeta, stonecropRecord, stonecropRecords, stonecropAction, and related types.

**Type:**

```typescript
export const typeDefs: import("graphql").DocumentNode
```

