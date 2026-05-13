import { useElementBounding } from '@vueuse/core'
import type { Ref, ShallowRef } from 'vue'

import type { ColumnSchema } from '@stonecrop/schema'

import { createTableStore } from '../stores/table'

/**
 * Runtime column definition for ATable.
 *
 * Extends `ColumnSchema` from `@stonecrop/schema` — all authoring properties (`label`, `fieldtype`, `width`,
 * `pinned`, filter config, cell/modal component names, etc.) are inherited. The overrides
 * below widen three properties for runtime use (live functions, broader alignment values)
 * and add two runtime-only additions (`mask`, `originalIndex`).
 *
 * Schema-based callers should author columns as `ColumnSchema[]` (using `fieldname`) and
 * pass them via ATable's `:schema` prop — `TableColumn` is the internal runtime type and
 * callers working from a doctype schema never need to construct it directly.
 * @public
 */
export interface TableColumn extends Omit<ColumnSchema, 'fieldname' | 'hidden' | 'format' | 'modalComponent'> {
	/** Runtime column key. Corresponds to `fieldname` in `ColumnSchema`; populated by `schemaToColumns`. */
	name: string

	/**
	 * Widens `ColumnSchema.format` (string-only) to also accept a live function at runtime.
	 * Serialized string functions are deserialized by the table store's `getFormattedValue`.
	 */
	format?: string | ((value: any, context: CellContext) => string)

	/**
	 * Widens `ColumnSchema.modalComponent` (string-only) to also accept a factory function.
	 * When a function is provided it receives the cell context and returns the component name.
	 * The cell context exposes:
	 * - `row` — the row object for the current cell
	 * - `column` — the column object for the current cell
	 * - `table` — the table object
	 */
	modalComponent?: string | ((context: CellContext) => string)

	/**
	 * Input mask applied to the cell value before display. Accepts a live function only —
	 * masks cannot be serialized to JSON so they are absent from `ColumnSchema`.
	 */
	mask?: (value: any) => any

	/**
	 * Runtime Gantt column index (excluding pinned columns). Set automatically during
	 * Gantt table rendering.
	 */
	readonly originalIndex?: number
}

/**
 * Table cell context definition.
 * @public
 */
export interface CellContext {
	/**
	 * The row object for the current cell.
	 */
	row: TableRow

	/**
	 * The column object for the current cell.
	 */
	column: TableColumn

	/**
	 * The table object for the current cell.
	 */
	table: { [key: string]: any }
}

/**
 * Row action type identifiers.
 * @public
 */
export type RowActionType = 'add' | 'delete' | 'duplicate' | 'insertAbove' | 'insertBelow' | 'move'

/**
 * Options for configuring individual row actions.
 * @public
 */
export interface RowActionOptions {
	/**
	 * Whether the action is enabled.
	 *
	 * @defaultValue true
	 */
	enabled?: boolean

	/**
	 * Custom label for the action (used in dropdown mode).
	 */
	label?: string

	/**
	 * Custom icon override (raw SVG string).
	 */
	icon?: string

	/**
	 * Custom handler for the action. Return false to prevent the default behavior.
	 *
	 * @param rowIndex - The index of the row the action is being performed on
	 * @param store - The table store instance
	 * @returns void or false to prevent default behavior
	 */
	handler?: (rowIndex: number, store: ReturnType<typeof createTableStore>) => void | boolean
}

/**
 * Configuration for row-level actions (add, delete, duplicate, etc.).
 * @public
 */
export interface RowActionsConfig {
	/**
	 * Whether row actions are enabled.
	 *
	 * @defaultValue false
	 */
	enabled: boolean

	/**
	 * Position of the row actions column relative to the index column.
	 *
	 * @defaultValue 'before-index'
	 */
	position?: 'before-index' | 'after-index' | 'end'

	/**
	 * Pixel width threshold at which to switch from icons to dropdown mode.
	 * Set to 0 to always use icons, or a large number to always use dropdown.
	 *
	 * @defaultValue 150
	 */
	dropdownThreshold?: number

	/**
	 * Force dropdown mode regardless of available width.
	 *
	 * @defaultValue false
	 */
	forceDropdown?: boolean

