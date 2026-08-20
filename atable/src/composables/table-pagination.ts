import type { GetRecordsOptions, GetRecordsResult } from '@stonecrop/schema'
import { computed, nextTick, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

import type { TableRow } from '../types'

/**
 * A table row after filter/sort, with its index in the held row list.
 * @public
 */
export type FilteredTableRow = TableRow & { originalIndex: number }

/**
 * Options for {@link useTablePagination}.
 * @public
 */
export interface UseTablePaginationOptions {
	/** Rows after filter and sort — pagination is a window over this list, not part of filtering. */
	rows: MaybeRefOrGetter<FilteredTableRow[]>
	/** When set, slice the held rows into windows of this size. Omit to show the whole held list. */
	pageSize?: MaybeRefOrGetter<number | undefined>
	/** Fetch the next server page. Typed from schema so ATable need not import Stonecrop. */
	getRecords?: (options?: GetRecordsOptions) => Promise<GetRecordsResult>
	/** When this changes, refetch from offset 0. */
	sourceKey?: MaybeRefOrGetter<string | undefined>
}

/**
 * Pagination state and controls returned by {@link useTablePagination}.
 * @public
 */
export interface TablePagination {
	visibleRows: Ref<FilteredTableRow[]>
	hasPrev: Ref<boolean>
	hasNext: Ref<boolean>
	/** Whether the server reported more records beyond what has been fetched. */
	hasMore: Ref<boolean>
	loading: Ref<boolean>
	next: () => Promise<void>
	prev: () => void
	/** Whether footer chrome should render. */
	showFooter: Ref<boolean>
	/** Whether another in-memory window exists before asking the server. */
	hasLocalNext: Ref<boolean>
	/** Rows currently held after filter/sort — useful for a completion summary. */
	loadedCount: Ref<number>
	/** True once the server reported a further page existed (multi-page fetch). */
	hasEverHadMore: Ref<boolean>
}

/**
 * Window rows after filter/sort, and optionally walk {@link @stonecrop/schema#GetRecordsOptions} for the next page.
 * Pagination is not a filter — pass already-filtered rows.
 * @public
 */
export function useTablePagination(options: UseTablePaginationOptions): TablePagination {
	const heldRows = computed(() => toValue(options.rows))
	const pageSize = computed(() => toValue(options.pageSize))
	const sourceKey = computed(() => toValue(options.sourceKey))

	const windowIndex = ref(0)
	const loading = ref(false)
	const serverHasMore = ref(false)
	const hasEverHadMore = ref(false)
	const lastFetchOffset = ref(0)
	const lastPageLength = ref(0)
	const loadedCount = computed(() => heldRows.value.length)

	const effectivePageSize = computed(() => {
		const size = pageSize.value
		if (size != null && size > 0) {
			return size
		}
		// No pageSize: one window over everything held (server list or full child table).
		const count = heldRows.value.length
		return count > 0 ? count : 1
	})

	const windowCount = computed(() => Math.max(1, Math.ceil(heldRows.value.length / effectivePageSize.value)))

	const visibleRows = computed(() => {
		const start = windowIndex.value * effectivePageSize.value
		return heldRows.value.slice(start, start + effectivePageSize.value)
	})

	const hasLocalNext = computed(() => windowIndex.value < windowCount.value - 1)
	const hasPrev = computed(() => windowIndex.value > 0)
	const hasNext = computed(() => hasLocalNext.value || (Boolean(options.getRecords) && serverHasMore.value))
	const hasMore = computed(() => serverHasMore.value)

	const showFooter = computed(() => {
		if (options.getRecords) {
			// Keep the footer after the last "Load more" so completion is visible, not silent.
			return serverHasMore.value || hasPrev.value || loading.value || (hasEverHadMore.value && !serverHasMore.value)
		}
		const size = pageSize.value
		return size != null && size > 0 && heldRows.value.length > size
	})

	const resetWindow = () => {
		windowIndex.value = 0
		hasEverHadMore.value = false
	}

	const fetchFromServer = async (fetchOptions?: GetRecordsOptions) => {
		if (!options.getRecords) {
			return
		}
		loading.value = true
		try {
			const result = await options.getRecords(fetchOptions)
			serverHasMore.value = result.hasMore
			if (result.hasMore) {
				hasEverHadMore.value = true
			}
			lastFetchOffset.value = fetchOptions?.offset ?? 0
			lastPageLength.value = result.data.length
		} finally {
			loading.value = false
		}
	}

	watch(
		() => sourceKey.value,
		() => {
			resetWindow()
			if (options.getRecords) {
				void fetchFromServer()
			}
		},
		{ immediate: true }
	)

	watch(heldRows, () => {
		// Shrinking the held set can leave the window past the end.
		if (windowIndex.value >= windowCount.value) {
			windowIndex.value = Math.max(0, windowCount.value - 1)
		}
	})

	const next = async () => {
		if (hasLocalNext.value) {
			windowIndex.value += 1
			return
		}
		if (options.getRecords && serverHasMore.value) {
			await fetchFromServer({ offset: lastFetchOffset.value + lastPageLength.value })
			await nextTick()
			// Parent/HST grows rows; show the newly appended tail.
			windowIndex.value = Math.max(0, windowCount.value - 1)
		}
	}

	const prev = () => {
		if (windowIndex.value > 0) {
			windowIndex.value -= 1
		}
	}

	return {
		visibleRows,
		hasPrev,
		hasNext,
		hasMore,
		loading,
		next,
		prev,
		showFooter,
		hasLocalNext,
		loadedCount,
		hasEverHadMore,
	}
}
