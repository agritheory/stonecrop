import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { config, flushPromises, mount } from '@vue/test-utils'
import { h } from 'vue'

import ACell from '../src/components/ACell.vue'
import ARow from '../src/components/ARow.vue'
import ATable from '../src/components/ATable.vue'
import { createTableStore } from '../src/stores/table'
import type { TableColumn, TableConfig } from '../src/types'

// One row component renders cells (default slot) + an optional expansion panel (#content),
// a chevron index cell in list-expansion (.expansion-index, distinct from tree's .tree-index),
// and — the point of the merge — coexists with row actions, so the panel must span them.
describe('ARow list-expansion (unified)', { tags: ['component'] }, () => {
	const mockColumns: TableColumn[] = [
		{ name: 'col1', label: 'Column 1', align: 'left', edit: false },
		{ name: 'col2', label: 'Column 2', align: 'center', edit: true },
	]

	const mockRows = [
		{ col1: 'value1', col2: 'value2' },
		{ col1: 'value3', col2: 'value4' },
	]

	const makeStore = (tableConfig: TableConfig = { view: 'list-expansion' }) =>
		createTableStore({ columns: mockColumns, rows: mockRows, config: tableConfig })

	beforeEach(() => {
		setActivePinia(createPinia())
		config.global.components = { ACell, ARow }
	})

	it('renders the chevron index collapsed, no expanded row', () => {
		const store = makeStore()
		const wrapper = mount(ARow, {
			props: { rowIndex: 0, store },
			slots: { default: '<td>Row Content</td>', content: '<div>Expanded Content</div>' },
		})

		expect(wrapper.find('.atable-row').exists()).toBe(true)
		expect(wrapper.find('.expansion-index').text()).toBe('►')
		expect(wrapper.find('.atable-expanded-row').exists()).toBe(false)
	})

	it('renders the expanded content row when expanded', () => {
		const store = makeStore()
		store.toggleRowExpand(0)
		const wrapper = mount(ARow, {
			props: { rowIndex: 0, store },
			slots: { default: '<td>Row Content</td>', content: '<div>Expanded Content</div>' },
		})

		expect(wrapper.find('.expansion-index').text()).toBe('▼')
		expect(wrapper.find('.atable-expanded-row').exists()).toBe(true)
		expect(wrapper.find('.atable-expanded-content').exists()).toBe(true)
	})

	it('toggles expansion on chevron click', async () => {
		const store = makeStore()
		const wrapper = mount(ARow, {
			props: { rowIndex: 0, store },
			slots: { default: '<td>Row Content</td>', content: '<div>Expanded Content</div>' },
		})

		const chevron = wrapper.find('.expansion-index')
		expect(chevron.text()).toBe('►')

		await chevron.trigger('click')
		expect(wrapper.find('.expansion-index').text()).toBe('▼')
		expect(wrapper.find('.atable-expanded-row').exists()).toBe(true)

		await wrapper.find('.expansion-index').trigger('click')
		expect(wrapper.find('.expansion-index').text()).toBe('►')
		expect(wrapper.find('.atable-expanded-row').exists()).toBe(false)
	})

	it('renders cells passed via the default slot', () => {
		const store = makeStore()
		const wrapper = mount(ARow, {
			props: { rowIndex: 0, store },
			slots: { default: '<td class="probe">CELL</td>' },
		})

		expect(wrapper.find('td.probe').text()).toBe('CELL')
	})

	it('honors tabIndex and defaults to -1 on the row', () => {
		const store = makeStore()
		const custom = mount(ARow, {
			props: { rowIndex: 0, store, tabIndex: 5 },
			slots: { default: '<td>x</td>' },
		})
		expect(custom.find('.atable-row').attributes('tabindex')).toBe('5')

		const def = mount(ARow, {
			props: { rowIndex: 0, store },
			slots: { default: '<td>x</td>' },
		})
		expect(def.find('.atable-row').attributes('tabindex')).toBe('-1')
	})

	it('spans index column in the expanded content colspan (no actions)', () => {
		const store = makeStore()
		store.toggleRowExpand(0)
		const wrapper = mount(ARow, {
			props: { rowIndex: 0, store },
			slots: { default: '<td>x</td>', content: '<div>panel</div>' },
		})

		// columns + 1 chevron column
		expect(wrapper.find('.atable-expanded-content').attributes('colspan')).toBe(String(mockColumns.length + 1))
	})

	it('spans the row-actions column too when row actions are enabled', () => {
		const store = makeStore({
			view: 'list-expansion',
			rowActions: { enabled: true, actions: { add: true, delete: true } },
		})
		store.toggleRowExpand(0)
		const wrapper = mount(ARow, {
			props: { rowIndex: 0, store },
			slots: { default: '<td>x</td>', content: '<div>panel</div>' },
		})

		// columns + 1 chevron column + 1 actions column
		expect(wrapper.find('.atable-expanded-content').attributes('colspan')).toBe(String(mockColumns.length + 2))
	})

	it('passes scoped { row, rowIndex } to the #content slot', () => {
		const store = makeStore()
		store.toggleRowExpand(0)
		const wrapper = mount(ARow, {
			props: { rowIndex: 0, store },
			slots: {
				default: '<td>x</td>',
				content: (scope: { row: { col1: string }; rowIndex: number }) =>
					h('div', { class: 'scoped-probe' }, `${scope.rowIndex}:${scope.row.col1}`),
			},
		})

		expect(wrapper.find('.scoped-probe').text()).toBe('0:value1')
	})

	it('paints the chevron cell with a top border like list-index', () => {
		const store = makeStore()
		const wrapper = mount(ARow, {
			props: { rowIndex: 0, store },
			slots: { default: '<td>x</td>' },
		})

		expect(getComputedStyle(wrapper.find('.expansion-index').element).borderTopWidth).not.toBe('0px')
	})

	it('paints the expanded panel with a border on every side', () => {
		const store = makeStore()
		store.toggleRowExpand(0)
		const wrapper = mount(ARow, {
			props: { rowIndex: 0, store },
			slots: { default: '<td>x</td>', content: '<div class="panel-probe">panel</div>' },
		})

		const panel = wrapper.find('.atable-expanded-content').element
		const style = getComputedStyle(panel)
		expect(style.borderTopWidth).not.toBe('0px')
		expect(style.borderRightWidth).not.toBe('0px')
		expect(style.borderBottomWidth).not.toBe('0px')
		expect(style.borderLeftWidth).not.toBe('0px')
	})

	it('forwards #content from ATable into the expanded panel', async () => {
		const wrapper = mount(ATable, {
			props: {
				columns: mockColumns,
				rows: mockRows,
				config: { view: 'list-expansion' },
			},
			slots: {
				content: '<div class="atable-content-probe">Nested form</div>',
			},
		})

		expect(wrapper.find('.atable-expanded-row').exists()).toBe(false)
		await wrapper.find('.expansion-index').trigger('click')
		await flushPromises()
		expect(wrapper.find('.atable-content-probe').text()).toBe('Nested form')
	})

	it('toggles expansion on Ctrl+G when the row is focused (keyboard parity)', async () => {
		const store = makeStore()
		const wrapper = mount(ARow, {
			attachTo: document.body,
			props: { rowIndex: 0, store },
			slots: { default: '<td>x</td>', content: '<div>panel</div>' },
		})

		expect(wrapper.find('.expansion-index').text()).toBe('►')

		const row = wrapper.find('.atable-row')
		await row.trigger('focusin')
		await flushPromises()
		await row.trigger('keydown', { key: 'g', ctrlKey: true })
		await flushPromises()

		expect(wrapper.find('.expansion-index').text()).toBe('▼')
		wrapper.unmount()
	})
})
