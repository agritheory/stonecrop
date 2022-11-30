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

	format?: string | ((value: any) => any)
	mask?: (value: any) => any
}

export type TableConfig = {
	listExpansionView?: boolean
	listView?: boolean
	treeView?: boolean
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
	component?: string
	event?: string
	left?: number
	parent?: HTMLElement
	rowIndex?: number
	top?: number
	visible?: boolean
	width?: string
}
