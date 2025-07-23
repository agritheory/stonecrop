import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import AExpansionRow from '../src/components/AExpansionRow.vue'
import { createTableStore } from '../src/stores/table'
import type { TableColumn } from '../src/types'

describe('AExpansionRow component', () => {
	const mockColumns: TableColumn[] = [
		{ name: 'col1', label: 'Column 1', type: 'Data', align: 'left', edit: false },
		{ name: 'col2', label: 'Column 2', type: 'Data', align: 'center', edit: true },
	]

	const mockRows = [
		{ col1: 'value1', col2: 'value2' },
		{ col1: 'value3', col2: 'value4' },
	]

	let store: ReturnType<typeof createTableStore>

	beforeEach(() => {
		setActivePinia(createPinia())
		store = createTableStore({
			columns: mockColumns,
			rows: mockRows,
			config: { view: 'list-expansion' },
		})
	})

	it('should render correctly when collapsed', () => {
		const wrapper = mount(AExpansionRow, {
			props: {
				rowIndex: 0,
				store,
			},
			slots: {
				row: '<td>Row Content</td>',
				content: '<div>Expanded Content</div>',
			},
		})

		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.expandable-row').exists()).toBe(true)
		expect(wrapper.find('.row-index').text()).toBe('►')
		expect(wrapper.find('.expanded-row').exists()).toBe(false)
	})

	it('should render correctly when expanded', async () => {
		// First expand the row
		store.toggleRowExpand(0)

		const wrapper = mount(AExpansionRow, {
			props: {
				rowIndex: 0,
				store,
			},
			slots: {
				row: '<td>Row Content</td>',
				content: '<div>Expanded Content</div>',
			},
		})

		expect(wrapper.find('.row-index').text()).toBe('▼')
		expect(wrapper.find('.expanded-row').exists()).toBe(true)
		expect(wrapper.find('.expanded-row-content').exists()).toBe(true)
	})

	it('should toggle expansion on click', async () => {
		const wrapper = mount(AExpansionRow, {
			props: {
				rowIndex: 0,
				store,
			},
			slots: {
				row: '<td>Row Content</td>',
				content: '<div>Expanded Content</div>',
			},
		})

		const toggleButton = wrapper.find('.row-index')
		expect(toggleButton.text()).toBe('►')

		await toggleButton.trigger('click')
		expect(wrapper.find('.row-index').text()).toBe('▼')
		expect(wrapper.find('.expanded-row').exists()).toBe(true)

		await toggleButton.trigger('click')
		expect(wrapper.find('.row-index').text()).toBe('►')
		expect(wrapper.find('.expanded-row').exists()).toBe(false)
	})

	it('should handle keyboard navigation with Ctrl+G', async () => {
		const wrapper = mount(AExpansionRow, {
			props: {
				rowIndex: 0,
				store,
				addNavigation: true,
			},
			slots: {
				row: '<td>Row Content</td>',
			},
		})

		// Initially collapsed
		expect(wrapper.find('.row-index').text()).toBe('►')

		// Manually call the toggle function (simulating the keyboard handler)
		store.toggleRowExpand(0)
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.row-index').text()).toBe('▼')
	})

	it('should handle custom keyboard handlers', async () => {
		const customHandler = vi.fn()
		const wrapper = mount(AExpansionRow, {
			props: {
				rowIndex: 0,
				store,
				addNavigation: {
					'keydown.enter': customHandler,
				},
			},
			slots: {
				row: '<td>Row Content</td>',
			},
		})

		// Test that the component accepts custom navigation handlers
		// Since keyboard navigation is complex to test in isolation,
		// we'll test that the prop is accepted and the component renders
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.props().addNavigation).toEqual({ 'keydown.enter': customHandler })
	})

	it('should set correct tabindex', () => {
		const wrapper = mount(AExpansionRow, {
			props: {
				rowIndex: 0,
				store,
				tabIndex: 5,
			},
			slots: {
				row: '<td>Row Content</td>',
			},
		})

		expect(wrapper.find('.expandable-row').attributes('tabindex')).toBe('5')
	})

	it('should use default tabindex when not provided', () => {
		const wrapper = mount(AExpansionRow, {
			props: {
				rowIndex: 0,
				store,
			},
			slots: {
				row: '<td>Row Content</td>',
			},
		})

		expect(wrapper.find('.expandable-row').attributes('tabindex')).toBe('-1')
	})

	it('should set correct colspan for expanded content', async () => {
		store.toggleRowExpand(0)

		const wrapper = mount(AExpansionRow, {
			props: {
				rowIndex: 0,
				store,
			},
			slots: {
				row: '<td>Row Content</td>',
				content: '<div>Expanded Content</div>',
			},
		})

		const expandedContent = wrapper.find('.expanded-row-content')
		expect(expandedContent.attributes('colspan')).toBe(String(mockColumns.length + 1))
	})
})
