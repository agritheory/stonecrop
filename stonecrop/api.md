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

### getStonecrop

Returns the global Stonecrop singleton instance, or `undefined` if no instance has been created yet.

Use this when you need the Stonecrop instance outside a Vue component context (e.g., in workflow action handlers, plugin setup code, or non-component utilities). Inside a component, prefer `useStonecrop()`.

**Signature:**

```typescript
export declare function getStonecrop(): Stonecrop | undefined;
```

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
        parentOperationId?: string | undefined;
        childOperationIds?: string[] | undefined;
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
        parentOperationId?: string | undefined;
        childOperationIds?: string[] | undefined;
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

Unified Stonecrop composable - handles both general operations and HST reactive integration

**Signature:**

```typescript
export declare function useStonecrop(): BaseStonecropReturn | HSTStonecropReturn;
```

### useStonecrop

Unified Stonecrop composable with HST integration for a specific doctype and record.

When a `Doctype` instance is passed, all synchronous initialisation (`hstStore`, `resolvedSchema`, `formData`, `handleHSTChange`, operation-log wiring) is performed during `setup()` — before the first render and without awaiting any lifecycle hook. Callers can read `hstStore.value`, `resolvedSchema.value`, and `formData.value` immediately after calling this composable; no `nextTick`, `flushPromises`, or `setTimeout` is required.

The only remaining async work in `onMounted` is fetching an existing record from the server when `recordId` is not `'new'`, and lazy-loading a doctype by slug string.

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
export declare function validateSchema(doctype: string, schema: List<SchemaTypes> | SchemaTypes[] | undefined, registry: Registry, workflow?: AnyStateNodeConfig, actions?: ImmutableMap<string, string[]> | Map<string, string[]>): ValidationResult;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | Doctype name |
| schema | `List<SchemaTypes> \| SchemaTypes[] \| undefined` | Schema fields |
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

### HSTNode

Core HST Interface - enhanced with tree navigation Provides a hierarchical state tree interface for navigating and manipulating nested data structures.

**Definition:**

