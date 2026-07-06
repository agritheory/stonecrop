import { defineStore } from 'pinia'
import { componentCategory } from '@stonecrop/schema'
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
import { formatQuantity, generateHash } from '../utils'

/**
 * Represents the state of a single filter
 * @public
 */
export interface FilterState {
	/** The main filter value */
	value: any
	/** Start value for date range filters */
	startValue?: any
	/** End value for date range filters */
	endValue?: any
}

/**
 * Record mapping column indices to their filter states
 * @public
 */
export type FilterStateRecord = Record<number, FilterState>

// Quantity columns hold a composite `{ qty, uom, ... }` value (see `QuantityValue` in
// `@stonecrop/aform`); numeric comparisons (filtering, sorting) operate on `qty`.
function toComparableNumber(cellValue: any): number {
	if (cellValue !== null && typeof cellValue === 'object' && 'qty' in cellValue) {
		return Number((cellValue as { qty: unknown }).qty)
	}
	return Number(cellValue)
}

function isNodeOpen(rowIndex: number, treeDisplay: TableDisplay[]): boolean {
	const row = treeDisplay[rowIndex]
	if (row.isRoot) {
		return true // Root nodes are always open
	}

	if (row.parent === null || row.parent === undefined) {
		return true
	}

	const parentIndex = row.parent
	if (parentIndex < 0 || parentIndex >= treeDisplay.length) {
		return false
	}

	const parent = treeDisplay[parentIndex]
	// Node is open if parent's children are open AND parent itself is open
	return (parent.childrenOpen || false) && isNodeOpen(parentIndex, treeDisplay)
}

function applyFilter(cellValue: any, filter: FilterState, column: TableColumn): boolean {
	const filterType = column.filterType || 'text'
	const value = filter.value

	if (!value && filterType !== 'dateRange' && filterType !== 'checkbox') return true

	switch (filterType) {
		case 'text': {
			const searchableText =
				typeof cellValue === 'object' && cellValue !== null
					? Object.values(cellValue).join(' ')
					: String(cellValue || '')
			return searchableText.toLowerCase().includes(String(value).toLowerCase())
		}

		case 'number': {
			const numValue = toComparableNumber(cellValue)
			const filterNum = Number(value)
			return !isNaN(numValue) && !isNaN(filterNum) && numValue === filterNum
		}

		case 'select':
			return cellValue === value

		case 'checkbox':
			// For checkbox filter, if checked (true), show only truthy values
			// If unchecked (false/undefined), show all values
			if (value === true) {
				return !!cellValue
			}
			return true

		case 'date': {
			// Handle both timestamp numbers and date strings
			let cellDate: Date
			if (typeof cellValue === 'number') {
				// Apply the same year transformation as in the format function
				const originalDate = new Date(cellValue)
				const currentYear = new Date().getFullYear()
				cellDate = new Date(currentYear, originalDate.getMonth(), originalDate.getDate())
			} else {
				cellDate = new Date(String(cellValue))
			}
			const filterDate = new Date(String(value))
			return cellDate.toDateString() === filterDate.toDateString()
		}

		case 'dateRange': {
			const startValue = filter.startValue
			const endValue = filter.endValue
			if (!startValue && !endValue) return true

			// Handle both timestamp numbers and date strings
			let cellDateRange: Date
			if (typeof cellValue === 'number') {
				// Apply the same year transformation as in the format function
				const originalDate = new Date(cellValue)
				const currentYear = new Date().getFullYear()
				cellDateRange = new Date(currentYear, originalDate.getMonth(), originalDate.getDate())
			} else {
				cellDateRange = new Date(String(cellValue))
			}
			if (startValue && cellDateRange < new Date(String(startValue))) return false
			if (endValue && cellDateRange > new Date(String(endValue))) return false

			return true
		}

		default:
			return true
	}
}

/**
 * Compute the CSS indentation for a tree-table cell. Pure helper (captures no store state);
 * imported directly by cell components rather than exposed on the store's public return.
 * @internal
 */