	/**
	 * Configuration for individual actions. Set to true to enable with defaults,
	 * false to disable, or provide RowActionOptions for custom configuration.
	 */
	actions?: {
		add?: boolean | RowActionOptions
		delete?: boolean | RowActionOptions
		duplicate?: boolean | RowActionOptions
		insertAbove?: boolean | RowActionOptions
		insertBelow?: boolean | RowActionOptions
		move?: boolean | RowActionOptions
	}
}

/**
 * Base table configuration properties shared across all view types.
 * @public
 */
export interface BaseTableConfig {
	/**
	 * Control whether the table should be allowed to use the full width of its container.
	 *
	 * @defaultValue false
	 */
	fullWidth?: boolean

	/**
	 * Configuration for row-level actions (add, delete, duplicate, etc.).
	 */
	rowActions?: RowActionsConfig
}

/**
 * Table configuration for basic view types (uncounted, list, list-expansion).
 * @public
 */
export interface BasicTableConfig extends BaseTableConfig {
	/**
	 * The type of view to display the table in.
	 */
	view?: 'uncounted' | 'list' | 'list-expansion'
}

/**
 * Table configuration for tree view types.
 * @public
 */
export interface TreeTableConfig extends BaseTableConfig {
	/**
	 * The type of view to display the table in.
	 */
	view: 'tree'

	/**
	 * Default expansion state for tree views. Possible values:
	 * - `root` - Only top-level nodes are visible (fully collapsed)
	 * - `branch` - Shows minimal tree to display all gantt nodes. Expands only the necessary paths to gantt nodes, stops at gantt nodes with no gantt descendants
	 * - `leaf` - All nodes are visible (fully expanded)
	 *
	 * @defaultValue undefined (default behavior is 'leaf' mode)
	 */
	defaultTreeExpansion?: 'root' | 'branch' | 'leaf'
}

/**
 * Table configuration for gantt view types.
 * @public
 */
export interface GanttTableConfig extends BaseTableConfig {
	/**
	 * The type of view to display the table in.
	 */
	view: 'gantt'

	/**
	 * Control whether dependency graph connections should be enabled for Gantt views.
	 * When false, connection handles and dependency lines will be hidden.
	 *
	 * @defaultValue true
	 */
	dependencyGraph?: boolean
}

/**
 * Table configuration for tree-gantt view types.
 * @public
 */
export interface TreeGanttTableConfig extends BaseTableConfig {
	/**
	 * The type of view to display the table in.
	 */
	view: 'tree-gantt'

	/**
	 * Default expansion state for tree views. Possible values:
	 * - `root` - Only top-level nodes are visible (fully collapsed)
	 * - `branch` - Shows minimal tree to display all gantt nodes. Expands only the necessary paths to gantt nodes, stops at gantt nodes with no gantt descendants
	 * - `leaf` - All nodes are visible (fully expanded)
	 *
	 * @defaultValue undefined (default behavior is 'leaf' mode)
	 */
	defaultTreeExpansion?: 'root' | 'branch' | 'leaf'

	/**
	 * Control whether dependency graph connections should be enabled for Gantt views.
	 * When false, connection handles and dependency lines will be hidden.
	 *
	 * @defaultValue true
	 */
	dependencyGraph?: boolean
}

/**
 * Table configuration definition using discriminated unions for type safety.
 * @public
 */
export type TableConfig = BasicTableConfig | TreeTableConfig | GanttTableConfig | TreeGanttTableConfig

/**
 * Table display definition.
 * @public
 */
export interface TableDisplay {
	/**
	 * Indicates whether a row node is expanded or collapsed.
	 *
	 * Only applicable for list-expansion views.
	 *
	 * @defaultValue false
	 */
	expanded?: boolean

	/**
	 * Indicates whether a row node's child nodes are open or closed.
	 *
	 * Only applicable for tree views.
	 *
	 * @defaultValue false
	 */
	childrenOpen?: boolean

	/**
	 * Indicates whether a row node is a parent node. This is evaluated automatically
	 * while rendering the table.
	 *
	 * Only applicable for tree views.
	 */
	isParent?: boolean

	/**
	 * Indicates whether a row node is a root node. This is evaluated automatically
	 * while rendering the table.
	 *
	 * Only applicable for tree views.
	 */
	isRoot?: boolean

