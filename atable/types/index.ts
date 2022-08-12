export type TableColumn = {
	name: string

	align?: string
	component?: string
	edit?: boolean
	label?: string
	type?: string
	width?: string

	format?: Function
	mask?: Function
}

export type TableConfig = {
	numberedRows?: boolean
	treeView?: boolean
}

export type TableDisplay = {
	default?: {
		[key: string]: any
		modified: boolean
	}
}

export type TableRow = {
	[key: string]: string
	indent?: string
	parent?: string
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
