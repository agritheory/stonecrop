# Atable Documentation

> This documentation is automatically generated from the TypeScript API.

<h2>Vue Components</h2>

### ACell

Vue component exported from @stonecrop/atable.

```typescript
import { ACell } from '@stonecrop/atable'
```

### AExpansionRow

Vue component exported from @stonecrop/atable.

```typescript
import { AExpansionRow } from '@stonecrop/atable'
```

### AGanttCell

Vue component exported from @stonecrop/atable.

```typescript
import { AGanttCell } from '@stonecrop/atable'
```

### ARow

Vue component exported from @stonecrop/atable.

```typescript
import { ARow } from '@stonecrop/atable'
```

### ATable

Vue component exported from @stonecrop/atable.

```typescript
import { ATable } from '@stonecrop/atable'
```

### ATableHeader

Vue component exported from @stonecrop/atable.

```typescript
import { ATableHeader } from '@stonecrop/atable'
```

### ATableLoading

Vue component exported from @stonecrop/atable.

```typescript
import { ATableLoading } from '@stonecrop/atable'
```

### ATableLoadingBar

Vue component exported from @stonecrop/atable.

```typescript
import { ATableLoadingBar } from '@stonecrop/atable'
```

### ATableModal

Vue component exported from @stonecrop/atable.

```typescript
import { ATableModal } from '@stonecrop/atable'
```

<h2>Functions</h2>

### createTableStore

**Signature:**

