export type TableColumn = {
	name: string

	align?: CanvasTextAlign
	edit?: boolean
	label?: string
	type?: string
	width?: string

	cellComponent?: string
	cellComponentProps?: Record<string, any>
	modalComponent?: string
	modalComponentProps?: Record<string, any>

	format?: string | ((value: any) => any)
	mask?: (value: any) => any
}

export type TableConfig = {
	view?: 'list' | 'tree' | 'list-expansion'
	fullWidth?: boolean
}

export type TableDisplay = {
	childrenOpen?: boolean
	expanded?: boolean
	indent?: number
	isParent?: boolean
	isRoot?: boolean
	modified?: boolean
	open?: boolean
	parent?: number
}

export type TableRow = {
	[key: string]: any
	indent?: number
	parent?: number
}

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
