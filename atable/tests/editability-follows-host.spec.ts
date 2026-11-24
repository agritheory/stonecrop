import { config, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import type { ColumnSchema } from '@stonecrop/schema'

vi.mock('@vueuse/core', async importOriginal => ({
	...(await importOriginal<typeof import('@vueuse/core')>()),
	useElementBounding: vi.fn(() => ({
		left: { value: 10 },
		bottom: { value: 60 },
		width: { value: 200 },
		height: { value: 100 },
	})),
	useDebounceFn: vi.fn(fn => fn),
	useMutationObserver: vi.fn(),
	useResizeObserver: vi.fn(),
	onClickOutside: vi.fn(),
}))

vi.mock('@vueuse/components', () => ({
	vResizeObserver: vi.fn(),
	vOnClickOutside: vi.fn(),
}))

import ACell from '../src/components/ACell.vue'
import ARow from '../src/components/ARow.vue'
import ATable from '../src/components/ATable.vue'

const schema = (edit: boolean): ColumnSchema[] => [
	{ fieldname: 'item', component: 'ATextInput', label: 'Item', width: '20ch', edit },
	{ fieldname: 'qty', component: 'ANumericInput', label: 'Qty', width: '10ch', edit },
]

const findAddButton = (wrapper: ReturnType<typeof mount>) =>
	wrapper.findAll('button').find(button => button.text() === 'Add row')

// A host (a form turning read-only, say) changes the table's schema and config while it is shown.
describe('ATable editability follows its host', { tags: ['component'] }, () => {
	config.global.components = { ACell, ARow }

	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('stops offering Add row once its config is no longer addable, and offers it again after', async () => {
		const wrapper = mount(ATable, {
			props: { rows: [], schema: schema(true), config: { view: 'list', addable: true } },
		})
		expect(findAddButton(wrapper)).toBeDefined()

		await wrapper.setProps({ config: { view: 'list', addable: false } })
		expect(findAddButton(wrapper)).toBeUndefined()

		await wrapper.setProps({ config: { view: 'list', addable: true } })
		expect(findAddButton(wrapper)).toBeDefined()
	})

	it('locks its shown cells once its columns are no longer editable, and unlocks them after', async () => {
		const wrapper = mount(ATable, {
			props: { rows: [{ item: 'Bolt', qty: 3 }], schema: schema(true), config: { view: 'list' } },
		})
		const cell = () => wrapper.find('td.atable-cell[data-colindex="0"]')
		expect(cell().attributes('contenteditable')).toBe('true')

		await wrapper.setProps({ schema: schema(false) })
		expect(cell().attributes('contenteditable')).toBe('false')
		expect(wrapper.vm.store.columns.every(column => !column.edit)).toBe(true)

		await wrapper.setProps({ schema: schema(true) })
		expect(cell().attributes('contenteditable')).toBe('true')
	})

	it('keeps a width the user dragged when only editability changes', async () => {
		const wrapper = mount(ATable, {
			props: { rows: [{ item: 'Bolt', qty: 3 }], schema: schema(true), config: { view: 'list' } },
		})
		wrapper.vm.store.resizeColumn(0, 300)

		await wrapper.setProps({ schema: schema(false) })
		expect(wrapper.vm.store.columns[0].width).toBe('300px')
		expect(wrapper.vm.store.columns.every(column => !column.edit)).toBe(true)
		// The cell, not just the store: a drag replaces the column object, and the cell must still lock.
		expect(wrapper.find('td.atable-cell[data-colindex="0"]').attributes('contenteditable')).toBe('false')
	})

	it('locks its cells after a column was added while shown', async () => {
		const withNote = (edit: boolean): ColumnSchema[] => [
			...schema(edit),
			{ fieldname: 'note', component: 'ATextInput', label: 'Note', width: '20ch', edit },
		]
		const wrapper = mount(ATable, {
			props: { rows: [{ item: 'Bolt', qty: 3, note: 'x' }], schema: schema(true), config: { view: 'list' } },
		})
		// Adding a column replaces the store's columns rather than updating them in place.
		await wrapper.setProps({ schema: withNote(true) })
		const cells = () => wrapper.findAll('td.atable-cell')
		expect(cells()).toHaveLength(3)

		await wrapper.setProps({ schema: withNote(false) })
		expect(cells().map(cell => cell.attributes('contenteditable'))).toEqual(['false', 'false', 'false'])
	})

	it('locks its cells when the host hands over read-only columns', async () => {
		const columns = (edit: boolean) => [
			{ name: 'item', label: 'Item', edit },
			{ name: 'qty', label: 'Qty', edit },
		]
		const wrapper = mount(ATable, {
			props: { rows: [{ item: 'Bolt', qty: 3 }], columns: columns(true), config: { view: 'list' } },
		})
		const cell = () => wrapper.find('td.atable-cell[data-colindex="0"]')
		expect(cell().attributes('contenteditable')).toBe('true')

		await wrapper.setProps({ columns: columns(false) })
		expect(cell().attributes('contenteditable')).toBe('false')
	})

	it('leaves columns handed over through the columns model alone', async () => {
		const columns = [{ name: 'item', label: 'Item', edit: true }]
		const wrapper = mount(ATable, {
			props: { rows: [{ item: 'Bolt' }], columns, schema: schema(true), config: { view: 'list' } },
		})

		await wrapper.setProps({ schema: schema(false) })
		expect(wrapper.vm.store.columns).toEqual(columns)
	})
})
