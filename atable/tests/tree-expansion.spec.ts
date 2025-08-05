import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { createTableStore } from '../src/stores/table'
import type { TableColumn, TableRow, TableConfig } from '../src/types'

describe('Tree Expansion Configuration', () => {
	const mockColumns: TableColumn[] = [
		{ name: 'id', label: 'ID' },
		{ name: 'name', label: 'Name' },
	]

	const mockTreeRows: TableRow[] = [
		{ id: 1, name: 'Root 1', parent: undefined }, // index 0
		{ id: 2, name: 'Child 1.1', parent: 0 }, // index 1
		{ id: 3, name: 'Child 1.2', parent: 0, gantt: { startIndex: 0, endIndex: 2 } }, // index 2
		{ id: 4, name: 'Grandchild 1.2.1', parent: 2 }, // index 3
		{ id: 5, name: 'Root 2', parent: undefined, gantt: { startIndex: 1, colspan: 3 } }, // index 4
		{ id: 6, name: 'Child 2.1', parent: 4 }, // index 5
	]

	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('should default to expanded state when no defaultTreeExpansion is set', () => {
		const config: TableConfig = { view: 'tree' }
		const store = createTableStore({
			columns: mockColumns,
			rows: mockTreeRows,
			config,
		})

		// All nodes should start with childrenOpen: true (new default behavior)
		expect(store.display[0].childrenOpen).toBe(true) // Root 1
		expect(store.display[1].childrenOpen).toBe(true) // Child 1.1
		expect(store.display[2].childrenOpen).toBe(true) // Child 1.2 (has gantt)
		expect(store.display[3].childrenOpen).toBe(true) // Grandchild 1.2.1
		expect(store.display[4].childrenOpen).toBe(true) // Root 2 (has gantt)
		expect(store.display[5].childrenOpen).toBe(true) // Child 2.1

		// All nodes should be visible (fully expanded by default)
		expect(store.display[0].open).toBe(true) // Root 1
		expect(store.display[1].open).toBe(true) // Child 1.1
		expect(store.display[2].open).toBe(true) // Child 1.2
		expect(store.display[3].open).toBe(true) // Grandchild 1.2.1
		expect(store.display[4].open).toBe(true) // Root 2
		expect(store.display[5].open).toBe(true) // Child 2.1
	})

	it('should keep only root nodes visible with defaultTreeExpansion: "root"', () => {
		const config: TableConfig = { view: 'tree', defaultTreeExpansion: 'root' }
		const store = createTableStore({
			columns: mockColumns,
			rows: mockTreeRows,
			config,
		})

		// All nodes should start with childrenOpen: false
		expect(store.display[0].childrenOpen).toBe(false) // Root 1
		expect(store.display[1].childrenOpen).toBe(false) // Child 1.1
		expect(store.display[2].childrenOpen).toBe(false) // Child 1.2 (has gantt)
		expect(store.display[3].childrenOpen).toBe(false) // Grandchild 1.2.1
		expect(store.display[4].childrenOpen).toBe(false) // Root 2 (has gantt)
		expect(store.display[5].childrenOpen).toBe(false) // Child 2.1

		// Only root nodes should be visible
		expect(store.display[0].open).toBe(true) // Root 1
		expect(store.display[1].open).toBe(false) // Child 1.1
		expect(store.display[2].open).toBe(false) // Child 1.2
		expect(store.display[3].open).toBe(false) // Grandchild 1.2.1
		expect(store.display[4].open).toBe(true) // Root 2
		expect(store.display[5].open).toBe(false) // Child 2.1
	})

	it('should expand nodes with gantt data and their ancestors with defaultTreeExpansion: "branch"', () => {
		const config: TableConfig = { view: 'tree', defaultTreeExpansion: 'branch' }
		const store = createTableStore({
			columns: mockColumns,
			rows: mockTreeRows,
			config,
		})

		// Nodes should only expand if they lead to gantt nodes
		expect(store.display[0].childrenOpen).toBe(true) // Root 1 (has gantt descendant)
		expect(store.display[1].childrenOpen).toBe(false) // Child 1.1 (no gantt, no gantt descendants)
		expect(store.display[2].childrenOpen).toBe(false) // Child 1.2 (has gantt data, but no gantt descendants)
		expect(store.display[3].childrenOpen).toBe(false) // Grandchild 1.2.1 (no gantt)
		expect(store.display[4].childrenOpen).toBe(false) // Root 2 (has gantt, but no gantt descendants)
		expect(store.display[5].childrenOpen).toBe(false) // Child 2.1 (no gantt)

		// Visibility should reflect the expansion state - only show gantt nodes and path to them
		expect(store.display[0].open).toBe(true) // Root 1
		expect(store.display[1].open).toBe(true) // Child 1.1 (parent is open)
		expect(store.display[2].open).toBe(true) // Child 1.2 (parent is open, has gantt)
		expect(store.display[3].open).toBe(false) // Grandchild 1.2.1 (parent's children are closed)
		expect(store.display[4].open).toBe(true) // Root 2 (has gantt)
		expect(store.display[5].open).toBe(false) // Child 2.1 (parent's children are closed)
	})

	it('should expand all nodes with defaultTreeExpansion: "leaf"', () => {
		const config: TableConfig = { view: 'tree', defaultTreeExpansion: 'leaf' }
		const store = createTableStore({
			columns: mockColumns,
			rows: mockTreeRows,
			config,
		})

		// All nodes should have childrenOpen: true
		expect(store.display[0].childrenOpen).toBe(true) // Root 1
		expect(store.display[1].childrenOpen).toBe(true) // Child 1.1
		expect(store.display[2].childrenOpen).toBe(true) // Child 1.2
		expect(store.display[3].childrenOpen).toBe(true) // Grandchild 1.2.1
		expect(store.display[4].childrenOpen).toBe(true) // Root 2
		expect(store.display[5].childrenOpen).toBe(true) // Child 2.1

		// All nodes should be visible
		expect(store.display[0].open).toBe(true) // Root 1
		expect(store.display[1].open).toBe(true) // Child 1.1
		expect(store.display[2].open).toBe(true) // Child 1.2
		expect(store.display[3].open).toBe(true) // Grandchild 1.2.1
		expect(store.display[4].open).toBe(true) // Root 2
		expect(store.display[5].open).toBe(true) // Child 2.1
	})

	it('should work with tree-gantt view', () => {
		const config: TableConfig = { view: 'tree-gantt', defaultTreeExpansion: 'branch' }
		const store = createTableStore({
			columns: mockColumns,
			rows: mockTreeRows,
			config,
		})

		// Should behave the same as tree view
		expect(store.isTreeView).toBe(true)
		expect(store.isGanttView).toBe(true)

		// Check expansion state for nodes with gantt data (should not expand if no gantt descendants)
		expect(store.display[2].childrenOpen).toBe(false) // Child 1.2 (has gantt, but no gantt descendants)
		expect(store.display[4].childrenOpen).toBe(false) // Root 2 (has gantt, but no gantt descendants)
	})

	it('should handle user expansion toggles correctly after initial setup', () => {
		const config: TableConfig = { view: 'tree', defaultTreeExpansion: 'root' }
		const store = createTableStore({
			columns: mockColumns,
			rows: mockTreeRows,
			config,
		})

		// Initially all children should be closed
		expect(store.display[0].childrenOpen).toBe(false)

		// User toggles root expansion
		store.toggleRowExpand(0)

		// Now children should be open
		expect(store.display[0].childrenOpen).toBe(true)
		expect(store.display[1].open).toBe(true) // Child 1.1 should now be visible
		expect(store.display[2].open).toBe(true) // Child 1.2 should now be visible
	})

	it('should demonstrate branch mode behavior with complex tree structure', () => {
		// Create a more complex tree structure to better test branch mode
		const complexRows: TableRow[] = [
			{ id: 1, name: 'Project Root', parent: undefined }, // index 0
			{ id: 2, name: 'Planning Phase', parent: 0 }, // index 1
			{ id: 3, name: 'Task 1', parent: 1, gantt: { startIndex: 0, endIndex: 2 } }, // index 2
			{ id: 4, name: 'Subtask 1.1', parent: 2 }, // index 3
			{ id: 5, name: 'Subtask 1.2', parent: 2, gantt: { startIndex: 1, endIndex: 3 } }, // index 4
			{ id: 6, name: 'Development Phase', parent: 0, gantt: { startIndex: 2, endIndex: 4 } }, // index 5
			{ id: 7, name: 'Non-gantt child', parent: 4 }, // index 6
		]

		const config: TableConfig = { view: 'tree', defaultTreeExpansion: 'branch' }
		const store = createTableStore({
			columns: mockColumns,
			rows: complexRows,
			config,
		})

		// Root should expand (has gantt descendants)
		expect(store.display[0].childrenOpen).toBe(true) // Project Root

		// Planning Phase should expand (has gantt descendants)
		expect(store.display[1].childrenOpen).toBe(true) // Planning Phase

		// Task 1 should expand (has gantt and also has gantt descendants through Subtask 1.2)
		expect(store.display[2].childrenOpen).toBe(true) // Task 1

		// Subtask 1.1 should NOT expand (no gantt, no gantt descendants)
		expect(store.display[3].childrenOpen).toBe(false) // Subtask 1.1

		// Subtask 1.2 should NOT expand (has gantt but no gantt descendants)
		expect(store.display[4].childrenOpen).toBe(false) // Subtask 1.2

		// Development Phase should NOT expand (has gantt but no gantt descendants)
		expect(store.display[5].childrenOpen).toBe(false) // Development Phase

		// Visibility: gantt nodes and paths to them should be visible
		expect(store.display[0].open).toBe(true) // Project Root
		expect(store.display[1].open).toBe(true) // Planning Phase (path to gantt)
		expect(store.display[2].open).toBe(true) // Task 1 (has gantt)
		expect(store.display[3].open).toBe(true) // Subtask 1.1 (parent expanded)
		expect(store.display[4].open).toBe(true) // Subtask 1.2 (has gantt)
		expect(store.display[5].open).toBe(true) // Development Phase (has gantt)
		expect(store.display[6].open).toBe(false) // Non-gantt child (parent doesn't expand)
	})
})
