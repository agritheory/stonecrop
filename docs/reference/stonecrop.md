---
title: Stonecrop API Reference
description: Core orchestration with Registry, HST, and composables
---

# Stonecrop API Reference

> This documentation is automatically generated from the TypeScript API.

## Functions

### createHST

Factory function for HST creation Creates a new HSTNode proxy for hierarchical state tree navigation.

**Signature:**

```typescript
declare function createHST(target: any, doctype: string): HSTNode;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| target | `any` | The target object to wrap with HST functionality |
| doctype | `string` | The document type identifier |

### createValidator

Creates a validator with the given registry

**Signature:**

```typescript
export declare function createValidator(registry: Registry, options?: Partial<ValidatorOptions>): SchemaValidator;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| registry | `Registry` | Registry instance |
| options | `Partial<ValidatorOptions>` | Additional validator options |

### executeClientHandler

Execute a docbuilder-authored `clientHandler` body against an injected API map.

`code` is a function *body* (statements), not a full function — authored in the docbuilder code editor and stored on `ActionDefinition.clientHandler`. It is compiled with the AsyncFunction constructor, so `await` works directly. Each key of `api` becomes a parameter name bound to its value, so a handler can reference `router`, `record`, `runAction`, etc. by name.

This executor is deliberately concern-free: it performs no routing, dispatch, or HST writes itself — the caller assembles `api`. The injected set is an *intent* contract, not a sandbox (an AsyncFunction body can still reach `fetch`/`window`); enforcement of what a handler may actually do lives server-side, not here.

Errors are propagated to the caller as a rejected promise — syntax errors at compile time and thrown errors / rejections at run time — so callers handle both uniformly.

**Signature:**

```typescript
export declare function executeClientHandler(code: string, api?: ClientHandlerApi): Promise<unknown>;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| code | `string` | the clientHandler body, e.g. `"router.push('/users')"` |
| api | `ClientHandlerApi` | named capabilities injected as parameters (default: none) |

### getGlobalTriggerEngine

Get or create the global field trigger engine singleton

**Signature:**

```typescript
export declare function getGlobalTriggerEngine(options?: FieldTriggerOptions): FieldTriggerEngine;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `FieldTriggerOptions` | Optional configuration for the field trigger engine |

### isDraftRecordId

Whether a record id refers to a record that has not been saved yet.

Guard anything that assumes the record exists — fetching it, resolving its links, judging workflow readiness — with this rather than the literal. The shell and this package once spelled the rule differently, which left every guard here dead.

**Signature:**

```typescript
export declare function isDraftRecordId(recordId: string | null | undefined): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| recordId | `string \| null \| undefined` | The record id to test |

### markOperationIrreversible

Mark a specific operation as irreversible. Used to prevent undo of critical operations like publishing or deletion.

**Signature:**

```typescript
export declare function markOperationIrreversible(operationId: string | undefined, reason: string): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| operationId | `string \| undefined` | The ID of the operation to mark as irreversible |
| reason | `string` | Human-readable reason why the operation cannot be undone |

### registerGlobalAction

Register a global action function that can be used in field triggers

**Signature:**

```typescript
export declare function registerGlobalAction(name: string, fn: FieldActionFunction): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | The name of the action to register |
| fn | `FieldActionFunction` | The action function to execute when the trigger fires |

### registerTransitionAction

Register a global XState transition action function

**Signature:**

```typescript
export declare function registerTransitionAction(name: string, fn: TransitionActionFunction): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | The name of the transition action to register |
| fn | `TransitionActionFunction` | The transition action function to execute |

### setFieldRollback

Configure rollback behavior for a specific field trigger

**Signature:**

```typescript
export declare function setFieldRollback(doctype: string, fieldname: string, enableRollback: boolean): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | The doctype name |
| fieldname | `string` | The field name |
| enableRollback | `boolean` | Whether to enable automatic rollback for this field |

### triggerTransition

Manually trigger an XState transition for a specific doctype/record This can be called directly when you need to execute transition actions programmatically

**Signature:**

```typescript
export declare function triggerTransition(doctype: string, transition: string, options?: {
    recordId?: string;
    currentState?: string;
    targetState?: string;
    fsmContext?: Record<string, any>;
    path?: string;
}): Promise<any>;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | The doctype name |
| transition | `string` | The XState transition name to trigger |
| options | `{ recordId?: string; currentState?: string; targetState?: string; fsmContext?: Record<string, any>; path?: string; }` | Optional configuration for the transition |

### useClientAction

Shared executor for doctype action clicks. A host's Desktop `@action` handler delegates here so every host runs the same logic from one definition:

- If the clicked action carries a `clientHandler`, run it. The handler **owns orchestration** — it calls `runAction` itself when it needs the server, navigates via `router`, reads `record`, or queries `graphql`. It supersedes the default dispatch. - Otherwise dispatch the action to its server `handler` (the pre-existing behavior), so actions without a `clientHandler` are unchanged.

`runAction` is the only blessed write: it dispatches **and** leaves the store consistent, filing the returned record under the identity the *server* settled on and following the route there when that differs from the one dispatched. For a created record those are never the same, which is what makes hand-rolling this reliably wrong.

The store write itself lives one layer down, in `dispatchAction`, so a host that never adopts this composable still cannot file a record under the wrong key. What stays here is only what needs the *dispatched* id: dropping the stale key, and moving the route.

Pass `buildArgs` to change the argument envelope your backend receives, `followRecord` to change where a created record sends the user, and `onError` to route failures into your own notification system. Identity resolution and HST keying are deliberately not configurable — see `UseClientActionOptions`.

**Signature:**

```typescript
export declare function useClientAction(options?: UseClientActionOptions): {
    run: (payload: ActionEventPayload) => Promise<void>;
};
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `UseClientActionOptions` |  |

### useLazyLink

Get the lazy link state for a specific link field on a doctype record.

This composable provides reactive state for lazy-loaded links: - `loading`: true while fetching - `loaded`: true after successful fetch (permanent until reload) - `error`: error state if any - `reload()`: explicitly trigger a fetch - `data`: computed from HST, or undefined if not loaded

The reload() function respects the link's fetch strategy: - `sync`: fetches via GraphQL query through fetchNestedData - `lazy`: fetches via GraphQL query through fetchNestedData - `custom`: invokes the serialized handler function directly

**Signature:**

```typescript
export declare function useLazyLink(doctype: Doctype, recordId: string, linkFieldname: string): LazyLink;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `Doctype` | The doctype instance |
| recordId | `string` | The record ID |
| linkFieldname | `string` | The link fieldname to load |

### useOperationLog

Composable for operation log management Provides easy access to undo/redo functionality and operation history

**Signature:**

```typescript
export declare function useOperationLog(config?: Partial<OperationLogConfig>): {
    operations: import("vue").Ref<{
        id: string;
        type: import("..").HSTOperationType;
        path: string;
        fieldname: string;
        beforeValue: any;
        afterValue: any;
        doctype: string;
        recordId?: string | undefined;
        timestamp: Date;
        source?: import("..").OperationSource | undefined;
        reversible: boolean;
        irreversibleReason?: string | undefined;
        transition?: string | undefined;
        currentState?: string | undefined;
        targetState?: string | undefined;
        actionName?: string | undefined;
        actionRecordIds?: string[] | undefined;
        actionResult?: "success" | "failure" | "pending" | undefined;
        actionError?: string | undefined;
        userId?: string | undefined;
        metadata?: Record<string, any> | undefined;
        ancestorOperationId?: string | undefined;
        descendantOperationIds?: string[] | undefined;
    }[], import("..").HSTOperation[] | {
        id: string;
        type: import("..").HSTOperationType;
        path: string;
        fieldname: string;
        beforeValue: any;
        afterValue: any;
        doctype: string;
        recordId?: string | undefined;
        timestamp: Date;
        source?: import("..").OperationSource | undefined;
        reversible: boolean;
        irreversibleReason?: string | undefined;
        transition?: string | undefined;
        currentState?: string | undefined;
        targetState?: string | undefined;
        actionName?: string | undefined;
        actionRecordIds?: string[] | undefined;
        actionResult?: "success" | "failure" | "pending" | undefined;
        actionError?: string | undefined;
        userId?: string | undefined;
        metadata?: Record<string, any> | undefined;
        ancestorOperationId?: string | undefined;
        descendantOperationIds?: string[] | undefined;
    }[]>;
    currentIndex: import("vue").Ref<number, number>;
    undoRedoState: import("vue").ComputedRef<import("..").UndoRedoState>;
    canUndo: import("vue").ComputedRef<boolean>;
    canRedo: import("vue").ComputedRef<boolean>;
    undoCount: import("vue").ComputedRef<number>;
    redoCount: import("vue").ComputedRef<number>;
    undo: (hstStore: HSTNode) => boolean;
    redo: (hstStore: HSTNode) => boolean;
    startBatch: () => void;
    commitBatch: (description?: string) => string | null;
    cancelBatch: () => void;
    clear: () => void;
    getOperationsFor: (doctype: string, recordId?: string) => import("..").HSTOperation[];
    getSnapshot: () => import("..").OperationLogSnapshot;
    markIrreversible: (operationId: string, reason: string) => void;
    logAction: (doctype: string, actionName: string, recordIds?: string[], result?: "success" | "failure" | "pending", error?: string) => string;
    configure: (options: Partial<OperationLogConfig>) => void;
};
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| config | `Partial<OperationLogConfig>` | Optional configuration for the operation log |

### useStonecrop

Unified Stonecrop composable - handles both general operations and HST reactive integration.

Called with no doctype, it returns the Stonecrop instance and the operation log, and touches the network not at all. Name a doctype to get the HST surface.

**Signature:**

```typescript
export declare function useStonecrop(): BaseStonecropReturn;
```

### useStonecrop

Unified Stonecrop composable with HST integration for a specific doctype and record.

When a `Doctype` instance is passed, all synchronous initialisation (`hstStore`, `resolvedSchema`, `formData`, `handleHSTChange`, operation-log wiring) is performed during `setup()` — before the first render and without awaiting any lifecycle hook. Callers can read `hstStore.value`, `resolvedSchema.value`, and `formData.value` immediately after calling this composable; no `nextTick`, `flushPromises`, or `setTimeout` is required.

The only async work in `onMounted` is fetching an existing record from the server when `recordId` is not a draft, and lazy-loading a doctype by slug string. Both need a doctype named here — nothing is inferred from the route.

**Signature:**

```typescript
export declare function useStonecrop(options: {
    registry?: Registry;
    doctype: Doctype | string;
    recordId?: string;
}): HSTStonecropReturn;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `{ registry?: Registry; doctype: Doctype \| string; recordId?: string; }` | Configuration with doctype (string slug or Doctype instance) and optional recordId |

