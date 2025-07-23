import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { createTableStore } from '../src/stores/table'
import type { TableColumn, TableRow } from '../src/types'

describe('Display reactivity fix', () => {
	const mockColumns: TableColumn[] = [
		{ name: 'id', label: 'ID' },
		{ name: 'name', label: 'Name' },
	]

	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('should update display properties when rows change', () => {
		// Initial data with parent-child relationships
		const initialRows: TableRow[] = [
			{ id: 1, name: 'Parent 1', parent: undefined },
			{ id: 2, name: 'Child 1.1', parent: 0 },
			{ id: 3, name: 'Child 1.2', parent: 0 },
		]

		const store = createTableStore({ columns: mockColumns, rows: initialRows })

		// Check initial display state
		expect(store.display[0].isRoot).toBe(true)
		expect(store.display[0].isParent).toBe(true)
		expect(store.display[1].isRoot).toBe(false)
		expect(store.display[1].parent).toBe(0)
		expect(store.display[2].isRoot).toBe(false)
		expect(store.display[2].parent).toBe(0)

		// Change the rows data - modify parent relationships
		const newRows: TableRow[] = [
			{ id: 1, name: 'Parent 1', parent: undefined },
			{ id: 2, name: 'Child 1.1', parent: 0 },
			{ id: 3, name: 'New Root', parent: undefined }, // Changed from child to root
			{ id: 4, name: 'New Child', parent: 2 }, // New child of previous child
		]

		// Update rows using the new method
		store.updateRows(newRows)

		// Check that display state has been recalculated
		expect(store.display[0].isRoot).toBe(true)
		expect(store.display[0].isParent).toBe(true)
		expect(store.display[1].isRoot).toBe(false)

		expect(store.display[1].isParent).toBe(false) // No children
		expect(store.display[1].parent).toBe(0)
		expect(store.display[2].isRoot).toBe(true) // Now a root
		expect(store.display[2].isParent).toBe(true) // Has a child (row 3)
		expect(store.display[2].parent).toBeUndefined() // No parent
		expect(store.display[3].isRoot).toBe(false)
		expect(store.display[3].parent).toBe(2)
	})

	it('should preserve row modifications and expand states across data changes', () => {
		const initialRows: TableRow[] = [
			{ id: 1, name: 'Parent 1', parent: undefined },
			{ id: 2, name: 'Child 1.1', parent: 0 },
		]

		const store = createTableStore({ columns: mockColumns, rows: initialRows })

		// Modify a cell to mark row as modified
		store.setCellData(1, 0, 'Modified Parent')
		expect(store.display[0].rowModified).toBe(true)

		// Toggle row expansion (for tree view)
		store.toggleRowExpand(0)

		// Now change the rows data but keep the same structure
		const newRows: TableRow[] = [
			{ id: 1, name: 'Parent 1 Updated', parent: undefined },
			{ id: 2, name: 'Child 1.1 Updated', parent: 0 },
		]

		store.updateRows(newRows)

		// Row modifications and expand states should be preserved
		expect(store.display[0].rowModified).toBe(true)
		// The expansion state should be preserved too
		expect(store.display[0].childrenOpen).toBeDefined()
	})
})
