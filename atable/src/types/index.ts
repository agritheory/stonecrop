import { useElementBounding } from '@vueuse/core'

import { createTableStore } from '../stores/table'

/**
 * Table column definition.
 * @public
 */
export type TableColumn = {
	name: string

	align?: CanvasTextAlign
	edit?: boolean
	label?: string
	type?: string
	width?: string
	pinned?: boolean

	cellComponent?: string
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
	modalComponentExtraProps?: Record<string, any>

	format?: string | ((value: any, context: CellContext) => string)
	mask?: (value: any) => any
}

/**
 * Table cell context definition.
 * @public
 */
export type CellContext = {
	row: TableRow
	column: TableColumn
	table: { [key: string]: any }
}

/**
 * Table configuration definition.
 * @public
 */
export type TableConfig = {
	/**
	 * The type of view to display the table in. Possible values:
	 * - `uncounted` - row numbers are not displayed in the table
	 * - `list` - row numbers are displayed in the table
	 * - `list-expansion` - carets are displayed in the number column that expand/collapse the row inline
	 * - `tree` - carets are displayed in the number column that expand/collapse grouped rows
	 */
	view?: 'uncounted' | 'list' | 'list-expansion' | 'tree'
	fullWidth?: boolean
}

/**
 * Table display definition.
 * @public
 */
export type TableDisplay = {
	childrenOpen?: boolean
	expanded?: boolean
	indent?: number
	isParent?: boolean
	isRoot?: boolean
	open?: boolean
	parent?: number
	rowModified?: boolean
}

/**
 * Table row definition.
 * @public
 */
export type TableRow = {
	[key: string]: any
	indent?: number
	parent?: number
}

/**
 * Table modal definition.
 * @public
 */
export type TableModal = {
	bottom?: ReturnType<typeof useElementBounding>['bottom']
	cell?: HTMLTableCellElement | null
	colIndex?: number
	event?: string
	height?: ReturnType<typeof useElementBounding>['height']
	left?: ReturnType<typeof useElementBounding>['left']
	parent?: HTMLElement
	rowIndex?: number
	visible?: boolean
	width?: ReturnType<typeof useElementBounding>['width']

	component?: string
	componentProps?: Record<string, any>
}

/**
 * Table modal component props definition.
 * @public
 */
export type TableModalProps = {
	[key: string]: any
	colIndex: number
	rowIndex: number
	store: ReturnType<typeof createTableStore>
}