```typescript
createTableStore: (initData: {
    columns: TableColumn[];
    rows: TableRow[];
    id?: string;
    config?: TableConfig;
    modal?: TableModal;
}) => import("pinia").Store<`table-${string}`, Pick<{
    columns: import("vue").Ref<{
        name: string;
        align?: CanvasTextAlign | undefined;
        edit?: boolean | undefined;
        label?: string | undefined;
        type?: string | undefined;
        width?: string | undefined;
        pinned?: boolean | undefined;
        resizable?: boolean | undefined;
        cellComponent?: string | undefined;
        cellComponentProps?: Record<string, any> | undefined;
        modalComponent?: string | ((context: CellContext) => string) | undefined;
        modalComponentExtraProps?: Record<string, any> | undefined;
        format?: string | ((value: any, context: CellContext) => string) | undefined;
        mask?: ((value: any) => any) | undefined;
        isGantt?: boolean | undefined;
        ganttComponent?: string | undefined;
        colspan?: number | undefined;
        originalIndex?: number | undefined;
    }[], TableColumn[] | {
        name: string;
        align?: CanvasTextAlign | undefined;
        edit?: boolean | undefined;
        label?: string | undefined;
        type?: string | undefined;
        width?: string | undefined;
        pinned?: boolean | undefined;
        resizable?: boolean | undefined;
        cellComponent?: string | undefined;
        cellComponentProps?: Record<string, any> | undefined;
        modalComponent?: string | ((context: CellContext) => string) | undefined;
        modalComponentExtraProps?: Record<string, any> | undefined;
        format?: string | ((value: any, context: CellContext) => string) | undefined;
        mask?: ((value: any) => any) | undefined;
        isGantt?: boolean | undefined;
        ganttComponent?: string | undefined;
        colspan?: number | undefined;
        originalIndex?: number | undefined;
    }[]>;
    config: import("vue").Ref<{
        view?: "uncounted" | "list" | "list-expansion" | "tree" | "gantt" | "tree-gantt" | undefined;
        fullWidth?: boolean | undefined;
    }, TableConfig | {
        view?: "uncounted" | "list" | "list-expansion" | "tree" | "gantt" | "tree-gantt" | undefined;
        fullWidth?: boolean | undefined;
    }>;
    connectionHandles: import("vue").Ref<{
        id: string;
        rowIndex: number;
        colIndex: number;
        side: "left" | "right";
        position: {
            x: number;
            y: number;
        };
        visible: boolean;
        barId: string;
    }[], ConnectionHandle[] | {
        id: string;
        rowIndex: number;
        colIndex: number;
        side: "left" | "right";
        position: {
            x: number;
            y: number;
        };
        visible: boolean;
        barId: string;
    }[]>;
    connectionPaths: import("vue").Ref<{
        id: string;
        from: {
            barId: string;
            side: "left" | "right";
        };
        to: {
            barId: string;
            side: "left" | "right";
        };
        style?: {
            color?: string | undefined;
            width?: number | undefined;
        } | undefined;
        label?: string | undefined;
    }[], ConnectionPath[] | {
        id: string;
        from: {
            barId: string;
            side: "left" | "right";
        };
        to: {
            barId: string;
            side: "left" | "right";
        };
        style?: {
            color?: string | undefined;
            width?: number | undefined;
        } | undefined;
        label?: string | undefined;
    }[]>;
    display: import("vue").WritableComputedRef<TableDisplay[], TableDisplay[]>;
    ganttBars: import("vue").Ref<{
        id: string;
        rowIndex: number;
        colIndex: number;
        startIndex: number;
        endIndex: number;
        color: string;
        position: {
            x: number;
            y: number;
        };
        label?: string | undefined;
    }[], GanttBarInfo[] | {
        id: string;
        rowIndex: number;
        colIndex: number;
        startIndex: number;
        endIndex: number;
        color: string;
        position: {
            x: number;
            y: number;
        };
        label?: string | undefined;
    }[]>;
    modal: import("vue").Ref<{
        visible?: boolean | undefined;
        cell?: (HTMLTableCellElement | null) | undefined;
        parent?: HTMLElement | undefined;
        colIndex?: number | undefined;
        rowIndex?: number | undefined;
        component?: string | undefined;
        componentProps?: Record<string, any> | undefined;
        bottom?: number | undefined;
        height?: number | undefined;
        left?: number | undefined;
        width?: number | undefined;
    }, TableModal | {
        visible?: boolean | undefined;
        cell?: (HTMLTableCellElement | null) | undefined;
        parent?: HTMLElement | undefined;
        colIndex?: number | undefined;
        rowIndex?: number | undefined;
        component?: string | undefined;
        componentProps?: Record<string, any> | undefined;
        bottom?: number | undefined;
        height?: number | undefined;
        left?: number | undefined;
        width?: number | undefined;
    }>;
    rows: import("vue").Ref<{
        [x: string]: any;
        indent?: number | undefined;
        parent?: number | undefined;
        gantt?: {
            color?: string | undefined;
            startIndex?: number | undefined;
            endIndex?: number | undefined;
            colspan?: number | undefined;
        } | undefined;
    }[], TableRow[] | {
        [x: string]: any;
        indent?: number | undefined;
        parent?: number | undefined;
        gantt?: {
            color?: string | undefined;
            startIndex?: number | undefined;
            endIndex?: number | undefined;
            colspan?: number | undefined;
        } | undefined;
    }[]>;
    table: import("vue").ComputedRef<{}>;
    updates: import("vue").Ref<Record<string, string>, Record<string, string>>;
    hasPinnedColumns: import("vue").ComputedRef<boolean>;
    isGanttView: import("vue").ComputedRef<boolean>;
    isTreeView: import("vue").ComputedRef<boolean>;
    numberedRowWidth: import("vue").ComputedRef<string>;
    zeroColumn: import("vue").ComputedRef<boolean>;
    closeModal: (event: MouseEvent) => void;
    createConnection: (fromHandleId: string, toHandleId: string, options?: {
        style?: ConnectionPath["style"];
        label?: string;
    }) => ConnectionPath | null;
    deleteConnection: (connectionId: string) => boolean;
    getCellData: <T = any>(colIndex: number, rowIndex: number) => T;
    getCellDisplayValue: (colIndex: number, rowIndex: number) => any;
    getConnectionsForBar: (barId: string) => {
        id: string;
        from: {
            barId: string;
            side: "left" | "right";
        };
        to: {
            barId: string;
            side: "left" | "right";
        };
        style?: {
            color?: string | undefined;
            width?: number | undefined;
        } | undefined;
        label?: string | undefined;
    }[];
    getFormattedValue: (colIndex: number, rowIndex: number, value: any) => any;
    getHandlesForBar: (barId: string) => {
        id: string;
        rowIndex: number;
        colIndex: number;
        side: "left" | "right";
        position: {
            x: number;
            y: number;
        };
        visible: boolean;
        barId: string;
    }[];
    getHeaderCellStyle: (column: TableColumn) => CSSProperties;
    getIndent: (colIndex: number, indentLevel?: number) => string;
    getRowExpandSymbol: (rowIndex: number) => "" | "▼" | "►";
    isRowGantt: (rowIndex: number) => boolean;
    isRowVisible: (rowIndex: number) => boolean | undefined;
    registerConnectionHandle: (handleInfo: ConnectionHandle) => void;
    registerGanttBar: (barInfo: GanttBarInfo) => void;
    resizeColumn: (colIndex: number, newWidth: number) => void;
    setCellData: (colIndex: number, rowIndex: number, value: any) => void;
    setCellText: (colIndex: number, rowIndex: number, value: string) => void;
    toggleRowExpand: (rowIndex: number) => void;
    unregisterConnectionHandle: (handleId: string) => void;
    unregisterGanttBar: (barId: string) => void;
    updateGanttBar: (event: GanttDragEvent) => void;
    updateRows: (newRows: TableRow[]) => void;
}, "columns" | "config" | "connectionHandles" | "connectionPaths" | "ganttBars" | "modal" | "rows" | "updates">, Pick<{
    columns: import("vue").Ref<{
        name: string;
        align?: CanvasTextAlign | undefined;
        edit?: boolean | undefined;
        label?: string | undefined;
        type?: string | undefined;
        width?: string | undefined;
        pinned?: boolean | undefined;
        resizable?: boolean | undefined;
        cellComponent?: string | undefined;
        cellComponentProps?: Record<string, any> | undefined;
        modalComponent?: string | ((context: CellContext) => string) | undefined;
        modalComponentExtraProps?: Record<string, any> | undefined;
        format?: string | ((value: any, context: CellContext) => string) | undefined;
        mask?: ((value: any) => any) | undefined;
        isGantt?: boolean | undefined;
        ganttComponent?: string | undefined;
        colspan?: number | undefined;
        originalIndex?: number | undefined;
    }[], TableColumn[] | {
        name: string;
        align?: CanvasTextAlign | undefined;
        edit?: boolean | undefined;
        label?: string | undefined;
        type?: string | undefined;
        width?: string | undefined;
        pinned?: boolean | undefined;
        resizable?: boolean | undefined;
        cellComponent?: string | undefined;
        cellComponentProps?: Record<string, any> | undefined;
        modalComponent?: string | ((context: CellContext) => string) | undefined;
        modalComponentExtraProps?: Record<string, any> | undefined;
        format?: string | ((value: any, context: CellContext) => string) | undefined;
        mask?: ((value: any) => any) | undefined;
        isGantt?: boolean | undefined;
        ganttComponent?: string | undefined;
        colspan?: number | undefined;
        originalIndex?: number | undefined;
    }[]>;
    config: import("vue").Ref<{
        view?: "uncounted" | "list" | "list-expansion" | "tree" | "gantt" | "tree-gantt" | undefined;
        fullWidth?: boolean | undefined;
    }, TableConfig | {
        view?: "uncounted" | "list" | "list-expansion" | "tree" | "gantt" | "tree-gantt" | undefined;
        fullWidth?: boolean | undefined;
    }>;
    connectionHandles: import("vue").Ref<{
        id: string;
        rowIndex: number;
        colIndex: number;
        side: "left" | "right";
        position: {
            x: number;
            y: number;
        };
        visible: boolean;
        barId: string;
    }[], ConnectionHandle[] | {
        id: string;
        rowIndex: number;
        colIndex: number;
        side: "left" | "right";
        position: {
            x: number;
            y: number;
        };
        visible: boolean;
        barId: string;
    }[]>;
    connectionPaths: import("vue").Ref<{
        id: string;
        from: {
            barId: string;
            side: "left" | "right";
        };
        to: {
            barId: string;
            side: "left" | "right";
        };
        style?: {
            color?: string | undefined;
            width?: number | undefined;
        } | undefined;
        label?: string | undefined;
    }[], ConnectionPath[] | {
        id: string;
        from: {
            barId: string;
            side: "left" | "right";
        };
        to: {
            barId: string;
            side: "left" | "right";
        };
        style?: {
            color?: string | undefined;
            width?: number | undefined;
        } | undefined;
        label?: string | undefined;
    }[]>;
    display: import("vue").WritableComputedRef<TableDisplay[], TableDisplay[]>;
    ganttBars: import("vue").Ref<{
        id: string;
        rowIndex: number;
        colIndex: number;
        startIndex: number;
        endIndex: number;
        color: string;
        position: {
            x: number;
            y: number;
        };
        label?: string | undefined;
    }[], GanttBarInfo[] | {
        id: string;
        rowIndex: number;
        colIndex: number;
        startIndex: number;
        endIndex: number;
        color: string;
        position: {
            x: number;
            y: number;
        };
        label?: string | undefined;
    }[]>;
    modal: import("vue").Ref<{
        visible?: boolean | undefined;
        cell?: (HTMLTableCellElement | null) | undefined;
        parent?: HTMLElement | undefined;
        colIndex?: number | undefined;
        rowIndex?: number | undefined;
        component?: string | undefined;
        componentProps?: Record<string, any> | undefined;
        bottom?: number | undefined;
        height?: number | undefined;
        left?: number | undefined;
        width?: number | undefined;
    }, TableModal | {
        visible?: boolean | undefined;
        cell?: (HTMLTableCellElement | null) | undefined;
        parent?: HTMLElement | undefined;
        colIndex?: number | undefined;
        rowIndex?: number | undefined;
        component?: string | undefined;
        componentProps?: Record<string, any> | undefined;
        bottom?: number | undefined;
        height?: number | undefined;
        left?: number | undefined;
        width?: number | undefined;
    }>;
    rows: import("vue").Ref<{
        [x: string]: any;
        indent?: number | undefined;
        parent?: number | undefined;
        gantt?: {
            color?: string | undefined;
            startIndex?: number | undefined;
            endIndex?: number | undefined;
            colspan?: number | undefined;
        } | undefined;
    }[], TableRow[] | {
        [x: string]: any;
        indent?: number | undefined;
        parent?: number | undefined;
        gantt?: {
            color?: string | undefined;
            startIndex?: number | undefined;
            endIndex?: number | undefined;
            colspan?: number | undefined;
        } | undefined;
    }[]>;
    table: import("vue").ComputedRef<{}>;
    updates: import("vue").Ref<Record<string, string>, Record<string, string>>;
    hasPinnedColumns: import("vue").ComputedRef<boolean>;
    isGanttView: import("vue").ComputedRef<boolean>;
    isTreeView: import("vue").ComputedRef<boolean>;
    numberedRowWidth: import("vue").ComputedRef<string>;
    zeroColumn: import("vue").ComputedRef<boolean>;
    closeModal: (event: MouseEvent) => void;
    createConnection: (fromHandleId: string, toHandleId: string, options?: {
        style?: ConnectionPath["style"];
        label?: string;
    }) => ConnectionPath | null;
    deleteConnection: (connectionId: string) => boolean;
    getCellData: <T = any>(colIndex: number, rowIndex: number) => T;
    getCellDisplayValue: (colIndex: number, rowIndex: number) => any;
    getConnectionsForBar: (barId: string) => {
        id: string;
        from: {
            barId: string;
            side: "left" | "right";
        };
        to: {
            barId: string;
            side: "left" | "right";
        };
        style?: {
            color?: string | undefined;
            width?: number | undefined;
        } | undefined;
        label?: string | undefined;
    }[];
    getFormattedValue: (colIndex: number, rowIndex: number, value: any) => any;
    getHandlesForBar: (barId: string) => {
        id: string;
        rowIndex: number;
        colIndex: number;
        side: "left" | "right";
        position: {
            x: number;
            y: number;
        };
        visible: boolean;
        barId: string;
    }[];
    getHeaderCellStyle: (column: TableColumn) => CSSProperties;
    getIndent: (colIndex: number, indentLevel?: number) => string;
    getRowExpandSymbol: (rowIndex: number) => "" | "▼" | "►";
    isRowGantt: (rowIndex: number) => boolean;
    isRowVisible: (rowIndex: number) => boolean | undefined;
    registerConnectionHandle: (handleInfo: ConnectionHandle) => void;
    registerGanttBar: (barInfo: GanttBarInfo) => void;
    resizeColumn: (colIndex: number, newWidth: number) => void;
    setCellData: (colIndex: number, rowIndex: number, value: any) => void;
    setCellText: (colIndex: number, rowIndex: number, value: string) => void;
    toggleRowExpand: (rowIndex: number) => void;
    unregisterConnectionHandle: (handleId: string) => void;
    unregisterGanttBar: (barId: string) => void;
    updateGanttBar: (event: GanttDragEvent) => void;
    updateRows: (newRows: TableRow[]) => void;
}, "display" | "table" | "hasPinnedColumns" | "isGanttView" | "isTreeView" | "numberedRowWidth" | "zeroColumn">, Pick<{
    columns: import("vue").Ref<{
        name: string;
        align?: CanvasTextAlign | undefined;
        edit?: boolean | undefined;
        label?: string | undefined;
        type?: string | undefined;
        width?: string | undefined;
        pinned?: boolean | undefined;
        resizable?: boolean | undefined;
        cellComponent?: string | undefined;
        cellComponentProps?: Record<string, any> | undefined;
        modalComponent?: string | ((context: CellContext) => string) | undefined;
        modalComponentExtraProps?: Record<string, any> | undefined;
        format?: string | ((value: any, context: CellContext) => string) | undefined;
        mask?: ((value: any) => any) | undefined;
        isGantt?: boolean | undefined;
        ganttComponent?: string | undefined;
        colspan?: number | undefined;
        originalIndex?: number | undefined;
    }[], TableColumn[] | {
        name: string;
        align?: CanvasTextAlign | undefined;
        edit?: boolean | undefined;
        label?: string | undefined;
        type?: string | undefined;
        width?: string | undefined;
        pinned?: boolean | undefined;
        resizable?: boolean | undefined;
        cellComponent?: string | undefined;
        cellComponentProps?: Record<string, any> | undefined;
        modalComponent?: string | ((context: CellContext) => string) | undefined;
        modalComponentExtraProps?: Record<string, any> | undefined;
        format?: string | ((value: any, context: CellContext) => string) | undefined;
        mask?: ((value: any) => any) | undefined;
        isGantt?: boolean | undefined;
        ganttComponent?: string | undefined;
        colspan?: number | undefined;
        originalIndex?: number | undefined;
    }[]>;
    config: import("vue").Ref<{
        view?: "uncounted" | "list" | "list-expansion" | "tree" | "gantt" | "tree-gantt" | undefined;
        fullWidth?: boolean | undefined;
    }, TableConfig | {
        view?: "uncounted" | "list" | "list-expansion" | "tree" | "gantt" | "tree-gantt" | undefined;
        fullWidth?: boolean | undefined;
    }>;
    connectionHandles: import("vue").Ref<{
        id: string;
        rowIndex: number;
        colIndex: number;
        side: "left" | "right";
        position: {
            x: number;
            y: number;
        };
        visible: boolean;
        barId: string;
    }[], ConnectionHandle[] | {
        id: string;
        rowIndex: number;
        colIndex: number;
        side: "left" | "right";
        position: {
            x: number;
            y: number;
        };
        visible: boolean;
        barId: string;
    }[]>;
    connectionPaths: import("vue").Ref<{
        id: string;
        from: {
            barId: string;
            side: "left" | "right";
        };
        to: {
            barId: string;
            side: "left" | "right";
        };
        style?: {
            color?: string | undefined;
            width?: number | undefined;
        } | undefined;
        label?: string | undefined;
    }[], ConnectionPath[] | {
        id: string;
        from: {
            barId: string;
            side: "left" | "right";
        };
        to: {
            barId: string;
            side: "left" | "right";
        };
        style?: {
            color?: string | undefined;
            width?: number | undefined;
        } | undefined;
        label?: string | undefined;
    }[]>;
    display: import("vue").WritableComputedRef<TableDisplay[], TableDisplay[]>;
    ganttBars: import("vue").Ref<{
        id: string;
        rowIndex: number;
        colIndex: number;
        startIndex: number;
        endIndex: number;
        color: string;
        position: {
            x: number;
            y: number;
        };
        label?: string | undefined;
    }[], GanttBarInfo[] | {
        id: string;
        rowIndex: number;
        colIndex: number;
        startIndex: number;
        endIndex: number;
        color: string;
        position: {
            x: number;
            y: number;
        };
        label?: string | undefined;
    }[]>;
    modal: import("vue").Ref<{
        visible?: boolean | undefined;
        cell?: (HTMLTableCellElement | null) | undefined;
        parent?: HTMLElement | undefined;
        colIndex?: number | undefined;
        rowIndex?: number | undefined;
        component?: string | undefined;
        componentProps?: Record<string, any> | undefined;
        bottom?: number | undefined;
        height?: number | undefined;
        left?: number | undefined;
        width?: number | undefined;
    }, TableModal | {
        visible?: boolean | undefined;
        cell?: (HTMLTableCellElement | null) | undefined;
        parent?: HTMLElement | undefined;
        colIndex?: number | undefined;
        rowIndex?: number | undefined;
        component?: string | undefined;
        componentProps?: Record<string, any> | undefined;
        bottom?: number | undefined;
        height?: number | undefined;
        left?: number | undefined;
        width?: number | undefined;
    }>;
    rows: import("vue").Ref<{
        [x: string]: any;
        indent?: number | undefined;
        parent?: number | undefined;
        gantt?: {
            color?: string | undefined;
            startIndex?: number | undefined;
            endIndex?: number | undefined;
            colspan?: number | undefined;
        } | undefined;
    }[], TableRow[] | {
        [x: string]: any;
        indent?: number | undefined;
        parent?: number | undefined;
        gantt?: {
            color?: string | undefined;
            startIndex?: number | undefined;
            endIndex?: number | undefined;
            colspan?: number | undefined;
        } | undefined;
    }[]>;
    table: import("vue").ComputedRef<{}>;
    updates: import("vue").Ref<Record<string, string>, Record<string, string>>;
    hasPinnedColumns: import("vue").ComputedRef<boolean>;
    isGanttView: import("vue").ComputedRef<boolean>;
    isTreeView: import("vue").ComputedRef<boolean>;
    numberedRowWidth: import("vue").ComputedRef<string>;
    zeroColumn: import("vue").ComputedRef<boolean>;
    closeModal: (event: MouseEvent) => void;
    createConnection: (fromHandleId: string, toHandleId: string, options?: {
        style?: ConnectionPath["style"];
        label?: string;
    }) => ConnectionPath | null;
    deleteConnection: (connectionId: string) => boolean;
    getCellData: <T = any>(colIndex: number, rowIndex: number) => T;
    getCellDisplayValue: (colIndex: number, rowIndex: number) => any;
    getConnectionsForBar: (barId: string) => {
        id: string;
        from: {
            barId: string;
            side: "left" | "right";
        };
        to: {
            barId: string;
            side: "left" | "right";
        };
        style?: {
            color?: string | undefined;
            width?: number | undefined;
        } | undefined;
        label?: string | undefined;
    }[];
    getFormattedValue: (colIndex: number, rowIndex: number, value: any) => any;
    getHandlesForBar: (barId: string) => {
        id: string;
        rowIndex: number;
        colIndex: number;
        side: "left" | "right";
        position: {
            x: number;
            y: number;
        };
        visible: boolean;
        barId: string;
    }[];
    getHeaderCellStyle: (column: TableColumn) => CSSProperties;
    getIndent: (colIndex: number, indentLevel?: number) => string;
    getRowExpandSymbol: (rowIndex: number) => "" | "▼" | "►";
    isRowGantt: (rowIndex: number) => boolean;
    isRowVisible: (rowIndex: number) => boolean | undefined;
    registerConnectionHandle: (handleInfo: ConnectionHandle) => void;
    registerGanttBar: (barInfo: GanttBarInfo) => void;
    resizeColumn: (colIndex: number, newWidth: number) => void;
    setCellData: (colIndex: number, rowIndex: number, value: any) => void;
    setCellText: (colIndex: number, rowIndex: number, value: string) => void;
    toggleRowExpand: (rowIndex: number) => void;
    unregisterConnectionHandle: (handleId: string) => void;
    unregisterGanttBar: (barId: string) => void;
    updateGanttBar: (event: GanttDragEvent) => void;
    updateRows: (newRows: TableRow[]) => void;
}, "closeModal" | "createConnection" | "deleteConnection" | "getCellData" | "getCellDisplayValue" | "getConnectionsForBar" | "getFormattedValue" | "getHandlesForBar" | "getHeaderCellStyle" | "getIndent" | "getRowExpandSymbol" | "isRowGantt" | "isRowVisible" | "registerConnectionHandle" | "registerGanttBar" | "resizeColumn" | "setCellData" | "setCellText" | "toggleRowExpand" | "unregisterConnectionHandle" | "unregisterGanttBar" | "updateGanttBar" | "updateRows">>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| initData | `{ columns: TableColumn[]; rows: TableRow[]; id?: string; config?: TableConfig; modal?: TableModal; }` |  |

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

### TableDisplay

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
| childrenOpen? | `boolean` |  |
| expanded? | `boolean` |  |
| indent? | `number` |  |
| isParent? | `boolean` |  |
| isRoot? | `boolean` |  |
| open? | `boolean` |  |
| parent? | `number` |  |
| rowModified? | `boolean` |  |

### TableModal

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
| bottom? | `ReturnType<typeof useElementBounding>['bottom']` |  |
| cell? | `HTMLTableCellElement \| null` |  |
| colIndex? | `number` |  |
| component? | `string` |  |
| componentProps? | `Record<string, any>` |  |
| height? | `ReturnType<typeof useElementBounding>['height']` |  |
| left? | `ReturnType<typeof useElementBounding>['left']` |  |
| parent? | `HTMLElement` |  |
| rowIndex? | `number` |  |
| visible? | `boolean` |  |
| width? | `ReturnType<typeof useElementBounding>['width']` |  |

### TableModalProps

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
| colIndex | `number` |  |
| rowIndex | `number` |  |
| store | `ReturnType<typeof createTableStore>` |  |

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

### ConnectionEvent

**Definition:**

```typescript
export type ConnectionEvent = {
    type: 'create' | 'delete';
    connection: ConnectionPath;
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

