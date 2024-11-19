export type ListViewItem = {
	description: string
	label: string
	checked?: boolean
	debounce?: number
	linkComponent?: string
	route?: string
	count?: {
		count: number
		of: number
		uom: string
	}
}
