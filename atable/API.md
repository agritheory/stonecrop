# Atable API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

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

## Functions

### createTableStore

Create a table store

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
        sortable?: boolean | undefined;
        filterable?: boolean | undefined;
        filterType?: "text" | "select" | "number" | "date" | "dateRange" | "checkbox" | "component" | undefined;
        filterOptions?: any[] | undefined;
        filterComponent?: string | undefined;
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
        sortable?: boolean | undefined;
        filterable?: boolean | undefined;
        filterType?: "text" | "select" | "number" | "date" | "dateRange" | "checkbox" | "component" | undefined;
        filterOptions?: any[] | undefined;
        filterComponent?: string | undefined;
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
        view?: "uncounted" | "list" | "list-expansion" | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "tree";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "gantt";
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "tree-gantt";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
    }, TableConfig | {
        view?: "uncounted" | "list" | "list-expansion" | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "tree";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "gantt";
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "tree-gantt";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        dependencyGraph?: boolean | undefined;
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
    filterState: import("vue").Ref<Record<number, {
        value: any;
        startValue?: any;
        endValue?: any;
    }>, Record<number, {
        value: any;
        startValue?: any;
        endValue?: any;
    }>>;
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
    sortState: import("vue").Ref<{
        column: number | null;
        direction: "asc" | "desc" | null;
    }, {
        column: number | null;
        direction: "asc" | "desc" | null;
    } | {
        column: number | null;
        direction: "asc" | "desc" | null;
    }>;
    table: import("vue").ComputedRef<{}>;
    updates: import("vue").Ref<Record<string, string>, Record<string, string>>;
    filteredRows: import("vue").ComputedRef<{
        originalIndex: number;
        indent?: number | undefined;
        parent?: number | undefined;
        gantt?: {
            color?: string | undefined;
            startIndex?: number | undefined;
            endIndex?: number | undefined;
            colspan?: number | undefined;
        } | undefined;
    }[]>;
    hasPinnedColumns: import("vue").ComputedRef<boolean>;
    isGanttView: import("vue").ComputedRef<boolean>;
    isTreeView: import("vue").ComputedRef<boolean>;
    isDependencyGraphEnabled: import("vue").ComputedRef<boolean>;
    numberedRowWidth: import("vue").ComputedRef<string>;
    zeroColumn: import("vue").ComputedRef<boolean>;
    clearFilter: (colIndex: number) => void;
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
    setFilter: (colIndex: number, filter: {
        value: any;
        startValue?: any;
        endValue?: any;
    }) => void;
    sortByColumn: (colIndex: number) => void;
    toggleRowExpand: (rowIndex: number) => void;
    unregisterConnectionHandle: (handleId: string) => void;
    unregisterGanttBar: (barId: string) => void;
    updateGanttBar: (event: GanttDragEvent) => void;
    updateRows: (newRows: TableRow[]) => void;
}, "columns" | "config" | "connectionHandles" | "connectionPaths" | "filterState" | "ganttBars" | "modal" | "rows" | "sortState" | "updates">, Pick<{
    columns: import("vue").Ref<{
        name: string;
        align?: CanvasTextAlign | undefined;
        edit?: boolean | undefined;
        label?: string | undefined;
        type?: string | undefined;
        width?: string | undefined;
        pinned?: boolean | undefined;
        resizable?: boolean | undefined;
        sortable?: boolean | undefined;
        filterable?: boolean | undefined;
        filterType?: "text" | "select" | "number" | "date" | "dateRange" | "checkbox" | "component" | undefined;
        filterOptions?: any[] | undefined;
        filterComponent?: string | undefined;
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
        sortable?: boolean | undefined;
        filterable?: boolean | undefined;
        filterType?: "text" | "select" | "number" | "date" | "dateRange" | "checkbox" | "component" | undefined;
        filterOptions?: any[] | undefined;
        filterComponent?: string | undefined;
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
        view?: "uncounted" | "list" | "list-expansion" | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "tree";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "gantt";
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "tree-gantt";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
    }, TableConfig | {
        view?: "uncounted" | "list" | "list-expansion" | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "tree";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "gantt";
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "tree-gantt";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        dependencyGraph?: boolean | undefined;
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
    filterState: import("vue").Ref<Record<number, {
        value: any;
        startValue?: any;
        endValue?: any;
    }>, Record<number, {
        value: any;
        startValue?: any;
        endValue?: any;
    }>>;
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
    sortState: import("vue").Ref<{
        column: number | null;
        direction: "asc" | "desc" | null;
    }, {
        column: number | null;
        direction: "asc" | "desc" | null;
    } | {
        column: number | null;
        direction: "asc" | "desc" | null;
    }>;
    table: import("vue").ComputedRef<{}>;
    updates: import("vue").Ref<Record<string, string>, Record<string, string>>;
    filteredRows: import("vue").ComputedRef<{
        originalIndex: number;
        indent?: number | undefined;
        parent?: number | undefined;
        gantt?: {
            color?: string | undefined;
            startIndex?: number | undefined;
            endIndex?: number | undefined;
            colspan?: number | undefined;
        } | undefined;
    }[]>;
    hasPinnedColumns: import("vue").ComputedRef<boolean>;
    isGanttView: import("vue").ComputedRef<boolean>;
    isTreeView: import("vue").ComputedRef<boolean>;
    isDependencyGraphEnabled: import("vue").ComputedRef<boolean>;
    numberedRowWidth: import("vue").ComputedRef<string>;
    zeroColumn: import("vue").ComputedRef<boolean>;
    clearFilter: (colIndex: number) => void;
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
    setFilter: (colIndex: number, filter: {
        value: any;
        startValue?: any;
        endValue?: any;
    }) => void;
    sortByColumn: (colIndex: number) => void;
    toggleRowExpand: (rowIndex: number) => void;
    unregisterConnectionHandle: (handleId: string) => void;
    unregisterGanttBar: (barId: string) => void;
    updateGanttBar: (event: GanttDragEvent) => void;
    updateRows: (newRows: TableRow[]) => void;
}, "display" | "table" | "filteredRows" | "hasPinnedColumns" | "isGanttView" | "isTreeView" | "isDependencyGraphEnabled" | "numberedRowWidth" | "zeroColumn">, Pick<{
    columns: import("vue").Ref<{
        name: string;
        align?: CanvasTextAlign | undefined;
        edit?: boolean | undefined;
        label?: string | undefined;
        type?: string | undefined;
        width?: string | undefined;
        pinned?: boolean | undefined;
        resizable?: boolean | undefined;
        sortable?: boolean | undefined;
        filterable?: boolean | undefined;
        filterType?: "text" | "select" | "number" | "date" | "dateRange" | "checkbox" | "component" | undefined;
        filterOptions?: any[] | undefined;
        filterComponent?: string | undefined;
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
        sortable?: boolean | undefined;
        filterable?: boolean | undefined;
        filterType?: "text" | "select" | "number" | "date" | "dateRange" | "checkbox" | "component" | undefined;
        filterOptions?: any[] | undefined;
        filterComponent?: string | undefined;
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
        view?: "uncounted" | "list" | "list-expansion" | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "tree";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "gantt";
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "tree-gantt";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
    }, TableConfig | {
        view?: "uncounted" | "list" | "list-expansion" | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "tree";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "gantt";
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
    } | {
        view: "tree-gantt";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        dependencyGraph?: boolean | undefined;
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
    filterState: import("vue").Ref<Record<number, {
        value: any;
        startValue?: any;
        endValue?: any;
    }>, Record<number, {
        value: any;
        startValue?: any;
        endValue?: any;
    }>>;
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
    sortState: import("vue").Ref<{
        column: number | null;
        direction: "asc" | "desc" | null;
    }, {
        column: number | null;
        direction: "asc" | "desc" | null;
    } | {
        column: number | null;
        direction: "asc" | "desc" | null;
    }>;
    table: import("vue").ComputedRef<{}>;
    updates: import("vue").Ref<Record<string, string>, Record<string, string>>;
    filteredRows: import("vue").ComputedRef<{
        originalIndex: number;
        indent?: number | undefined;
        parent?: number | undefined;
        gantt?: {
            color?: string | undefined;
            startIndex?: number | undefined;
            endIndex?: number | undefined;
            colspan?: number | undefined;
        } | undefined;
    }[]>;
    hasPinnedColumns: import("vue").ComputedRef<boolean>;
    isGanttView: import("vue").ComputedRef<boolean>;
    isTreeView: import("vue").ComputedRef<boolean>;
    isDependencyGraphEnabled: import("vue").ComputedRef<boolean>;
    numberedRowWidth: import("vue").ComputedRef<string>;
    zeroColumn: import("vue").ComputedRef<boolean>;
    clearFilter: (colIndex: number) => void;
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
    setFilter: (colIndex: number, filter: {
        value: any;
        startValue?: any;
        endValue?: any;
    }) => void;
    sortByColumn: (colIndex: number) => void;
    toggleRowExpand: (rowIndex: number) => void;
    unregisterConnectionHandle: (handleId: string) => void;
    unregisterGanttBar: (barId: string) => void;
    updateGanttBar: (event: GanttDragEvent) => void;
    updateRows: (newRows: TableRow[]) => void;
}, "clearFilter" | "closeModal" | "createConnection" | "deleteConnection" | "getCellData" | "getCellDisplayValue" | "getConnectionsForBar" | "getFormattedValue" | "getHandlesForBar" | "getHeaderCellStyle" | "getIndent" | "getRowExpandSymbol" | "isRowGantt" | "isRowVisible" | "registerConnectionHandle" | "registerGanttBar" | "resizeColumn" | "setCellData" | "setCellText" | "setFilter" | "sortByColumn" | "toggleRowExpand" | "unregisterConnectionHandle" | "unregisterGanttBar" | "updateGanttBar" | "updateRows">>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| initData | `{ columns: TableColumn[]; rows: TableRow[]; id?: string; config?: TableConfig; modal?: TableModal; }` | Initial data for the table store |

### install

Install all ATable components

**Signature:**

```typescript
declare function install(app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| app | `App` | Vue app instance |

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

### ConnectionEvent

Connection event for handling connection creation/deletion.

**Definition:**

```typescript
export type ConnectionEvent = {
    type: 'create' | 'delete';
    connection: ConnectionPath;
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

### TableConfig

Table configuration definition using discriminated unions for type safety.

**Definition:**

```typescript
export type TableConfig = BasicTableConfig | TreeTableConfig | GanttTableConfig | TreeGanttTableConfig;
```