export function getIndent(colIndex: number, indentLevel?: number): string {
	if (indentLevel && colIndex === 0 && indentLevel > 0) {
		return `${indentLevel}ch`
	} else {
		return 'inherit'
	}
}

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
	modal?: TableModal
	linkResolver?: ((doctype: string, id: string) => Promise<string | undefined>) | null
}) => {
	const id = initData.id || generateHash()
	const linkResolver = initData.linkResolver ?? null
	const createStore = defineStore(`table-${id}`, () => {
		const createDisplayObject = () => {
			const defaultDisplay: TableDisplay[] = [Object.assign({}, { rowModified: false })]

			// TODO: (typing) is this type correct for the parent set?
			const parents = new Set<string | number>()
			for (let rowIndex = 0; rowIndex < rows.value.length; rowIndex++) {
				const row = rows.value[rowIndex]
				if (row.parent !== null && row.parent !== undefined) {
					parents.add(row.parent)
				}
			}

			// Helper function to check if a row has gantt data
			const hasGanttData = (rowIndex: number): boolean => {
				return rows.value[rowIndex]?.gantt !== undefined
			}

			// Helper function to check if any descendant has gantt data
			const hasGanttDescendant = (rowIndex: number): boolean => {
				for (let i = 0; i < rows.value.length; i++) {
					if (rows.value[i].parent === rowIndex) {
						if (hasGanttData(i) || hasGanttDescendant(i)) {
							return true
						}
					}
				}
				return false
			}

			// Helper function to determine if children should be open based on expansion mode
			const shouldChildrenBeOpen = (rowIndex: number): boolean => {
				const currentConfig = config.value
				const expansionMode =
					currentConfig.view === 'tree' || currentConfig.view === 'tree-gantt'
						? currentConfig.defaultTreeExpansion
						: undefined

				if (!expansionMode) return true // Default behavior - start expanded (leaf mode)

				switch (expansionMode) {
					case 'root':
						return false // Only root nodes are visible, all children start collapsed
					case 'branch':
						// Only expand if this node leads to gantt nodes OR if this node itself has gantt data AND has gantt children
						return hasGanttDescendant(rowIndex)
					case 'leaf':
						return true // All nodes should be expanded
					default:
						return true // Default to expanded if unknown mode
				}
			}

			for (let rowIndex = 0; rowIndex < rows.value.length; rowIndex++) {
				const row = rows.value[rowIndex]
				const isRootNode = row.parent === null || row.parent === undefined
				const isParentNode = parents.has(rowIndex)

				defaultDisplay[rowIndex] = {
					childrenOpen: shouldChildrenBeOpen(rowIndex),
					expanded: false,
					indent: row.indent || 0,
					isParent: isParentNode,
					isRoot: isRootNode,
					rowModified: false,
					open: isRootNode, // This will be recalculated later for non-root nodes
					parent: row.parent,
				}
			}

			return defaultDisplay
		}

		// state
		const columns = ref(initData.columns)
		const rows = ref(initData.rows)
		const config = ref<TableConfig>(initData.config || {})

		// Track row modifications and expand states separately from the computed display
		const rowModifications = ref<Record<number, boolean>>({})
		const rowExpandStates = ref<Record<number, { childrenOpen?: boolean; expanded?: boolean }>>({})

		const table = computed(() => {
			const tableData: Record<string, any> = {}
			for (const [colIndex, column] of columns.value.entries()) {
				for (const [rowIndex, row] of rows.value.entries()) {
					tableData[`${colIndex}:${rowIndex}`] = row[column.name]
				}
			}
			return tableData
		})

		const display = computed({
			get: () => {
				const baseDisplay = createDisplayObject()

				// Apply persistent modifications and expand states
				for (let i = 0; i < baseDisplay.length; i++) {
					if (rowModifications.value[i]) {
						baseDisplay[i].rowModified = rowModifications.value[i]
					}
					if (rowExpandStates.value[i]) {
						if (rowExpandStates.value[i].childrenOpen !== undefined) {
							baseDisplay[i].childrenOpen = rowExpandStates.value[i].childrenOpen!
						}
						if (rowExpandStates.value[i].expanded !== undefined) {
							baseDisplay[i].expanded = rowExpandStates.value[i].expanded!
						}
					}
				}

				// Calculate 'open' property for tree view based on parent's childrenOpen state
				if (isTreeView.value) {
					// Helper function to check if all ancestors are open

					for (let i = 0; i < baseDisplay.length; i++) {
						const row = baseDisplay[i]
						if (!row.isRoot) {
							baseDisplay[i].open = isNodeOpen(i, baseDisplay)
						}
					}
				}

				return baseDisplay
			},
			set: (newDisplay: TableDisplay[]) => {
				// Only update if the new display is different from the current one; also avoids recursive updates
				if (JSON.stringify(newDisplay) !== JSON.stringify(display.value)) {
					display.value = newDisplay
				}
			},
		})

		const modal = ref<TableModal>(initData.modal || { visible: false })
		const updates = ref<Record<string, string>>({})
		const ganttBars = ref<GanttBarInfo[]>([])
		const connectionHandles = ref<ConnectionHandle[]>([])
		const connectionPaths = ref<ConnectionPath[]>([])
		const sortState = ref<{ column: number | null; direction: 'asc' | 'desc' | null }>({
			column: null,
			direction: null,
		})
		const filterState = ref<FilterStateRecord>({})

		// getters
		const hasPinnedColumns = computed(() => columns.value.some(col => col.pinned))
		const isGanttView = computed(() => config.value.view === 'gantt' || config.value.view === 'tree-gantt')
		const isTreeView = computed(() => config.value.view === 'tree' || config.value.view === 'tree-gantt')
		const isDependencyGraphEnabled = computed(() => {
			const currentConfig = config.value
			return currentConfig.view === 'gantt' || currentConfig.view === 'tree-gantt'
				? currentConfig.dependencyGraph !== false
				: true
		})

		const numberedRowWidth = computed(() => {
			const indent = Math.ceil(rows.value.length / 100 + 1)
			return `${indent}ch`
		})

		const zeroColumn = computed(() =>
			config.value.view ? ['list', 'tree', 'tree-gantt', 'list-expansion'].includes(config.value.view) : false
		)

		const filteredRows = computed(() => {
			let filtered: Array<TableRow & { originalIndex: number }> = rows.value.map((row, originalIndex) => ({
				...row,
				originalIndex,
			}))

			// Apply filters
			Object.entries(filterState.value).forEach(([colIndexStr, filter]) => {
				const colIndex = parseInt(colIndexStr)
				const column = columns.value[colIndex]

				if (!column) return

				// Skip if filter has no value (except for dateRange and checkbox which can have different value structures)
				const hasFilterValue =
					filter.value ||
					filter.startValue ||
					filter.endValue ||
					(column.filterType === 'checkbox' && filter.value !== undefined)

				if (!hasFilterValue) return

				filtered = filtered.filter(row => {
					const cellValue = row[column.name]
					return applyFilter(cellValue, filter, column)
				})
			})

			// Apply sorting if active
			if (sortState.value.column !== null && sortState.value.direction) {
				const column = columns.value[sortState.value.column]
				const direction = sortState.value.direction

				filtered.sort((a, b) => {
					let aVal = a[column.name]
					let bVal = b[column.name]

					if (aVal === null || aVal === undefined) aVal = ''
					if (bVal === null || bVal === undefined) bVal = ''

					const aNum = toComparableNumber(aVal)
					const bNum = toComparableNumber(bVal)
					const isNumeric = !isNaN(aNum) && !isNaN(bNum) && aVal !== '' && bVal !== ''

					if (isNumeric) {
						return direction === 'asc' ? aNum - bNum : bNum - aNum
					} else {
						const aStr = String(aVal).toLowerCase()
						const bStr = String(bVal).toLowerCase()
						return direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
					}
				})
			}

			return filtered
		})

		// actions
		const getCellData = (colIndex: number, rowIndex: number): any => table.value[`${colIndex}:${rowIndex}`]
		const setCellData = (colIndex: number, rowIndex: number, value: any) => {
			const index = `${colIndex}:${rowIndex}`
			const col = columns.value[colIndex]

			if (table.value[index] !== value) {
				rowModifications.value[rowIndex] = true
			}

			table.value[index] = value
			// Create a new row object to ensure reactivity
			rows.value[rowIndex] = {
				...rows.value[rowIndex],
				[col.name]: value,
			}
		}

		const updateRows = (newRows: TableRow[]) => {
			rows.value = newRows
		}

		const setCellText = (colIndex: number, rowIndex: number, value: string) => {
			const index = `${colIndex}:${rowIndex}`

			if (table.value[index] !== value) {
				rowModifications.value[rowIndex] = true
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
			if (!isTreeView.value && config.value.view !== 'list-expansion') {
				return ''
			}

			if (isTreeView.value && (display.value[rowIndex].isRoot || display.value[rowIndex].isParent)) {
				return display.value[rowIndex].childrenOpen ? '▼' : '►'
			}

			if (config.value.view === 'list-expansion') {
				return display.value[rowIndex].expanded ? '▼' : '►'
			}

			return ''
		}

		const toggleRowExpand = (rowIndex: number) => {
			if (isTreeView.value) {
				const currentState = rowExpandStates.value[rowIndex] || {}
				const currentChildrenOpen = currentState.childrenOpen ?? display.value[rowIndex].childrenOpen
				const newChildrenOpen = !currentChildrenOpen

				rowExpandStates.value[rowIndex] = {
					...currentState,
					childrenOpen: newChildrenOpen,
				}

				// If we're closing, recursively close all descendant nodes
				if (!newChildrenOpen) {
					closeDescendants(rowIndex)
				}
			} else if (config.value.view === 'list-expansion') {
				const currentState = rowExpandStates.value[rowIndex] || {}
				const currentExpanded = currentState.expanded ?? display.value[rowIndex].expanded
				rowExpandStates.value[rowIndex] = {
					...currentState,
					expanded: !currentExpanded,
				}
			}
		}

		const closeDescendants = (parentRowIndex: number) => {
			for (let index = 0; index < rows.value.length; index++) {
				if (display.value[index].parent === parentRowIndex) {
					const childState = rowExpandStates.value[index] || {}
					rowExpandStates.value[index] = {
						...childState,
						childrenOpen: false,
					}
					// Recursively close this child's descendants
					closeDescendants(index)
				}
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
				// Default cell formatting comes from the component's category; anything without an
				// opinion (including an unknown component) renders the raw value.
				const category = componentCategory(column.component)
				if (category === 'boolean') return value ? '✓' : '✗'
				if (category === 'date') return value != null ? new Date(String(value)).toLocaleDateString() : value
				if (category === 'datetime') return value != null ? new Date(String(value)).toLocaleString() : value
				if (category === 'quantity') return formatQuantity(value)
				return value
			}

			if (typeof format === 'function') {
				return format(value, { table: table.value, row, column })
			} else if (typeof format === 'string') {
				// parse format function from string
				// oxlint-disable-next-line @typescript-eslint/no-implied-eval
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

		const createConnection = (
			fromHandleId: string,
			toHandleId: string,
			options?: { style?: ConnectionPath['style']; label?: string }
		) => {
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
					side: fromHandle.side,
				},
				to: {
					barId: toHandle.barId,
					side: toHandle.side,
				},
				style: options?.style,
				label: options?.label,
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
			return connectionPaths.value.filter(conn => conn.from.barId === barId || conn.to.barId === barId)
		}

		const getHandlesForBar = (barId: string) => {
			return connectionHandles.value.filter(handle => handle.barId === barId)
		}

		const sortByColumn = (colIndex: number) => {
			const column = columns.value[colIndex]
			if (column.sortable === false) return

			let newDirection: 'asc' | 'desc'
			if (sortState.value.column === colIndex) {
				if (sortState.value.direction === 'asc') {
					newDirection = 'desc'
				} else {
					newDirection = 'asc'
				}
			} else {
				newDirection = 'asc'
			}

			sortState.value.column = colIndex
			sortState.value.direction = newDirection

			// Note: The actual sorting is now handled in the filteredRows computed property
			// This ensures that sorting works on filtered data without modifying the original rows
		}

		const setFilter = (colIndex: number, filter: FilterState) => {
			if (!filter.value && !filter.startValue && !filter.endValue) {
				// Remove filter if empty
				delete filterState.value[colIndex]
			} else {
				filterState.value[colIndex] = filter
			}
		}

		const clearFilter = (colIndex: number) => {
			delete filterState.value[colIndex]
		}

		// Row action methods

		/**
		 * Add a new row to the table.
		 * @param rowData - Optional partial row data to initialize the new row with
		 * @param position - Where to insert the row: 'start', 'end', or a specific index
		 * @returns The index of the newly added row
		 */
		const addRow = (rowData?: Partial<TableRow>, position: 'start' | 'end' | number = 'end'): number => {
			// Create a new row with default empty values for each column
			const newRow: TableRow = {}
			for (const column of columns.value) {
				newRow[column.name] = ''
			}

			// Merge in any provided row data
			if (rowData) {
				Object.assign(newRow, rowData)
			}

			let insertIndex: number
			if (position === 'start') {
				insertIndex = 0
				rows.value.unshift(newRow)
			} else if (position === 'end') {
				insertIndex = rows.value.length
				rows.value.push(newRow)
			} else {
				insertIndex = Math.max(0, Math.min(position, rows.value.length))
				rows.value.splice(insertIndex, 0, newRow)
			}

			return insertIndex
		}

		/**
		 * Delete a row from the table.
		 * @param rowIndex - The index of the row to delete
		 * @returns The deleted row, or null if the index was invalid
		 */
		const deleteRow = (rowIndex: number): TableRow | null => {
			if (rowIndex < 0 || rowIndex >= rows.value.length) {
				return null
			}

			const [deletedRow] = rows.value.splice(rowIndex, 1)

			// Clean up row modifications tracking for the deleted row
			delete rowModifications.value[rowIndex]
			delete rowExpandStates.value[rowIndex]

			// Shift modification/expand state indices for rows after the deleted one
			const newModifications: Record<number, boolean> = {}
			const newExpandStates: Record<number, { childrenOpen?: boolean; expanded?: boolean }> = {}

			for (const [key, value] of Object.entries(rowModifications.value)) {
				const idx = parseInt(key)
				if (idx > rowIndex) {
					newModifications[idx - 1] = value
				} else {
					newModifications[idx] = value
				}
			}

			for (const [key, value] of Object.entries(rowExpandStates.value)) {
				const idx = parseInt(key)
				if (idx > rowIndex) {
					newExpandStates[idx - 1] = value
				} else {
					newExpandStates[idx] = value
				}
			}

			rowModifications.value = newModifications
			rowExpandStates.value = newExpandStates

			return deletedRow
		}

		/**
		 * Duplicate a row in the table.
		 * @param rowIndex - The index of the row to duplicate
		 * @returns The index of the new duplicated row, or -1 if the index was invalid
		 */
		const duplicateRow = (rowIndex: number): number => {
			if (rowIndex < 0 || rowIndex >= rows.value.length) {
				return -1
			}

			// Deep clone the row data
			const originalRow = rows.value[rowIndex]
			const duplicatedRow: TableRow = JSON.parse(JSON.stringify(originalRow))

			// Insert the duplicated row after the original
			const newIndex = rowIndex + 1
			rows.value.splice(newIndex, 0, duplicatedRow)

			return newIndex
		}

		/**
		 * Insert a new row above the specified row.
		 * @param rowIndex - The index of the row to insert above
		 * @param rowData - Optional partial row data to initialize the new row with
		 * @returns The index of the newly inserted row
		 */
		const insertRowAbove = (rowIndex: number, rowData?: Partial<TableRow>): number => {
			const insertIndex = Math.max(0, rowIndex)
			return addRow(rowData, insertIndex)
		}

		/**
		 * Insert a new row below the specified row.
		 * @param rowIndex - The index of the row to insert below
		 * @param rowData - Optional partial row data to initialize the new row with
		 * @returns The index of the newly inserted row
		 */
		const insertRowBelow = (rowIndex: number, rowData?: Partial<TableRow>): number => {
			const insertIndex = Math.min(rowIndex + 1, rows.value.length)
			return addRow(rowData, insertIndex)
		}

		/**
		 * Move a row from one position to another.
		 * @param fromIndex - The current index of the row to move
		 * @param toIndex - The target index to move the row to
		 * @returns true if the move was successful, false otherwise
		 */
		const moveRow = (fromIndex: number, toIndex: number): boolean => {
			// Validate indices
			if (
				fromIndex < 0 ||
				fromIndex >= rows.value.length ||
				toIndex < 0 ||
				toIndex >= rows.value.length ||
				fromIndex === toIndex
			) {
				return false
			}

			// Remove the row from its current position
			const [movedRow] = rows.value.splice(fromIndex, 1)

			// Insert at the new position
			rows.value.splice(toIndex, 0, movedRow)

			// Update row modification and expand state indices
			const newModifications: Record<number, boolean> = {}
			const newExpandStates: Record<number, { childrenOpen?: boolean; expanded?: boolean }> = {}

			for (const [key, value] of Object.entries(rowModifications.value)) {
				const idx = parseInt(key)
				let newIdx = idx

				if (idx === fromIndex) {
					// The moved row
					newIdx = toIndex
				} else if (fromIndex < toIndex) {
					// Moving down: rows between fromIndex and toIndex shift up
					if (idx > fromIndex && idx <= toIndex) {
						newIdx = idx - 1
					}
				} else {
					// Moving up: rows between toIndex and fromIndex shift down
					if (idx >= toIndex && idx < fromIndex) {
						newIdx = idx + 1
					}
				}

				newModifications[newIdx] = value
			}

			for (const [key, value] of Object.entries(rowExpandStates.value)) {
				const idx = parseInt(key)
				let newIdx = idx

				if (idx === fromIndex) {
					newIdx = toIndex
				} else if (fromIndex < toIndex) {
					if (idx > fromIndex && idx <= toIndex) {
						newIdx = idx - 1
					}
				} else {
					if (idx >= toIndex && idx < fromIndex) {
						newIdx = idx + 1
					}
				}

				newExpandStates[newIdx] = value
			}

			rowModifications.value = newModifications
			rowExpandStates.value = newExpandStates

			return true
		}

		return {
			// state
			columns,
			config,
			connectionHandles,
			connectionPaths,
			display,
			filterState,
			ganttBars,
			modal,
			rows,
			sortState,
			table,
			updates,

			// getters
			filteredRows,
			hasPinnedColumns,
			isGanttView,
			isTreeView,
			isDependencyGraphEnabled,
			numberedRowWidth,
			zeroColumn,

			// resolver
			linkResolver,

			// actions
			addRow,
			clearFilter,
			closeModal,
			createConnection,
			deleteConnection,
			deleteRow,
			duplicateRow,
			getCellData,
			getCellDisplayValue,
			getConnectionsForBar,
			getFormattedValue,
			getHandlesForBar,
			getHeaderCellStyle,
			getRowExpandSymbol,
			insertRowAbove,
			insertRowBelow,
			isRowGantt,
			isRowVisible,
			moveRow,
			registerConnectionHandle,
			registerGanttBar,
			resizeColumn,
			setCellData,
			setCellText,
			setFilter,
			sortByColumn,
			toggleRowExpand,
			unregisterConnectionHandle,
			unregisterGanttBar,
			updateGanttBar,
			updateRows,
		}
	})

	return createStore()
}
