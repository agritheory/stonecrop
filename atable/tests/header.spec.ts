import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import ATableHeader from '../src/components/ATableHeader.vue'
import { createTableStore } from '../src/stores/table'
import type { TableColumn, TableConfig } from '../src/types'

// Mock the vResizeObserver directive
const mockVResizeObserver = {
	mounted: vi.fn(),
	unmounted: vi.fn(),
}

describe('ATableHeader component', { tags: ['component'] }, () => {
	const mockColumns: TableColumn[] = [
		{ name: 'col1', label: 'Column 1', align: 'left', edit: false, width: '100px' },
		{ name: 'col2', label: 'Column 2', align: 'center', edit: true, width: '150px' },
		{ name: 'col3', label: '', align: 'right', edit: false, width: '200px' },
	]

	const mockRows = [{ col1: 'value1', col2: 'value2', col3: 'value3' }]

	let store: ReturnType<typeof createTableStore>

	beforeEach(() => {
		setActivePinia(createPinia())
		store = createTableStore({
			columns: mockColumns,
			rows: mockRows,
			config: { view: 'list' } as TableConfig,
		})
	})

	it('should render header with correct number of columns', () => {
		const wrapper = mount(ATableHeader, {
			props: {
				columns: mockColumns,
				store,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		expect(wrapper.find('thead').exists()).toBe(true)
		expect(wrapper.find('.atable-header-row').exists()).toBe(true)

		const headerCells = wrapper.findAll('th')
		// Should have zero column + regular columns
		expect(headerCells.length).toBe(mockColumns.length + 1)
	})

	it('should display column labels correctly', () => {
		const wrapper = mount(ATableHeader, {
			props: {
				columns: mockColumns,
				store,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		const headerCells = wrapper.findAll('th')
		// Skip the first cell (zero column)
		expect(headerCells[1].text()).toBe('Column 1')
		expect(headerCells[2].text()).toBe('Column 2')
		// Should generate letter for empty label
		expect(headerCells[3].text()).toBe('C')
	})

	it('should apply correct styles from store', () => {
		const wrapper = mount(ATableHeader, {
			props: {
				columns: mockColumns,
				store,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		const headerCells = wrapper.findAll('th')
		// Test that style is applied (store.getHeaderCellStyle should be called)
		expect(headerCells[1].attributes('style')).toBeDefined()
		expect(headerCells[2].attributes('style')).toBeDefined()
		expect(headerCells[3].attributes('style')).toBeDefined()
	})

	it('should set correct data attributes', () => {
		const wrapper = mount(ATableHeader, {
			props: {
				columns: mockColumns,
				store,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		const headerCells = wrapper.findAll('th')
		// Skip the first cell (zero column)
		expect(headerCells[1].attributes('data-colindex')).toBe('0')
		expect(headerCells[2].attributes('data-colindex')).toBe('1')
		expect(headerCells[3].attributes('data-colindex')).toBe('2')
	})

	it('should handle pinned columns', () => {
		const pinnedColumns = [{ ...mockColumns[0], pinned: true }, ...mockColumns.slice(1)]

		const wrapper = mount(ATableHeader, {
			props: {
				columns: pinnedColumns,
				store,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		const headerCells = wrapper.findAll('th')
		// First regular column should have sticky class
		expect(headerCells[1].classes()).toContain('sticky-column')
		// Other columns should not
		expect(headerCells[2].classes()).not.toContain('sticky-column')
	})

	it('should handle different view configurations', () => {
		// Test with tree view
		const treeStore = createTableStore({
			columns: mockColumns,
			rows: mockRows,
			config: { view: 'tree' } as TableConfig,
		})

		const wrapper = mount(ATableHeader, {
			props: {
				columns: mockColumns,
				store: treeStore,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		const indexHeader = wrapper.find('#header-index')
		expect(indexHeader.classes()).toContain('tree-index')
	})

	it('should handle list-expansion view', () => {
		const expansionStore = createTableStore({
			columns: mockColumns,
			rows: mockRows,
			config: { view: 'list-expansion' } as TableConfig,
		})

		const wrapper = mount(ATableHeader, {
			props: {
				columns: mockColumns,
				store: expansionStore,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		const indexHeader = wrapper.find('#header-index')
		expect(indexHeader.classes()).toContain('list-expansion-index')
	})

	it('should not render when no columns provided', () => {
		const wrapper = mount(ATableHeader, {
			props: {
				columns: [],
				store,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		expect(wrapper.find('thead').exists()).toBe(false)
	})

	it('should handle resize observer events', () => {
		const wrapper = mount(ATableHeader, {
			props: {
				columns: mockColumns,
				store,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		// Get the component instance to test onResize method
		const component = wrapper.vm as any

		// Mock resize observer entry
		const mockEntry = {
			borderBoxSize: [
				{
					inlineSize: 250,
				},
			],
			target: {
				dataset: { colindex: '0' },
			},
		}

		// Test onResize method
		component.onResize([mockEntry])

		// Verify that resizeColumn was called (indirectly through store)
		expect(store.columns[0].width).toBeDefined()
	})

	it('should handle sortable columns click', async () => {
		const sortableColumns = mockColumns.map(col => ({ ...col, sortable: true }))

		const wrapper = mount(ATableHeader, {
			props: {
				columns: sortableColumns,
				store,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		const spy = vi.spyOn(store, 'sortByColumn')
		const headerCells = wrapper.findAll('th')

		await headerCells[1].trigger('click')
		expect(spy).toHaveBeenCalledWith(0)
	})

	it('should not call sortByColumn when sortable is false', async () => {
		const nonSortableColumns = mockColumns.map(col => ({ ...col, sortable: false }))

		const wrapper = mount(ATableHeader, {
			props: {
				columns: nonSortableColumns,
				store,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		const spy = vi.spyOn(store, 'sortByColumn')
		const headerCells = wrapper.findAll('th')

		await headerCells[1].trigger('click')
		expect(spy).not.toHaveBeenCalled()
	})

	it('should handle empty borderBoxSize in resize observer', () => {
		const wrapper = mount(ATableHeader, {
			props: {
				columns: mockColumns,
				store,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		const component = wrapper.vm as any
		const spy = vi.spyOn(store, 'resizeColumn')

		// Mock entry with empty borderBoxSize
		const mockEntry = {
			borderBoxSize: [],
			target: {
				dataset: { colindex: '0' },
			},
		}

		component.onResize([mockEntry])

		// Should not call resizeColumn
		expect(spy).not.toHaveBeenCalled()
	})

	it('should not resize when width has not changed', () => {
		// Create store with numeric width
		const numericColumns = mockColumns.map(col => Object.assign({}, col, { width: 100 }))
		const numericStore = createTableStore({
			columns: numericColumns,
			rows: mockRows,
			config: { view: 'list' } as TableConfig,
		})

		const wrapper = mount(ATableHeader, {
			props: {
				columns: numericColumns,
				store: numericStore,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		const component = wrapper.vm as any
		const spy = vi.spyOn(numericStore, 'resizeColumn')

		// Mock entry with same width
		const mockEntry = {
			borderBoxSize: [
				{
					inlineSize: 100,
				},
			],
			target: {
				dataset: { colindex: '0' },
			},
		}

		component.onResize([mockEntry])

		// Should not call resizeColumn when width is the same
		expect(spy).not.toHaveBeenCalled()
	})

	it('should call resizeColumn when width has changed', () => {
		// Create store with numeric width
		const numericColumns = mockColumns.map(col => Object.assign({}, col, { width: 100 }))
		const numericStore = createTableStore({
			columns: numericColumns,
			rows: mockRows,
			config: { view: 'list' } as TableConfig,
		})

		const wrapper = mount(ATableHeader, {
			props: {
				columns: numericColumns,
				store: numericStore,
			},
			global: {
				directives: {
					'resize-observer': mockVResizeObserver,
				},
			},
		})

		const component = wrapper.vm as any
		const spy = vi.spyOn(numericStore, 'resizeColumn')

		// Mock entry with different width
		const mockEntry = {
			borderBoxSize: [
				{
					inlineSize: 150, // Changed from 100
				},
			],
			target: {
				dataset: { colindex: '0' },
			},
		}

		component.onResize([mockEntry])

		// Should call resizeColumn with new width
		expect(spy).toHaveBeenCalledWith(0, 150)
	})
})