### useUndoRedoShortcuts

Keyboard shortcut handler for undo/redo Automatically binds Ctrl+Z (undo) and Ctrl+Shift+Z/Ctrl+Y (redo) using VueUse

**Signature:**

```typescript
export declare function useUndoRedoShortcuts(hstStore: HSTNode, enabled?: boolean): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| hstStore | `HSTNode` | The HST store to operate on |
| enabled | `boolean` | Whether shortcuts are enabled (default: true) |

### validateSchema

Quick validation helper

**Signature:**

```typescript
export declare function validateSchema(doctype: string, schema: List<DoctypeField> | DoctypeField[] | undefined, registry: Registry, workflow?: AnyStateNodeConfig, actions?: ImmutableMap<string, string[]> | Map<string, string[]>): ValidationResult;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | Doctype name |
| schema | `List<DoctypeField> \| DoctypeField[] \| undefined` | Schema fields |
| registry | `Registry` | Registry instance |
| workflow | `AnyStateNodeConfig` | Optional workflow configuration |
| actions | `ImmutableMap<string, string[]> \| Map<string, string[]>` | Optional actions map |

### withBatch

Batch operation helper Wraps a function execution in a batch operation

**Signature:**

```typescript
export declare function withBatch<T>(fn: () => T | Promise<T>, description?: string): Promise<string | null>;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| fn | `() => T \| Promise<T>` | The function to execute within a batch |
| description | `string` | Optional description for the batch |

## Interfaces

### ActionArgsContext

Everything known about a dispatch at the point the argument array is built.

**Definition:**

```typescript
export interface ActionArgsContext {
  action: string;
  data: Record<string, unknown>;
  doctype: string;
  extra?: Record<string, unknown>;
  isDraft: boolean;
  recordId: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| action | `string` | The action being dispatched. |
| data | `Record<string, unknown>` | The form snapshot being sent. |
| doctype | `string` | Slug of the doctype the action was raised on. |
| extra? | `Record<string, unknown>` | Extra fields a `clientHandler` passed to `runAction`. |
| isDraft | `boolean` | Whether `recordId` is the draft segment rather than a real identity. |
| recordId | `string` | The route's record segment — `DRAFT_RECORD_ID` for an unsaved record. |

### ActionExecutionResult

Result of executing a field action

**Definition:**

```typescript
export interface ActionExecutionResult {
  action: FieldAction;
  error?: Error;
  executionTime: number;
  success: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| action | `FieldAction` | The action that was executed |
| error? | `Error` | Error if execution failed |
| executionTime | `number` | Execution time in milliseconds |
| success | `boolean` | Whether the action executed successfully |

### ActionFailure

An action that did not complete, described well enough for a host to render it.

An object rather than a bare message on purpose: a notification says *what* failed, and the action, doctype and record are all known at the point of failure. It is also the shape that can gain a field later without breaking a host that already destructures it.

**Definition:**

```typescript
export interface ActionFailure {
  action: string;
  cause?: unknown;
  doctype: string;
  message: string;
  recordId: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| action | `string` | The action that was clicked, not necessarily the one a `clientHandler` dispatched. |
| cause? | `unknown` | The thrown value, present only when the failure was a throw rather than a refused dispatch. |
| doctype | `string` | Slug of the doctype the action was raised on. |
| message | `string` | Human-readable reason — the server's own message where there is one. |
| recordId | `string` | Record the action was raised against; the `new` route segment for an unsaved record. |

### ActionRegistry

Registry for storing global action functions

**Definition:**

```typescript
export interface ActionRegistry {
  get(name: string): FieldActionFunction | undefined;
  has(name: string): boolean;
  list(): string[];
  register(name: string, fn: FieldActionFunction): void;
  unregister(name: string): void;
}
```

### BatchOperation

Batch operation wrapper

**Definition:**

```typescript
export interface BatchOperation {
  description?: string;
  id: string;
  operations: HSTOperation[];
  reversible: boolean;
  timestamp: Date;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| description? | `string` | Optional description of what this batch represents |
| id | `string` | Unique batch identifier |
| operations | `HSTOperation[]` | Operations included in this batch |
| reversible | `boolean` | Whether the entire batch can be undone |
| timestamp | `Date` | When the batch was created |

### CrossTabMessage

Cross-tab message payload

**Definition:**

```typescript
export interface CrossTabMessage {
  clientId: string;
  operation?: HSTOperation;
  operations?: HSTOperation[];
  timestamp: Date;
  type: CrossTabMessageType;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| clientId | `string` | Identifier of the client/tab sending the message |
| operation? | `HSTOperation` | Single operation for operation/undo/redo messages |
| operations? | `HSTOperation[]` | Multiple operations for sync messages |
| timestamp | `Date` | When the message was sent |
| type | `CrossTabMessageType` | Type of cross-tab message |

### FieldChangeContext

Context provided to action functions when field changes occur

**Definition:**

```typescript
export interface FieldChangeContext {
  afterValue: any;
  beforeValue: any;
  doctype: string;
  fieldname: string;
  operation: 'set' | 'delete' | 'patch';
  path: string;
  recordId?: string;
  store?: HSTNode;
  timestamp: Date;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| afterValue | `any` | Value after the change |
| beforeValue | `any` | Value before the change |
| doctype | `string` | The doctype of the record being changed |
| fieldname | `string` | The field name (last segment of path) |
| operation | `'set' \| 'delete' \| 'patch'` | The operation type |
| path | `string` | The HST path that was changed |
| recordId? | `string` | The record ID if applicable |
| store? | `HSTNode` | Reference to the HST store for state access (optional) |
| timestamp | `Date` | Timestamp of the change |

### FieldTriggerConfig

Configuration for a single field trigger

**Definition:**

```typescript
export interface FieldTriggerConfig {
  actions: FieldAction[];
  condition?: (context: FieldChangeContext) => boolean | Promise<boolean>;
  enableRollback?: boolean;
  stopOnError?: boolean;
  timeout?: number;
  timing?: 'before' | 'after';
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| actions | `FieldAction[]` | Array of actions to execute when this field changes |
| condition? | `(context: FieldChangeContext) => boolean \| Promise<boolean>` | Optional condition function to determine if actions should run |
| enableRollback? | `boolean` | Whether to enable automatic rollback for this field trigger (overrides global setting) |
| stopOnError? | `boolean` | Whether to stop execution on first error (default: true) |
| timeout? | `number` | Maximum execution time in milliseconds before timeout |
| timing? | `'before' \| 'after'` | Whether to run actions before or after the value is set (default: 'after') |

### FieldTriggerExecutionResult

Result of executing all actions for a field change

**Definition:**

```typescript
export interface FieldTriggerExecutionResult {
  actionResults: ActionExecutionResult[];
  allSucceeded: boolean;
  path: string;
  rolledBack: boolean;
  snapshot?: any;
  stoppedOnError: boolean;
  totalExecutionTime: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| actionResults | `ActionExecutionResult[]` | Results for each action that was executed |
| allSucceeded | `boolean` | Whether all actions succeeded |
| path | `string` | The path that triggered the actions |
| rolledBack | `boolean` | Whether a rollback was performed |
| snapshot? | `any` | The snapshot that was captured before execution |
| stoppedOnError | `boolean` | Whether execution was stopped due to an error |
| totalExecutionTime | `number` | Total execution time for all actions |

### FieldTriggerOptions

Options for the field trigger system

**Definition:**

```typescript
export interface FieldTriggerOptions {
  debug?: boolean;
  defaultTimeout?: number;
  enableRollback?: boolean;
  errorHandler?: (error: Error, context: FieldChangeContext, action: FieldAction) => void;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| debug? | `boolean` | Whether to log trigger executions for debugging |
| defaultTimeout? | `number` | Default timeout for action execution in milliseconds |
| enableRollback? | `boolean` | Whether to enable automatic rollback on failure (default: true) |
| errorHandler? | `(error: Error, context: FieldChangeContext, action: FieldAction) => void` | Custom error handler for action failures |

### FollowRecordContext

Where a record ended up after the server settled its identity.

**Definition:**

```typescript
export interface FollowRecordContext {
  doctype: string;
  previousRecordId: string;
  recordId: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| doctype | `string` | Slug of the doctype the action was raised on. |
| previousRecordId | `string` | The identity that was dispatched, which is no longer valid. |
| recordId | `string` | The identity the server settled on — where the record now lives. |

### HSTNode

Core HST Interface - enhanced with tree navigation Provides a hierarchical state tree interface for navigating and manipulating nested data structures.

**Definition:**

```typescript
export interface HSTNode {
  get(path: string): any;
  getAncestor(): HSTNode | null;
  getBreadcrumbs(): string[];
  getDepth(): number;
  getNode(path: string): HSTNode;
  getPath(): string;
  getRoot(): HSTNode;
  has(path: string): boolean;
  set(path: string, value: any, source: 'user' | 'system' | 'sync' | 'undo' | 'redo'): void;
  triggerTransition(transition: string, context: {
        currentState?: string;
        targetState?: string;
        fsmContext?: Record<string, any>;
    }): Promise<any>;
}
```

### HSTOperation

Complete metadata for an HST mutation Enables time travel, synchronization, and audit trails

**Definition:**

```typescript
export interface HSTOperation {
  actionError?: string;
  actionName?: string;
  actionRecordIds?: string[];
  actionResult?: 'success' | 'failure' | 'pending';
  afterValue: any;
  ancestorOperationId?: string;
  beforeValue: any;
  currentState?: string;
  descendantOperationIds?: string[];
  doctype: string;
  fieldname: string;
  id: string;
  irreversibleReason?: string;
  metadata?: Record<string, any>;
  path: string;
  recordId?: string;
  reversible: boolean;
  source?: OperationSource;
  targetState?: string;
  timestamp: Date;
  transition?: string;
  type: HSTOperationType;
  userId?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| actionError? | `string` | Error message if action execution failed |
| actionName? | `string` | Action name if operation is an action execution (type: 'action') |
| actionRecordIds? | `string[]` | Record IDs that the action was executed on |
| actionResult? | `'success' \| 'failure' \| 'pending'` | Result or status of the action execution |
| afterValue | `any` | Value after the operation |
| ancestorOperationId? | `string` | Ancestor operation ID for batch operations |
| beforeValue | `any` | Value before the operation |
| currentState? | `string` | XState current state before transition |
| descendantOperationIds? | `string[]` | Descendant operation IDs for batch operations |
| doctype | `string` | Doctype this operation affects |
| fieldname | `string` | Field name extracted from path |
| id | `string` | Unique operation identifier |
| irreversibleReason? | `string` | Reason if operation is irreversible |
| metadata? | `Record<string, any>` | Additional metadata for custom use cases |
| path | `string` | Full HST path affected (e.g., "task.123.title") |
| recordId? | `string` | Record ID if applicable |
| reversible | `boolean` | Whether this operation can be undone |
| source? | `OperationSource` | Source of the operation (defaults to 'user' if not specified) |
| targetState? | `string` | XState target state after transition |
| timestamp | `Date` | Timestamp of the operation |
| transition? | `string` | XState transition name if triggered by FSM |
| type | `HSTOperationType` | Type of operation performed |
| userId? | `string` | User or session identifier |

### OperationLogConfig

Operation log configuration

**Definition:**

```typescript
export interface OperationLogConfig {
  enableCrossTabSync?: boolean;
  enablePersistence?: boolean;
  maxOperations?: number;
  operationFilter?: (operation: HSTOperation) => boolean;
  persistenceKeyPrefix?: string;
  userId?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| enableCrossTabSync? | `boolean` | Enable cross-tab synchronization (default: true) |
| enablePersistence? | `boolean` | Enable operation persistence to localStorage (default: false) |
| maxOperations? | `number` | Maximum operations to store (default: 100) |
| operationFilter? | `(operation: HSTOperation) => boolean` | Custom operation filter |
| persistenceKeyPrefix? | `string` | Persistence key prefix |
| userId? | `string` | User identifier for multi-user scenarios |

### OperationLogSnapshot

Operation log snapshot for debugging

**Definition:**

```typescript
export interface OperationLogSnapshot {
  currentIndex: number;
  irreversibleOperations: number;
  newestOperation?: Date;
  oldestOperation?: Date;
  operations: HSTOperation[];
  reversibleOperations: number;
  totalOperations: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| currentIndex | `number` | Current operation index in the history |
| irreversibleOperations | `number` | Number of operations that cannot be undone |
| newestOperation? | `Date` | Timestamp of the newest operation |
| oldestOperation? | `Date` | Timestamp of the oldest operation |
| operations | `HSTOperation[]` | All operations in the log |
| reversibleOperations | `number` | Number of operations that can be undone |
| totalOperations | `number` | Total number of operations |

### PageInfo

Pagination metadata from the last `getRecords` for a doctype. Kept beside HST, not in it — see `getPageInfo`.

**Definition:**

```typescript
export interface PageInfo {
  count?: number;
  hasMore: boolean;
  limit: number;
  offset: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| count? | `number` | Total matching the filters when the caller passed includeTotal |
| hasMore | `boolean` | Whether the backend holds further records beyond what has been fetched |
| limit | `number` | Number of rows in the last page (result.data.length) |
| offset | `number` | Offset of the last fetch |

### RouteContext

Route context passed to getMeta function

**Definition:**

```typescript
export interface RouteContext {
  path: string;
  segments: string[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| path | `string` | The full route path (e.g., "/todo/1" or "/todo") |
| segments | `string[]` | Path segments split by "/" (e.g., ["todo", "1"] or ["todo"]) |

### StonecropOptions

Options for constructing a Stonecrop instance directly. When using the Vue plugin, pass these via `InstallOptions` instead.

**Definition:**

```typescript
export interface StonecropOptions {
  client?: DataClient;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| client? | `DataClient` | Data client for fetching doctype metadata and records. Use stonecrop/graphql-client's StonecropClient for GraphQL backends, or implement DataClient for custom data sources. Can be set later via `setClient()` for deferred configuration. |

### TransitionChangeContext

Context provided to XState transition action functions Extends FieldChangeContext with FSM-specific data

**Definition:**

```typescript
export interface TransitionChangeContext {
  currentState?: string;
  fsmContext?: Record<string, any>;
  targetState?: string;
  transition: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| currentState? | `string` | Current workflow state before transition |
| fsmContext? | `Record<string, any>` | Additional FSM context data |
| targetState? | `string` | Target workflow state after transition |
| transition | `string` | The XState transition name that triggered this action |

### TransitionExecutionResult

Result of executing an XState transition action

**Definition:**

```typescript
export interface TransitionExecutionResult {
  action: TransitionAction;
  error?: Error;
  executionTime: number;
  success: boolean;
  transition: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| action | `TransitionAction` | The action that was executed |
| error? | `Error` | Error if execution failed |
| executionTime | `number` | Execution time in milliseconds |
| success | `boolean` | Whether the action executed successfully |
| transition | `string` | The transition name that was executed |

### UndoRedoState

Undo/Redo state

**Definition:**

```typescript
export interface UndoRedoState {
  canRedo: boolean;
  canUndo: boolean;
  currentIndex: number;
  redoCount: number;
  undoCount: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| canRedo | `boolean` | Can redo |
| canUndo | `boolean` | Can undo |
| currentIndex | `number` | Current operation index |
| redoCount | `number` | Number of operations available for redo |
| undoCount | `number` | Number of operations available for undo |

### UseClientActionOptions

Host overrides for `useClientAction`.

These are the three things that legitimately differ between applications: how your backend wants an action's arguments shaped, where the user should end up after a create, and how a failure is shown. Everything else is framework behaviour and is deliberately not configurable — in particular, resolving a record's identity and keying it into HST stay sealed, because that is the rule the adapter re-derives server-side, and every host that re-derived it got it wrong.

**Definition:**

```typescript
export interface UseClientActionOptions {
  buildArgs?: (context: ActionArgsContext) => unknown[];
  followRecord?: (context: FollowRecordContext) => void | Promise<void>;
  onError?: (failure: ActionFailure) => void;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| buildArgs? | `(context: ActionArgsContext) => unknown[]` | Build the opaque argument array handed to `DataClient.runAction`. The default is `[{ id, data }]`, omitting `id` entirely for a draft — the envelope every in-repo server handler destructures. Supply this when your backend expects another shape; `desktop/playground` uses positional `[recordId, data]`, for instance. Nothing validates the array, so both ends of your own stack have to agree on it. Whatever you return is sent verbatim. It does not affect how the *result* is stored — that is keyed off the returned record's declared identity, not off what was sent. |
| followRecord? | `(context: FollowRecordContext) => void \| Promise<void>` | Move the user to where a record ended up when the server settled on a different identity — the create case, and any action that rewrites a natural key. The default is `router.replace('/{doctype}/{recordId}')`. `replace`, not `push`: the route being left behind was never a record, so going Back to `/{doctype}/new` would show an empty form that creates yet another record. Supply this for a locale prefix, a nested path, or to stay put; the store has already been updated either way. |
| onError? | `(failure: ActionFailure) => void` | Called instead of the built-in alert when an action fails. Supply this to route failures into the host's own notification system, or pass a no-op to suppress them entirely. It fully replaces the default, console log included — a host that wants one writes it. |

### ValidationError

A single validation error contributed by a trigger, displayed on a field.

**Definition:**

```typescript
export interface ValidationError {
  field: string;
  message: string;
  trigger: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| field | `string` | The fieldname the error displays on (the `setError` target, not necessarily a fired field) |
| message | `string` | The message to display |
| trigger | `string` | The trigger that produced this error — the namespace a re-run clears before repopulating |

### ValidationIssue

Validation issue

**Definition:**

```typescript
export interface ValidationIssue {
  context?: Record<string, unknown>;
  doctype?: string;
  fieldname?: string;
  message: string;
  rule: string;
  severity: ValidationSeverity;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| context? | `Record<string, unknown>` | Additional context |
| doctype? | `string` | Doctype name |
| fieldname? | `string` | Field name if applicable |
| message | `string` | Human-readable message |
| rule | `string` | Validation rule that failed |
| severity | `ValidationSeverity` | Severity level |

### ValidationResult

Validation result

**Definition:**

```typescript
export interface ValidationResult {
  errorCount: number;
  infoCount: number;
  issues: ValidationIssue[];
  valid: boolean;
  warningCount: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| errorCount | `number` | Count of errors |
| infoCount | `number` | Count of info messages |
| issues | `ValidationIssue[]` | List of validation issues |
| valid | `boolean` | Whether validation passed (no blocking errors) |
| warningCount | `number` | Count of warnings |

### ValidatorOptions

Schema validator options

**Definition:**

```typescript
export interface ValidatorOptions {
  registry?: Registry;
  validateActions?: boolean;
  validateLinks?: boolean;
  validateLinkTargets?: boolean;
  validateRequiredProperties?: boolean;
  validateWorkflows?: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| registry? | `Registry` | Registry instance for doctype lookups |
| validateActions? | `boolean` | Whether to validate action registration |
| validateLinks? | `boolean` | Whether to validate links object (target resolution, backlink consistency, Link field correspondence) |
| validateLinkTargets? | `boolean` | Whether to validate Link field targets |
| validateRequiredProperties? | `boolean` | Whether to validate required schema properties |
| validateWorkflows? | `boolean` | Whether to validate workflow reachability |

## Type Aliases

### ActionDispatchResult

Result of dispatching an action to its server handler.

**Definition:**

```typescript
export type ActionDispatchResult = {
    success: boolean;
    data: unknown;
    error: string | null;
};
```

### ActionEventPayload

Payload emitted with the 'action' event when the user triggers a declared action — an FSM transition or a stateless Command.

Defined here rather than in `@stonecrop/desktop` because the shell that *emits* it and the runner that *consumes* it now live in different packages, and desktop already depends on this one. `@stonecrop/desktop` re-exports it, so a host importing it from there is unaffected.

**Definition:**

```typescript
export type ActionEventPayload = {
    name: string;
    doctype: string;
    recordId: string;
    data: Record<string, any>;
};
```

### BaseStonecropReturn

Base Stonecrop composable return type - includes operation log functionality

**Definition:**

```typescript
export type BaseStonecropReturn = {
    stonecrop: Ref<Stonecrop | undefined>;
    operationLog: OperationLogAPI;
};
```

### ClientHandlerApi

Named capabilities injected into a clientHandler body as function parameters. The caller (the assembly composable) owns what each name resolves to — typically `router`, `record`, `runAction`, and a read-only `graphql`.

**Definition:**

```typescript
export type ClientHandlerApi = Record<string, unknown>;
```

### CrossTabMessageType

Cross-tab message types

**Definition:**

```typescript
export type CrossTabMessageType = 'operation' | 'undo' | 'redo' | 'sync-request' | 'sync-response';
```

### DoctypeConfig

Plain object representation of doctype configuration for serialization/API responses. Extends DoctypeMeta with Stonecrop-specific properties: actions, slug, inherits.

**Definition:**

```typescript
export type DoctypeConfig = {
    name: string;
    slug?: string;
    displayField?: string;
    fields?: DoctypeField[];
    links?: Record<string, LinkDeclaration>;
    workflow?: UnknownMachineConfig | WorkflowMeta;
    inherits?: string;
};
```

### FieldAction

Supported action types for field triggers

**Definition:**

```typescript
export type FieldAction = FieldActionFunction | FieldActionString;
```

### FieldActionFunction

Action function that can be triggered by field changes

**Definition:**

```typescript
export type FieldActionFunction = (context: FieldChangeContext) => void | Promise<void>;
```

### FieldActionString

String reference to a globally registered action function or inline function

**Definition:**

```typescript
export type FieldActionString = string;
```

### FieldTriggerMap

Map of field paths to trigger configurations Supports wildcard patterns like 'emailAddress.*.is_primary'

**Definition:**

```typescript
export type FieldTriggerMap = Record<string, FieldTriggerConfig | FieldAction[]>;
```

### HSTChangeData

HST Change data structure

**Definition:**

```typescript
export type HSTChangeData = {
    path: string;
    value: any;
    fieldname: string;
    recordId?: string;
};
```

### HSTOperationInput

Input type for adding operations Excludes system-generated fields (id, timestamp)

**Definition:**

```typescript
export type HSTOperationInput = Omit<HSTOperation, 'id' | 'timestamp' | 'source'> & {
    source?: OperationSource;
};
```

### HSTOperationType

Type of HST operation

**Definition:**

```typescript
export type HSTOperationType = 'set' | 'delete' | 'batch' | 'transition' | 'action';
```

### HSTStonecropReturn

HST-enabled Stonecrop composable return type

**Definition:**

```typescript
export type HSTStonecropReturn = BaseStonecropReturn & {
    provideHSTPath: (fieldname: string, recordId?: string) => string;
    handleHSTChange: (changeData: HSTChangeData) => void;
    hstStore: Ref<HSTNode | undefined>;
    formData: Ref<Record<string, any>>;
    resolvedSchema: Ref<ResolvedField[]>;
    initializeNestedData: (path: string, doctype: Doctype) => void;
    fetchNestedData: (path: string, doctype: Doctype, recordId: string, options?: {
        includeNested?: boolean | string[];
    }) => Promise<void>;
    collectRecordPayload: (doctype: Doctype, recordId: string) => Record<string, any>;
    createNestedContext: (basePath: string, descendantDoctype: Doctype) => {
        provideHSTPath: (fieldname: string) => string;
        handleHSTChange: (changeData: HSTChangeData) => void;
    };
    isLoading: Ref<boolean>;
    error: Ref<Error | null>;
    resolvedDoctype: Ref<Doctype | undefined>;
    isWorkflowReady: ComputedRef<boolean>;
    blockedLinks: ComputedRef<string[]>;
};
```

### ImmutableDoctype

Immutable Doctype type for Stonecrop instances. App authors should use `Doctype.fromObject()` rather than constructing this shape manually.

**Definition:**

```typescript
export type ImmutableDoctype = {
    readonly schema?: List<DoctypeField>;
    readonly workflow?: UnknownMachineConfig | AnyStateNodeConfig | WorkflowMeta;
};
```

### InstallOptions

Install options for Stonecrop Vue plugin

**Definition:**

```typescript
export type InstallOptions = {
    router?: Router;
    components?: Record<string, Component>;
    getMeta?: (routeContext: RouteContext) => Doctype | Promise<Doctype>;
    client?: DataClient;
    autoInitializeRouter?: boolean;
    onRouterInitialized?: (registry: Registry, stonecrop: Stonecrop) => void | Promise<void>;
};
```

### LazyLink

Lazy link state for a single link field. Provides reactive state and reload capability for lazy-loaded links.

**Definition:**

```typescript
export type LazyLink = {
    loading: Ref<boolean>;
    loaded: Ref<boolean>;
    error: Ref<Error | null>;
    reload: () => Promise<void>;
    data: ComputedRef;
};
```

### OperationLogAPI

Operation Log API - nested object containing all operation log functionality

**Definition:**

```typescript
export type OperationLogAPI = {
    operations: Ref<HSTOperation[]>;
    currentIndex: Ref<number>;
    undoRedoState: ComputedRef<{
        canUndo: boolean;
        canRedo: boolean;
        undoCount: number;
        redoCount: number;
        currentIndex: number;
    }>;
    canUndo: ComputedRef<boolean>;
    canRedo: ComputedRef<boolean>;
    undoCount: ComputedRef<number>;
    redoCount: ComputedRef<number>;
    undo: (hstStore: HSTNode) => boolean;
    redo: (hstStore: HSTNode) => boolean;
    startBatch: () => void;
    commitBatch: (description?: string) => string | null;
    cancelBatch: () => void;
    clear: () => void;
    getOperationsFor: (doctype: string, recordId?: string) => HSTOperation[];
    getSnapshot: () => OperationLogSnapshot;
    markIrreversible: (operationId: string, reason: string) => void;
    logAction: (doctype: string, actionName: string, recordIds?: string[], result?: 'success' | 'failure' | 'pending', error?: string) => string;
    configure: (options: Partial<OperationLogConfig>) => void;
};
```

### OperationSource

Operation source - where the change originated

**Definition:**

```typescript
export type OperationSource = 'user' | 'system' | 'sync' | 'undo' | 'redo';
```

### TransitionAction

Supported action types for XState transitions Can be either a transition-specific function or a string reference

**Definition:**

```typescript
export type TransitionAction = TransitionActionFunction | FieldActionString;
```

### TransitionActionFunction

Action function for XState transition triggers Receives enhanced context with FSM state information

**Definition:**

```typescript
export type TransitionActionFunction = (context: TransitionChangeContext) => void | Promise<void>;
```

## Classes

### Doctype

Doctype runtime class with Immutable.js collections for HST change tracking.

**Constructor:**

```typescript
new Doctype(doctype: string, schema: ImmutableDoctype['schema'], workflow: ImmutableDoctype['workflow'], component: Component, links: Record<string, LinkDeclaration>, displayField: string)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | The doctype name |
| schema | `ImmutableDoctype['schema']` | The doctype schema definition |
| workflow | `ImmutableDoctype['workflow']` | The doctype workflow configuration (XState machine) |
| component | `Component` | Optional Vue component for rendering the doctype |
| links | `Record<string, LinkDeclaration>` | Optional relationship links to other doctypes |
| displayField | `string` | Optional field used when displaying references to this doctype |

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| component | `Component` | The doctype component |
| displayField | `string` | Field on this doctype used when displaying a reference to one of its records. |
| doctype | `string` | The doctype name |
| links | `Record<string, LinkDeclaration>` | Relationship links to other doctypes |
| name | `string` | Alias for doctype (for DoctypeLike interface compatibility) |
| recordIdField | `string` | The field a record of this doctype is identified by: the declared `primaryKey`, or `id` when nothing is declared. The client-side twin of the adapters' `recordLookupField`. Both are the same call to `@stonecrop/schema`'s `getRecordIdField`, so the field a caller reads an identity out of is the same field the adapter builds its lookup predicate on. Use this to ask whether a record *states* its own identity. `getRecordId` deliberately falls back to `id` when the declared key is missing, which is right for resolving a link from a record already in hand and wrong for deciding whether a server response settled on a new identity: a response that omits a natural key would resolve through that fallback to a surrogate the adapter cannot look up. |
| schema | `ImmutableDoctype['schema']` | The doctype schema |
| slug | `string` | Converts the registered doctype string to a slug (kebab-case). The following conversions are made: - It replaces camelCase and PascalCase with kebab-case strings - It replaces spaces and underscores with hyphens - It converts the string to lowercase |
| workflow | `ImmutableDoctype['workflow']` | The doctype workflow |

**Methods:**

#### fromObject

Creates a Doctype instance from a plain configuration object. Handles conversion of arrays to Immutable.js collections internally.

This is the recommended way to create a Doctype from API responses or configuration files, as it encapsulates the Immutable.js construction that the framework uses internally.

```typescript
fromObject(config: DoctypeConfig): Doctype
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| config | `DoctypeConfig` | Plain object with doctype configuration (typically from API response) |

#### getActionMeta

Returns metadata for a specific action, if available. Only works with WorkflowMeta format; returns undefined for XState format.

```typescript
getActionMeta(actionName: string): {
        label: string;
        requiredFields?: string[];
        allowedStates?: string[];
    } | undefined
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| actionName | `string` | The action name to get metadata for |

#### getAvailableCommands

Returns the stateless **Commands** available in a given workflow state — side-effect actions (save/print/email…) that do not change workflow state. Unlike transitions, Commands may exist on a workflow that declares no `states` (a commands-only doctype), and a Command with no `allowedStates` is available in every state.

Only meaningful for WorkflowMeta format; XState workflows have no Commands.

```typescript
getAvailableCommands(currentState: string): Array<{
        name: string;
    }>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| currentState | `string` | The record's current state, used to honor a Command's `allowedStates` |

#### getAvailableTransitions

Returns the transitions available from a given workflow state, derived from the doctype's workflow configuration. Supports both XState format and WorkflowMeta format.

```typescript
getAvailableTransitions(currentState: string): Array<{
        name: string;
        targetState: string;
    }>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| currentState | `string` | The state name to read transitions from |

#### getRecordId

Resolve a record's identity using this doctype's declared `primaryKey`, falling back to `id`.

Lives here rather than at the call site because the doctype owns its schema — and because the rule must match the server's, which builds its SQL identity predicate from the same declared field via `@stonecrop/schema`'s `getPrimaryKeyField`.

```typescript
getRecordId(record: Record<string, unknown>): string | undefined
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| record | `Record<string, unknown>` | the record to read the identity from |

#### getSchemaArray

Returns the raw authoring schema as a plain array. For the resolved schema suitable for AForm, use `registry.resolveSchema(doctype)`.

```typescript
getSchemaArray(): DoctypeField[]
```

#### getTriggers

Returns the field-validation **triggers** declared on this doctype's workflow (advisory, client-side). Keyed by trigger name. Returns undefined when the workflow is absent, is an XState machine (no triggers), or simply declares none.

```typescript
getTriggers(): Record<string, TriggerDefinition> | undefined
```

### FieldTriggerEngine

Field trigger execution engine integrated with Registry Singleton pattern following Registry implementation

**Constructor:**

```typescript
new FieldTriggerEngine(options: FieldTriggerOptions)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `FieldTriggerOptions` | Configuration options for the field trigger engine |

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| _root | `FieldTriggerEngine` | The root FieldTriggerEngine instance |

**Methods:**

#### executeFieldTriggers

Execute field triggers for a changed field

```typescript
executeFieldTriggers(context: FieldChangeContext, options: {
        timeout?: number;
        enableRollback?: boolean;
    }): Promise<FieldTriggerExecutionResult>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| context | `FieldChangeContext` | The field change context |
| options | `{ timeout?: number; enableRollback?: boolean; }` | Execution options (timeout and enableRollback) |

#### executeTransitionActions

Execute XState transition actions Similar to field triggers but specifically for FSM state transitions

```typescript
executeTransitionActions(context: TransitionChangeContext, options: {
        timeout?: number;
    }): Promise<TransitionExecutionResult[]>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| context | `TransitionChangeContext` | The transition change context |
| options | `{ timeout?: number; }` | Execution options (timeout) |

#### getAction

Look up a registered action function by name. Returns `undefined` if the action has not been registered.

```typescript
getAction(name: string): FieldActionFunction | undefined
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | The action name |

#### registerAction

Register a global action function

```typescript
registerAction(name: string, fn: FieldActionFunction): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | The name of the action |
| fn | `FieldActionFunction` | The action function |

#### registerDoctypeActions

Register actions from a doctype - both regular actions and field triggers Separates XState transitions (uppercase) from field triggers (lowercase)

```typescript
registerDoctypeActions(doctype: string, actions: ImmutableMap<string, string[]> | Map<string, string[]> | Record<string, string[]> | undefined): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | The doctype name |
| actions | `ImmutableMap<string, string[]> \| Map<string, string[]> \| Record<string, string[]> \| undefined` | The actions to register (supports Immutable Map, Map, or plain object) |

#### registerTransitionAction

Register a global XState transition action function

```typescript
registerTransitionAction(name: string, fn: TransitionActionFunction): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` | The name of the transition action |
| fn | `TransitionActionFunction` | The transition action function |

#### setFieldRollback

Configure rollback behavior for a specific field trigger

```typescript
setFieldRollback(doctype: string, fieldname: string, enableRollback: boolean): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | The doctype name |
| fieldname | `string` | The field name |
| enableRollback | `boolean` | Whether to enable rollback |

### HST

Global HST Manager (Singleton) Manages hierarchical state trees and provides access to the global registry.

**Methods:**

#### getDoctypeMeta

Helper method to get doctype metadata from the registry

```typescript
getDoctypeMeta(doctype: string): any
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | The name of the doctype to retrieve metadata for |

#### getInstance

Gets the singleton instance of HST

```typescript
getInstance(): HST
```

#### getRegistry

Gets the global registry instance

```typescript
getRegistry(): any
```

### Registry

Stonecrop Registry class

**Constructor:**

```typescript
new Registry(router: Router, getMeta: (routeContext: RouteContext) => Doctype | Promise<Doctype>)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| router | `Router` | Optional Vue router instance for route management |
| getMeta | `(routeContext: RouteContext) => Doctype \| Promise<Doctype>` | Optional function to fetch doctype metadata from an API |

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| _root | `Registry` | The root Registry instance |
| getMeta | `(routeContext: RouteContext) => Doctype \| Promise<Doctype>` | The getMeta function fetches doctype metadata from an API based on route context |
| name | `string` | The name of the Registry instance |
| registry | `Record<string, Doctype>` | The registry property contains a collection of doctypes |
| router | `Router` | The Vue router instance |

**Methods:**

#### addDoctype

Get doctype metadata

```typescript
addDoctype(doctype: Doctype): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `Doctype` | The doctype to fetch metadata for |

#### getAncestorLinks

Get links on other doctypes that target the given doctype.

```typescript
getAncestorLinks(doctypeSlug: string): Array<LinkDeclaration & {
        fieldname: string;
        doctype: string;
    }>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctypeSlug | `string` | The doctype slug to find ancestor links for |

#### getDescendantLinks

Get all links declared on a doctype.

```typescript
getDescendantLinks(doctypeSlug: string): Array<LinkDeclaration & {
        fieldname: string;
    }>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctypeSlug | `string` | The doctype slug to get links for |

#### getDoctype

Get a registered doctype by slug

```typescript
getDoctype(slug: string): Doctype | undefined
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| slug | `string` | The doctype slug to look up |

#### initializeRecord

Initialize a new record with default values based on a resolved schema. Narrows by `kind` discriminator for precise branch selection.

- `kind: 'table'` or `kind: 'link'` → `[]` or `{}` - `kind: 'fieldset'` → recursively initializes children as `{}` - `kind: 'field'` → derives the default from the component's category; falls back to `null`

```typescript
initializeRecord(schema: ResolvedField[]): Record<string, any>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| schema | `ResolvedField[]` | The resolved schema array to derive defaults from |

#### resolveSchema

Resolve a Doctype's authoring schema into a rendered schema array suitable for AForm.

Transforms `DoctypeField[]` (authoring space) → `ResolvedField[]` (rendering space): - `kind: 'field'` (not Link) → `ResolvedScalar` - `kind: 'field'` (Link, no declaration) → `ResolvedScalar` with `component: 'AFormLink'` - `kind: 'field'` (Link, `noneOrMany`/`atLeastOne`) → `ResolvedTable` - `kind: 'field'` (Link, `one`/`atMostOne`) → `ResolvedLink` - `kind: 'fieldset'` → `ResolvedFieldset` (children resolved recursively) - `kind: 'table'` → `ResolvedTable` (columns as `ColumnSchema[]`)

Circular references are protected against via the `visited` set.

```typescript
resolveSchema(doctype: Doctype, visited: Set<string>): ResolvedField[]
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `Doctype` | The doctype to resolve |
| visited | `Set<string>` | Internal — set of already-visited doctype slugs for cycle detection |

### SchemaValidator

Schema validator class

**Constructor:**

```typescript
new SchemaValidator(options: ValidatorOptions)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `ValidatorOptions` | Validator configuration options |

**Methods:**

#### validate

Validates a complete doctype schema

```typescript
validate(doctype: string, schema: List<DoctypeField> | DoctypeField[] | undefined, workflow: AnyStateNodeConfig, actions: ImmutableMap<string, string[]> | Map<string, string[]>, links: Record<string, LinkDeclaration>): ValidationResult
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | Doctype name |
| schema | `List<DoctypeField> \| DoctypeField[] \| undefined` | Schema fields (List or Array) |
| workflow | `AnyStateNodeConfig` | Optional workflow configuration |
| actions | `ImmutableMap<string, string[]> \| Map<string, string[]>` | Optional actions map |
| links | `Record<string, LinkDeclaration>` | Optional links object |

### Stonecrop

Main Stonecrop class with HST integration and built-in Operation Log

**Constructor:**

```typescript
new Stonecrop(registry: Registry, operationLogConfig: Partial<OperationLogConfig>, options: StonecropOptions)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| registry | `Registry` | The Registry instance containing doctype definitions |
| operationLogConfig | `Partial<OperationLogConfig>` | Optional configuration for the operation log |
| options | `StonecropOptions` | Options including the data client (can be set later via setClient) |

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| registry | `Registry` | The registry instance containing all doctype definitions |

**Methods:**

#### addRecord

Add a record to the store

```typescript
addRecord(doctype: string | Doctype, recordId: string, recordData: any): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| Doctype` | The doctype |
| recordId | `string` | The record ID |
| recordData | `any` | The record data |

#### clearRecords

Clear all records for a doctype

```typescript
clearRecords(doctype: string | Doctype): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| Doctype` | The doctype |

#### collectRecordPayload

Collect a record payload with all nested doctype fields from HST

```typescript
collectRecordPayload(doctype: Doctype, recordId: string): Record<string, any>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `Doctype` | The doctype metadata |
| recordId | `string` | The record ID to collect |

#### dispatchAction

Dispatch an action to the server via the configured data client, and file the record it returns into HST under the identity the *server* settled on.

The write is the point. For a created record the settled identity is never the one that was dispatched, so a caller that stores the result under the id it sent files the record under a key nothing can fetch and leaves the next save creating a second one. Every host that hand-rolled this got it wrong the same way, so it stops being the caller's job — this is the write-side twin of `getRecords`, which keys reads by the same rule.

Two things are deliberately NOT done here, because both need the id that was dispatched and that lives inside `args` — an opaque array whose shape is a convention between a host's client and its server handlers, not something this layer may parse. Dropping the stale key and moving the route therefore stay with `useClientAction`, which knows both ids.

A result that states no identity of its own — a `{ state: 'APPROVED' }` outcome — is left alone rather than guessed at, for the same reason `settledRecordId` is strict: a partial record must not be able to look like a rename.

```typescript
dispatchAction(doctype: Doctype, action: string, args: unknown[]): Promise<{
        success: boolean;
        data: unknown;
        error: string | null;
    }>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `Doctype` | The doctype |
| action | `string` | Action name to execute (e.g., 'SUBMIT', 'APPROVE', 'save') |
| args | `unknown[]` | Action arguments (typically record ID and/or form data) |

#### fetchNestedData

Fetch a record and its nested data from the server.

Calls `_client.getRecord()` with nested sub-selections and stores each scalar field at its own HST path (`slug.recordId.fieldname`), descendants at the link-level path (`slug.recordId.linkname`).

```typescript
fetchNestedData(path: string, doctype: Doctype, recordId: string, options: {
        includeNested?: boolean | string[];
    }): Promise<void>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| path | `string` | HST path (e.g., "recipe.r1") |
| doctype | `Doctype` | The doctype to fetch |
| recordId | `string` | Record ID to fetch |
| options | `{ includeNested?: boolean \| string[]; }` | Query options (includeNested to control which links are fetched) |

#### getClient

Get the current data client

```typescript
getClient(): DataClient | undefined
```

#### getMeta

Get doctype metadata from the registry

```typescript
getMeta(context: RouteContext): Promise<any>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| context | `RouteContext` | The route context |

#### getPageInfo

What the last `getRecords` for this doctype returned about the wider set.

Answers the question HST cannot: HST holds what was fetched, so counting its keys reports how much has been seen, never how much exists. Reactive, so a view reading it re-renders when a fetch lands.

```typescript
getPageInfo(doctype: string | Doctype): PageInfo | undefined
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| Doctype` | The doctype slug string or Doctype object |

#### getRecord

Fetch a single record from the server and store it in HST.

This is the one read path for a record, and it owns the whole job: deciding whether a fetch is warranted, performing it, and writing the result back under the doctype's declared identity. Callers ask for a record and get one; they do not re-derive when to ask.

Two cases return without touching the network, because in both the answer is already known: a draft does not exist on the server yet, and a record already in HST has been read. Refetching the latter would also discard unsaved edits sitting in the store.

```typescript
getRecord(doctype: string | Doctype, recordId: string, options: GetRecordOptions): Promise<void>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| Doctype` | The doctype slug string or Doctype object |
| recordId | `string` | The record ID |
| options | `GetRecordOptions` | Query options (includeNested, maxDepth), forwarded to the client |

#### getRecordById

Get a specific record

```typescript
getRecordById(doctype: string | Doctype, recordId: string): HSTNode | undefined
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| Doctype` | The doctype |
| recordId | `string` | The record ID |

#### getRecordIds

Get all record IDs for a doctype

```typescript
getRecordIds(doctype: string | Doctype): string[]
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| Doctype` | The doctype |

#### getRecords

Fetch a doctype's records from the server and store them in HST.

This is the one read path for a list. Every caller shares its keying rule, so a row is always stored under the identity its Edit link will later ask for.

Deliberately unguarded, unlike `getRecord`: a list is a view of data that changes, so revisiting one must re-read it rather than serve whatever HST happens to hold.

`options` is forwarded to the client untouched — no row limit is invented here, because nothing on this side of the wire knows what is safe for an arbitrary backend. A caller that passes none gets whatever the server considers a reasonable page.

`options.offset === 0` (or omitted) replaces the doctype's HST records; `offset > 0` appends.

```typescript
getRecords(doctype: Doctype, options: GetRecordsOptions): Promise<GetRecordsResult>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `Doctype` | The doctype |
| options | `GetRecordsOptions` | Query options (filters, orderBy, limit, offset), forwarded to the client |

#### getRecordState

Determine the current workflow state for a record.

Reads the record's `status` field from the HST store. If the field is absent or empty the doctype's declared `workflow.initial` state is used as the fallback, giving callers a reliable state name without having to duplicate that logic.

```typescript
getRecordState(doctype: string | Doctype, recordId: string): string
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| Doctype` | The doctype slug or Doctype instance |
| recordId | `string` | The record identifier |

#### getStore

Get the root HST store node for advanced usage

```typescript
getStore(): HSTNode
```

#### initializeNestedData

Scaffold empty descendant records from defaults for all descendant links.

Initializes all scalar and link fields at their HST paths with default values. For new records, call this after setting up the doctype to ensure all paths exist.

```typescript
initializeNestedData(path: string, doctype: Doctype): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| path | `string` | HST path (e.g., "customer.new") |
| doctype | `Doctype` | The doctype to initialize |

#### isWorkflowReady

Check if workflow actions are ready to run (all required link data is loaded). A link's data is considered loaded if it exists in HST at `slug.recordId.linkname`.

```typescript
isWorkflowReady(doctype: Doctype, recordId: string): {
        ready: boolean;
        blockedLinks?: string[];
    }
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `Doctype` | The doctype to check |
| recordId | `string` | The record ID |

#### records

Get records hash for a doctype

```typescript
records(doctype: string | Doctype): HSTNode
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| Doctype` | The doctype to get records for |

#### removeRecord

Remove a record from the store

```typescript
removeRecord(doctype: string | Doctype, recordId: string): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| Doctype` | The doctype |
| recordId | `string` | The record ID |

#### setClient

Set the data client for fetching doctype metadata and records. Use this for deferred configuration in Nuxt/Vue plugin setups.

```typescript
setClient(client: DataClient): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| client | `DataClient` | DataClient implementation (e.g., StonecropClient from stonecrop/graphql-client) |

#### setup

Setup method for doctype initialization

```typescript
setup(doctype: Doctype): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `Doctype` | The doctype to setup |

## Variables

### DRAFT_RECORD_ID

The record-id segment a draft route carries: `/{doctype}/new`.

Route only — never a store key, and never sent: an action dispatched for a draft omits the id rather than sending this.

**Type:**

```typescript
export const DRAFT_RECORD_ID: 
```

### plugin

Stonecrop Vue plugin

**Type:**

```typescript
export const plugin: Plugin
```

### useOperationLogStore

Global HST Operation Log Store Tracks all mutations with full metadata for undo/redo, sync, and audit

**Type:**

```typescript
export const useOperationLogStore: import("pinia").StoreDefinition<"hst-operation-log", Pick<{
    operations: import("vue").Ref<{
        id: string;
        type: import("..").HSTOperationType;
        path: string;
        fieldname: string;
        beforeValue: any;
        afterValue: any;
        doctype: string;
        recordId?: string | undefined;
        timestamp: Date;
        source?: OperationSource | undefined;
        reversible: boolean;
        irreversibleReason?: string | undefined;
        transition?: string | undefined;
        currentState?: string | undefined;
        targetState?: string | undefined;
        actionName?: string | undefined;
        actionRecordIds?: string[] | undefined;
        actionResult?: "success" | "failure" | "pending" | undefined;
        actionError?: string | undefined;
        userId?: string | undefined;
        metadata?: Record<string, any> | undefined;
        ancestorOperationId?: string | undefined;
        descendantOperationIds?: string[] | undefined;
    }[], HSTOperation[] | {
        id: string;
        type: import("..").HSTOperationType;
        path: string;
        fieldname: string;
        beforeValue: any;
        afterValue: any;
        doctype: string;
        recordId?: string | undefined;
        timestamp: Date;
        source?: OperationSource | undefined;
        reversible: boolean;
        irreversibleReason?: string | undefined;
        transition?: string | undefined;
        currentState?: string | undefined;
        targetState?: string | undefined;
        actionName?: string | undefined;
        actionRecordIds?: string[] | undefined;
        actionResult?: "success" | "failure" | "pending" | undefined;
        actionError?: string | undefined;
        userId?: string | undefined;
        metadata?: Record<string, any> | undefined;
        ancestorOperationId?: string | undefined;
        descendantOperationIds?: string[] | undefined;
    }[]>;
    currentIndex: import("vue").Ref<number, number>;
    config: import("vue").Ref<{
        maxOperations?: number | undefined;
        enableCrossTabSync?: boolean | undefined;
        enablePersistence?: boolean | undefined;
        persistenceKeyPrefix?: string | undefined;
        userId?: string | undefined;
        operationFilter?: ((operation: HSTOperation) => boolean) | undefined;
    }, OperationLogConfig | {
        maxOperations?: number | undefined;
        enableCrossTabSync?: boolean | undefined;
        enablePersistence?: boolean | undefined;
        persistenceKeyPrefix?: string | undefined;
        userId?: string | undefined;
        operationFilter?: ((operation: HSTOperation) => boolean) | undefined;
    }>;
    clientId: import("vue").Ref<string, string>;
    undoRedoState: import("vue").ComputedRef<UndoRedoState>;
    canUndo: import("vue").ComputedRef<boolean>;
    canRedo: import("vue").ComputedRef<boolean>;
    undoCount: import("vue").ComputedRef<number>;
    redoCount: import("vue").ComputedRef<number>;
    configure: (options: Partial<OperationLogConfig>) => void;
    addOperation: (operation: HSTOperationInput, source?: OperationSource) => string;
    startBatch: () => void;
    commitBatch: (description?: string) => string | null;
    cancelBatch: () => void;
    undo: (store: HSTNode) => boolean;
    redo: (store: HSTNode) => boolean;
    clear: () => void;
    getOperationsFor: (doctype: string, recordId?: string) => HSTOperation[];
    getSnapshot: () => OperationLogSnapshot;
    markIrreversible: (operationId: string, reason: string) => void;
    logAction: (doctype: string, actionName: string, recordIds?: string[], result?: "success" | "failure" | "pending", error?: string) => string;
}, "config" | "operations" | "clientId" | "currentIndex">, Pick<{
    operations: import("vue").Ref<{
        id: string;
        type: import("..").HSTOperationType;
        path: string;
        fieldname: string;
        beforeValue: any;
        afterValue: any;
        doctype: string;
        recordId?: string | undefined;
        timestamp: Date;
        source?: OperationSource | undefined;
        reversible: boolean;
        irreversibleReason?: string | undefined;
        transition?: string | undefined;
        currentState?: string | undefined;
        targetState?: string | undefined;
        actionName?: string | undefined;
        actionRecordIds?: string[] | undefined;
        actionResult?: "success" | "failure" | "pending" | undefined;
        actionError?: string | undefined;
        userId?: string | undefined;
        metadata?: Record<string, any> | undefined;
        ancestorOperationId?: string | undefined;
        descendantOperationIds?: string[] | undefined;
    }[], HSTOperation[] | {
        id: string;
        type: import("..").HSTOperationType;
        path: string;
        fieldname: string;
        beforeValue: any;
        afterValue: any;
        doctype: string;
        recordId?: string | undefined;
        timestamp: Date;
        source?: OperationSource | undefined;
        reversible: boolean;
        irreversibleReason?: string | undefined;
        transition?: string | undefined;
        currentState?: string | undefined;
        targetState?: string | undefined;
        actionName?: string | undefined;
        actionRecordIds?: string[] | undefined;
        actionResult?: "success" | "failure" | "pending" | undefined;
        actionError?: string | undefined;
        userId?: string | undefined;
        metadata?: Record<string, any> | undefined;
        ancestorOperationId?: string | undefined;
        descendantOperationIds?: string[] | undefined;
    }[]>;
    currentIndex: import("vue").Ref<number, number>;
    config: import("vue").Ref<{
        maxOperations?: number | undefined;
        enableCrossTabSync?: boolean | undefined;
        enablePersistence?: boolean | undefined;
        persistenceKeyPrefix?: string | undefined;
        userId?: string | undefined;
        operationFilter?: ((operation: HSTOperation) => boolean) | undefined;
    }, OperationLogConfig | {
        maxOperations?: number | undefined;
        enableCrossTabSync?: boolean | undefined;
        enablePersistence?: boolean | undefined;
        persistenceKeyPrefix?: string | undefined;
        userId?: string | undefined;
        operationFilter?: ((operation: HSTOperation) => boolean) | undefined;
    }>;
    clientId: import("vue").Ref<string, string>;
    undoRedoState: import("vue").ComputedRef<UndoRedoState>;
    canUndo: import("vue").ComputedRef<boolean>;
    canRedo: import("vue").ComputedRef<boolean>;
    undoCount: import("vue").ComputedRef<number>;
    redoCount: import("vue").ComputedRef<number>;
    configure: (options: Partial<OperationLogConfig>) => void;
    addOperation: (operation: HSTOperationInput, source?: OperationSource) => string;
    startBatch: () => void;
    commitBatch: (description?: string) => string | null;
    cancelBatch: () => void;
    undo: (store: HSTNode) => boolean;
    redo: (store: HSTNode) => boolean;
    clear: () => void;
    getOperationsFor: (doctype: string, recordId?: string) => HSTOperation[];
    getSnapshot: () => OperationLogSnapshot;
    markIrreversible: (operationId: string, reason: string) => void;
    logAction: (doctype: string, actionName: string, recordIds?: string[], result?: "success" | "failure" | "pending", error?: string) => string;
}, "undoRedoState" | "canUndo" | "canRedo" | "undoCount" | "redoCount">, Pick<{
    operations: import("vue").Ref<{
        id: string;
        type: import("..").HSTOperationType;
        path: string;
        fieldname: string;
        beforeValue: any;
        afterValue: any;
        doctype: string;
        recordId?: string | undefined;
        timestamp: Date;
        source?: OperationSource | undefined;
        reversible: boolean;
        irreversibleReason?: string | undefined;
        transition?: string | undefined;
        currentState?: string | undefined;
        targetState?: string | undefined;
        actionName?: string | undefined;
        actionRecordIds?: string[] | undefined;
        actionResult?: "success" | "failure" | "pending" | undefined;
        actionError?: string | undefined;
        userId?: string | undefined;
        metadata?: Record<string, any> | undefined;
        ancestorOperationId?: string | undefined;
        descendantOperationIds?: string[] | undefined;
    }[], HSTOperation[] | {
        id: string;
        type: import("..").HSTOperationType;
        path: string;
        fieldname: string;
        beforeValue: any;
        afterValue: any;
        doctype: string;
        recordId?: string | undefined;
        timestamp: Date;
        source?: OperationSource | undefined;
        reversible: boolean;
        irreversibleReason?: string | undefined;
        transition?: string | undefined;
        currentState?: string | undefined;
        targetState?: string | undefined;
        actionName?: string | undefined;
        actionRecordIds?: string[] | undefined;
        actionResult?: "success" | "failure" | "pending" | undefined;
        actionError?: string | undefined;
        userId?: string | undefined;
        metadata?: Record<string, any> | undefined;
        ancestorOperationId?: string | undefined;
        descendantOperationIds?: string[] | undefined;
    }[]>;
    currentIndex: import("vue").Ref<number, number>;
    config: import("vue").Ref<{
        maxOperations?: number | undefined;
        enableCrossTabSync?: boolean | undefined;
        enablePersistence?: boolean | undefined;
        persistenceKeyPrefix?: string | undefined;
        userId?: string | undefined;
        operationFilter?: ((operation: HSTOperation) => boolean) | undefined;
    }, OperationLogConfig | {
        maxOperations?: number | undefined;
        enableCrossTabSync?: boolean | undefined;
        enablePersistence?: boolean | undefined;
        persistenceKeyPrefix?: string | undefined;
        userId?: string | undefined;
        operationFilter?: ((operation: HSTOperation) => boolean) | undefined;
    }>;
    clientId: import("vue").Ref<string, string>;
    undoRedoState: import("vue").ComputedRef<UndoRedoState>;
    canUndo: import("vue").ComputedRef<boolean>;
    canRedo: import("vue").ComputedRef<boolean>;
    undoCount: import("vue").ComputedRef<number>;
    redoCount: import("vue").ComputedRef<number>;
    configure: (options: Partial<OperationLogConfig>) => void;
    addOperation: (operation: HSTOperationInput, source?: OperationSource) => string;
    startBatch: () => void;
    commitBatch: (description?: string) => string | null;
    cancelBatch: () => void;
    undo: (store: HSTNode) => boolean;
    redo: (store: HSTNode) => boolean;
    clear: () => void;
    getOperationsFor: (doctype: string, recordId?: string) => HSTOperation[];
    getSnapshot: () => OperationLogSnapshot;
    markIrreversible: (operationId: string, reason: string) => void;
    logAction: (doctype: string, actionName: string, recordIds?: string[], result?: "success" | "failure" | "pending", error?: string) => string;
}, "clear" | "undo" | "redo" | "configure" | "addOperation" | "startBatch" | "commitBatch" | "cancelBatch" | "getOperationsFor" | "getSnapshot" | "markIrreversible" | "logAction">>
```

### useValidationStore

Reactive per-field validation error store + the advisory field-validation trigger engine.

Holds the errors produced by field-validation triggers (see `TriggerDefinition` in `@stonecrop/schema`) and runs a trigger's `clientHandler` on demand. Errors are **namespaced by trigger**: re-running a trigger clears its own prior contributions before repopulating, so a corrected value clears its stale error without disturbing other triggers.

The engine is **advisory** and does **no rollback** — an invalid value stays in the record so the user can fix it; validity is reported separately via `isValid` (read by the save gate) and the per-field messages are surfaced via `errorsByField` / `errorsFor` for display.

**Type:**

```typescript
export const useValidationStore: import("pinia").StoreDefinition<"stonecrop-validation", Pick<{
    errors: import("vue").Ref<{
        trigger: string;
        field: string;
        message: string;
    }[], ValidationError[] | {
        trigger: string;
        field: string;
        message: string;
    }[]>;
    isValid: import("vue").ComputedRef<boolean>;
    errorsByField: import("vue").ComputedRef<Record<string, string[]>>;
    errorsFor: (field: string) => string[];
    setError: (trigger: string, field: string, message: string) => void;
    clearTrigger: (trigger: string) => void;
    clearAll: () => void;
    validateField: (triggers: Record<string, TriggerDefinition>, changedField: string, record: Record<string, unknown>) => Promise<void>;
    validateRecord: (triggers: Record<string, TriggerDefinition>, record: Record<string, unknown>) => Promise<void>;
}, "errors">, Pick<{
    errors: import("vue").Ref<{
        trigger: string;
        field: string;
        message: string;
    }[], ValidationError[] | {
        trigger: string;
        field: string;
        message: string;
    }[]>;
    isValid: import("vue").ComputedRef<boolean>;
    errorsByField: import("vue").ComputedRef<Record<string, string[]>>;
    errorsFor: (field: string) => string[];
    setError: (trigger: string, field: string, message: string) => void;
    clearTrigger: (trigger: string) => void;
    clearAll: () => void;
    validateField: (triggers: Record<string, TriggerDefinition>, changedField: string, record: Record<string, unknown>) => Promise<void>;
    validateRecord: (triggers: Record<string, TriggerDefinition>, record: Record<string, unknown>) => Promise<void>;
}, "isValid" | "errorsByField">, Pick<{
    errors: import("vue").Ref<{
        trigger: string;
        field: string;
        message: string;
    }[], ValidationError[] | {
        trigger: string;
        field: string;
        message: string;
    }[]>;
    isValid: import("vue").ComputedRef<boolean>;
    errorsByField: import("vue").ComputedRef<Record<string, string[]>>;
    errorsFor: (field: string) => string[];
    setError: (trigger: string, field: string, message: string) => void;
    clearTrigger: (trigger: string) => void;
    clearAll: () => void;
    validateField: (triggers: Record<string, TriggerDefinition>, changedField: string, record: Record<string, unknown>) => Promise<void>;
    validateRecord: (triggers: Record<string, TriggerDefinition>, record: Record<string, unknown>) => Promise<void>;
}, "errorsFor" | "setError" | "clearTrigger" | "clearAll" | "validateField" | "validateRecord">>
```

## Enums

### ValidationSeverity

Validation severity levels

**Members:**

```typescript
export enum ValidationSeverity {
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
}
```

