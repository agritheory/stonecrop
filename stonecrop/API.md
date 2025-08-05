# Stonecrop API Reference

> This documentation is automatically generated from the TypeScript API.

## Other Components

### Stonecrop

```typescript
export { Stonecrop }
```

## Functions

### useStonecrop

Stonecrop composable

**Signature:**

```typescript
export declare function useStonecrop(registry?: Registry): StonecropReturn;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| registry | `Registry` |  |

## Interfaces

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

### ConnectionEvent

Connection event for handling connection creation/deletion.

**Definition:**

```typescript
export type ConnectionEvent = {
    type: 'create' | 'delete';
    connection: ConnectionPath;
};
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
    getMeta?: (doctype?: string) => DoctypeMeta | Promise<DoctypeMeta>;
};
```

### MutableDoctype

Mutable Doctype type for Stonecrop instances

**Definition:**

```typescript
export type MutableDoctype = {
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

### StonecropReturn

Stonecrop composable return type

**Definition:**

```typescript
export type StonecropReturn = {
    stonecrop: Ref<Stonecrop | undefined>;
};
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
| actions | `ImmutableDoctype['actions']` | The doctype actions |
| component | `Component` | The doctype component |
| doctype | `string` | The doctype name |
| schema | `ImmutableDoctype['schema']` | The doctype schema |
| slug | `string` | Converts the registered doctype string to a slug (kebab-case). The following conversions are made: - It replaces camelCase and PascalCase with kebab-case strings - It replaces spaces and underscores with hyphens - It converts the string to lowercase |
| workflow | `ImmutableDoctype['workflow']` | The doctype workflow |

### Registry

Stonecrop Registry class

**Constructor:**

```typescript
new Registry(router: Router, getMeta: (doctype: string) => DoctypeMeta | Promise<DoctypeMeta>)
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| _root | `Registry` | The root Registry instance |
| getMeta | `(doctype: string) => DoctypeMeta \| Promise<DoctypeMeta>` | The getMeta function fetches doctype metadata from an API |
| name | `string` | The name of the Registry instance |
| registry | `Record<string, DoctypeMeta>` | The registry property contains a collection of doctypes |
| router | `Router` | The Vue router instance |

**Methods:**

#### addDoctype

Get doctype metadata

```typescript
addDoctype(doctype: DoctypeMeta): void
```

### StonecropClass

Stonecrop class

**Constructor:**

```typescript
new StonecropClass(registry: Registry, store: ReturnType<typeof useDataStore>)
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| _root | `Stonecrop` | The root Stonecrop instance |
| name | `` | The name of the Stonecrop instance |
| registry | `Registry` | The registry is an immutable collection of doctypes |
| store | `ReturnType<typeof useDataStore>` | The Pinia store that manages the mutable records |

**Methods:**

#### getMeta

Gets the meta for the given doctype

```typescript
getMeta(doctype: string): Promise<DoctypeMeta> | never
```

#### getRecord

Gets the record for the given doctype and id

```typescript
getRecord(doctype: DoctypeMeta, id: string): Promise<void>
```

#### getRecords

Gets the records for the given doctype

```typescript
getRecords(doctype: DoctypeMeta, filters: RequestInit): Promise<void>
```

#### runAction

Runs the action for the given doctype and id

```typescript
runAction(doctype: DoctypeMeta, action: string, id: string[]): void
```

#### setup

Sets up the Stonecrop instance with the given doctype

```typescript
setup(doctype: DoctypeMeta): void
```

