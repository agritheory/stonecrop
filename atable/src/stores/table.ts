import { defineStore } from 'pinia'
import { type CSSProperties, computed, ref } from 'vue'

import type {
	CellContext,
	ConnectionHandle,
	ConnectionPath,
	GanttBarInfo,
	GanttDragEvent,
	TableColumn,
	TableConfig,
	TableDisplay,
	TableModal,
	TableRow,
} from '../types'
import { generateHash } from '../utils'

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
	const id = initData.id || generateHash()
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
					indent: row.indent || 0,
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
		const modal = ref<TableModal>(initData.modal || { visible: false })
		const updates = ref<Record<string, string>>({})
		const ganttBars = ref<GanttBarInfo[]>([])
		const connectionHandles = ref<ConnectionHandle[]>([])
		const connectionPaths = ref<ConnectionPath[]>([])

		// getters
		const hasPinnedColumns = computed(() => columns.value.some(col => col.pinned))
		const isGanttView = computed(() => config.value.view === 'gantt' || config.value.view === 'tree-gantt')
		const isTreeView = computed(() => config.value.view === 'tree' || config.value.view === 'tree-gantt')

		const numberedRowWidth = computed(() => {
			const indent = Math.ceil(rows.value.length / 100 + 1)
			return `${indent}ch`
		})

		const zeroColumn = computed(() =>
			config.value.view ? ['list', 'tree', 'tree-gantt', 'list-expansion'].includes(config.value.view) : false
		)

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

		const setCellText = (colIndex: number, rowIndex: number, value: string) => {
			const index = `${colIndex}:${rowIndex}`

			if (table.value[index] !== value) {
				display.value[rowIndex].rowModified = true
				updates.value[index] = value
			}
		}

		const getHeaderCellStyle = (column: TableColumn): CSSProperties => {
			const isLastCol = columns.value.indexOf(column) === columns.value.length - 1

			// if the table is full width, the last column should not be resizable;
			// ref: https://github.com/agritheory/stonecrop/pull/196#issuecomment-2503762641

			const isResizable = config.value.fullWidth ? column.resizable && !isLastCol : column.resizable

			return {
				width: column.width || '40ch',
				textAlign: column.align || 'center',
				...(isResizable && {
					resize: 'horizontal',
					overflow: 'hidden',
					whiteSpace: 'nowrap',
				}),
			}
		}

		const resizeColumn = (colIndex: number, newWidth: number) => {
			if (colIndex < 0 || colIndex >= columns.value.length) return

			const minWidth = 40
			const finalWidth = Math.max(newWidth, minWidth)

			columns.value[colIndex] = {
				...columns.value[colIndex],
				width: `${finalWidth}px`,
			}
		}

		const isRowGantt = (rowIndex: number) => {
			const row = rows.value[rowIndex]
			return isGanttView.value && row.gantt !== undefined
		}

		const isRowVisible = (rowIndex: number) => {
			return !isTreeView.value || display.value[rowIndex].isRoot || display.value[rowIndex].open
		}

		const getRowExpandSymbol = (rowIndex: number) => {
			if (!isTreeView.value) {
				return ''
			}

			if (display.value[rowIndex].isRoot || display.value[rowIndex].isParent) {
				return display.value[rowIndex].childrenOpen ? '-' : '+'
			}

			return ''
		}

		const toggleRowExpand = (rowIndex: number) => {
			if (isTreeView.value) {
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

		const updateGanttBar = (event: GanttDragEvent) => {
			// update the local gantt bar cache
			const ganttBar = rows.value[event.rowIndex]?.gantt
			if (ganttBar) {
				if (event.type === 'resize') {
					if (event.edge === 'start') {
						ganttBar.startIndex = event.newStart
						ganttBar.endIndex = event.end
						ganttBar.colspan = ganttBar.endIndex - ganttBar.startIndex
					} else if (event.edge === 'end') {
						ganttBar.startIndex = event.start
						ganttBar.endIndex = event.newEnd
						ganttBar.colspan = ganttBar.endIndex - ganttBar.startIndex
					}
				} else if (event.type === 'bar') {
					ganttBar.startIndex = event.newStart
					ganttBar.endIndex = event.newEnd
					ganttBar.colspan = ganttBar.endIndex - ganttBar.startIndex
				}
			}
		}

		const registerGanttBar = (barInfo: GanttBarInfo) => {
			const existingIndex = ganttBars.value.findIndex(bar => bar.id === barInfo.id)
			if (existingIndex >= 0) {
				// @ts-expect-error TODO: for some reason, the IDE is expecting an unref'd value
				ganttBars.value[existingIndex] = barInfo
			} else {
				// @ts-expect-error TODO: for some reason, the IDE is expecting an unref'd value
				ganttBars.value.push(barInfo)
			}
		}

		const unregisterGanttBar = (barId: string) => {
			const index = ganttBars.value.findIndex(bar => bar.id === barId)
			if (index >= 0) {
				ganttBars.value.splice(index, 1)
			}
		}

		const registerConnectionHandle = (handleInfo: ConnectionHandle) => {
			const existingIndex = connectionHandles.value.findIndex(handle => handle.id === handleInfo.id)
			if (existingIndex >= 0) {
				// @ts-expect-error TODO: for some reason, the IDE is expecting an unref'd value
				connectionHandles.value[existingIndex] = handleInfo
			} else {
				// @ts-expect-error TODO: for some reason, the IDE is expecting an unref'd value
				connectionHandles.value.push(handleInfo)
			}
		}

		const unregisterConnectionHandle = (handleId: string) => {
			const index = connectionHandles.value.findIndex(handle => handle.id === handleId)
			if (index >= 0) {
				connectionHandles.value.splice(index, 1)
			}
		}

		const createConnection = (fromHandleId: string, toHandleId: string, options?: { style?: ConnectionPath['style']; label?: string }) => {
			const fromHandle = connectionHandles.value.find(h => h.id === fromHandleId)
			const toHandle = connectionHandles.value.find(h => h.id === toHandleId)

			if (!fromHandle || !toHandle) {
				console.warn('Cannot create connection: handle not found')
				return null
			}

			const connection: ConnectionPath = {
				id: `connection-${fromHandleId}-${toHandleId}`,
				from: {
					barId: fromHandle.barId,
					side: fromHandle.side
				},
				to: {
					barId: toHandle.barId,
					side: toHandle.side
				},
				style: options?.style,
				label: options?.label
			}

			connectionPaths.value.push(connection)
			return connection
		}

		const deleteConnection = (connectionId: string) => {
			const index = connectionPaths.value.findIndex(conn => conn.id === connectionId)
			if (index >= 0) {
				connectionPaths.value.splice(index, 1)
				return true
			}
			return false
		}

		const getConnectionsForBar = (barId: string) => {
			return connectionPaths.value.filter(conn =>
				conn.from.barId === barId || conn.to.barId === barId
			)
		}

		const getHandlesForBar = (barId: string) => {
			return connectionHandles.value.filter(handle => handle.barId === barId)
		}

		return {
			// state
			columns,
			config,
			connectionHandles,
			connectionPaths,
			display,
			ganttBars,
			modal,
			rows,
			table,
			updates,

			// getters
			hasPinnedColumns,
			isGanttView,
			isTreeView,
			numberedRowWidth,
			zeroColumn,

			// actions
			closeModal,
			createConnection,
			deleteConnection,
			getCellData,
			getCellDisplayValue,
			getConnectionsForBar,
			getFormattedValue,
			getHandlesForBar,
			getHeaderCellStyle,
			getIndent,
			getRowExpandSymbol,
			isRowGantt,
			isRowVisible,
			registerConnectionHandle,
			registerGanttBar,
			resizeColumn,
			setCellData,
			setCellText,
			toggleRowExpand,
			unregisterConnectionHandle,
			unregisterGanttBar,
			updateGanttBar,
		}
	})

	return createStore()
}