```typescript
export interface HSTNode {
  get(path: string): any;
  getBreadcrumbs(): string[];
  getDepth(): number;
  getNode(path: string): HSTNode;
  getParent(): HSTNode | null;
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
  beforeValue: any;
  childOperationIds?: string[];
  currentState?: string;
  doctype: string;
  fieldname: string;
  id: string;
  irreversibleReason?: string;
  metadata?: Record<string, any>;
  parentOperationId?: string;
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
| beforeValue | `any` | Value before the operation |
| childOperationIds? | `string[]` | Child operation IDs for batch operations |
| currentState? | `string` | XState current state before transition |
| doctype | `string` | Doctype this operation affects |
| fieldname | `string` | Field name extracted from path |
| id | `string` | Unique operation identifier |
| irreversibleReason? | `string` | Reason if operation is irreversible |
| metadata? | `Record<string, any>` | Additional metadata for custom use cases |
| parentOperationId? | `string` | Parent operation ID for batch operations |
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
  autoSyncInterval?: number;
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
| autoSyncInterval? | `number` | Auto-sync interval in milliseconds (default: 30000) |
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

### BaseStonecropReturn

Base Stonecrop composable return type - includes operation log functionality

**Definition:**

```typescript
export type BaseStonecropReturn = {
    stonecrop: Ref<Stonecrop | undefined>;
    operationLog: OperationLogAPI;
};
```

### CrossTabMessageType

Cross-tab message types

**Definition:**

```typescript
export type CrossTabMessageType = 'operation' | 'undo' | 'redo' | 'sync-request' | 'sync-response';
```

### DoctypeConfig

Plain object representation of doctype configuration for serialization/API responses. Compatible with the DoctypeMeta type from stonecrop/schema.

**Definition:**

```typescript
export type DoctypeConfig = {
    name: string;
    slug?: string;
    tableName?: string;
    fields?: SchemaTypes[];
    links?: Record<string, LinkDeclaration>;
    workflow?: UnknownMachineConfig | WorkflowMeta;
    actions?: Record<string, string[]>;
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
    resolvedSchema: Ref<SchemaTypes[]>;
    initializeNestedData: (path: string, doctype: Doctype, options?: {
        includeNested?: boolean | string[];
    }) => void;
    fetchNestedData: (path: string, doctype: Doctype, recordId: string, options?: {
        includeNested?: boolean | string[];
    }) => Promise<void>;
    collectRecordPayload: (doctype: Doctype, recordId: string) => Record<string, any>;
    createNestedContext: (basePath: string, childDoctype: Doctype) => {
        provideHSTPath: (fieldname: string) => string;
        handleHSTChange: (changeData: HSTChangeData) => void;
    };
    isLoading: Ref<boolean>;
    error: Ref<Error | null>;
    resolvedDoctype: Ref<Doctype | undefined>;
};
```

### ImmutableDoctype

Immutable Doctype type for Stonecrop instances

**Definition:**

```typescript
export type ImmutableDoctype = {
    readonly schema?: List<SchemaTypes>;
    readonly workflow?: UnknownMachineConfig | AnyStateNodeConfig | WorkflowMeta;
    readonly actions?: Map<string, string[]>;
    readonly links?: Record<string, LinkDeclaration>;
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

### MutableDoctype

Mutable Doctype type for Stonecrop instances

**Definition:**

```typescript
export type MutableDoctype = {
    doctype?: string;
    schema?: SchemaTypes[];
    workflow?: UnknownMachineConfig | AnyStateNodeConfig | WorkflowMeta;
    actions?: Record<string, string[]>;
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

### Schema

Schema type for Stonecrop instances

**Definition:**

```typescript
export type Schema = {
    doctype: string;
    schema: List<SchemaTypes>;
};
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
new Doctype(doctype: string, schema: ImmutableDoctype['schema'], workflow: ImmutableDoctype['workflow'], actions: ImmutableDoctype['actions'], component: Component, links: Record<string, LinkDeclaration>)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | The doctype name |
| schema | `ImmutableDoctype['schema']` | The doctype schema definition |
| workflow | `ImmutableDoctype['workflow']` | The doctype workflow configuration (XState machine) |
| actions | `ImmutableDoctype['actions']` | The doctype actions and field triggers |
| component | `Component` | Optional Vue component for rendering the doctype |
| links | `Record<string, LinkDeclaration>` | Optional relationship links to other doctypes |

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| actions | `ImmutableDoctype['actions']` | The doctype actions and field triggers |
| component | `Component` | The doctype component |
| doctype | `string` | The doctype name |
| links | `Record<string, LinkDeclaration>` | Relationship links to other doctypes |
| name | `string` | Alias for doctype (for DoctypeLike interface compatibility) |
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
        handler: string;
        requiredFields?: string[];
        allowedStates?: string[];
        confirm?: boolean;
        args?: Record<string, unknown>;
    } | undefined
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| actionName | `string` | The action name to get metadata for |

#### getActionsObject

Returns the actions as a plain object for use with components that expect plain JavaScript objects.

```typescript
getActionsObject(): Record<string, string[]>
```

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

#### getSchemaArray

Returns the schema as a plain array for use with components that expect plain JavaScript arrays (e.g., AForm, ATable).

```typescript
getSchemaArray(): SchemaTypes[]
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

Initialize a new record with default values based on a schema.

```typescript
initializeRecord(schema: SchemaTypes[]): Record<string, any>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| schema | `SchemaTypes[]` | The schema array to derive defaults from |

#### resolveSchema

Resolve nested Doctype fields in a schema by embedding child schemas inline.

Accepts a Doctype and extracts `fields` and `links` internally. Fields array contains both scalar fields and link fields (with fieldtype: 'Link'). Render order is determined by the order of fields in the fields array.

For each link field: - Looks up the corresponding link declaration in `links` by fieldname - `cardinality: 'noneOrMany'` or `'atLeastOne'`: auto-derives `columns` from the target's schema, sets `component` to `link.component ?? 'ATable'`, `config: { view: 'list' }`, `rows: []`. - `cardinality: 'one'` or `'atMostOne'`: embeds the target schema as the entry's `schema` property, sets `component` to `link.component ?? 'AForm'`.

Recurses for deeply nested doctypes. Circular references are protected against. Returns a new array — does not mutate the original.

