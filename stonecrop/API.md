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
| target | `any` |  |
| doctype | `string` |  |
| parentDoctype | `string` |  |

### getGlobalTriggerEngine

Get or create the global field trigger engine

**Signature:**

```typescript
export declare function getGlobalTriggerEngine(options?: FieldTriggerOptions): FieldTriggerEngine;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `FieldTriggerOptions` |  |

### registerGlobalAction

Register a global action function that can be used in field triggers

**Signature:**

```typescript
export declare function registerGlobalAction(name: string, fn: FieldActionFunction): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| name | `string` |  |
| fn | `FieldActionFunction` |  |

### useStonecrop

Unified Stonecrop composable - handles both general operations and HST reactive integration

**Signature:**

```typescript
export declare function useStonecrop(): BaseStonecropReturn | HSTStonecropReturn;
```

### useStonecrop

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
| options | `{ registry?: Registry; doctype: DoctypeMeta; recordId?: string; }` |  |

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
| timestamp | `Date` | Timestamp of the change |

### FieldTriggerConfig

Configuration for a single field trigger

**Definition:**

```typescript
export interface FieldTriggerConfig {
  actions: FieldAction[];
  condition?: (context: FieldChangeContext) => boolean | Promise<boolean>;
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
| stoppedOnError | `boolean` | Whether execution was stopped due to an error |
| totalExecutionTime | `number` | Total execution time for all actions |

### FieldTriggerOptions

Options for the field trigger system

**Definition:**

```typescript
export interface FieldTriggerOptions {
  debug?: boolean;
  defaultTimeout?: number;
  errorHandler?: (error: Error, context: FieldChangeContext, action: FieldAction) => void;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| debug? | `boolean` | Whether to log trigger executions for debugging |
| defaultTimeout? | `number` | Default timeout for action execution in milliseconds |
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
  set(path: string, value: any): void;
}
```

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
  type?: string;
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
| resizable? | `boolean` |  |
| type? | `string` | `Data` (the column contains text data), `Select` (the column contains a select input), `Date` (the column contains a date input), `component` (the column contains a custom component) |
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

Base Stonecrop composable return type

**Definition:**

```typescript
export type BaseStonecropReturn = {
    stonecrop: Ref<Stonecrop | undefined>;
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
    readonly?: boolean;
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

## Classes

### DoctypeMeta

Doctype Meta class

**Constructor:**

```typescript
new DoctypeMeta(doctype: string, schema: ImmutableDoctype['schema'], workflow: ImmutableDoctype['workflow'], actions: ImmutableDoctype['actions'], component: Component)
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| actions | `ImmutableDoctype['actions']` | The doctype actions and field triggers |
| component | `Component` | The doctype component |
| doctype | `string` | The doctype name |
| schema | `ImmutableDoctype['schema']` | The doctype schema |
| slug | `string` | Converts the registered doctype string to a slug (kebab-case). The following conversions are made: - It replaces camelCase and PascalCase with kebab-case strings - It replaces spaces and underscores with hyphens - It converts the string to lowercase |
| workflow | `ImmutableDoctype['workflow']` | The doctype workflow |

### HST

Global HST Manager (Singleton) Manages hierarchical state trees and provides access to the global registry.

**Methods:**

#### getDoctypeMeta

Helper method to get doctype metadata from the registry

```typescript
getDoctypeMeta(doctype: string): any
```

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

### Stonecrop

Main Stonecrop class with HST integration

**Constructor:**

```typescript
new Stonecrop(registry: Registry)
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| registry | `Registry` |  |

**Methods:**

#### addRecord

Add a record to the store

```typescript
addRecord(doctype: string | DoctypeMeta, recordId: string, recordData: any): void
```

#### clearRecords

Clear all records for a doctype

```typescript
clearRecords(doctype: string | DoctypeMeta): void
```

#### getMeta

Get doctype metadata from the registry

```typescript
getMeta(context: RouteContext): Promise<any>
```

#### getRecord

Get single record from server (maintains compatibility)

```typescript
getRecord(doctype: DoctypeMeta, recordId: string): Promise<void>
```

#### getRecordById

Get a specific record

```typescript
getRecordById(doctype: string | DoctypeMeta, recordId: string): HSTNode | undefined
```

#### getRecordIds

Get all record IDs for a doctype

```typescript
getRecordIds(doctype: string | DoctypeMeta): string[]
```

#### getRecords

Get records from server (maintains compatibility)

```typescript
getRecords(doctype: DoctypeMeta): Promise<void>
```

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

#### removeRecord

Remove a record from the store

```typescript
removeRecord(doctype: string | DoctypeMeta, recordId: string): void
```

#### runAction

Run action on doctype (maintains compatibility)

```typescript
runAction(_doctype: DoctypeMeta, _action: string, _args: any[]): void
```

#### setup

Setup method for doctype initialization

```typescript
setup(doctype: DoctypeMeta): void
```

## Variables

### plugin

Stonecrop Vue plugin

**Type:**

```typescript
export const plugin: Plugin
```

