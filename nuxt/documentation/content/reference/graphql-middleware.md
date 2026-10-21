---
title: GraphQL Middleware API Reference
description: PostGraphile middleware for Stonecrop
---

# Graphql_middleware API Reference

> This documentation is automatically generated from the TypeScript API.

## Functions

### applyGuardedTransition

Run a workflow action on the server: check `allowedStates`, then apply the action through `io`.

- A **transition** (`nextState`) runs `io.runEffect` if supplied, then writes the new state.

- A **self-transition** (`selfTransition`, such as Save) saves the record's data and keeps its state, through `io.runEffect` if supplied and `io.writeData` otherwise.

- A **stateless command** (neither) runs `io.runEffect` and leaves the state alone.

- Anything else fails without touching the backend.

On a record that does not exist yet, a self-transition creates it without checking `allowedStates`, a command with no `allowedStates` runs, and anything else fails: the actions `isActionAllowedOnNewRecord` allows. On a saved record the check is the same rule the client's `getAvailableTransitions` uses.

**Signature:**

```typescript
export declare function applyGuardedTransition(actionDef: {
    label?: string;
    allowedStates?: string[];
    nextState?: string;
    selfTransition?: boolean;
}, io: GuardedTransitionIO, data?: Record<string, unknown>): Promise<{
    success: boolean;
    data: unknown;
    error: string | null;
}>;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| actionDef | `{ label?: string; allowedStates?: string[]; nextState?: string; selfTransition?: boolean; }` | The action's `label`, `allowedStates`, and `nextState` or `selfTransition` |
| io | `GuardedTransitionIO` | The backend's storage calls |
| data | `Record<string, unknown>` | The record's field data, for a self-transition |

### clearFetchHandlers

Remove all registered fetch handlers. Primarily for test isolation.

**Signature:**

```typescript
export declare function clearFetchHandlers(): void;
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

The returned preset extends `PostGraphileAmberPreset` and applies Stonecrop's recommended defaults. It turns off the mutations Amber generates, a create, update and delete for every table and one for every `VOLATILE` database function, so `stonecropAction` is the only write the API offers. Pass it to `extends` in your PostGraphile configuration:

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

## Interfaces

### ActionHandlerContext

Everything a server-side action handler is given when `stonecropAction` dispatches to it.

A context object rather than positional parameters so the set can grow without breaking registered handlers — the adapters that supply these live in consumer repositories.

**Definition:**

