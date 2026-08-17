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

### applyGuardedTransition

Apply a workflow action on the server, enforcing `allowedStates`.

The server owns the transition: it reads the record's authoritative current state, rejects the action when `isActionAllowedInState` denies it, then applies the outcome. Storage access is injected via `io` so this one guard serves every backend and can never disagree with the frontend's `getAvailableTransitions`, which shares the same predicate.

**The doctype decides whether an action may run and what state results; the adapter decides what actually happens.** `allowedStates`, `nextState` and `selfTransition` are authored in the doctype (in DocBuilder, by whoever models the workflow); the effect is registered by whoever owns the database. Neither names the other: an action never carries a handler name, and a handler never overrides the guard.

There are four action shapes this distinguishes: - A cross-state **transition** (has `nextState`): writes the new `status`, guarded by `allowedStates`. - A **self-transition** (`selfTransition: true`, no `nextState`, e.g. `Save`): stays in the current state and persists record field `data` in place via `io.writeData`, guarded by `allowedStates`. When the target record does not exist the same write creates it — saving a record is one request whether or not the row is there yet, so there is no separate create action, no create mutation, and no second write path for it. - A **stateless command** (neither of the above) with an `io.runEffect`: the handler is the whole outcome. Still guarded by `allowedStates`, and still forbidden from moving the record. - Anything else — no `nextState`, no `selfTransition`, no registered effect — is either a genuine authoring mistake or a command whose handler was never wired. It fails loudly before touching the backend rather than reporting a false success.

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
| actionDef | `{ label?: string; allowedStates?: string[]; nextState?: string; selfTransition?: boolean; }` | The action's `label`, `allowedStates`, and either `nextState` (transition) or `selfTransition` |
| io | `GuardedTransitionIO` | Backend read/write closures, plus the optional adapter-owned effect |
| data | `Record<string, unknown>` | Record field data for a self-transition's mutate-in-place write (ignored by transitions) |

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
| currentState? | `string` | The state the guard read, or `undefined` when nothing about the action required reading it. |
| data | `Record<string, unknown>` | The record field data the client sent (`args[0].data`). Unvalidated: `args` is an opaque `JSON` scalar, so this is browser-supplied input that has passed through no schema. Treat it as untrusted — parameterize it into SQL and whitelist the fields the action is allowed to touch. |
| doctype | `string` | The doctype the action was dispatched against, as the client sent it. |
| meta | `DoctypeMeta` | The resolved doctype metadata, for field names, the primary key, and the workflow. |
| pgClient | `PgClient` | Active database client for the current request. **It is inside the action's transaction.** The guard read, this handler, and the state write all run on this client inside one transaction, so the action is atomic: throw, and everything this handler wrote is rolled back along with the state change. Returning normally commits the lot. Do **not** open your own `BEGIN`/`COMMIT` around these statements. A `COMMIT` here would close the action's transaction early, committing work the guard may still reject. If you need to undo part of your own work without failing the action, use a `SAVEPOINT`. Work sent to a *different* connection is outside all of this and will not be rolled back — so use this client rather than opening one of your own. Rows from a raw `pgClient.query()` carry snake_case **column** names, while the middleware's own read paths alias them to camelCase fieldnames at the SQL layer (ADR 0004). A handler that returns raw rows therefore leaks snake_case keys to the client. Alias in SQL (`"display_name" AS "displayName"`) or convert with `snakeToCamel` from `@stonecrop/schema`. |
| recordId? | `string \| number` | The target record's identity, taken from the first argument envelope. Absent for a record-less command. |

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

