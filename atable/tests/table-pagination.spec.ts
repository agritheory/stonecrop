import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { useTablePagination, type FilteredTableRow } from '../src/composables/table-pagination'

function makeRows(count: number): FilteredTableRow[] {
	return Array.from({ length: count }, (_, i) => ({
		id: String(i + 1),
		name: `Row ${i + 1}`,
		originalIndex: i,
	}))
}

describe('useTablePagination', () => {
	it('shows all filtered rows when neither pageSize nor getRecords is set', () => {
		const rows = ref(makeRows(3))
		const page = useTablePagination({ rows })

		expect(page.visibleRows.value).toHaveLength(3)
		expect(page.showFooter.value).toBe(false)
	})

	it('windows held rows when pageSize is set', async () => {
		const rows = ref(makeRows(5))
		const page = useTablePagination({ rows, pageSize: 2 })

		expect(page.showFooter.value).toBe(true)
		expect(page.visibleRows.value.map(r => r.id)).toEqual(['1', '2'])

		await page.next()
		expect(page.visibleRows.value.map(r => r.id)).toEqual(['3', '4'])

		page.prev()
		expect(page.visibleRows.value.map(r => r.id)).toEqual(['1', '2'])
	})

	it('fetches unqualified on mount when getRecords is provided', async () => {
		const getRecords = vi.fn().mockResolvedValue({
			data: [{ id: '1' }],
			hasMore: true,
		})
		const rows = ref(makeRows(1))

		const page = useTablePagination({
			rows,
			getRecords,
			sourceKey: 'task',
		})

		await nextTick()
		await vi.waitFor(() => expect(getRecords).toHaveBeenCalledOnce())
		expect(getRecords).toHaveBeenCalledWith(undefined)
		expect(page.hasMore.value).toBe(true)
		expect(page.showFooter.value).toBe(true)
	})

	it('next at end of held rows requests the next server offset only', async () => {
		const getRecords = vi
			.fn()
			.mockResolvedValueOnce({ data: [{ id: '1' }, { id: '2' }], hasMore: true })
			.mockResolvedValueOnce({ data: [{ id: '3' }], hasMore: false })

		const rows = ref(makeRows(2))
		const page = useTablePagination({ rows, getRecords, sourceKey: 'task' })

		await nextTick()
		await vi.waitFor(() => expect(getRecords).toHaveBeenCalledOnce())

		await page.next()
		expect(getRecords).toHaveBeenLastCalledWith({ offset: 2 })
		expect(page.hasMore.value).toBe(false)
		expect(page.showFooter.value).toBe(true)
		expect(page.hasEverHadMore.value).toBe(true)
	})

	it('keeps footer hidden when the first page is already complete', async () => {
		const getRecords = vi.fn().mockResolvedValue({ data: [{ id: '1' }], hasMore: false })
		const rows = ref(makeRows(1))
		const page = useTablePagination({ rows, getRecords, sourceKey: 'task' })

		await nextTick()
		await vi.waitFor(() => expect(getRecords).toHaveBeenCalledOnce())

		expect(page.showFooter.value).toBe(false)
		expect(page.hasEverHadMore.value).toBe(false)
	})

	it('refetches from offset 0 when sourceKey changes', async () => {
		const sourceKey = ref('a')
		const getRecords = vi.fn().mockResolvedValue({ data: [], hasMore: false })
		const rows = ref<FilteredTableRow[]>([])

		useTablePagination({ rows, getRecords, sourceKey })

		await nextTick()
		await vi.waitFor(() => expect(getRecords).toHaveBeenCalledOnce())

		sourceKey.value = 'b'
		await nextTick()
		await vi.waitFor(() => expect(getRecords).toHaveBeenCalledTimes(2))
		expect(getRecords).toHaveBeenLastCalledWith(undefined)
	})

	it('does not fetch when hasMore is false and next is called', async () => {
		const getRecords = vi.fn().mockResolvedValue({ data: [{ id: '1' }], hasMore: false })
		const rows = ref(makeRows(1))
		const page = useTablePagination({ rows, getRecords, sourceKey: 'task' })

		await nextTick()
		await vi.waitFor(() => expect(getRecords).toHaveBeenCalledOnce())

		await page.next()
		expect(getRecords).toHaveBeenCalledOnce()
	})
})
