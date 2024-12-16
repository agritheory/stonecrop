import { defineStore } from 'pinia'
import { type CSSProperties, computed, ref } from 'vue'

import type { CellContext, TableColumn, TableConfig, TableDisplay, TableModal, TableRow } from '../types'

/**
 * Create a table store
 * @param initData - Initial data for the table store
 * @returns table store instance
 * @public
 */
export const createTableStore = (initData: {
	columns: TableColumn[]
	rows: TableRow[]
	id?: string
	config?: TableConfig
	table?: { [key: string]: any }
	display?: TableDisplay[]
	modal?: TableModal
}) => {
	const id = initData.id || crypto.randomUUID()
	const createStore = defineStore(`table-${id}`, () => {
		// util functions
		const createTableObject = () => {
			const table = {}
			for (const [colIndex, column] of columns.value.entries()) {
				for (const [rowIndex, row] of rows.value.entries()) {
					table[`${colIndex}:${rowIndex}`] = row[column.name]
				}
			}
			return table
		}

		const createDisplayObject = (display?: TableDisplay[]) => {
			const defaultDisplay: TableDisplay[] = [Object.assign({}, { rowModified: false })]

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
			for (let rowIndex = rows.value.length - 1; rowIndex >= 0; rowIndex--) {
				const row = rows.value[rowIndex]
				if (row.parent) {
					parents.add(row.parent)
				}

				defaultDisplay[rowIndex] = {
					childrenOpen: false,
					expanded: false,
					indent: row.indent || null,
					isParent: parents.has(rowIndex),
					isRoot: row.parent === null || row.parent === undefined,
					rowModified: false,
					open: row.parent === null || row.parent === undefined,
					parent: row.parent,
				}
			}

			return defaultDisplay
		}

		// state
		const columns = ref(initData.columns)
		const rows = ref(initData.rows)
		const config = ref(initData.config || {})
		const table = ref(initData.table || createTableObject())
		const display = ref(createDisplayObject(initData.display))
		const modal = ref(initData.modal || { visible: false })

		// getters
		const hasPinnedColumns = computed(() => columns.value.some(col => col.pinned))

		const numberedRowWidth = computed(() => {
			const indent = Math.ceil(rows.value.length / 100 + 1)
			return `${indent}ch`
		})

		const zeroColumn = computed(() => ['list', 'tree', 'list-expansion'].includes(config.value.view))

		// actions
		const getCellData = <T = any>(colIndex: number, rowIndex: number): T => table.value[`${colIndex}:${rowIndex}`]
		const setCellData = (colIndex: number, rowIndex: number, value: any) => {
			const index = `${colIndex}:${rowIndex}`
			const col = columns.value[colIndex]

			if (table.value[index] !== value) {
				display.value[rowIndex].rowModified = true
			}

			table.value[index] = value
			rows.value[rowIndex][col.name] = value
		}

		const getHeaderCellStyle = (column: TableColumn): CSSProperties => ({
			minWidth: column.width || '40ch',
			textAlign: column.align || 'center',
			width: config.value.fullWidth ? 'auto' : null,
		})

		const isRowVisible = (rowIndex: number) => {
			return config.value.view !== 'tree' || display.value[rowIndex].isRoot || display.value[rowIndex].open
		}

		const getRowExpandSymbol = (rowIndex: number) => {
			if (config.value.view !== 'tree') {
				return ''
			}

			if (display.value[rowIndex].isRoot || display.value[rowIndex].isParent) {
				return display.value[rowIndex].childrenOpen ? '-' : '+'
			}

			return ''
		}

		const toggleRowExpand = (rowIndex: number) => {
			if (config.value.view === 'tree') {
				display.value[rowIndex].childrenOpen = !display.value[rowIndex].childrenOpen
				for (let index = rows.value.length - 1; index >= 0; index--) {
					if (display.value[index].parent === rowIndex) {
						display.value[index].open = !display.value[index].open
						if (display.value[index].childrenOpen) {
							toggleRowExpand(index)
						}
					}
				}
			} else if (config.value.view === 'list-expansion') {
				display.value[rowIndex].expanded = !display.value[rowIndex].expanded
			}
		}

		const getCellDisplayValue = (colIndex: number, rowIndex: number) => {
			const cellData = getCellData(colIndex, rowIndex)
			return getFormattedValue(colIndex, rowIndex, cellData)
		}

		const getFormattedValue = (colIndex: number, rowIndex: number, value: any) => {
			const column = columns.value[colIndex]
			const row = rows.value[rowIndex]
			const format = column.format

			if (!format) {
				return value
			}

			if (typeof format === 'function') {
				return format(value, { table: table.value, row, column })
			} else if (typeof format === 'string') {
				// parse format function from string
				// eslint-disable-next-line @typescript-eslint/no-implied-eval
				const formatFn: (value: any, context?: CellContext) => string = Function(`"use strict";return (${format})`)()
				return formatFn(value, { table: table.value, row, column })
			}

			return value
		}

		const closeModal = (event: MouseEvent) => {
			if (!(event.target instanceof Node)) {
				// if the target is not a node, it's probably a custom click event to Document or Window
				// err on the side of closing the modal in that case
				if (modal.value.visible) modal.value.visible = false
			} else if (!modal.value.parent?.contains(event.target)) {
				if (modal.value.visible) modal.value.visible = false
			}
		}

		const getIndent = (colIndex: number, indentLevel?: number) => {
			if (indentLevel && colIndex === 0 && indentLevel > 0) {
				return `${indentLevel}ch`
			} else {
				return 'inherit'
			}
		}

		return {
			// state
			columns,
			rows,
			config,
			table,
			display,
			modal,

			// getters
			hasPinnedColumns,
			numberedRowWidth,
			zeroColumn,

			// actions
			closeModal,
			getCellData,
			getCellDisplayValue,
			getFormattedValue,
			getHeaderCellStyle,
			getIndent,
			getRowExpandSymbol,
			isRowVisible,
			setCellData,
			toggleRowExpand,
		}
	})

	return createStore()
}
