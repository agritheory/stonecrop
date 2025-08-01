import { useElementBounding } from '@vueuse/core'
import type { Ref, ShallowRef } from 'vue'

import { createTableStore } from '../stores/table'

/**
 * Table column definition.
 * @public
 */
export interface TableColumn {
	/**
	 * The key of the column. This is used to identify the column in the table.
	 */
	name: string

	/**
	 * The alignment of the column. Possible values:
	 * - `left` - left aligned
	 * - `center` - center aligned
	 * - `right` - right aligned
	 * - `start` - aligned to the start of the column
	 * - `end` - aligned to the end of the column
	 *
	 * @defaultValue 'center'
	 */
	align?: CanvasTextAlign

	/**
	 * Control whether cells for the column is editable.
	 *
	 * @defaultValue false
	 */
	edit?: boolean

	/**
	 * The label of the column. This is displayed in the table header.
	 *
	 * @defaultValue If no label is provided, a character will be assigned alphabetically,
	 * starting from 'A' for the first column, 'B' for the second column, and so on.
	 */
	label?: string

	/**
	 * The data-type of the column. Possible values:
	 * - `Data` - the column contains text data
	 * - `Select` - the column contains a select input
	 * - `Date` - the column contains a date input
	 * - `component` - the column contains a custom component
	 *
	 * @beta
	 */
	type?: string

	/**
	 * The width of the column. This can be a number (in pixels) or a string (in CSS units).
	 *
	 * @defaultValue '40ch'
	 */
	width?: string

	/**
	 * Control whether the column should be pinned to the table.
	 *
	 * @defaultValue false
	 */
	pinned?: boolean
	resizable?: boolean

	/**
	 * The component to use to render the cell for the column. If not provided, the table will
	 * render the default `<td>` element.
	 */
	cellComponent?: string

	/**
	 * Additional properties to pass to the table's cell component.
	 *
	 * Only applicable if the `cellComponent` property is set for the column.
	 */
	cellComponentProps?: Record<string, any>

	/**
	 * The component to use for the modal. If a function is provided, it will be called with the cell context.
	 * The following properties are available on the cell context:
	 * - `row` - the row object
	 * - `column` - the column object
	 * - `table` - the table object
	 *
	 * The function should return the name of the component to use for the modal.
	 *
	 * Additionally, the following properties will be automatically passed to the modal component:
	 * - `colIndex` - the column index of the current cell
	 * - `rowIndex` - the row index of the current cell
	 * - `store` - the table data store
	 */

	modalComponent?: string | ((context: CellContext) => string)

	/**
	 * Additional properties to pass to the modal component.
	 *
	 * Only applicable if the `modalComponent` property is set for the column.
	 */
	modalComponentExtraProps?: Record<string, any>

	/**
	 * The format function to use to format the value of the cell. This can either be a normal or stringified
	 * function that takes the value and the cell context and returns a string.
	 */
	format?: string | ((value: any, context: CellContext) => string)

	/**
	 * The masking function to use to apply an input mask to the cell. This will accept an input value and
	 * return the masked value.
	 */
	mask?: (value: any) => any

	/**
	 * Whether the column is a Gantt column.
	 *
	 * Only applicable for Gantt tables.
	 *
	 * @defaultValue false
	 */
	isGantt?: boolean

	/**
	 * The component to use to render the Gantt bar for the column.
	 *
	 * Only applicable for Gantt tables.
	 *
	 * @defaultValue 'AGanttCell'
	 */
	ganttComponent?: string

	/**
	 * The colspan of the Gantt bar for the column. This determines how many columns
	 * the Gantt bar should span across.
	 *
	 * Only applicable for Gantt tables.
	 *
	 * @defaultValue The number of columns in the table, excluding any pinned columns.
	 */
	colspan?: number

	/**
	 * The original column index for the Gantt bar, excluding any pinned columns.
	 * This is evaluated automatically while rendering the table.
	 *
	 * Only applicable for Gantt tables.
	 *
	 * @defaultValue 0
	 */
	originalIndex?: number
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
 * Table configuration definition.
 * @public
 */
export interface TableConfig {
	/**
	 * The type of view to display the table in. Possible values:
	 * - `uncounted` - row numbers are not displayed in the table
	 * - `list` - row numbers are displayed in the table
	 * - `list-expansion` - carets are displayed in the number column that expand/collapse the row inline
	 * - `tree` - carets are displayed in the number column that expand/collapse grouped rows
	 * - `gantt` - view that allows specific rows to be displayed with Gantt functionality
	 * - `tree-gantt` - similar to `gantt`, but allows for tree functionality as well
	 */
	view?: 'uncounted' | 'list' | 'list-expansion' | 'tree' | 'gantt' | 'tree-gantt'

	/**
	 * Control whether the table should be allowed to use the full width of its container.
	 *
	 * @defaultValue false
	 */
	fullWidth?: boolean

	/**
	 * Control whether dependency graph connections should be enabled for Gantt views.
	 * When false, connection handles and dependency lines will be hidden.
	 *
	 * @defaultValue true
	 */
	dependencyGraph?: boolean
}

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
export type GanttDragEvent =
	| {
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
