---
title: ATable API Reference
description: Advanced table with tree and Gantt views
---

# Atable API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### ACell

Vue component exported from @stonecrop/atable.

```typescript
import { ACell } from '@stonecrop/atable'
```

### AddIcon

Vue component exported from @stonecrop/atable.

```typescript
import { AddIcon } from '@stonecrop/atable'
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

### ARowActions

Vue component exported from @stonecrop/atable.

```typescript
import { ARowActions } from '@stonecrop/atable'
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

### DeleteIcon

Vue component exported from @stonecrop/atable.

```typescript
import { DeleteIcon } from '@stonecrop/atable'
```

### DuplicateIcon

Vue component exported from @stonecrop/atable.

```typescript
import { DuplicateIcon } from '@stonecrop/atable'
```

### InsertAboveIcon

Vue component exported from @stonecrop/atable.

```typescript
import { InsertAboveIcon } from '@stonecrop/atable'
```

### InsertBelowIcon

Vue component exported from @stonecrop/atable.

```typescript
import { InsertBelowIcon } from '@stonecrop/atable'
```

### MoveIcon

Vue component exported from @stonecrop/atable.

```typescript
import { MoveIcon } from '@stonecrop/atable'
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
        format?: string | ((value: any, context: CellContext) => string) | undefined;
        modalComponent?: string | ((context: CellContext) => string) | undefined;
        mask?: ((value: any) => any) | undefined;
        readonly originalIndex?: number | undefined;
        fieldtype?: string | undefined;
        label?: string | undefined;
        align?: "left" | "right" | "center" | "start" | "end" | undefined;
        edit?: boolean | undefined;
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
        modalComponentExtraProps?: Record<string, any> | undefined;
        isGantt?: boolean | undefined;
        ganttComponent?: string | undefined;
        colspan?: number | undefined;
    }[], TableColumn[] | {
        name: string;
        format?: string | ((value: any, context: CellContext) => string) | undefined;
        modalComponent?: string | ((context: CellContext) => string) | undefined;
        mask?: ((value: any) => any) | undefined;
        readonly originalIndex?: number | undefined;
        fieldtype?: string | undefined;
        label?: string | undefined;
        align?: "left" | "right" | "center" | "start" | "end" | undefined;
        edit?: boolean | undefined;
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
        modalComponentExtraProps?: Record<string, any> | undefined;
        isGantt?: boolean | undefined;
        ganttComponent?: string | undefined;
        colspan?: number | undefined;
    }[]>;
    config: import("vue").Ref<{
        view?: "uncounted" | "list" | "list-expansion" | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "tree";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "gantt";
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "tree-gantt";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    }, TableConfig | {
        view?: "uncounted" | "list" | "list-expansion" | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "tree";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "gantt";
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "tree-gantt";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
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
    filterState: import("vue").Ref<FilterStateRecord, FilterStateRecord>;
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
    table: import("vue").ComputedRef<Record<string, any>>;
    updates: import("vue").Ref<Record<string, string>, Record<string, string>>;
    filteredRows: import("vue").ComputedRef<(TableRow & {
        originalIndex: number;
    })[]>;
    hasPinnedColumns: import("vue").ComputedRef<boolean>;
    isGanttView: import("vue").ComputedRef<boolean>;
    isTreeView: import("vue").ComputedRef<boolean>;
    isDependencyGraphEnabled: import("vue").ComputedRef<boolean>;
    numberedRowWidth: import("vue").ComputedRef<string>;
    zeroColumn: import("vue").ComputedRef<boolean>;
    addRow: (rowData?: Partial<TableRow>, position?: "start" | "end" | number) => number;
    clearFilter: (colIndex: number) => void;
    closeModal: (event: MouseEvent) => void;
    createConnection: (fromHandleId: string, toHandleId: string, options?: {
        style?: ConnectionPath["style"];
        label?: string;
    }) => ConnectionPath | null;
    deleteConnection: (connectionId: string) => boolean;
    deleteRow: (rowIndex: number) => TableRow | null;
    duplicateRow: (rowIndex: number) => number;
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
    insertRowAbove: (rowIndex: number, rowData?: Partial<TableRow>) => number;
    insertRowBelow: (rowIndex: number, rowData?: Partial<TableRow>) => number;
    isRowGantt: (rowIndex: number) => boolean;
    isRowVisible: (rowIndex: number) => boolean | undefined;
    moveRow: (fromIndex: number, toIndex: number) => boolean;
    registerConnectionHandle: (handleInfo: ConnectionHandle) => void;
    registerGanttBar: (barInfo: GanttBarInfo) => void;
    resizeColumn: (colIndex: number, newWidth: number) => void;
    setCellData: (colIndex: number, rowIndex: number, value: any) => void;
    setCellText: (colIndex: number, rowIndex: number, value: string) => void;
    setFilter: (colIndex: number, filter: FilterState) => void;
    sortByColumn: (colIndex: number) => void;
    toggleRowExpand: (rowIndex: number) => void;
    unregisterConnectionHandle: (handleId: string) => void;
    unregisterGanttBar: (barId: string) => void;
    updateGanttBar: (event: GanttDragEvent) => void;
    updateRows: (newRows: TableRow[]) => void;
}, "columns" | "config" | "connectionHandles" | "connectionPaths" | "filterState" | "ganttBars" | "modal" | "rows" | "sortState" | "updates">, Pick<{
    columns: import("vue").Ref<{
        name: string;
        format?: string | ((value: any, context: CellContext) => string) | undefined;
        modalComponent?: string | ((context: CellContext) => string) | undefined;
        mask?: ((value: any) => any) | undefined;
        readonly originalIndex?: number | undefined;
        fieldtype?: string | undefined;
        label?: string | undefined;
        align?: "left" | "right" | "center" | "start" | "end" | undefined;
        edit?: boolean | undefined;
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
        modalComponentExtraProps?: Record<string, any> | undefined;
        isGantt?: boolean | undefined;
        ganttComponent?: string | undefined;
        colspan?: number | undefined;
    }[], TableColumn[] | {
        name: string;
        format?: string | ((value: any, context: CellContext) => string) | undefined;
        modalComponent?: string | ((context: CellContext) => string) | undefined;
        mask?: ((value: any) => any) | undefined;
        readonly originalIndex?: number | undefined;
        fieldtype?: string | undefined;
        label?: string | undefined;
        align?: "left" | "right" | "center" | "start" | "end" | undefined;
        edit?: boolean | undefined;
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
        modalComponentExtraProps?: Record<string, any> | undefined;
        isGantt?: boolean | undefined;
        ganttComponent?: string | undefined;
        colspan?: number | undefined;
    }[]>;
    config: import("vue").Ref<{
        view?: "uncounted" | "list" | "list-expansion" | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "tree";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "gantt";
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "tree-gantt";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    }, TableConfig | {
        view?: "uncounted" | "list" | "list-expansion" | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "tree";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "gantt";
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "tree-gantt";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
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
    filterState: import("vue").Ref<FilterStateRecord, FilterStateRecord>;
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
    table: import("vue").ComputedRef<Record<string, any>>;
    updates: import("vue").Ref<Record<string, string>, Record<string, string>>;
    filteredRows: import("vue").ComputedRef<(TableRow & {
        originalIndex: number;
    })[]>;
    hasPinnedColumns: import("vue").ComputedRef<boolean>;
    isGanttView: import("vue").ComputedRef<boolean>;
    isTreeView: import("vue").ComputedRef<boolean>;
    isDependencyGraphEnabled: import("vue").ComputedRef<boolean>;
    numberedRowWidth: import("vue").ComputedRef<string>;
    zeroColumn: import("vue").ComputedRef<boolean>;
    addRow: (rowData?: Partial<TableRow>, position?: "start" | "end" | number) => number;
    clearFilter: (colIndex: number) => void;
    closeModal: (event: MouseEvent) => void;
    createConnection: (fromHandleId: string, toHandleId: string, options?: {
        style?: ConnectionPath["style"];
        label?: string;
    }) => ConnectionPath | null;
    deleteConnection: (connectionId: string) => boolean;
    deleteRow: (rowIndex: number) => TableRow | null;
    duplicateRow: (rowIndex: number) => number;
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
    insertRowAbove: (rowIndex: number, rowData?: Partial<TableRow>) => number;
    insertRowBelow: (rowIndex: number, rowData?: Partial<TableRow>) => number;
    isRowGantt: (rowIndex: number) => boolean;
    isRowVisible: (rowIndex: number) => boolean | undefined;
    moveRow: (fromIndex: number, toIndex: number) => boolean;
    registerConnectionHandle: (handleInfo: ConnectionHandle) => void;
    registerGanttBar: (barInfo: GanttBarInfo) => void;
    resizeColumn: (colIndex: number, newWidth: number) => void;
    setCellData: (colIndex: number, rowIndex: number, value: any) => void;
    setCellText: (colIndex: number, rowIndex: number, value: string) => void;
    setFilter: (colIndex: number, filter: FilterState) => void;
    sortByColumn: (colIndex: number) => void;
    toggleRowExpand: (rowIndex: number) => void;
    unregisterConnectionHandle: (handleId: string) => void;
    unregisterGanttBar: (barId: string) => void;
    updateGanttBar: (event: GanttDragEvent) => void;
    updateRows: (newRows: TableRow[]) => void;
}, "display" | "table" | "filteredRows" | "hasPinnedColumns" | "isGanttView" | "isTreeView" | "isDependencyGraphEnabled" | "numberedRowWidth" | "zeroColumn">, Pick<{
    columns: import("vue").Ref<{
        name: string;
        format?: string | ((value: any, context: CellContext) => string) | undefined;
        modalComponent?: string | ((context: CellContext) => string) | undefined;
        mask?: ((value: any) => any) | undefined;
        readonly originalIndex?: number | undefined;
        fieldtype?: string | undefined;
        label?: string | undefined;
        align?: "left" | "right" | "center" | "start" | "end" | undefined;
        edit?: boolean | undefined;
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
        modalComponentExtraProps?: Record<string, any> | undefined;
        isGantt?: boolean | undefined;
        ganttComponent?: string | undefined;
        colspan?: number | undefined;
    }[], TableColumn[] | {
        name: string;
        format?: string | ((value: any, context: CellContext) => string) | undefined;
        modalComponent?: string | ((context: CellContext) => string) | undefined;
        mask?: ((value: any) => any) | undefined;
        readonly originalIndex?: number | undefined;
        fieldtype?: string | undefined;
        label?: string | undefined;
        align?: "left" | "right" | "center" | "start" | "end" | undefined;
        edit?: boolean | undefined;
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
        modalComponentExtraProps?: Record<string, any> | undefined;
        isGantt?: boolean | undefined;
        ganttComponent?: string | undefined;
        colspan?: number | undefined;
    }[]>;
    config: import("vue").Ref<{
        view?: "uncounted" | "list" | "list-expansion" | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "tree";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "gantt";
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "tree-gantt";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    }, TableConfig | {
        view?: "uncounted" | "list" | "list-expansion" | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "tree";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "gantt";
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    } | {
        view: "tree-gantt";
        defaultTreeExpansion?: "root" | "branch" | "leaf" | undefined;
        dependencyGraph?: boolean | undefined;
        fullWidth?: boolean | undefined;
        rowActions?: {
            enabled: boolean;
            position?: "before-index" | "after-index" | "end" | undefined;
            dropdownThreshold?: number | undefined;
            forceDropdown?: boolean | undefined;
            actions?: {
                add?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                delete?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                duplicate?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertAbove?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                insertBelow?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
                move?: boolean | {
                    enabled?: boolean | undefined;
                    label?: string | undefined;
                    icon?: string | undefined;
                    handler?: ((rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean) | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
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
    filterState: import("vue").Ref<FilterStateRecord, FilterStateRecord>;
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
    table: import("vue").ComputedRef<Record<string, any>>;
    updates: import("vue").Ref<Record<string, string>, Record<string, string>>;
    filteredRows: import("vue").ComputedRef<(TableRow & {
        originalIndex: number;
    })[]>;
    hasPinnedColumns: import("vue").ComputedRef<boolean>;
    isGanttView: import("vue").ComputedRef<boolean>;
    isTreeView: import("vue").ComputedRef<boolean>;
    isDependencyGraphEnabled: import("vue").ComputedRef<boolean>;
    numberedRowWidth: import("vue").ComputedRef<string>;
    zeroColumn: import("vue").ComputedRef<boolean>;
    addRow: (rowData?: Partial<TableRow>, position?: "start" | "end" | number) => number;
    clearFilter: (colIndex: number) => void;
    closeModal: (event: MouseEvent) => void;
    createConnection: (fromHandleId: string, toHandleId: string, options?: {
        style?: ConnectionPath["style"];
        label?: string;
    }) => ConnectionPath | null;
    deleteConnection: (connectionId: string) => boolean;
    deleteRow: (rowIndex: number) => TableRow | null;
    duplicateRow: (rowIndex: number) => number;
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
    insertRowAbove: (rowIndex: number, rowData?: Partial<TableRow>) => number;
    insertRowBelow: (rowIndex: number, rowData?: Partial<TableRow>) => number;
    isRowGantt: (rowIndex: number) => boolean;
    isRowVisible: (rowIndex: number) => boolean | undefined;
    moveRow: (fromIndex: number, toIndex: number) => boolean;
    registerConnectionHandle: (handleInfo: ConnectionHandle) => void;
    registerGanttBar: (barInfo: GanttBarInfo) => void;
    resizeColumn: (colIndex: number, newWidth: number) => void;
    setCellData: (colIndex: number, rowIndex: number, value: any) => void;
    setCellText: (colIndex: number, rowIndex: number, value: string) => void;
    setFilter: (colIndex: number, filter: FilterState) => void;
    sortByColumn: (colIndex: number) => void;
    toggleRowExpand: (rowIndex: number) => void;
    unregisterConnectionHandle: (handleId: string) => void;
    unregisterGanttBar: (barId: string) => void;
    updateGanttBar: (event: GanttDragEvent) => void;
    updateRows: (newRows: TableRow[]) => void;
}, "addRow" | "clearFilter" | "closeModal" | "createConnection" | "deleteConnection" | "deleteRow" | "duplicateRow" | "getCellData" | "getCellDisplayValue" | "getConnectionsForBar" | "getFormattedValue" | "getHandlesForBar" | "getHeaderCellStyle" | "getIndent" | "getRowExpandSymbol" | "insertRowAbove" | "insertRowBelow" | "isRowGantt" | "isRowVisible" | "moveRow" | "registerConnectionHandle" | "registerGanttBar" | "resizeColumn" | "setCellData" | "setCellText" | "setFilter" | "sortByColumn" | "toggleRowExpand" | "unregisterConnectionHandle" | "unregisterGanttBar" | "updateGanttBar" | "updateRows">>
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

### schemaToColumns

Convert an array of doctype field descriptors into ATable column definitions.

Fields are excluded when: - `hidden: true` — field should not be visible in any view - no `fieldtype` — non-scalar entry (nested table or fieldset), has no column equivalent

`fieldname` is renamed to `name`; `hidden` is stripped. All other `ColumnSchema` properties spread through automatically.

**Signature:**

```typescript
export declare function schemaToColumns(schema: ColumnSchema[]): TableColumn[];
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| schema | `ColumnSchema[]` |  |

