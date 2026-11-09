import { config, flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

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
import type { TableColumn, TableConfig, TableRow } from '../src/types'

const columns: TableColumn[] = [
	{ name: 'id', label: 'ID', width: '100px' },
	{ name: 'name', label: 'Name', width: '200px' },
]

const findAddButton = (wrapper: ReturnType<typeof mount>) =>
	wrapper.findAll('button').find(button => button.text() === 'Add row')

describe('ATable empty-state row', { tags: ['component'] }, () => {
	config.global.components = { ACell, ARow }

	beforeEach(() => {
		setActivePinia(createPinia())
	})

	const mountTable = (rows: TableRow[], tableConfig: TableConfig = {}, extra: Record<string, unknown> = {}) =>
		mount(ATable, { props: { rows, columns, config: tableConfig, ...extra } })

	it('says "No data" in a single non-data row, with no Add row when the host has not made it addable', () => {
		const wrapper = mountTable([], { view: 'list' })

		const empty = wrapper.findAll('tbody tr')
		expect(empty).toHaveLength(1)
		expect(empty[0].classes()).toContain('atable-empty-row')
		expect(wrapper.findAll('tbody tr.atable-row')).toHaveLength(0)
		expect(wrapper.find('.atable-empty-row').text()).toBe('No data')
		expect(findAddButton(wrapper)).toBeUndefined()
		// Not a data cell, so keyboard navigation never lands on it.
		expect(wrapper.find('.atable-empty-row td').attributes('tabindex')).toBeUndefined()
	})

	it('does not render when rows exist', () => {
		const wrapper = mountTable([{ id: 1, name: 'John' }], { view: 'list' })
		expect(wrapper.find('.atable-empty-row').exists()).toBe(false)
	})

	it.each([
		[{ view: 'list' }, 3],
		[{ view: 'uncounted' }, 2],
		[{ view: 'list-expansion' }, 3],
		[{ view: 'list', rowActions: { enabled: true } }, 4],
		[{ view: 'uncounted', rowActions: { enabled: true } }, 3],
	] as [TableConfig, number][])('spans the full table width for %o', (tableConfig, colspan) => {
		const wrapper = mountTable([], tableConfig)
		expect(wrapper.find('.atable-empty-row td').attributes('colspan')).toBe(String(colspan))
	})

	it('adds a row through store.addRow and row:add when addable, after which the empty row goes away', async () => {
		const wrapper = mountTable([], { view: 'list', addable: true })
		const store = (wrapper.vm as unknown as { store: { addRow: (...args: unknown[]) => number } }).store
		const addRowSpy = vi.spyOn(store, 'addRow')

		await findAddButton(wrapper)!.trigger('click')
		await flushPromises()

		expect(addRowSpy).toHaveBeenCalledTimes(1)
		const addEvents = wrapper.emitted('row:add')
		expect(addEvents).toHaveLength(1)
		expect(addEvents![0][0]).toMatchObject({ rowIndex: 0 })
		expect(wrapper.emitted('update:rows')).toHaveLength(1)
		expect(wrapper.find('.atable-empty-row').exists()).toBe(false)
		expect(wrapper.findAll('tbody tr.atable-row')).toHaveLength(1)
	})

	it('says no records match when filters hide every row, without offering Add row', async () => {
		const wrapper = mountTable([{ id: 1, name: 'John' }], { view: 'list', addable: true })
		const store = (wrapper.vm as unknown as { store: { setFilter: (col: number, f: unknown) => void } }).store
		store.setFilter(1, { value: 'Nobody' })
		await flushPromises()

		expect(wrapper.find('.atable-empty-row').text()).toBe('No matching records')
		expect(findAddButton(wrapper)).toBeUndefined()
	})

	it('stays hidden while the first page loads and when it fails', async () => {
		let resolveRead: (value: { data: TableRow[]; hasMore: boolean }) => void = () => {}
		const getRecords = vi
			.fn()
			.mockImplementationOnce(() => new Promise(resolve => (resolveRead = resolve)))
			.mockRejectedValueOnce(new Error('boom'))
		const wrapper = mountTable([], { view: 'list' }, { getRecords, sourceKey: 'task' })

		await flushPromises()
		expect(wrapper.find('.atable-empty-row').exists()).toBe(false)

		resolveRead({ data: [], hasMore: false })
		await flushPromises()
		expect(wrapper.find('.atable-empty-row').exists()).toBe(true)

		await wrapper.setProps({ sourceKey: 'other' })
		await flushPromises()
		expect(wrapper.text()).toContain("Couldn't load records.")
		expect(wrapper.find('.atable-empty-row').exists()).toBe(false)
	})
})
