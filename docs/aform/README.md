# Aform Documentation

> This documentation is automatically generated from the TypeScript API.

<h2>Vue Components</h2>

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

<h2>Functions</h2>

### install

**Signature:**

```typescript
declare function install(app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| app | `App` |  |

<h2>Interfaces</h2>

### CellContext

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
| column | `TableColumn` |  |
| row | `TableRow` |  |
| table | `{ [key: string]: any; }` |  |

### GanttOptions

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
| color? | `string` |  |
| colspan? | `number` |  |
| endIndex? | `number` |  |
| startIndex? | `number` |  |

### TableColumn

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
| align? | `CanvasTextAlign` |  |
| cellComponent? | `string` |  |
| cellComponentProps? | `Record<string, any>` |  |
| colspan? | `number` |  |
| edit? | `boolean` |  |
| format? | `string \| ((value: any, context: CellContext) => string)` |  |
| ganttComponent? | `string` |  |
| isGantt? | `boolean` |  |
| label? | `string` |  |
| mask? | `(value: any) => any` |  |
| modalComponent? | `string \| ((context: CellContext) => string)` |  |
| modalComponentExtraProps? | `Record<string, any>` |  |
| name | `string` |  |
| originalIndex? | `number` |  |
| pinned? | `boolean` |  |
| resizable? | `boolean` |  |
| type? | `string` |  |
| width? | `string` |  |

### TableConfig

**Definition:**

```typescript
export interface TableConfig {
  fullWidth?: boolean;
  view?: 'uncounted' | 'list' | 'list-expansion' | 'tree' | 'gantt' | 'tree-gantt';
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| fullWidth? | `boolean` |  |
| view? | `'uncounted' \| 'list' \| 'list-expansion' \| 'tree' \| 'gantt' \| 'tree-gantt'` |  |

### TableRow

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
| gantt? | `GanttOptions` |  |
| indent? | `number` |  |
| parent? | `number` |  |

<h2>Type Aliases</h2>

### BaseSchema

**Definition:**

```typescript
export type BaseSchema = {
    fieldname: string;
    component?: string;
    value?: any;
};
```

### FieldsetSchema

**Definition:**

```typescript
export type FieldsetSchema = BaseSchema & {
    label?: string;
    schema?: (FormSchema | TableSchema)[];
    collapsible?: boolean;
};
```

### FormSchema

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

**Definition:**

```typescript
export type SchemaTypes = FormSchema | TableSchema | FieldsetSchema;
```

### TableSchema

**Definition:**

```typescript
export type TableSchema = BaseSchema & {
    columns?: TableColumn[];
    config?: TableConfig;
    rows?: TableRow[];
};
```

