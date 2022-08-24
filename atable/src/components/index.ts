import { v4 } from 'uuid'
import { computed, reactive } from 'vue'

import { TableDisplay, TableRow, TableColumn, TableConfig, TableModal } from '../../types'

export default class TableDataStore {
	id: string
	rows: TableRow[]
	columns: TableColumn[]
	config: TableConfig
	table: { [key: string]: any }
	display: TableDisplay[]
	modal: TableModal

	constructor(
		id?: string,
		columns?: TableColumn[],
		rows?: TableRow[],
		config?: TableConfig,
		table?: { [key: string]: any },
		display?: TableDisplay[]
	) {
		this.id = id || v4()
		this.rows = rows
		this.columns = reactive(columns)
		this.config = reactive(config)
		this.table = table || reactive(this.createTableObject())
		this.display = this.createDisplayObject(display)
		this.modal = reactive({ visible: false })
	}

	createTableObject() {
		const table = {}
		for (const [colIndex, column] of this.columns.entries()) {
			for (const [rowIndex, row] of this.rows.entries()) {
				table[`${colIndex}:${rowIndex}`] = row[column.name]
			}
		}
		return table
	}

	createDisplayObject(display?: TableDisplay[]) {
		const defaultDisplay: TableDisplay[] = [Object.assign({}, { modified: false })]

		// TODO: (typing) what is the type of `display` here?
		if (display) {
			if ('0:0' in display) {
				return display
			}
			// else if ('default' in display) {
			// 	// TODO: (typing) what is the possible input here for 'default'?
			// 	defaultDisplay = display.default
			// }
		}

		// TODO: (typing) is this type correct for the parent set?
		const parents = new Set<string | number>()
		for (let rowIndex = this.rows.length - 1; rowIndex >= 0; rowIndex--) {
			const row = this.rows[rowIndex]
			if (row.parent) {
				parents.add(row.parent)
			}

			defaultDisplay[rowIndex] = {
				childrenOpen: false,
				indent: row.indent || null,
				isParent: parents.has(rowIndex),
				isRoot: row.parent === null || row.parent === undefined,
				modified: false,
				open: row.parent === null || row.parent === undefined,
				parent: row.parent,
			}
		}

		return reactive(defaultDisplay)
	}

	get zeroColumn() {
		return this.config.numberedRows || this.config.treeView
	}

	get numberedRowWidth() {
		return computed(() => {
			return String(Math.ceil(this.rows.length / 100) + 1) + 'ch'
		})
	}

	cellData<T>(colIndex: number, rowIndex: number): T {
		return this.table[`${colIndex}:${rowIndex}`]
	}

	setCellData(rowIndex: number, colIndex: number, value: any) {
		if (this.table[`${colIndex}:${rowIndex}`] !== value) {
			this.display[rowIndex].modified = true
		}
		this.table[`${colIndex}:${rowIndex}`] = value
		return this.table[`${colIndex}:${rowIndex}`]
	}

	toggleRowExpand(rowIndex: number) {
		if (!this.config.treeView) {
			return
		}

		this.display[rowIndex].childrenOpen = !this.display[rowIndex].childrenOpen
		for (let index = this.rows.length - 1; index >= 0; index--) {
			if (this.display[index].parent === rowIndex) {
				this.display[index].open = !this.display[index].open
				if (this.display[index].childrenOpen) {
					this.toggleRowExpand(index)
				}
			}
		}
	}
}