Backend IO the dispatch layer injects so the transition logic stays storage-agnostic. The same guard runs whether the record lives in Postgres, a mock executor, or an in-memory Map — only these closures change per backend.

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
| readState | `() => Promise<string \| null \| undefined>` | Read the record's current workflow state — the value of its `status` field. Three answers, and the difference between the last two matters: - a string — the record's current state - `undefined` — the record exists but carries no workflow state - `null` — **there is no such record** Collapsing those two into `undefined` is what let an action against a missing record report success: the state read as `''`, an action declaring no `allowedStates` passed the guard, and the write then found nothing to write. Backends must return `null` when the lookup misses. |
| runEffect? | `(currentState: string \| undefined) => Promise<unknown>` | Run the adapter's side effect for this action, after the guard has passed and before any state is written. This is the seam a **database author** wires — see `StonecropPluginOptions.actionHandlers` for the Postgres adapter's registration surface. It is what makes a stateless Command (no `nextState`, no `selfTransition`) executable at all: without one, such an action has nothing to apply and fails loudly. Throwing rejects the action, so the dispatcher writes neither data nor state. It does **not** undo writes the handler already made: this guard is storage-agnostic and owns no transaction, and the Postgres adapter in particular dispatches outside one. A handler whose own statements must be all-or-nothing has to wrap them itself. Returning a full record makes it the client writeback payload; returning `undefined` leaves the doctype's own outcome to decide what comes back. |
| writeData? | `(patch: Record<string, unknown>, exists: boolean) => Promise<Record<string, unknown>>` | Persist a record's field data for a self-transition, returning the full record as it now stands (so the client writeback reflects it). **This is an upsert, and it is the create path.** Saving a record is one request whether or not the row is there yet, so there is no create action and no create mutation — `exists` says which case you are in, and the second argument exists only because the dispatcher already knows: it read the record's state to run the guard. When `exists` is false, mint or derive the identity here and return the created record; identity is the backend's business, not the dispatcher's. Read the declared `primaryKey` out of `data` for a natural-keyed doctype — that value is a field the user filled in — and mint one only when the doctype is surrogate-keyed. Never return an empty object for a creation: the dispatcher treats that as a backend that only knows how to patch, and fails loudly rather than reporting a save that stored nothing. Optional. A backend with no data-write path omits it, which is how it declines both saving and creating; a self-transition is then rejected loudly rather than silently dropped — unless `runEffect` is supplied, in which case the handler is the persistence path. |
| writeState | `(nextState: string) => Promise<void>` | Persist the record's new workflow state, written verbatim. |

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
| actionHandlers? | `Record<string, Record<string, ActionHandler>>` | Server-side effects for workflow actions, keyed `[doctype name][action key]`. This is the seam that makes a stateless Command executable. `applyGuardedTransition` can apply a doctype's own outcome — a `nextState` transition, or a `selfTransition` data write — but an action that is neither has nothing to apply and fails loudly. Registering a handler here supplies the missing half. **The doctype never names a handler, and a handler never overrides the guard.** The two are authored by different people: a doctype is runtime data edited in DocBuilder by whoever models the workflow, while these run behind the GraphQL surface and belong to whoever owns the database. So the doctype keeps `allowedStates` (may this run) and `nextState` (what state results), and this keeps the effect (what actually happens). Routing between them is resolved here, on the server, and is never published to the client. Handlers are looked up by `meta.name` — the doctype's canonical name, not its slug. An unregistered action is not an error in itself: a transition needs no handler. It fails only when the doctype gave the action no outcome either, and the error then names the action and both ways to fix it, so a typo'd key reports as a missing effect rather than a silent no-op. |
| debug? | `boolean` | When `true`, SQL queries executed inside `loadOneWithPgClient` callbacks are logged to `console.log` with `[@stonecrop/graphql-middleware]` prefix. Defaults to `false`. |
| defaultRecordLimit? | `number \| null` | Row cap applied when nothing else names one: to `stonecropRecords` when the caller requests no `limit`, and to a many-side link when its declaration carries no `fetch.limit`. Defaults to 200. A row cap is a statement about what this database can afford to serve, so it belongs to whoever owns the database — not to a doctype (which describes the API surface, not the table) and not to a page (which cannot know the size of an arbitrary table). Callers stay free to ask for less; they cannot ask for an unbounded scan by omission. One number covers both reads because a link *is* a list, fetched a different way. It used to be capped at a hard-coded 50 that no option could reach, which is how an operator watching a slow query found there was no knob to turn. Truncation is always reported — `hasMore` for a list, `truncatedLinks` for a record — so a partial answer is distinguishable from a complete one without asking for a count. That matters more for a link than for a list: a link cannot be paged, so a client that writes back a truncated relation deletes the rows it was never sent. Set to `null` for no default cap. That is the pre-0.17 behaviour for lists, and it means an unqualified list query returns the whole table and a link returns the whole relation. |
| tables? | `Record<string, string>` | Override the PostgreSQL FROM clause target for specific doctypes, keyed by doctype name. Values may be a bare table name (`'plan'`) or a schema-qualified name (`'orpin.plan'`). SQL fragments and subqueries are not supported. When absent for a doctype, the table name is derived as `camelToSnake(doctype.name)`. |

## Type Aliases

### ActionHandler

A server-side effect for one doctype action, supplied by whoever owns the database.

Throwing rejects the action and no state is written. Returning the updated record makes it the client writeback payload; returning `undefined` leaves the doctype's own outcome to decide.

The return value is passed through verbatim as `StonecropActionResult.data`, so it must be API-layer data — camelCase fieldname keys, not raw snake_case columns. See `pgClient` above and ADR 0007.

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

