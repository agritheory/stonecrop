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
declare function createHST(target: any, doctype: string, parentDoctype?: string): HSTNode;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| target | `any` | The target object to wrap with HST functionality |
| doctype | `string` | The document type identifier |
| parentDoctype | `string` | Optional parent document type identifier |

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

Unified Stonecrop composable with HST integration for a specific doctype and record

**Signature:**

```typescript
export declare function useStonecrop(options: {
    registry?: Registry;
    doctype: DoctypeMeta;
    recordId?: string;
}): HSTStonecropReturn;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `{ registry?: Registry; doctype: DoctypeMeta; recordId?: string; }` | Configuration with doctype and optional recordId |

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

### BaseTableConfig

Base table configuration properties shared across all view types.

**Definition:**

```typescript
export interface BaseTableConfig {
  fullWidth?: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| fullWidth? | `boolean` | Control whether the table should be allowed to use the full width of its container. |

### BasicTableConfig

Table configuration for basic view types (uncounted, list, list-expansion).

**Definition:**

```typescript
export interface BasicTableConfig {
  view?: 'uncounted' | 'list' | 'list-expansion';
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| view? | `'uncounted' \| 'list' \| 'list-expansion'` | The type of view to display the table in. |

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

### CellContext

Table cell context definition.

**Definition:**

```typescript
export interface CellContext {
  column: TableColumn;
  row: TableRow;
  table: {
        [key: string]: any;
    };
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| column | `TableColumn` | The column object for the current cell. |
| row | `TableRow` | The row object for the current cell. |
| table | `{ [key: string]: any; }` | The table object for the current cell. |

### ConnectionHandle

Connection handle information for gantt bar connections.

**Definition:**

```typescript
export interface ConnectionHandle {
  barId: string;
  colIndex: number;
  id: string;
  position: {
        x: ShallowRef<number>;
        y: ShallowRef<number>;
    };
  rowIndex: number;
  side: 'left' | 'right';
  visible: Ref<boolean>;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| barId | `string` | Reference to the gantt bar this handle belongs to. |
| colIndex | `number` | The column index of the gantt bar this handle belongs to. |
| id | `string` | Unique identifier for the connection handle. |
| position | `{ x: ShallowRef<number>; y: ShallowRef<number>; }` | The position of the connection handle. |
| rowIndex | `number` | The row index of the gantt bar this handle belongs to. |
| side | `'left' \| 'right'` | The side of the gantt bar where this handle is located. |
| visible | `Ref<boolean>` | Whether the handle is currently visible (on hover). |

### ConnectionPath

Connection path between two gantt bars.

**Definition:**

```typescript
export interface ConnectionPath {
  from: {
        barId: string;
        side: 'left' | 'right';
    };
  id: string;
  label?: string;
  style?: {
        color?: string;
        width?: number;
    };
  to: {
        barId: string;
        side: 'left' | 'right';
    };
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| from | `{ barId: string; side: 'left' \| 'right'; }` | The source connection handle. |
| id | `string` | Unique identifier for the connection path. |
| label? | `string` | Optional label for the connection. |
| style? | `{ color?: string; width?: number; }` | Optional styling for the connection path. |
| to | `{ barId: string; side: 'left' \| 'right'; }` | The target connection handle. |

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

### GanttBarInfo

Gantt bar information for VueFlow integration.

**Definition:**

```typescript
export interface GanttBarInfo {
  colIndex: number;
  color: Ref<string>;
  endIndex: Ref<number>;
  id: string;
  label?: string;
  position: {
        x: ShallowRef<number>;
        y: ShallowRef<number>;
    };
  rowIndex: number;
  startIndex: Ref<number>;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| colIndex | `number` | The primary column index of the gantt bar (typically the start index). |
| color | `Ref<string>` | Color of the gantt bar. |
| endIndex | `Ref<number>` | Ending column index of the gantt bar. |
| id | `string` | Unique identifier for the gantt bar. |
| label? | `string` | Display label for the gantt bar. |
| position | `{ x: ShallowRef<number>; y: ShallowRef<number>; }` | The position of the gantt bar in the ATable component. |
| rowIndex | `number` | The row index of the gantt bar. |
| startIndex | `Ref<number>` | Starting column index of the gantt bar. |

### GanttOptions

Gantt chart options for table rows.

**Definition:**

```typescript
export interface GanttOptions {
  color?: string;
  colspan?: number;
  endIndex?: number;
  startIndex?: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| color? | `string` | The color to be applied to the row's gantt bar. |
| colspan? | `number` | The length of the gantt bar in columns. Useful when only the start index is provided. If colspan and endIndex are not provided, the bar will stretch to the end of the table. |
| endIndex? | `number` | The ending column index for the gantt bar. If endIndex and colspan are not provided, the bar will stretch to the end of the table. |
| startIndex? | `number` | The starting column index for the gantt bar. |

### GanttTableConfig

Table configuration for gantt view types.

**Definition:**

```typescript
export interface GanttTableConfig {
  dependencyGraph?: boolean;
  view: 'gantt';
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| dependencyGraph? | `boolean` | Control whether dependency graph connections should be enabled for Gantt views. When false, connection handles and dependency lines will be hidden. |
| view | `'gantt'` | The type of view to display the table in. |

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

### TableColumn

Table column definition.

**Definition:**

```typescript
export interface TableColumn {
  align?: CanvasTextAlign;
  cellComponent?: string;
  cellComponentProps?: Record<string, any>;
  colspan?: number;
  edit?: boolean;
  fieldtype?: string;
  filterable?: boolean;
  filterComponent?: string;
  filterOptions?: any[];
  filterType?: 'text' | 'select' | 'number' | 'date' | 'dateRange' | 'checkbox' | 'component';
  format?: string | ((value: any, context: CellContext) => string);
  ganttComponent?: string;
  isGantt?: boolean;
  label?: string;
  mask?: (value: any) => any;
  modalComponent?: string | ((context: CellContext) => string);
  modalComponentExtraProps?: Record<string, any>;
  name: string;
  originalIndex?: number;
  pinned?: boolean;
  resizable?: boolean;
  sortable?: boolean;
  width?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| align? | `CanvasTextAlign` | `left` (left aligned), `center` (center aligned), `right` (right aligned), `start` (aligned to the start of the column), `end` (aligned to the end of the column) |
| cellComponent? | `string` | The component to use to render the cell for the column. If not provided, the table will render the default `<td>` element. |
| cellComponentProps? | `Record<string, any>` | Additional properties to pass to the table's cell component. Only applicable if the `cellComponent` property is set for the column. |
| colspan? | `number` | The colspan of the Gantt bar for the column. This determines how many columns the Gantt bar should span across. Only applicable for Gantt tables. |
| edit? | `boolean` | Control whether cells for the column is editable. |
| fieldtype? | `string` | The semantic field type of the column. Uses the same StonecropFieldType enum as forms. Common values: 'Data', 'Text', 'Int', 'Float', 'Date', 'Select', 'Link', 'Check', etc. |
| filterable? | `boolean` | Control whether the column should be filterable and define filter configuration. |
| filterComponent? | `string` | Custom component for filtering. |
| filterOptions? | `any[]` | Options for select-type filters. |
| filterType? | `'text' \| 'select' \| 'number' \| 'date' \| 'dateRange' \| 'checkbox' \| 'component'` | The type of filter for the column. |
| format? | `string \| ((value: any, context: CellContext) => string)` | The format function to use to format the value of the cell. This can either be a normal or stringified function that takes the value and the cell context and returns a string. |
| ganttComponent? | `string` | The component to use to render the Gantt bar for the column. Only applicable for Gantt tables. |
| isGantt? | `boolean` | Whether the column is a Gantt column. Only applicable for Gantt tables. |
| label? | `string` | The label of the column. This is displayed in the table header. |
| mask? | `(value: any) => any` | The masking function to use to apply an input mask to the cell. This will accept an input value and return the masked value. |
| modalComponent? | `string \| ((context: CellContext) => string)` | `row` (the row object), `column` (the column object), `table` (the table object) The function should return the name of the component to use for the modal. `colIndex` (the column index of the current cell), `rowIndex` (the row index of the current cell), `store` (the table data store) |
| modalComponentExtraProps? | `Record<string, any>` | Additional properties to pass to the modal component. Only applicable if the `modalComponent` property is set for the column. |
| name | `string` | The key of the column. This is used to identify the column in the table. |
| originalIndex? | `number` | The original column index for the Gantt bar, excluding any pinned columns. This is evaluated automatically while rendering the table. Only applicable for Gantt tables. |
| pinned? | `boolean` | Control whether the column should be pinned to the table. |
| resizable? | `boolean` | Control whether the column can be resized by the user. |
| sortable? | `boolean` | Control whether the column should be sortable. |
| width? | `string` | The width of the column. This can be a number (in pixels) or a string (in CSS units). |

### TableDisplay

Table display definition.

**Definition:**

```typescript
export interface TableDisplay {
  childrenOpen?: boolean;
  expanded?: boolean;
  indent?: number;
  isParent?: boolean;
  isRoot?: boolean;
  open?: boolean;
  parent?: number;
  rowModified?: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| childrenOpen? | `boolean` | Indicates whether a row node's child nodes are open or closed. Only applicable for tree views. |
| expanded? | `boolean` | Indicates whether a row node is expanded or collapsed. Only applicable for list-expansion views. |
| indent? | `number` | The indentation level of the row node. Only applicable for tree and gantt views. |
| isParent? | `boolean` | Indicates whether a row node is a parent node. This is evaluated automatically while rendering the table. Only applicable for tree views. |
| isRoot? | `boolean` | Indicates whether a row node is a root node. This is evaluated automatically while rendering the table. Only applicable for tree views. |
| open? | `boolean` | Indicates whether a row node is visible. This is evaluated automatically while rendering the table. Only applicable for tree views. |
| parent? | `number` | The HTML parent element for the row node. This is evaluated automatically while rendering the table. Only applicable for tree and gantt views. |
| rowModified? | `boolean` | Indicates whether a row node has been modified. This is evaluated automatically when a cell is edited. |

### TableModal

Table modal definition.

**Definition:**

```typescript
export interface TableModal {
  bottom?: ReturnType<typeof useElementBounding>['bottom'];
  cell?: HTMLTableCellElement | null;
  colIndex?: number;
  component?: string;
  componentProps?: Record<string, any>;
  height?: ReturnType<typeof useElementBounding>['height'];
  left?: ReturnType<typeof useElementBounding>['left'];
  parent?: HTMLElement;
  rowIndex?: number;
  visible?: boolean;
  width?: ReturnType<typeof useElementBounding>['width'];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| bottom? | `ReturnType<typeof useElementBounding>['bottom']` | Reactive bottom value for the modal's bounding box. The field is unset when the modal is not being displayed. |
| cell? | `HTMLTableCellElement \| null` | The HTML cell element that the modal is currently being displayed for. The field is unset when the modal is not being displayed. |
| colIndex? | `number` | The index of the column that the modal is currently being displayed for. The field is unset when the modal is not being displayed. |
| component? | `string` | The component to use to render the modal. If not provided, the table will try to use the column's `modalComponent` property, if set. If that is not set, the table will not display a modal. |
| componentProps? | `Record<string, any>` | Additional properties to pass to the table's modal component. |
| height? | `ReturnType<typeof useElementBounding>['height']` | Reactive height value for the modal's bounding box. The field is unset when the modal is not being displayed. |
| left? | `ReturnType<typeof useElementBounding>['left']` | Reactive left value for the modal's bounding box. The field is unset when the modal is not being displayed. |
| parent? | `HTMLElement` | The HTML parent element that the modal is currently being displayed for. The field is unset when the modal is not being displayed. |
| rowIndex? | `number` | The index of the row that the modal is currently being displayed for. The field is unset when the modal is not being displayed. |
| visible? | `boolean` | Indicates whether the table modal is currently visible. |
| width? | `ReturnType<typeof useElementBounding>['width']` | Reactive width value for the modal's bounding box. The field is unset when the modal is not being displayed. |

### TableModalProps

Table modal component props definition.

**Definition:**

```typescript
export interface TableModalProps {
  colIndex: number;
  rowIndex: number;
  store: ReturnType<typeof createTableStore>;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| colIndex | `number` | The index of the column that the modal is currently being displayed for. |
| rowIndex | `number` | The index of the row that the modal is currently being displayed for. |
| store | `ReturnType<typeof createTableStore>` | The store for managing the current table's state. |

### TableRow

Table row definition.

**Definition:**

```typescript
export interface TableRow {
  gantt?: GanttOptions;
  indent?: number;
  parent?: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| gantt? | `GanttOptions` | The options to use when rendering the row as a Gantt table. |
| indent? | `number` | The indentation level of the row node. Only applicable for tree and gantt views. |
| parent? | `number` | The HTML parent element for the row node. This is evaluated automatically while rendering the table. Only applicable for tree and gantt views. |

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

### TreeGanttTableConfig

Table configuration for tree-gantt view types.

**Definition:**

```typescript
export interface TreeGanttTableConfig {
  defaultTreeExpansion?: 'root' | 'branch' | 'leaf';
  dependencyGraph?: boolean;
  view: 'tree-gantt';
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| defaultTreeExpansion? | `'root' \| 'branch' \| 'leaf'` | `branch` (Shows minimal tree to display all gantt nodes. Expands only the necessary paths to gantt nodes, stops at gantt nodes with no gantt descendants), `leaf` (All nodes are visible (fully expanded)) |
| dependencyGraph? | `boolean` | Control whether dependency graph connections should be enabled for Gantt views. When false, connection handles and dependency lines will be hidden. |
| view | `'tree-gantt'` | The type of view to display the table in. |

### TreeTableConfig

Table configuration for tree view types.

**Definition:**

```typescript
export interface TreeTableConfig {
  defaultTreeExpansion?: 'root' | 'branch' | 'leaf';
  view: 'tree';
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| defaultTreeExpansion? | `'root' \| 'branch' \| 'leaf'` | `branch` (Shows minimal tree to display all gantt nodes. Expands only the necessary paths to gantt nodes, stops at gantt nodes with no gantt descendants), `leaf` (All nodes are visible (fully expanded)) |
| view | `'tree'` | The type of view to display the table in. |

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
| validateLinkTargets? | `boolean` | Whether to validate Link field targets |
| validateRequiredProperties? | `boolean` | Whether to validate required schema properties |
| validateWorkflows? | `boolean` | Whether to validate workflow reachability |

## Type Aliases

### BaseSchema

Basic field structure for AForm schemas

**Definition:**

```typescript
export type BaseSchema = {
    fieldname: string;
    component?: string;
    value?: any;
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

### ComponentProps

Defined props for AForm components

**Definition:**

```typescript
export type ComponentProps = {
    schema?: SchemaTypes;
    label?: string;
    mask?: string;
    required?: boolean;
    readOnly?: boolean;
    uuid?: string;
    validation?: {
        errorMessage: string;
        [key: string]: any;
    };
};
```

### ConnectionEvent

Connection event for handling connection creation/deletion.

**Definition:**

```typescript
export type ConnectionEvent = {
    type: 'create' | 'delete';
    connection: ConnectionPath;
};
```

### CrossTabMessageType

Cross-tab message types

**Definition:**

```typescript
export type CrossTabMessageType = 'operation' | 'undo' | 'redo' | 'sync-request' | 'sync-response';
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

### FieldsetSchema

Schema structure for defining fieldsets inside AForm

**Definition:**

```typescript
export type FieldsetSchema = BaseSchema & {
    label?: string;
    schema?: (FormSchema | TableSchema)[];
    collapsible?: boolean;
};
```

### FieldTriggerMap

Map of field paths to trigger configurations Supports wildcard patterns like 'emailAddress.*.is_primary'

**Definition:**

```typescript
export type FieldTriggerMap = Record<string, FieldTriggerConfig | FieldAction[]>;
```

### FormSchema

Schema structure for defining forms inside AForm

**Definition:**

```typescript
export type FormSchema = BaseSchema & {
    align?: string;
    edit?: boolean;
    fieldtype?: string;
    label?: string;
    name?: string;
    width?: string;
    mask?: string;
};
```

### GanttDragEvent

Gantt table drag event definition.

**Definition:**

```typescript
export type GanttDragEvent = {
    rowIndex: number;
    colIndex: number;
    delta: number;
} & ({
    type: 'bar';
    oldStart: number;
    oldEnd: number;
    newStart: number;
    newEnd: number;
    colspan: number;
} | {
    type: 'resize';
    edge: 'start';
    oldStart: number;
    newStart: number;
    end: number;
    oldColspan: number;
    newColspan: number;
} | {
    type: 'resize';
    edge: 'end';
    oldEnd: number;
    newEnd: number;
    start: number;
    oldColspan: number;
    newColspan: number;
});
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
};
```

### ImmutableDoctype

Immutable Doctype type for Stonecrop instances

**Definition:**

```typescript
export type ImmutableDoctype = {
    readonly schema?: List<SchemaTypes>;
    readonly workflow?: UnknownMachineConfig | AnyStateNodeConfig;
    readonly actions?: Map<string, string[]>;
};
```

### InstallOptions

Install options for Stonecrop Vue plugin

**Definition:**

```typescript
export type InstallOptions = {
    router?: Router;
    components?: Record<string, Component>;
    getMeta?: (routeContext: RouteContext) => DoctypeMeta | Promise<DoctypeMeta>;
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
    workflow?: UnknownMachineConfig | AnyStateNodeConfig;
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

### SchemaTypes

Superset of all schema types for AForm

**Definition:**

```typescript
export type SchemaTypes = FormSchema | TableSchema | FieldsetSchema;
```

### TableConfig

Table configuration definition using discriminated unions for type safety.

**Definition:**

```typescript
export type TableConfig = BasicTableConfig | TreeTableConfig | GanttTableConfig | TreeGanttTableConfig;
```

### TableSchema

Schema structure for defining tables inside AForm

**Definition:**

```typescript
export type TableSchema = BaseSchema & {
    columns?: TableColumn[];
    config?: TableConfig;
    rows?: TableRow[];
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

### DoctypeMeta

Doctype Meta class

**Constructor:**

```typescript
new DoctypeMeta(doctype: string, schema: ImmutableDoctype['schema'], workflow: ImmutableDoctype['workflow'], actions: ImmutableDoctype['actions'], component: Component)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | The doctype name |
| schema | `ImmutableDoctype['schema']` | The doctype schema definition |
| workflow | `ImmutableDoctype['workflow']` | The doctype workflow configuration (XState machine) |
| actions | `ImmutableDoctype['actions']` | The doctype actions and field triggers |
| component | `Component` | Optional Vue component for rendering the doctype |

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| actions | `ImmutableDoctype['actions']` | The doctype actions and field triggers |
| component | `Component` | The doctype component |
| doctype | `string` | The doctype name |
| schema | `ImmutableDoctype['schema']` | The doctype schema |
| slug | `string` | Converts the registered doctype string to a slug (kebab-case). The following conversions are made: - It replaces camelCase and PascalCase with kebab-case strings - It replaces spaces and underscores with hyphens - It converts the string to lowercase |
| workflow | `ImmutableDoctype['workflow']` | The doctype workflow |

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
new Registry(router: Router, getMeta: (routeContext: RouteContext) => DoctypeMeta | Promise<DoctypeMeta>)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| router | `Router` | Optional Vue router instance for route management |
| getMeta | `(routeContext: RouteContext) => DoctypeMeta \| Promise<DoctypeMeta>` | Optional function to fetch doctype metadata from an API |

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| _root | `Registry` | The root Registry instance |
| getMeta | `(routeContext: RouteContext) => DoctypeMeta \| Promise<DoctypeMeta>` | The getMeta function fetches doctype metadata from an API based on route context |
| name | `string` | The name of the Registry instance |
| registry | `Record<string, DoctypeMeta>` | The registry property contains a collection of doctypes |
| router | `Router` | The Vue router instance |

**Methods:**

#### addDoctype

Get doctype metadata

```typescript
addDoctype(doctype: DoctypeMeta): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeMeta` | The doctype to fetch metadata for |

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
validate(doctype: string, schema: List<SchemaTypes> | SchemaTypes[] | undefined, workflow: AnyStateNodeConfig, actions: ImmutableMap<string, string[]> | Map<string, string[]>): ValidationResult
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string` | Doctype name |
| schema | `List<SchemaTypes> \| SchemaTypes[] \| undefined` | Schema fields (List or Array) |
| workflow | `AnyStateNodeConfig` | Optional workflow configuration |
| actions | `ImmutableMap<string, string[]> \| Map<string, string[]>` | Optional actions map |

### Stonecrop

Main Stonecrop class with HST integration and built-in Operation Log

**Constructor:**

```typescript
new Stonecrop(registry: Registry, operationLogConfig: Partial<OperationLogConfig>)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| registry | `Registry` | The Registry instance containing doctype definitions |
| operationLogConfig | `Partial<OperationLogConfig>` | Optional configuration for the operation log |

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| registry | `Registry` | The registry instance containing all doctype definitions |

**Methods:**

#### addRecord

Add a record to the store

```typescript
addRecord(doctype: string | DoctypeMeta, recordId: string, recordData: any): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| DoctypeMeta` | The doctype |
| recordId | `string` | The record ID |
| recordData | `any` | The record data |

#### clearRecords

Clear all records for a doctype

```typescript
clearRecords(doctype: string | DoctypeMeta): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| DoctypeMeta` | The doctype |

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

Get single record from server (maintains compatibility)

```typescript
getRecord(doctype: DoctypeMeta, recordId: string): Promise<void>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeMeta` | The doctype |
| recordId | `string` | The record ID |

#### getRecordById

Get a specific record

```typescript
getRecordById(doctype: string | DoctypeMeta, recordId: string): HSTNode | undefined
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| DoctypeMeta` | The doctype |
| recordId | `string` | The record ID |

#### getRecordIds

Get all record IDs for a doctype

```typescript
getRecordIds(doctype: string | DoctypeMeta): string[]
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| DoctypeMeta` | The doctype |

#### getRecords

Get records from server (maintains compatibility)

```typescript
getRecords(doctype: DoctypeMeta): Promise<void>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeMeta` | The doctype |

#### getStore

Get the root HST store node for advanced usage

```typescript
getStore(): HSTNode
```

#### records

Get records hash for a doctype

```typescript
records(doctype: string | DoctypeMeta): HSTNode
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| DoctypeMeta` | The doctype to get records for |

#### removeRecord

Remove a record from the store

```typescript
removeRecord(doctype: string | DoctypeMeta, recordId: string): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `string \| DoctypeMeta` | The doctype |
| recordId | `string` | The record ID |

#### runAction

Run action on doctype Executes the action and logs it to the operation log for audit tracking

```typescript
runAction(doctype: DoctypeMeta, action: string, args: any[]): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeMeta` | The doctype |
| action | `string` | The action to run |
| args | `any[]` | Action arguments (typically record IDs) |

#### setup

Setup method for doctype initialization

```typescript
setup(doctype: DoctypeMeta): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| doctype | `DoctypeMeta` | The doctype to setup |

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
}, "operations" | "clientId" | "currentIndex" | "config">, Pick<{
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