## Interfaces

### BaseTableConfig

Base table configuration properties shared across all view types.

**Definition:**

```typescript
export interface BaseTableConfig {
  fullWidth?: boolean;
  rowActions?: RowActionsConfig;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| fullWidth? | `boolean` | Control whether the table should be allowed to use the full width of its container. |
| rowActions? | `RowActionsConfig` | Configuration for row-level actions (add, delete, duplicate, etc.). |

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

### FilterState

Represents the state of a single filter

**Definition:**

```typescript
export interface FilterState {
  endValue?: any;
  startValue?: any;
  value: any;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| endValue? | `any` | End value for date range filters |
| startValue? | `any` | Start value for date range filters |
| value | `any` | The main filter value |

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

### RowActionOptions

Options for configuring individual row actions.

**Definition:**

```typescript
export interface RowActionOptions {
  enabled?: boolean;
  handler?: (rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean;
  icon?: string;
  label?: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| enabled? | `boolean` | Whether the action is enabled. |
| handler? | `(rowIndex: number, store: ReturnType<typeof createTableStore>) => void \| boolean` | Custom handler for the action. Return false to prevent the default behavior. |
| icon? | `string` | Custom icon override (raw SVG string). |
| label? | `string` | Custom label for the action (used in dropdown mode). |

### RowActionsConfig

Configuration for row-level actions (add, delete, duplicate, etc.).

**Definition:**

```typescript
export interface RowActionsConfig {
  actions?: {
        add?: boolean | RowActionOptions;
        delete?: boolean | RowActionOptions;
        duplicate?: boolean | RowActionOptions;
        insertAbove?: boolean | RowActionOptions;
        insertBelow?: boolean | RowActionOptions;
        move?: boolean | RowActionOptions;
    };
  dropdownThreshold?: number;
  enabled: boolean;
  forceDropdown?: boolean;
  position?: 'before-index' | 'after-index' | 'end';
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| actions? | `{ add?: boolean \| RowActionOptions; delete?: boolean \| RowActionOptions; duplicate?: boolean \| RowActionOptions; insertAbove?: boolean \| RowActionOptions; insertBelow?: boolean \| RowActionOptions; move?: boolean \| RowActionOptions; }` | Configuration for individual actions. Set to true to enable with defaults, false to disable, or provide RowActionOptions for custom configuration. |
| dropdownThreshold? | `number` | Pixel width threshold at which to switch from icons to dropdown mode. Set to 0 to always use icons, or a large number to always use dropdown. |
| enabled | `boolean` | Whether row actions are enabled. |
| forceDropdown? | `boolean` | Force dropdown mode regardless of available width. |
| position? | `'before-index' \| 'after-index' \| 'end'` | Position of the row actions column relative to the index column. |

### RowAddEvent

Event payload for row:add event.

**Definition:**

```typescript
export interface RowAddEvent {
  row: TableRow;
  rowIndex: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| row | `TableRow` |  |
| rowIndex | `number` |  |

### RowDeleteEvent

Event payload for row:delete event.

**Definition:**

```typescript
export interface RowDeleteEvent {
  row: TableRow;
  rowIndex: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| row | `TableRow` |  |
| rowIndex | `number` |  |

### RowDuplicateEvent

Event payload for row:duplicate event.

**Definition:**

```typescript
export interface RowDuplicateEvent {
  newIndex: number;
  row: TableRow;
  sourceIndex: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| newIndex | `number` |  |
| row | `TableRow` |  |
| sourceIndex | `number` |  |

### RowInsertEvent

Event payload for row:insert-above and row:insert-below events.

**Definition:**

```typescript
export interface RowInsertEvent {
  newIndex: number;
  row: TableRow;
  targetIndex: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| newIndex | `number` |  |
| row | `TableRow` |  |
| targetIndex | `number` |  |

### RowMoveEvent

Event payload for row:move event.

**Definition:**

```typescript
export interface RowMoveEvent {
  fromIndex: number;
  toIndex: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| fromIndex | `number` |  |
| toIndex | `number` |  |

### TableColumn

Runtime column definition for ATable.

Extends `ColumnSchema` from `@stonecrop/schema` — all authoring properties (`label`, `fieldtype`, `width`, `pinned`, filter config, cell/modal component names, etc.) are inherited. The overrides below widen three properties for runtime use (live functions, broader alignment values) and add two runtime-only additions (`mask`, `originalIndex`).

Schema-based callers should author columns as `ColumnSchema[]` (using `fieldname`) and pass them via ATable's `:schema` prop — `TableColumn` is the internal runtime type and callers working from a doctype schema never need to construct it directly.

**Definition:**

```typescript
export interface TableColumn {
  format?: string | ((value: any, context: CellContext) => string);
  mask?: (value: any) => any;
  modalComponent?: string | ((context: CellContext) => string);
  name: string;
  originalIndex?: number;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| format? | `string \| ((value: any, context: CellContext) => string)` | Widens `ColumnSchema.format` (string-only) to also accept a live function at runtime. Serialized string functions are deserialized by the table store's `getFormattedValue`. |
| mask? | `(value: any) => any` | Input mask applied to the cell value before display. Accepts a live function only — masks cannot be serialized to JSON so they are absent from `ColumnSchema`. |
| modalComponent? | `string \| ((context: CellContext) => string)` | Widens `ColumnSchema.modalComponent` (string-only) to also accept a factory function. When a function is provided it receives the cell context and returns the component name. The cell context exposes: - `row` — the row object for the current cell - `column` — the column object for the current cell - `table` — the table object |
| name | `string` | Runtime column key. Corresponds to `fieldname` in `ColumnSchema`; populated by `schemaToColumns`. |
| originalIndex? | `number` | Runtime Gantt column index (excluding pinned columns). Set automatically during Gantt table rendering. |

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

### FilterStateRecord

Record mapping column indices to their filter states

**Definition:**

```typescript
export type FilterStateRecord = Record<number, FilterState>;
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

### RowActionType

Row action type identifiers.

**Definition:**

```typescript
export type RowActionType = 'add' | 'delete' | 'duplicate' | 'insertAbove' | 'insertBelow' | 'move';
```

### TableConfig

Table configuration definition using discriminated unions for type safety.

**Definition:**

```typescript
export type TableConfig = BasicTableConfig | TreeTableConfig | GanttTableConfig | TreeGanttTableConfig;
```

## Variables

### actionIcons

Map of action types to their default icons.

**Type:**

```typescript
export const actionIcons: Record<string, string>
```