```typescript
export interface ActionHandlerContext {
  action: string;
  args: unknown[];
  currentState?: string;
  data: Record<string, unknown>;
  doctype: string;
  meta: DoctypeMeta;
  pgClient: PgClient;
  recordId?: string | number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| action | `string` | The action's key in `workflow.actions` — the same string the handler was registered under. |
| args | `unknown[]` | The full argument envelope, for the actions that need more than the first record. |
| currentState? | `string` | The state the guard read (`''` for a record with no state), or `undefined` when nothing required reading it or the record does not exist yet. |
| data | `Record<string, unknown>` | The record field data the client sent (`args[0].data`). Unvalidated: `args` is an opaque `JSON` scalar, so this is browser-supplied input that has passed through no schema. Treat it as untrusted — parameterize it into SQL and whitelist the fields the action is allowed to touch. |
| doctype | `string` | The doctype the action was dispatched against, as the client sent it. |
| meta | `DoctypeMeta` | The resolved doctype metadata, for field names, the primary key, and the workflow. |
| pgClient | `PgClient` | The database client for this action, inside the action's transaction: throwing rolls back everything the handler wrote, and returning commits it. Never run `BEGIN` or `COMMIT` on it, which would commit work the action may still reject (a `SAVEPOINT` undoes part of your work), and never open another connection, whose work would not roll back. Its rows carry snake_case column names: return camelCase field names, by aliasing in SQL or with `snakeToCamel` from `@stonecrop/schema` (ADR 0004). |
| recordId? | `string \| number` | The record's key from the request. Absent for a record not created yet, and for a command on no record. |

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

### GuardedTransitionIO

The storage calls `applyGuardedTransition` makes. Each backend supplies its own.

**Definition:**

```typescript
export interface GuardedTransitionIO {
  readState: () => Promise<string | null | undefined>;
  runEffect?: (currentState: string | undefined) => Promise<unknown>;
  writeData?: (patch: Record<string, unknown>, exists: boolean) => Promise<Record<string, unknown>>;
  writeState: (nextState: string) => Promise<void>;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| readState | `() => Promise<string \| null \| undefined>` | Read the record's workflow state: its state, `undefined` when it exists with no state, or `null` when there is no such record. Return `null`, not `undefined`, for a missing record, or an action on it can report success while writing nothing. For a self-transition sent with an id that matches no record, throw instead: the record was deleted since it was read, and creating it would report a lost update as a success. |
| runEffect? | `(currentState: string \| undefined) => Promise<unknown>` | Run the server-side handler registered for this action, once it passes its `allowedStates` check (a self-transition creating a record skips that check), and before the state is written. A stateless command fails without one. Its return becomes the result's `data`. On a self-transition it is the whole save, on a record not created yet too, and must return the record it saved or the action fails. Throwing fails the action; undoing what it wrote is the backend's job (the Postgres adapter runs each action in a transaction). |
| writeData? | `(patch: Record<string, unknown>, exists: boolean) => Promise<Record<string, unknown>>` | Save a self-transition's field data and return the whole record, including its key. When `exists` is false, create the record: take its key from `patch` for a natural-keyed doctype, or mint one. An empty return for a create fails the action. Optional: without it, a self-transition fails unless `runEffect` is supplied. Never called when `runEffect` is supplied. |
| writeState | `(nextState: string) => Promise<void>` | Write the record's new workflow state. |

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
  actionHandlers?: Record<string, Record<string, ActionHandler>>;
  debug?: boolean;
  defaultRecordLimit?: number | null;
  tables?: Record<string, string>;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| actionHandlers? | `Record<string, Record<string, ActionHandler>>` | Server-side handlers for workflow actions, keyed by the doctype's `name` (not its slug), then the action's key. A handler runs only once the action passes its `allowedStates` check, which a Save creating a record skips. A stateless command (no `nextState`, no `selfTransition`) fails without one, and a transition's runs before the new state is written. A Save's (`selfTransition`) handler is the whole save: it runs on a record not created yet too, with no `recordId`, and must return the record it saved, with its key, or the save fails. A Save sent with an id that matches no row is refused before the handler runs. |
| debug? | `boolean` | When `true`, SQL queries executed inside `loadOneWithPgClient` callbacks are logged to `console.log` with `[@stonecrop/graphql-middleware]` prefix. Defaults to `false`. |
| defaultRecordLimit? | `number \| null` | Row cap when nothing else names one: for `stonecropRecords` called without a `limit`, and for a many-side link whose declaration has no `fetch.limit`. Defaults to 200; `null` removes it, so an unqualified list returns the whole table and a link the whole relation. A truncated answer is always reported: `hasMore` for a list, `truncatedLinks` for a record. A link cannot be paged, so a client that writes back a truncated link deletes the rows it was never sent. |
| tables? | `Record<string, string>` | Override the PostgreSQL FROM clause target for specific doctypes, keyed by doctype name. Values may be a bare table name (`'plan'`) or a schema-qualified name (`'orpin.plan'`). SQL fragments and subqueries are not supported. When absent for a doctype, the table name is derived as `pascalToSnake(doctype.name)`, so `SalesOrder` becomes `sales_order`. (Not `camelToSnake`, which prefixes a leading underscore on a PascalCase name: `camelToSnake('User')` is `_user`.) |

## Type Aliases

### ActionHandler

A server-side handler for one doctype action, registered in `actionHandlers`.

Throwing fails the action and rolls back what it wrote. The return becomes the result's `data`, so use camelCase field names (ADR 0007). The client stores the record read back afterwards, by the doctype's key in this return or else by the request's id.

**Definition:**

```typescript
export type ActionHandler = (context: ActionHandlerContext) => Promise<unknown>;
```

### FetchHandler

Handler for a custom fetch strategy on a link declaration. Called during `stonecropRecord` resolution when `link.fetch.method === 'custom'`.

**Definition:**

```typescript
export type FetchHandler = (pgClient: PgClient, parentRecord: Record<string, unknown>, link: LinkDeclaration) => Promise<Record<string, unknown> | Record<string, unknown>[]>;
```

### FieldCasing

Controls how PostgreSQL column names are mapped to GraphQL field names in the synthesized preset.

- `'camel'` (default): `my_column` → `myColumn`. This matches PostGraphile Amber's built-in behaviour.

- `'pascal'`: `my_column` → `MyColumn`. Opt in via `createStonecropPreset({ fieldCasing: 'pascal' })` or `grafserv.fieldCasing: 'pascal'` in `nuxt.config.ts`.

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

## Re-exported

Declared elsewhere and re-exported by this package.

| Name | From |
|------|------|
| DoctypeMeta | `@stonecrop/schema` |
| ValidationError | `@stonecrop/schema` |
| makePgService | `postgraphile/adaptors/pg` |