	/**
	 * Indicates whether a row node is visible. This is evaluated automatically
	 * while rendering the table.
	 *
	 * Only applicable for tree views.
	 */
	open?: boolean

	/**
	 * The indentation level of the row node.
	 *
	 * Only applicable for tree and gantt views.
	 *
	 * @defaultValue 0
	 */
	indent?: number

	/**
	 * The HTML parent element for the row node. This is evaluated automatically while rendering
	 * the table.
	 *
	 * Only applicable for tree and gantt views.
	 */
	parent?: number

	/**
	 * Indicates whether a row node has been modified. This is evaluated automatically when a cell
	 * is edited.
	 *
	 * @defaultValue false
	 */
	rowModified?: boolean
}

/**
 * Table row definition.
 * @public
 */
export interface TableRow {
	/**
	 * Additional arbitrary properties that can be passed to the row object.
	 */
	[key: string]: any

	/**
	 * The indentation level of the row node.
	 *
	 * Only applicable for tree and gantt views.
	 *
	 * @defaultValue 0
	 */
	indent?: number

	/**
	 * The HTML parent element for the row node. This is evaluated automatically while rendering
	 * the table.
	 *
	 * Only applicable for tree and gantt views.
	 */
	parent?: number

	/**
	 * The options to use when rendering the row as a Gantt table.
	 */
	gantt?: GanttOptions
}

/**
 * Gantt chart options for table rows.
 * @public
 */
export interface GanttOptions {
	/**
	 * The color to be applied to the row's gantt bar.
	 *
	 * @defaultValue '#cccccc'
	 */
	color?: string

	/**
	 * The starting column index for the gantt bar.
	 *
	 * @defaultValue 0
	 */
	startIndex?: number

	/**
	 * The ending column index for the gantt bar. If endIndex and colspan are not provided,
	 * the bar will stretch to the end of the table.
	 */
	endIndex?: number

	/**
	 * The length of the gantt bar in columns. Useful when only the start index is provided.
	 * If colspan and endIndex are not provided, the bar will stretch to the end of the table.
	 */
	colspan?: number
}

/**
 * Gantt table drag event definition.
 * @public
 */
export type GanttDragEvent = {
	rowIndex: number
	colIndex: number
	delta: number
} & (
	| {
			type: 'bar'
			oldStart: number
			oldEnd: number
			newStart: number
			newEnd: number
			colspan: number
	  }
	| {
			type: 'resize'
			edge: 'start'
			oldStart: number
			newStart: number
			end: number
			oldColspan: number
			newColspan: number
	  }
	| {
			type: 'resize'
			edge: 'end'
			oldEnd: number
			newEnd: number
			start: number
			oldColspan: number
			newColspan: number
	  }
)

/**
 * Table modal definition.
 * @public
 */
export interface TableModal {
	/**
	 * Indicates whether the table modal is currently visible.
	 *
	 * @defaultValue false
	 */
	visible?: boolean

	/**
	 * The HTML cell element that the modal is currently being displayed for. The field is unset
	 * when the modal is not being displayed.
	 */
	cell?: HTMLTableCellElement | null

	/**
	 * The HTML parent element that the modal is currently being displayed for. The field is unset
	 * when the modal is not being displayed.
	 */
	parent?: HTMLElement

	/**
	 * The index of the column that the modal is currently being displayed for. The field is
	 * unset when the modal is not being displayed.
	 */
	colIndex?: number

	/**
	 * The index of the row that the modal is currently being displayed for. The field is
	 * unset when the modal is not being displayed.
	 */
	rowIndex?: number

	/**
	 * The component to use to render the modal. If not provided, the table will
	 * try to use the column's `modalComponent` property, if set. If that is not set,
	 * the table will not display a modal.
	 *
	 * @see {@link TableColumn.modalComponent}
	 */
	component?: string

	/**
	 * Additional properties to pass to the table's modal component.
	 */
	componentProps?: Record<string, any>

	/**
	 * Reactive bottom value for the modal's bounding box. The field is unset when the modal
	 * is not being displayed.
	 */
	bottom?: ReturnType<typeof useElementBounding>['bottom']

