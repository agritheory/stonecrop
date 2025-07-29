# Stonecrop Documentation

> This documentation is automatically generated from the TypeScript API.

## Other Components

### Stonecrop

```typescript
export { Stonecrop }
```

## Functions

### useStonecrop

**Signature:**

```typescript
export declare function useStonecrop(registry?: Registry): StonecropReturn;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| registry | `Registry` |  |

## Interfaces

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

### ConnectionHandle

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
| barId | `string` |  |
| colIndex | `number` |  |
| id | `string` |  |
| position | `{ x: ShallowRef<number>; y: ShallowRef<number>; }` |  |
| rowIndex | `number` |  |
| side | `'left' \| 'right'` |  |
| visible | `Ref<boolean>` |  |

### ConnectionPath

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
| from | `{ barId: string; side: 'left' \| 'right'; }` |  |
| id | `string` |  |
| label? | `string` |  |
| style? | `{ color?: string; width?: number; }` |  |
| to | `{ barId: string; side: 'left' \| 'right'; }` |  |

### GanttBarInfo

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
| colIndex | `number` |  |
| color | `Ref<string>` |  |
| endIndex | `Ref<number>` |  |
| id | `string` |  |
| label? | `string` |  |
| position | `{ x: ShallowRef<number>; y: ShallowRef<number>; }` |  |
| rowIndex | `number` |  |
| startIndex | `Ref<number>` |  |

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

## Type Aliases

### BaseSchema

**Definition:**

```typescript
export type BaseSchema = {
    fieldname: string;
    component?: string;
    value?: any;
};
```

### ConnectionEvent

**Definition:**

```typescript
export type ConnectionEvent = {
    type: 'create' | 'delete';
    connection: ConnectionPath;
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

### GanttDragEvent

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

**Definition:**

```typescript
export type ImmutableDoctype = {
    readonly schema?: List<SchemaTypes>;
    readonly workflow: StateMachine<unknown, any, any>;
    readonly actions?: Map<string, string[]>;
};
```

### InstallOptions

**Definition:**

```typescript
export type InstallOptions = {
    router?: Router;
    components?: Record<string, Component>;
    getMeta?: (doctype?: string) => DoctypeMeta | Promise<DoctypeMeta>;
};
```

### MutableDoctype

**Definition:**

```typescript
export type MutableDoctype = {
    schema?: SchemaTypes[];
    workflow: MachineConfig<unknown, any, any>;
    actions?: Record<string, string[]>;
};
```

### Schema

**Definition:**

```typescript
export type Schema = {
    doctype: string;
    schema: List<SchemaTypes>;
};
```

### SchemaTypes

**Definition:**

```typescript
export type SchemaTypes = FormSchema | TableSchema | FieldsetSchema;
```

### StonecropReturn

**Definition:**

```typescript
export type StonecropReturn = {
    stonecrop: Ref<Stonecrop | undefined>;
};
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

## Classes

### DoctypeMeta

**Constructor:**

```typescript
new DoctypeMeta(doctype: string, schema: ImmutableDoctype['schema'], workflow: ImmutableDoctype['workflow'], actions: ImmutableDoctype['actions'], component: Component)
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| actions | `ImmutableDoctype['actions']` |  |
| component | `Component` |  |
| doctype | `string` |  |
| schema | `ImmutableDoctype['schema']` |  |
| slug | `string` |  |
| workflow | `ImmutableDoctype['workflow']` |  |

### Registry

**Constructor:**

```typescript
new Registry(router: Router, getMeta: (doctype: string) => DoctypeMeta | Promise<DoctypeMeta>)
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| _root | `Registry` |  |
| getMeta | `(doctype: string) => DoctypeMeta \| Promise<DoctypeMeta>` |  |
| name | `string` |  |
| registry | `Record<string, DoctypeMeta>` |  |
| router | `Router` |  |

**Methods:**

#### addDoctype

```typescript
addDoctype(doctype: DoctypeMeta): void
```
