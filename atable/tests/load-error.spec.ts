import { config, flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
import type { TableColumn, TableRow } from '../src/types'

const SERVER_MESSAGE = 'Doctype "Task" declares a field for column "version_major", which table "task" does not have.'

const columns: TableColumn[] = [
	{ name: 'id', label: 'ID', width: '100px' },
	{ name: 'name', label: 'Name', width: '200px' },
]

const heldRows = (): TableRow[] => [
	{ id: 1, name: 'John' },
	{ id: 2, name: 'Jane' },
]

describe('ATable when a server read fails', { tags: ['component'] }, () => {
	config.global.components = { ACell, ARow }

	beforeEach(() => {
		setActivePinia(createPinia())
	})

	const mountTable = (getRecords: ReturnType<typeof vi.fn>) =>
		mount(ATable, { props: { rows: heldRows(), columns, getRecords, sourceKey: 'task' } })

	it('says the list could not load, in place of the rows it holds, and reads it again on Try again', async () => {
		// Rows already held are what an earlier visit left behind; they are not this read's answer.
		const getRecords = vi
			.fn()
			.mockRejectedValueOnce(new Error(SERVER_MESSAGE))
			.mockResolvedValueOnce({ data: heldRows(), hasMore: false })
		const wrapper = mountTable(getRecords)
		await flushPromises()

		const text = wrapper.text()
		expect(text).toContain("Couldn't load records.")
		expect(text).toContain(SERVER_MESSAGE)
		expect(wrapper.findAll('tbody tr.atable-row')).toHaveLength(0)

		const retry = wrapper.findAll('button').find(button => button.text() === 'Try again')
		await retry!.trigger('click')
		await flushPromises()

		expect(getRecords).toHaveBeenCalledTimes(2)
		expect(getRecords).toHaveBeenLastCalledWith(undefined)
		expect(wrapper.text()).not.toContain("Couldn't load")
		expect(wrapper.findAll('tbody tr.atable-row')).toHaveLength(2)
	})

	it('keeps the rows and says why when "Load more" fails, and clicking Load more again retries', async () => {
		const getRecords = vi
			.fn()
			.mockResolvedValueOnce({ data: heldRows(), hasMore: true })
			.mockRejectedValueOnce(new TypeError('Failed to fetch'))
			.mockResolvedValueOnce({ data: [], hasMore: false })
		const wrapper = mountTable(getRecords)
		await flushPromises()

		const loadMore = () => wrapper.findAll('button').find(button => button.text() === 'Load more')!
		await loadMore().trigger('click')
		await flushPromises()

		expect(wrapper.findAll('tbody tr.atable-row')).toHaveLength(2)
		expect(wrapper.text()).toContain("Couldn't load more records.")
		expect(wrapper.text()).toContain('Failed to fetch')

		await loadMore().trigger('click')
		await flushPromises()

		expect(getRecords).toHaveBeenCalledTimes(3)
		expect(getRecords).toHaveBeenLastCalledWith({ offset: 2 })
		expect(wrapper.text()).not.toContain("Couldn't load more")
	})
})
