# Aform API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### ACheckbox

Vue component exported from @stonecrop/aform.

```typescript
import { ACheckbox } from '@stonecrop/aform'
```

### AComboBox

Vue component exported from @stonecrop/aform.

```typescript
import { AComboBox } from '@stonecrop/aform'
```

### ADate

Vue component exported from @stonecrop/aform.

```typescript
import { ADate } from '@stonecrop/aform'
```

### ADatePicker

Vue component exported from @stonecrop/aform.

```typescript
import { ADatePicker } from '@stonecrop/aform'
```

### ADropdown

Vue component exported from @stonecrop/aform.

```typescript
import { ADropdown } from '@stonecrop/aform'
```

### AFieldset

Vue component exported from @stonecrop/aform.

```typescript
import { AFieldset } from '@stonecrop/aform'
```

### AFileAttach

Vue component exported from @stonecrop/aform.

```typescript
import { AFileAttach } from '@stonecrop/aform'
```

### AForm

Vue component exported from @stonecrop/aform.

```typescript
import { AForm } from '@stonecrop/aform'
```

### ANumericInput

Vue component exported from @stonecrop/aform.

```typescript
import { ANumericInput } from '@stonecrop/aform'
```

### ATextInput

Vue component exported from @stonecrop/aform.

```typescript
import { ATextInput } from '@stonecrop/aform'
```

### Login

Vue component exported from @stonecrop/aform.

```typescript
import { Login } from '@stonecrop/aform'
```

## Functions

### install

Install all AForm components

**Signature:**

```typescript
declare function install(app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| app | `App` |  |

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

