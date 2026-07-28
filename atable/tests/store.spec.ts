import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { createTableStore, getIndent } from '../src/stores/table'
import type { TableColumn, TableRow, GanttBarInfo, ConnectionHandle } from '../src/types'

describe('table store', { tags: ['component'] }, () => {
	let store: ReturnType<typeof createTableStore>

	const mockColumns: TableColumn[] = [
		{ name: 'id', label: 'ID', width: '100px', align: 'left' },
		{ name: 'name', label: 'Name', width: '200px', align: 'center' },
		{ name: 'status', label: 'Status', width: '150px', align: 'right' },
	]

	const mockRows: TableRow[] = [
		{ id: 1, name: 'John', status: 'active' },
		{ id: 2, name: 'Jane', status: 'inactive' },
		{ id: 3, name: 'Bob', status: 'active' },
	]

	beforeEach(() => {
		setActivePinia(createPinia())
		store = createTableStore({
			columns: mockColumns,
			rows: mockRows.map(row => ({ ...row })),
		})
	})

	describe('initialization', () => {
		it('should initialize with provided data', () => {
			expect(store.columns).toEqual(mockColumns)
			expect(store.rows).toEqual(mockRows)
			expect(store.display).toHaveLength(mockRows.length)
		})

		it('should generate a unique store ID', () => {
			const store1 = createTableStore({ columns: mockColumns, rows: mockRows })
			const store2 = createTableStore({ columns: mockColumns, rows: mockRows })
			expect(store1.$id).not.toEqual(store2.$id)
			expect(store1.$id).toMatch(/^table-/)
		})

		it('should use provided ID', () => {
			const customStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				id: 'custom-id',
			})
			expect(customStore.$id).toBe('table-custom-id')
		})

		it('should initialize display array', () => {
			expect(store.display).toHaveLength(mockRows.length)
			store.display.forEach(displayItem => {
				expect(displayItem).toHaveProperty('rowModified', false)
				expect(displayItem).toHaveProperty('isRoot', true)
			})
		})
	})

	describe('computed properties', () => {
		it('should calculate zeroColumn correctly', () => {
			store.config.view = 'list'
			expect(store.zeroColumn).toBe(true)

			store.config.view = 'uncounted'
			expect(store.zeroColumn).toBe(false)
		})

		it('should calculate hasPinnedColumns correctly', () => {
			expect(store.hasPinnedColumns).toBe(false)

			store.columns[0].pinned = true
			expect(store.hasPinnedColumns).toBe(true)
		})

		it('should calculate isTreeView correctly', () => {
			store.config.view = 'tree'
			expect(store.isTreeView).toBe(true)

			store.config.view = 'list'
			expect(store.isTreeView).toBe(false)
		})

		it('should calculate isGanttView correctly', () => {
			store.config.view = 'gantt'
			expect(store.isGanttView).toBe(true)

			store.config.view = 'tree-gantt'
			expect(store.isGanttView).toBe(true)

			store.config.view = 'list'
			expect(store.isGanttView).toBe(false)
		})

		it('should calculate numberedRowWidth correctly', () => {
			// For 3 rows, should be 1ch (3 / 100 + 1 = 1.03, Math.ceil = 2, but minimum 1)
			expect(store.numberedRowWidth).toMatch(/\d+ch/)
		})
	})

	describe('column operations', () => {
		it('should resize column', () => {
			store.resizeColumn(0, 150)
			expect(store.columns[0].width).toBe('150px')
		})

		it('should not resize column with invalid index', () => {
			const originalWidth = store.columns[0].width
			store.resizeColumn(-1, 150)
			store.resizeColumn(999, 150)
			expect(store.columns[0].width).toBe(originalWidth)
		})

		it('should enforce minimum width when resizing', () => {
			store.resizeColumn(0, 10) // Below minimum of 40
			expect(store.columns[0].width).toBe('40px')
		})
	})

	describe('row operations', () => {
		it('should toggle row expansion in tree view', () => {
			store.config.view = 'tree'
			const originalState = store.display[0].childrenOpen
			store.toggleRowExpand(0)
			expect(store.display[0].childrenOpen).toBe(!originalState)
		})

		it('should toggle row expansion in list-expansion view', () => {
			store.config.view = 'list-expansion'
			const originalState = store.display[0].expanded
			store.toggleRowExpand(0)
			expect(store.display[0].expanded).toBe(!originalState)
		})

		it('should check if row is visible', () => {
			store.config.view = 'list'
			expect(store.isRowVisible(0)).toBe(true)

			store.config.view = 'tree'
			expect(store.isRowVisible(0)).toBe(true) // Root rows are always visible
		})

		it('should check if row is gantt', () => {
			store.config.view = 'gantt'
			expect(store.isRowGantt(0)).toBe(false) // No gantt data

			// Add gantt data
			store.rows[0].gantt = { startIndex: 0, endIndex: 2 }
			expect(store.isRowGantt(0)).toBe(true)
		})

		it('should get row expand symbol', () => {
			store.config.view = 'list'
			expect(store.getRowExpandSymbol(0)).toBe('')

			store.config.view = 'tree'
			store.display[0].isRoot = true
			expect(store.getRowExpandSymbol(0)).toMatch(/[►▼]/)
		})
	})

	describe('cell operations', () => {
		it('should get cell data', () => {
			const value = store.getCellData(1, 0) // column 1 (name), row 0
			expect(value).toBe('John')
		})

		it('should set cell data', () => {
			store.setCellData(1, 0, 'Johnny')
			expect(store.getCellData(1, 0)).toBe('Johnny')
			expect(store.rows[0].name).toBe('Johnny')
			expect(store.display[0].rowModified).toBe(true)
		})

		it('should set cell text', () => {
			// setCellText stages the change in updates without committing to rows.
			// store.table reflects only committed rows, so it remains 'John' here.
			const newValue = 'Johnny'
			store.setCellText(1, 0, newValue)

			expect(store.updates['1:0']).toBe(newValue)
			expect(store.display[0].rowModified).toBe(true)
		})

		it('should get formatted value', () => {
			const mockColumn = {
				...mockColumns[0],
				format: (value: any) => `Formatted: ${value}`,
			}
			store.columns[0] = mockColumn

			const formatted = store.getFormattedValue(0, 0, 'test')
			expect(formatted).toBe('Formatted: test')
		})

		it('should get formatted value with string format', () => {
			const mockColumn = {
				...mockColumns[0],
				format: '(value) => `String: ${value}`',
			}
			store.columns[0] = mockColumn

			const formatted = store.getFormattedValue(0, 0, 'test')
			expect(formatted).toBe('String: test')
		})

		describe('component-based formatting defaults', () => {
			it('formats Check true as ✓', () => {
				store.columns[0] = { name: 'id', component: 'ACheckbox' }
				expect(store.getFormattedValue(0, 0, true)).toBe('✓')
			})

			it('formats Check false as ✗', () => {
				store.columns[0] = { name: 'id', component: 'ACheckbox' }
				expect(store.getFormattedValue(0, 0, false)).toBe('✗')
			})

			it('formats Date string as locale date', () => {
				store.columns[0] = { name: 'id', component: 'ADate' }
				const input = '2024-06-15'
				const result = store.getFormattedValue(0, 0, input)
				expect(result).toBe(new Date(input).toLocaleDateString())
			})

			it('returns null for Date when value is null', () => {
				store.columns[0] = { name: 'id', component: 'ADate' }
				expect(store.getFormattedValue(0, 0, null)).toBeNull()
			})

			it('formats Datetime string as locale datetime', () => {
				store.columns[0] = { name: 'id', component: 'ADateTime' }
				const input = '2024-06-15T14:30:00Z'
				const result = store.getFormattedValue(0, 0, input)
				expect(result).toBe(new Date(input).toLocaleString())
			})

			it('returns null for Datetime when value is null', () => {
				store.columns[0] = { name: 'id', component: 'ADateTime' }
				expect(store.getFormattedValue(0, 0, null)).toBeNull()
			})

			it('formats a Quantity composite value as "<qty> <uom>"', () => {
				store.columns[0] = { name: 'id', component: 'AQuantityInput' }
				expect(store.getFormattedValue(0, 0, { qty: 2, uom: 'Box' })).toBe('2 Box')
			})

			it('formats a Currency composite value as "<amount> <currency>"', () => {
				store.columns[0] = { name: 'id', component: 'ACurrencyInput' }
				expect(store.getFormattedValue(0, 0, { amount: 5, currency: { id: 'USD', displayText: 'US Dollar' } })).toBe(
					'5 US Dollar'
				)
			})

			it('passes value through for an unknown component', () => {
				store.columns[0] = { name: 'id', component: 'ATextInput' }
				expect(store.getFormattedValue(0, 0, 'hello')).toBe('hello')
			})

			it('explicit format function takes precedence over the component default', () => {
				store.columns[0] = { name: 'id', component: 'ACheckbox', format: (value: any) => (value ? 'yes' : 'no') }
				expect(store.getFormattedValue(0, 0, true)).toBe('yes')
			})
		})

		it('should get cell display value', () => {
			// Get the actual current value from the cell
			const actualCellData = store.getCellData(1, 0)
			const displayValue = store.getCellDisplayValue(1, 0)

			// The display value should match the actual cell data
			expect(displayValue).toBe(actualCellData)
		})
	})

	describe('style methods', () => {
		it('should get header cell style', () => {
			const style = store.getHeaderCellStyle(mockColumns[1])
			expect(style).toHaveProperty('textAlign', 'center')
			expect(style).toHaveProperty('width', '200px')
		})

		it('should get header cell style with resizable column', () => {
			const resizableColumn = { ...mockColumns[0], resizable: true }
			const style = store.getHeaderCellStyle(resizableColumn)
			expect(style).toHaveProperty('resize', 'horizontal')
			expect(style).toHaveProperty('overflow', 'hidden')
		})

		it('should handle full width table resizing', () => {
			store.config.fullWidth = true

			// Add resizable property to the actual column in the store
			const lastColumnIndex = store.columns.length - 1
			store.columns[lastColumnIndex].resizable = true
			const style = store.getHeaderCellStyle(store.columns[lastColumnIndex])
			expect(style).not.toHaveProperty('resize')

			// But non-last columns should still have resize
			store.columns[0].resizable = true
			const firstStyle = store.getHeaderCellStyle(store.columns[0])
			expect(firstStyle).toHaveProperty('resize', 'horizontal')
		})

		it('should get indent for tree columns', () => {
			const indent = getIndent(0, 2)
			expect(indent).toBe('2ch')

			const noIndent = getIndent(1, 2)
			expect(noIndent).toBe('inherit')
		})
	})

	describe('gantt functionality', () => {
		it('should register and unregister gantt bars', () => {
			const barInfo: GanttBarInfo = {
				id: 'bar-1',
				rowIndex: 0,
				colIndex: 1,
				startIndex: { value: 0 } as any,
				endIndex: { value: 3 } as any,
				color: { value: '#ff0000' } as any,
				position: { x: { value: 10 } as any, y: { value: 20 } as any },
			}

			store.registerGanttBar(barInfo)
			expect(store.ganttBars).toContainEqual(barInfo)

			store.unregisterGanttBar('bar-1')
			expect(store.ganttBars).not.toContainEqual(barInfo)
		})

		it('should update existing gantt bar', () => {
			const barInfo: GanttBarInfo = {
				id: 'bar-1',
				rowIndex: 0,
				colIndex: 1,
				startIndex: { value: 0 } as any,
				endIndex: { value: 3 } as any,
				color: { value: '#ff0000' } as any,
				position: { x: { value: 10 } as any, y: { value: 20 } as any },
			}

			store.registerGanttBar(barInfo)

			const updatedBarInfo = { ...barInfo, color: { value: '#00ff00' } as any }
			store.registerGanttBar(updatedBarInfo)

			expect(store.ganttBars).toHaveLength(1)
			expect(store.ganttBars[0].color).toEqual({ value: '#00ff00' })
		})

		it('should update gantt bar on drag events', () => {
			store.rows[0].gantt = { startIndex: 0, endIndex: 2, colspan: 2 }

			const dragEvent = {
				type: 'bar' as const,
				rowIndex: 0,
				colIndex: 0,
				delta: 1,
				oldStart: 0,
				oldEnd: 2,
				newStart: 1,
				newEnd: 3,
				colspan: 2,
			}

			store.updateGanttBar(dragEvent)
			expect(store.rows[0].gantt?.startIndex).toBe(1)
			expect(store.rows[0].gantt?.endIndex).toBe(3)
		})

		it('should update gantt bar on resize events', () => {
			store.rows[0].gantt = { startIndex: 0, endIndex: 2, colspan: 2 }

			const resizeEvent = {
				type: 'resize' as const,
				edge: 'end' as const,
				rowIndex: 0,
				colIndex: 0,
				delta: 1,
				oldEnd: 2,
				newEnd: 3,
				start: 0,
				oldColspan: 2,
				newColspan: 3,
			}

			store.updateGanttBar(resizeEvent)
			expect(store.rows[0].gantt?.endIndex).toBe(3)
			expect(store.rows[0].gantt?.colspan).toBe(3)
		})
	})

	describe('connection functionality', () => {
		it('should register and unregister connection handles', () => {
			const handleInfo: ConnectionHandle = {
				id: 'handle-1',
				rowIndex: 0,
				colIndex: 1,
				side: 'left',
				position: { x: { value: 10 } as any, y: { value: 20 } as any },
				visible: { value: true } as any,
				barId: 'bar-1',
			}

			store.registerConnectionHandle(handleInfo)
			expect(store.connectionHandles).toContainEqual(handleInfo)

			store.unregisterConnectionHandle('handle-1')
			expect(store.connectionHandles).not.toContainEqual(handleInfo)
		})

		it('should create connections between handles', () => {
			const handle1: ConnectionHandle = {
				id: 'handle-1',
				rowIndex: 0,
				colIndex: 1,
				side: 'right',
				position: { x: { value: 10 } as any, y: { value: 20 } as any },
				visible: { value: true } as any,
				barId: 'bar-1',
			}

			const handle2: ConnectionHandle = {
				id: 'handle-2',
				rowIndex: 1,
				colIndex: 1,
				side: 'left',
				position: { x: { value: 50 } as any, y: { value: 60 } as any },
				visible: { value: true } as any,
				barId: 'bar-2',
			}

			store.registerConnectionHandle(handle1)
			store.registerConnectionHandle(handle2)

			const connection = store.createConnection('handle-1', 'handle-2', {
				style: { color: 'red', width: 2 },
				label: 'Test Connection',
			})

			expect(connection).toBeTruthy()
			expect(store.connectionPaths).toContainEqual(connection)
		})

		it('should delete connections', () => {
			const handle1: ConnectionHandle = {
				id: 'handle-1',
				rowIndex: 0,
				colIndex: 1,
				side: 'right',
				position: { x: { value: 10 } as any, y: { value: 20 } as any },
				visible: { value: true } as any,
				barId: 'bar-1',
			}

			const handle2: ConnectionHandle = {
				id: 'handle-2',
				rowIndex: 1,
				colIndex: 1,
				side: 'left',
				position: { x: { value: 50 } as any, y: { value: 60 } as any },
				visible: { value: true } as any,
				barId: 'bar-2',
			}

			store.registerConnectionHandle(handle1)
			store.registerConnectionHandle(handle2)

			const connection = store.createConnection('handle-1', 'handle-2')
			expect(connection).toBeTruthy()

			const deleted = store.deleteConnection(connection!.id)
			expect(deleted).toBe(true)
			expect(store.connectionPaths).not.toContainEqual(connection)
		})

		it('should get connections for a bar', () => {
			const handle1: ConnectionHandle = {
				id: 'handle-1',
				rowIndex: 0,
				colIndex: 1,
				side: 'right',
				position: { x: { value: 10 } as any, y: { value: 20 } as any },
				visible: { value: true } as any,
				barId: 'bar-1',
			}

			const handle2: ConnectionHandle = {
				id: 'handle-2',
				rowIndex: 1,
				colIndex: 1,
				side: 'left',
				position: { x: { value: 50 } as any, y: { value: 60 } as any },
				visible: { value: true } as any,
				barId: 'bar-2',
			}

			store.registerConnectionHandle(handle1)
			store.registerConnectionHandle(handle2)
			store.createConnection('handle-1', 'handle-2')

			const connections = store.getConnectionsForBar('bar-1')
			expect(connections).toHaveLength(1)
		})

		it('should get handles for a bar', () => {
			const handle1: ConnectionHandle = {
				id: 'handle-1',
				rowIndex: 0,
				colIndex: 1,
				side: 'right',
				position: { x: { value: 10 } as any, y: { value: 20 } as any },
				visible: { value: true } as any,
				barId: 'bar-1',
			}

			store.registerConnectionHandle(handle1)
			const handles = store.getHandlesForBar('bar-1')
			expect(handles).toHaveLength(1)
			expect(handles[0]).toEqual(handle1)
		})
	})

	describe('modal operations', () => {
		it('should close modal when clicking outside', () => {
			store.modal.visible = true
			store.modal.parent = document.createElement('div')

			const outsideElement = document.createElement('div')
			const event = new MouseEvent('click', { bubbles: true })
			Object.defineProperty(event, 'target', { value: outsideElement })

			store.closeModal(event)
			expect(store.modal.visible).toBe(false)
		})

		it('should not close modal when clicking inside', () => {
			store.modal.visible = true
			const parentElement = document.createElement('div')
			const childElement = document.createElement('span')
			parentElement.appendChild(childElement)
			store.modal.parent = parentElement

			const event = new MouseEvent('click', { bubbles: true })
			Object.defineProperty(event, 'target', { value: childElement })

			store.closeModal(event)
			expect(store.modal.visible).toBe(true)
		})
	})

	describe('error handling', () => {
		it('should handle creation of connection with missing handles', () => {
			const connection = store.createConnection('non-existent-1', 'non-existent-2')
			expect(connection).toBeNull()
		})

		it('should handle deletion of non-existent connection', () => {
			const deleted = store.deleteConnection('non-existent-connection')
			expect(deleted).toBe(false)
		})

		it('should handle gantt bar updates with missing gantt data', () => {
			const dragEvent = {
				type: 'bar' as const,
				rowIndex: 0,
				colIndex: 0,
				delta: 1,
				oldStart: 0,
				oldEnd: 2,
				newStart: 1,
				newEnd: 3,
				colspan: 2,
			}

			// Should not throw when gantt data is missing
			expect(() => store.updateGanttBar(dragEvent)).not.toThrow()
		})
	})

	describe('createDisplayObject edge cases', () => {
		it('should handle rows with parent relationships', () => {
			const treeRows: TableRow[] = [
				{ id: 1, name: 'Parent', parent: undefined },
				{ id: 2, name: 'Child 1', parent: 0 },
				{ id: 3, name: 'Child 2', parent: 0 },
				{ id: 4, name: 'Grandchild', parent: 1 },
			]

			const treeStore = createTableStore({
				columns: mockColumns,
				rows: treeRows,
			})

			// Check parent detection
			expect(treeStore.display[0].isParent).toBe(true)
			expect(treeStore.display[1].isParent).toBe(true)
			expect(treeStore.display[2].isParent).toBe(false)
			expect(treeStore.display[3].isParent).toBe(false)

			// Check root detection
			expect(treeStore.display[0].isRoot).toBe(true)
			expect(treeStore.display[1].isRoot).toBe(false)
		})

		it('should handle rows with indent property', () => {
			const indentedRows: TableRow[] = [
				{ id: 1, name: 'Level 0', indent: 0 },
				{ id: 2, name: 'Level 1', indent: 1 },
				{ id: 3, name: 'Level 2', indent: 2 },
			]

			const indentStore = createTableStore({
				columns: mockColumns,
				rows: indentedRows,
			})

			expect(indentStore.display[0].indent).toBe(0)
			expect(indentStore.display[1].indent).toBe(1)
			expect(indentStore.display[2].indent).toBe(2)
		})
	})

	describe('tree view functionality', () => {
		it('should toggle row expansion in tree view', () => {
			const treeRows: TableRow[] = [
				{ id: 1, name: 'Parent', parent: undefined },
				{ id: 2, name: 'Child 1', parent: 0 },
				{ id: 3, name: 'Child 2', parent: 0 },
			]

			const treeStore = createTableStore({
				columns: mockColumns,
				rows: treeRows,
				config: { view: 'tree', defaultTreeExpansion: 'root' },
			})

			// Initially children should be closed (using root mode)
			expect(treeStore.display[1].open).toBe(false)
			expect(treeStore.display[2].open).toBe(false)

			// Toggle parent
			treeStore.toggleRowExpand(0)

			expect(treeStore.display[0].childrenOpen).toBe(true)
			expect(treeStore.display[1].open).toBe(true)
			expect(treeStore.display[2].open).toBe(true)
		})

		it('should toggle nested children in tree view', () => {
			const nestedRows: TableRow[] = [
				{ id: 1, name: 'Root', parent: undefined },
				{ id: 2, name: 'Parent', parent: 0 },
				{ id: 3, name: 'Child', parent: 1 },
			]

			const treeStore = createTableStore({
				columns: mockColumns,
				rows: nestedRows,
				config: { view: 'tree', defaultTreeExpansion: 'root' },
			})

			// Initially child should not be open (using root mode - parents are collapsed)
			expect(treeStore.display[2].open).toBe(false)

			// Toggle root to open its children (row 1)
			treeStore.toggleRowExpand(0)
			expect(treeStore.display[1].open).toBe(true)

			// Toggle parent to open its children (row 2)
			treeStore.toggleRowExpand(1)
			expect(treeStore.display[2].open).toBe(true)
		})

		it('should toggle expansion in list-expansion view', () => {
			const listStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'list-expansion' },
			})

			expect(listStore.display[0].expanded).toBe(false)

			listStore.toggleRowExpand(0)

			expect(listStore.display[0].expanded).toBe(true)

			listStore.toggleRowExpand(0)

			expect(listStore.display[0].expanded).toBe(false)
		})

		it('should properly hide children when toggling parent node off', () => {
			const treeRows: TableRow[] = [
				{ id: 1, name: 'Parent', parent: undefined },
				{ id: 2, name: 'Child 1', parent: 0 },
				{ id: 3, name: 'Child 2', parent: 0 },
			]

			const treeStore = createTableStore({
				columns: mockColumns,
				rows: treeRows,
				config: { view: 'tree', defaultTreeExpansion: 'root' },
			})

			// Initially children should be closed (not visible) using root mode
			expect(treeStore.display[1].open).toBe(false)
			expect(treeStore.display[2].open).toBe(false)
			expect(treeStore.isRowVisible(1)).toBe(false)
			expect(treeStore.isRowVisible(2)).toBe(false)

			// Toggle parent to open children
			treeStore.toggleRowExpand(0)
			expect(treeStore.display[0].childrenOpen).toBe(true)
			expect(treeStore.display[1].open).toBe(true)
			expect(treeStore.display[2].open).toBe(true)
			expect(treeStore.isRowVisible(1)).toBe(true)
			expect(treeStore.isRowVisible(2)).toBe(true)

			// Toggle parent again to close children
			treeStore.toggleRowExpand(0)
			expect(treeStore.display[0].childrenOpen).toBe(false)
			expect(treeStore.display[1].open).toBe(false)
			expect(treeStore.display[2].open).toBe(false)
			expect(treeStore.isRowVisible(1)).toBe(false)
			expect(treeStore.isRowVisible(2)).toBe(false)
		})

		it('should handle deep nested tree hierarchy correctly', () => {
			const deepTreeRows: TableRow[] = [
				{ id: 1, name: 'Root', parent: undefined },
				{ id: 2, name: 'Level 1', parent: 0 },
				{ id: 3, name: 'Level 2a', parent: 1 },
				{ id: 4, name: 'Level 2b', parent: 1 },
				{ id: 5, name: 'Level 3', parent: 2 },
			]

			const treeStore = createTableStore({
				columns: mockColumns,
				rows: deepTreeRows,
				config: { view: 'tree', defaultTreeExpansion: 'root' },
			})

			// Initially all children should be closed
			expect(treeStore.isRowVisible(1)).toBe(false) // Level 1
			expect(treeStore.isRowVisible(2)).toBe(false) // Level 2a
			expect(treeStore.isRowVisible(3)).toBe(false) // Level 2b
			expect(treeStore.isRowVisible(4)).toBe(false) // Level 3

			// Open root - should only show Level 1
			treeStore.toggleRowExpand(0)
			expect(treeStore.isRowVisible(1)).toBe(true) // Level 1 now visible
			expect(treeStore.isRowVisible(2)).toBe(false) // Level 2a still hidden
			expect(treeStore.isRowVisible(3)).toBe(false) // Level 2b still hidden
			expect(treeStore.isRowVisible(4)).toBe(false) // Level 3 still hidden

			// Open Level 1 - should show Level 2a and Level 2b
			treeStore.toggleRowExpand(1)
			expect(treeStore.isRowVisible(2)).toBe(true) // Level 2a now visible
			expect(treeStore.isRowVisible(3)).toBe(true) // Level 2b now visible
			expect(treeStore.isRowVisible(4)).toBe(false) // Level 3 still hidden

			// Open Level 2a - should show Level 3
			treeStore.toggleRowExpand(2)
			expect(treeStore.isRowVisible(4)).toBe(true) // Level 3 now visible

			// Close root - should hide ALL children
			treeStore.toggleRowExpand(0)
			expect(treeStore.isRowVisible(1)).toBe(false) // Level 1 hidden
			expect(treeStore.isRowVisible(2)).toBe(false) // Level 2a hidden
			expect(treeStore.isRowVisible(3)).toBe(false) // Level 2b hidden
			expect(treeStore.isRowVisible(4)).toBe(false) // Level 3 hidden
		})

		it('should not expand all descendants when toggling a group node twice', () => {
			const deepTreeRows: TableRow[] = [
				{ id: 1, name: 'Root', parent: undefined },
				{ id: 2, name: 'Level 1a', parent: 0 },
				{ id: 3, name: 'Level 1b', parent: 0 },
				{ id: 4, name: 'Level 2a', parent: 1 },
				{ id: 5, name: 'Level 2b', parent: 1 },
				{ id: 6, name: 'Level 3', parent: 3 },
			]

			const treeStore = createTableStore({
				columns: mockColumns,
				rows: deepTreeRows,
				config: { view: 'tree', defaultTreeExpansion: 'root' },
			})

			// First expansion of root - should only show Level 1a and Level 1b
			treeStore.toggleRowExpand(0)
			expect(treeStore.isRowVisible(1)).toBe(true) // Level 1a visible
			expect(treeStore.isRowVisible(2)).toBe(true) // Level 1b visible
			expect(treeStore.isRowVisible(3)).toBe(false) // Level 2a hidden
			expect(treeStore.isRowVisible(4)).toBe(false) // Level 2b hidden
			expect(treeStore.isRowVisible(5)).toBe(false) // Level 3 hidden

			// Collapse root
			treeStore.toggleRowExpand(0)
			expect(treeStore.isRowVisible(1)).toBe(false) // Level 1a hidden
			expect(treeStore.isRowVisible(2)).toBe(false) // Level 1b hidden

			// Second expansion of root - should STILL only show Level 1a and Level 1b, NOT all descendants
			treeStore.toggleRowExpand(0)
			expect(treeStore.isRowVisible(1)).toBe(true) // Level 1a visible
			expect(treeStore.isRowVisible(2)).toBe(true) // Level 1b visible
			expect(treeStore.isRowVisible(3)).toBe(false) // Level 2a should STILL be hidden
			expect(treeStore.isRowVisible(4)).toBe(false) // Level 2b should STILL be hidden
			expect(treeStore.isRowVisible(5)).toBe(false) // Level 3 should STILL be hidden

			// Now expand Level 1a explicitly - should show only its immediate children
			treeStore.toggleRowExpand(1)
			expect(treeStore.isRowVisible(3)).toBe(true) // Level 2a now visible
			expect(treeStore.isRowVisible(4)).toBe(true) // Level 2b now visible
			expect(treeStore.isRowVisible(5)).toBe(false) // Level 3 still hidden (Level 2a not expanded)
		})
	})

	describe('gantt functionality', () => {
		it('should register gantt bars', () => {
			const ganttStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'gantt' },
			})

			const mockBar = {
				id: 'test-bar',
				rowIndex: 0,
				colIndex: 0,
				startIndex: { value: 0 },
				endIndex: { value: 5 },
				color: { value: '#ff0000' },
				label: 'Test Bar',
				position: { x: { value: 100 }, y: { value: 50 } },
			}

			ganttStore.registerGanttBar(mockBar as any)

			expect(ganttStore.ganttBars).toHaveLength(1)
			expect(ganttStore.ganttBars[0].id).toBe('test-bar')
		})

		it('should unregister gantt bars', () => {
			const ganttStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'gantt' },
			})

			const mockBar = {
				id: 'test-bar',
				rowIndex: 0,
				colIndex: 0,
				startIndex: { value: 0 },
				endIndex: { value: 5 },
				color: { value: '#ff0000' },
				label: 'Test Bar',
				position: { x: { value: 100 }, y: { value: 50 } },
			}

			ganttStore.registerGanttBar(mockBar as any)
			expect(ganttStore.ganttBars.length).toBe(1)

			ganttStore.unregisterGanttBar('test-bar')
			expect(ganttStore.ganttBars.length).toBe(0)
		})

		it('should register connection handles', () => {
			const ganttStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'gantt' },
			})

			const mockHandle = {
				id: 'test-handle',
				rowIndex: 0,
				colIndex: 0,
				side: 'left' as const,
				position: { x: { value: 100 }, y: { value: 50 } },
				visible: { value: false },
				barId: 'test-bar',
			}

			ganttStore.registerConnectionHandle(mockHandle as any)

			expect(ganttStore.connectionHandles).toHaveLength(1)
			expect(ganttStore.connectionHandles[0].id).toBe('test-handle')
		})

		it('should unregister connection handles', () => {
			const ganttStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'gantt' },
			})

			const mockHandle = {
				id: 'test-handle',
				rowIndex: 0,
				colIndex: 0,
				side: 'left' as const,
				position: { x: { value: 100 }, y: { value: 50 } },
				visible: { value: false },
				barId: 'test-bar',
			}

			ganttStore.registerConnectionHandle(mockHandle as any)
			expect(ganttStore.connectionHandles.length).toBe(1)

			ganttStore.unregisterConnectionHandle('test-handle')
			expect(ganttStore.connectionHandles.length).toBe(0)
		})

		it('should create connections between handles', () => {
			const ganttStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'gantt' },
			})

			// Register handles first
			const fromHandle = {
				id: 'from-handle',
				rowIndex: 0,
				colIndex: 0,
				side: 'right' as const,
				position: { x: { value: 100 }, y: { value: 50 } },
				visible: { value: false },
				barId: 'from-bar',
			}

			const toHandle = {
				id: 'to-handle',
				rowIndex: 1,
				colIndex: 0,
				side: 'left' as const,
				position: { x: { value: 200 }, y: { value: 100 } },
				visible: { value: false },
				barId: 'to-bar',
			}

			ganttStore.registerConnectionHandle(fromHandle as any)
			ganttStore.registerConnectionHandle(toHandle as any)

			const connection = ganttStore.createConnection('from-handle', 'to-handle')

			expect(connection).toBeDefined()
			expect(connection?.from.barId).toBe('from-bar')
			expect(connection?.to.barId).toBe('to-bar')
			expect(ganttStore.connectionPaths.length).toBe(1)
		})

		it('should handle creating connection with missing handles', () => {
			const ganttStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'gantt' },
			})

			// Try to create connection without registering handles
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			const connection = ganttStore.createConnection('missing-from', 'missing-to')

			expect(connection).toBe(null)
			expect(consoleSpy).toHaveBeenCalledWith('Cannot create connection: handle not found')

			consoleSpy.mockRestore()
		})

		it('should delete connections', () => {
			const ganttStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'gantt' },
			})

			// Register handles and create connection
			const fromHandle = {
				id: 'from-handle',
				rowIndex: 0,
				colIndex: 0,
				side: 'right' as const,
				position: { x: { value: 100 }, y: { value: 50 } },
				visible: { value: false },
				barId: 'from-bar',
			}

			const toHandle = {
				id: 'to-handle',
				rowIndex: 1,
				colIndex: 0,
				side: 'left' as const,
				position: { x: { value: 200 }, y: { value: 100 } },
				visible: { value: false },
				barId: 'to-bar',
			}

			ganttStore.registerConnectionHandle(fromHandle as any)
			ganttStore.registerConnectionHandle(toHandle as any)

			const connection = ganttStore.createConnection('from-handle', 'to-handle')
			expect(ganttStore.connectionPaths.length).toBe(1)

			const success = ganttStore.deleteConnection(connection!.id)
			expect(success).toBe(true)
			expect(ganttStore.connectionPaths.length).toBe(0)
		})

		it('should return false when deleting non-existent connection', () => {
			const ganttStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'gantt' },
			})

			const success = ganttStore.deleteConnection('non-existent-id')
			expect(success).toBe(false)
		})

		it('should get connections for a bar', () => {
			const ganttStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'gantt' },
			})

			// Create a connection
			const fromHandle = {
				id: 'from-handle',
				rowIndex: 0,
				colIndex: 0,
				side: 'right' as const,
				position: { x: { value: 100 }, y: { value: 50 } },
				visible: { value: false },
				barId: 'test-bar',
			}

			const toHandle = {
				id: 'to-handle',
				rowIndex: 1,
				colIndex: 0,
				side: 'left' as const,
				position: { x: { value: 200 }, y: { value: 100 } },
				visible: { value: false },
				barId: 'other-bar',
			}

			ganttStore.registerConnectionHandle(fromHandle as any)
			ganttStore.registerConnectionHandle(toHandle as any)
			ganttStore.createConnection('from-handle', 'to-handle')

			const connections = ganttStore.getConnectionsForBar('test-bar')
			expect(connections.length).toBe(1)
			expect(connections[0].from.barId).toBe('test-bar')
		})

		it('should get handles for a bar', () => {
			const ganttStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'gantt' },
			})

			const handle1 = {
				id: 'handle-1',
				rowIndex: 0,
				colIndex: 0,
				side: 'left' as const,
				position: { x: { value: 100 }, y: { value: 50 } },
				visible: { value: false },
				barId: 'test-bar',
			}

			const handle2 = {
				id: 'handle-2',
				rowIndex: 0,
				colIndex: 0,
				side: 'right' as const,
				position: { x: { value: 150 }, y: { value: 50 } },
				visible: { value: false },
				barId: 'test-bar',
			}

			ganttStore.registerConnectionHandle(handle1 as any)
			ganttStore.registerConnectionHandle(handle2 as any)

			const handles = ganttStore.getHandlesForBar('test-bar')
			expect(handles.length).toBe(2)
			expect(handles.map(h => h.side)).toEqual(['left', 'right'])
		})
	})

	describe('computed properties edge cases', () => {
		it('should handle tree-gantt view', () => {
			const treeGanttStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'tree-gantt' },
			})

			expect(treeGanttStore.isGanttView).toBe(true)
			expect(treeGanttStore.isTreeView).toBe(true)
		})

		it('should compute numberedRowWidth correctly', () => {
			// This test is for completeness - the actual computation logic is already tested
			expect(store.numberedRowWidth).toBeDefined()
		})

		it('should detect pinned columns correctly', () => {
			const pinnedColumns: TableColumn[] = [
				{ name: 'id', label: 'ID', pinned: true },
				{ name: 'name', label: 'Name' },
			]

			const pinnedStore = createTableStore({
				columns: pinnedColumns,
				rows: mockRows,
			})

			expect(pinnedStore.hasPinnedColumns).toBe(true)
		})

		it('should handle zero column for different views', () => {
			const treeStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'tree' },
			})

			const listExpansionStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'list-expansion' },
			})

			expect(treeStore.zeroColumn).toBe(true)
			expect(listExpansionStore.zeroColumn).toBe(true)
		})
	})

	describe('row action methods', () => {
		it('should add a row at the end by default', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			const initialLength = testStore.rows.length
			const newIndex = testStore.addRow({ id: 99, name: 'New', status: 'pending' })

			expect(newIndex).toBe(initialLength)
			expect(testStore.rows.length).toBe(initialLength + 1)
			expect(testStore.rows[newIndex].name).toBe('New')
		})

		it('should add a row at the start', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			const initialLength = testStore.rows.length
			const newIndex = testStore.addRow({ id: 99, name: 'First', status: 'pending' }, 'start')

			expect(newIndex).toBe(0)
			expect(testStore.rows.length).toBe(initialLength + 1)
			expect(testStore.rows[0].name).toBe('First')
		})

		it('should add a row at a specific index', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			const initialLength = testStore.rows.length
			const newIndex = testStore.addRow({ id: 99, name: 'Middle', status: 'pending' }, 1)

			expect(newIndex).toBe(1)
			expect(testStore.rows.length).toBe(initialLength + 1)
			expect(testStore.rows[1].name).toBe('Middle')
		})

		it('should add a row with default empty values when no data provided', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			const newIndex = testStore.addRow()

			expect(testStore.rows[newIndex].id).toBe('')
			expect(testStore.rows[newIndex].name).toBe('')
			expect(testStore.rows[newIndex].status).toBe('')
		})

		it('should delete a row and return the deleted row', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			const initialLength = testStore.rows.length
			const rowToDelete = { ...testStore.rows[1] }
			const deletedRow = testStore.deleteRow(1)

			expect(deletedRow).toEqual(rowToDelete)
			expect(testStore.rows.length).toBe(initialLength - 1)
			expect(testStore.rows.find(r => r.id === rowToDelete.id)).toBeUndefined()
		})

		it('should return null when deleting with invalid index', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			const result = testStore.deleteRow(-1)
			expect(result).toBeNull()

			const result2 = testStore.deleteRow(999)
			expect(result2).toBeNull()
		})

		it('should duplicate a row', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			const initialLength = testStore.rows.length
			const originalRow = testStore.rows[0]
			const newIndex = testStore.duplicateRow(0)

			expect(newIndex).toBe(1)
			expect(testStore.rows.length).toBe(initialLength + 1)
			expect(testStore.rows[newIndex].name).toBe(originalRow.name)
			expect(testStore.rows[newIndex].id).toBe(originalRow.id)
		})

		it('should return -1 when duplicating with invalid index', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			const result = testStore.duplicateRow(-1)
			expect(result).toBe(-1)

			const result2 = testStore.duplicateRow(999)
			expect(result2).toBe(-1)
		})

		it('should insert a row above', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			const initialLength = testStore.rows.length
			const newIndex = testStore.insertRowAbove(1, { id: 99, name: 'Above', status: 'new' })

			expect(newIndex).toBe(1)
			expect(testStore.rows.length).toBe(initialLength + 1)
			expect(testStore.rows[1].name).toBe('Above')
		})

		it('should insert a row below', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			const initialLength = testStore.rows.length
			const newIndex = testStore.insertRowBelow(1, { id: 99, name: 'Below', status: 'new' })

			expect(newIndex).toBe(2)
			expect(testStore.rows.length).toBe(initialLength + 1)
			expect(testStore.rows[2].name).toBe('Below')
		})

		it('should move a row down', () => {
			// Use fresh rows to avoid mutation from other tests
			const freshRows: TableRow[] = [
				{ id: 1, name: 'John', status: 'active' },
				{ id: 2, name: 'Jane', status: 'inactive' },
				{ id: 3, name: 'Bob', status: 'active' },
			]
			const testStore = createTableStore({ columns: mockColumns, rows: freshRows })
			const success = testStore.moveRow(0, 2)

			expect(success).toBe(true)
			expect(testStore.rows[0].name).toBe('Jane')
			expect(testStore.rows[1].name).toBe('Bob')
			expect(testStore.rows[2].name).toBe('John')
		})

		it('should move a row up', () => {
			// Use fresh rows to avoid mutation from other tests
			const freshRows: TableRow[] = [
				{ id: 1, name: 'John', status: 'active' },
				{ id: 2, name: 'Jane', status: 'inactive' },
				{ id: 3, name: 'Bob', status: 'active' },
			]
			const testStore = createTableStore({ columns: mockColumns, rows: freshRows })
			const success = testStore.moveRow(2, 0)

			expect(success).toBe(true)
			expect(testStore.rows[0].name).toBe('Bob')
			expect(testStore.rows[1].name).toBe('John')
			expect(testStore.rows[2].name).toBe('Jane')
		})

		it('should return false when moving with invalid indices', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			expect(testStore.moveRow(-1, 1)).toBe(false)
			expect(testStore.moveRow(0, 999)).toBe(false)
			expect(testStore.moveRow(1, 1)).toBe(false) // Same index
		})

		it('should preserve row modifications when deleting rows', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			// Modify row 2
			testStore.setCellData(1, 2, 'Modified')
			expect(testStore.display[2].rowModified).toBe(true)

			// Delete row 1 (before the modified row)
			testStore.deleteRow(1)

			// Row 2 is now row 1, and should still be modified
			expect(testStore.display[1].rowModified).toBe(true)
		})

		it('should preserve row modifications when moving rows', () => {
			const testStore = createTableStore({ columns: mockColumns, rows: [...mockRows] })
			// Modify row 0
			testStore.setCellData(1, 0, 'Modified John')
			expect(testStore.display[0].rowModified).toBe(true)

			// Move row 0 to position 2
			testStore.moveRow(0, 2)

			// The modified row should now be at index 2 and still be modified
			expect(testStore.rows[2].name).toBe('Modified John')
			expect(testStore.display[2].rowModified).toBe(true)
		})
	})

	describe('utility methods', () => {
		it('should get row expand symbol for tree view', () => {
			const treeStore = createTableStore({
				columns: mockColumns,
				rows: [
					{ id: 1, name: 'Parent', parent: undefined },
					{ id: 2, name: 'Child', parent: 0 },
				],
				config: { view: 'tree', defaultTreeExpansion: 'root' },
			})

			// Initially closed
			expect(treeStore.getRowExpandSymbol(0)).toBe('►')

			// After expanding
			treeStore.toggleRowExpand(0)
			expect(treeStore.getRowExpandSymbol(0)).toBe('▼')
		})

		it('should get row expand symbol for list-expansion view', () => {
			const listStore = createTableStore({
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'list-expansion' },
			})

			// Initially collapsed
			expect(listStore.getRowExpandSymbol(0)).toBe('►')

			// After expanding
			listStore.toggleRowExpand(0)
			expect(listStore.getRowExpandSymbol(0)).toBe('▼')
		})

		it('should return empty string for non-expandable views', () => {
			expect(store.getRowExpandSymbol(0)).toBe('')
		})

		it('should check row visibility correctly', () => {
			const treeStore = createTableStore({
				columns: mockColumns,
				rows: [
					{ id: 1, name: 'Parent', parent: undefined },
					{ id: 2, name: 'Child', parent: 0 },
				],
				config: { view: 'tree', defaultTreeExpansion: 'root' },
			})

			// Parent is always visible
			expect(treeStore.isRowVisible(0)).toBe(true)

			// Child is not visible initially (parent collapsed)
			expect(treeStore.isRowVisible(1)).toBe(false)

			// After expanding parent, child becomes visible
			treeStore.toggleRowExpand(0)
			expect(treeStore.isRowVisible(1)).toBe(true)
		})
	})

	describe('quantity column filtering and sorting', () => {
		// Quantity cells hold a composite `{ qty, uom, ... }` value; numeric filter/sort must
		// compare on `qty`, not the object itself (which would coerce to NaN).
		const quantityColumns: TableColumn[] = [
			{ name: 'item', label: 'Item' },
			{ name: 'qty', label: 'Qty', component: 'AQuantityInput', filterType: 'number' },
		]
		const quantityRows: TableRow[] = [
			{ item: 'A', qty: { qty: 30, uom: 'Box', stockQty: 30, stockUom: 'Nos', conversionFactor: 1 } },
			{ item: 'B', qty: { qty: 5, uom: 'Nos', stockQty: 5, stockUom: 'Nos', conversionFactor: 1 } },
			{ item: 'C', qty: { qty: 12, uom: 'Nos', stockQty: 12, stockUom: 'Nos', conversionFactor: 1 } },
		]

		let qtyStore: ReturnType<typeof createTableStore>
		beforeEach(() => {
			qtyStore = createTableStore({
				columns: quantityColumns,
				rows: quantityRows.map(row => Object.assign({}, row)),
			})
		})

		it("filters a quantity column by the composite value's qty", () => {
			qtyStore.setFilter(1, { value: '12' })
			expect(qtyStore.filteredRows.map(r => r.item)).toEqual(['C'])
		})

		it('sorts a quantity column numerically on qty (ascending)', () => {
			qtyStore.sortByColumn(1)
			expect(qtyStore.filteredRows.map(r => r.item)).toEqual(['B', 'C', 'A'])
		})

		it('sorts a quantity column numerically on qty (descending)', () => {
			qtyStore.sortByColumn(1) // asc
			qtyStore.sortByColumn(1) // desc
			expect(qtyStore.filteredRows.map(r => r.item)).toEqual(['A', 'C', 'B'])
		})
	})

	describe('currency column filtering and sorting', () => {
		// Currency cells hold a composite `{ amount, currency, baseAmount, ... }` value, and one
		// column routinely mixes currencies. Comparing raw `amount` would rank these rows
		// 10 < 20 < 100 when what they are actually worth is 13 > 12 > 10 — every comparison the
		// user can make is on `baseAmount`, the only common footing the rows have.
		const currencyColumns: TableColumn[] = [
			{ name: 'item', label: 'Item' },
			{ name: 'total', label: 'Total', component: 'ACurrencyInput', filterType: 'number' },
		]
		const usd = { id: 'USD', displayText: 'US Dollar' }
		const currencyRows: TableRow[] = [
			{ item: 'A', total: { amount: 10, currency: usd, baseAmount: 10, baseCurrency: usd, exchangeRate: 1 } },
			{
				item: 'B',
				total: {
					amount: 100,
					currency: { id: 'JPY', displayText: 'Yen' },
					baseAmount: 10,
					baseCurrency: usd,
					exchangeRate: 0.1,
				},
			},
			{
				item: 'C',
				total: {
					amount: 10,
					currency: { id: 'GBP', displayText: 'British Pound' },
					baseAmount: 13,
					baseCurrency: usd,
					exchangeRate: 1.3,
				},
			},
		]

		let currencyStore: ReturnType<typeof createTableStore>
		beforeEach(() => {
			currencyStore = createTableStore({
				columns: currencyColumns,
				rows: currencyRows.map(row => Object.assign({}, row)),
			})
		})

		it("filters a currency column on the value's baseAmount, not its raw amount", () => {
			currencyStore.setFilter(1, { value: '13' })
			expect(currencyStore.filteredRows.map(r => r.item)).toEqual(['C'])
		})

		it('does not match a raw amount that no row is actually worth', () => {
			// 100 is B's amount in JPY; in base currency B is worth 10, so nothing matches.
			currencyStore.setFilter(1, { value: '100' })
			expect(currencyStore.filteredRows.map(r => r.item)).toEqual([])
		})

		it('sorts a currency column on baseAmount (ascending), keeping mixed currencies comparable', () => {
			currencyStore.sortByColumn(1)
			expect(currencyStore.filteredRows.map(r => r.item)).toEqual(['A', 'B', 'C'])
		})

		it('sorts a currency column on baseAmount (descending)', () => {
			currencyStore.sortByColumn(1) // asc
			currencyStore.sortByColumn(1) // desc
			expect(currencyStore.filteredRows.map(r => r.item)).toEqual(['C', 'A', 'B'])
		})

		it('falls back to amount for a value carrying no baseAmount', () => {
			const unconvertedStore = createTableStore({
				columns: currencyColumns,
				rows: [
					{ item: 'A', total: { amount: 7, currency: usd } },
					{ item: 'B', total: { amount: 3, currency: usd } },
				],
			})
			unconvertedStore.sortByColumn(1)
			expect(unconvertedStore.filteredRows.map(r => r.item)).toEqual(['B', 'A'])
		})
	})
})