```typescript
resolveSchema(doctype: Doctype, visited: Set<string>): SchemaTypes[]
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
validate(doctype: string, schema: List<SchemaTypes> | SchemaTypes[] | undefined, workflow: AnyStateNodeConfig, actions: ImmutableMap<string, string[]> | Map<string, string[]>, links: Record<string, LinkDeclaration>): ValidationResult
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | Doctype name |
| schema | `List<SchemaTypes> \| SchemaTypes[] \| undefined` | Schema fields (List or Array) |
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

Dispatch an action to the server via the configured data client. All state changes flow through this single mutation endpoint.

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

Calls `_client.getRecord()` with nested sub-selections and stores each scalar field at its own HST path (`slug.recordId.fieldname`), children at the link-level path (`slug.recordId.linkname`).

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

#### getRecord

Get single record from server using the configured data client.

```typescript
getRecord(doctype: Doctype, recordId: string): Promise<void>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `Doctype` | The doctype |
| recordId | `string` | The record ID |

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

Get records from server using the configured data client.

```typescript
getRecords(doctype: Doctype): Promise<void>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `Doctype` | The doctype |

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

Scaffold empty child records from defaults for all descendant links.

Used when opening a new form — no server data, just scaffolded empty rows. Does not require a data client.

```typescript
initializeNestedData(path: string, doctype: Doctype, _options: {
        includeNested?: boolean | string[];
    }): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| path | `string` | HST path where the initialized data should be stored |
| doctype | `Doctype` | The doctype to initialize |
| _options | `{ includeNested?: boolean \| string[]; }` |  |

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

#### runAction

Run action on doctype Executes the action and logs it to the operation log for audit tracking

```typescript
runAction(doctype: Doctype, action: string, args: string[]): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `Doctype` | The doctype |
| action | `string` | The action to run |
| args | `string[]` | Action arguments (typically record IDs) |

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
        parentOperationId?: string | undefined;
        childOperationIds?: string[] | undefined;
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
        parentOperationId?: string | undefined;
        childOperationIds?: string[] | undefined;
    }[]>;
    currentIndex: import("vue").Ref<number, number>;
    config: import("vue").Ref<{
        maxOperations?: number | undefined;
        enableCrossTabSync?: boolean | undefined;
        autoSyncInterval?: number | undefined;
        enablePersistence?: boolean | undefined;
        persistenceKeyPrefix?: string | undefined;
        userId?: string | undefined;
        operationFilter?: ((operation: HSTOperation) => boolean) | undefined;
    }, OperationLogConfig | {
        maxOperations?: number | undefined;
        enableCrossTabSync?: boolean | undefined;
        autoSyncInterval?: number | undefined;
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
}, "operations" | "currentIndex" | "config" | "clientId">, Pick<{
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
        parentOperationId?: string | undefined;
        childOperationIds?: string[] | undefined;
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
        parentOperationId?: string | undefined;
        childOperationIds?: string[] | undefined;
    }[]>;
    currentIndex: import("vue").Ref<number, number>;
    config: import("vue").Ref<{
        maxOperations?: number | undefined;
        enableCrossTabSync?: boolean | undefined;
        autoSyncInterval?: number | undefined;
        enablePersistence?: boolean | undefined;
        persistenceKeyPrefix?: string | undefined;
        userId?: string | undefined;
        operationFilter?: ((operation: HSTOperation) => boolean) | undefined;
    }, OperationLogConfig | {
        maxOperations?: number | undefined;
        enableCrossTabSync?: boolean | undefined;
        autoSyncInterval?: number | undefined;
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
        parentOperationId?: string | undefined;
        childOperationIds?: string[] | undefined;
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
        parentOperationId?: string | undefined;
        childOperationIds?: string[] | undefined;
    }[]>;
    currentIndex: import("vue").Ref<number, number>;
    config: import("vue").Ref<{
        maxOperations?: number | undefined;
        enableCrossTabSync?: boolean | undefined;
        autoSyncInterval?: number | undefined;
        enablePersistence?: boolean | undefined;
        persistenceKeyPrefix?: string | undefined;
        userId?: string | undefined;
        operationFilter?: ((operation: HSTOperation) => boolean) | undefined;
    }, OperationLogConfig | {
        maxOperations?: number | undefined;
        enableCrossTabSync?: boolean | undefined;
        autoSyncInterval?: number | undefined;
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
}, "undo" | "redo" | "configure" | "addOperation" | "startBatch" | "commitBatch" | "cancelBatch" | "clear" | "getOperationsFor" | "getSnapshot" | "markIrreversible" | "logAction">>
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