	/**
	 * Reactive height value for the modal's bounding box. The field is unset when the modal
	 * is not being displayed.
	 */
	height?: ReturnType<typeof useElementBounding>['height']

	/**
	 * Reactive left value for the modal's bounding box. The field is unset when the modal
	 * is not being displayed.
	 */
	left?: ReturnType<typeof useElementBounding>['left']

	/**
	 * Reactive width value for the modal's bounding box. The field is unset when the modal
	 * is not being displayed.
	 */
	width?: ReturnType<typeof useElementBounding>['width']
}

/**
 * Table modal component props definition.
 * @public
 */
export interface TableModalProps {
	/**
	 * Additional arbitrary properties that can be passed to the modal component.
	 */
	[key: string]: any

	/**
	 * The index of the column that the modal is currently being displayed for.
	 */
	colIndex: number

	/**
	 * The index of the row that the modal is currently being displayed for.
	 */
	rowIndex: number

	/**
	 * The store for managing the current table's state.
	 */
	store: ReturnType<typeof createTableStore>
}

/**
 * Gantt bar information for VueFlow integration.
 * @public
 */
export interface GanttBarInfo {
	/**
	 * Unique identifier for the gantt bar.
	 */
	id: string

	/**
	 * The row index of the gantt bar.
	 */
	rowIndex: number

	/**
	 * The primary column index of the gantt bar (typically the start index).
	 */
	colIndex: number

	/**
	 * Starting column index of the gantt bar.
	 */
	startIndex: Ref<number>

	/**
	 * Ending column index of the gantt bar.
	 */
	endIndex: Ref<number>

	/**
	 * Color of the gantt bar.
	 */
	color: Ref<string>

	/**
	 * The position of the gantt bar in the ATable component.
	 */
	position: {
		x: ShallowRef<number>
		y: ShallowRef<number>
	}

	/**
	 * Display label for the gantt bar.
	 */
	label?: string
}

/**
 * Connection handle information for gantt bar connections.
 * @public
 */
export interface ConnectionHandle {
	/**
	 * Unique identifier for the connection handle.
	 */
	id: string

	/**
	 * The row index of the gantt bar this handle belongs to.
	 */
	rowIndex: number

	/**
	 * The column index of the gantt bar this handle belongs to.
	 */
	colIndex: number

	/**
	 * The side of the gantt bar where this handle is located.
	 */
	side: 'left' | 'right'

	/**
	 * The position of the connection handle.
	 */
	position: {
		x: ShallowRef<number>
		y: ShallowRef<number>
	}

	/**
	 * Whether the handle is currently visible (on hover).
	 */
	visible: Ref<boolean>

	/**
	 * Reference to the gantt bar this handle belongs to.
	 */
	barId: string
}

/**
 * Connection path between two gantt bars.
 * @public
 */
export interface ConnectionPath {
	/**
	 * Unique identifier for the connection path.
	 */
	id: string

	/**
	 * The source connection handle.
	 */
	from: {
		barId: string
		side: 'left' | 'right'
	}

	/**
	 * The target connection handle.
	 */
	to: {
		barId: string
		side: 'left' | 'right'
	}

	/**
	 * Optional styling for the connection path.
	 */
	style?: {
		color?: string
		width?: number
	}

	/**
	 * Optional label for the connection.
	 */
	label?: string
}

/**
 * Connection event for handling connection creation/deletion.
 * @public
 */
export type ConnectionEvent = {
	type: 'create' | 'delete'
	connection: ConnectionPath
}

/**
 * Event payload for row:add event.
 * @public
 */
export interface RowAddEvent {
	rowIndex: number
	row: TableRow
}

/**
 * Event payload for row:delete event.
 * @public
 */
export interface RowDeleteEvent {
	rowIndex: number
	row: TableRow
}

/**
 * Event payload for row:duplicate event.
 * @public
 */
export interface RowDuplicateEvent {
	sourceIndex: number
	newIndex: number
	row: TableRow
}

/**
 * Event payload for row:insert-above and row:insert-below events.
 * @public
 */
export interface RowInsertEvent {
	targetIndex: number
	newIndex: number
	row: TableRow
}

/**
 * Event payload for row:move event.
 * @public
 */
export interface RowMoveEvent {
	fromIndex: number
	toIndex: number
}
