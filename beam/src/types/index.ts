export type ListViewItem = {
	description: string
	label: string

	checked?: boolean
	count?: {
		count: number
		of: number
		uom: string
	}
	date?: string
	dateFormat?: string
	debounce?: number
	linkComponent?: string
	route?: string
}
