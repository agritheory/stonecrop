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
	modalComponent?: string | ((context?: CellContext) => string)
	modalComponentExtraProps?: Record<string, any>

	format?: string | ((value: any, context?: CellContext) => string)
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
	colIndex?: number
	event?: string
	left?: number
	parent?: HTMLElement
	rowIndex?: number
	top?: number
	visible?: boolean
	width?: string

	component?: string
	componentProps?: Record<string, any>
}
