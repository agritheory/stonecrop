import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { useStonecrop } from '@stonecrop/stonecrop'
import type { Router } from 'vue-router'

interface UseHSTDetailOptions {
	doctype: string
	recordId: ComputedRef<string>
	fetchUrl?: ComputedRef<string | null>
	router: Router
	defaultData?: any
	listPath: string
}

interface UseHSTDetailReturn {
	stonecrop: Ref<any>
	hstStore: ComputedRef<any>
	operations: Ref<any[]>
	currentIndex: Ref<number>
	canUndo: ComputedRef<boolean>
	canRedo: ComputedRef<boolean>
	undo: () => void
	redo: () => void
	handleCancel: () => void
	handleSave: (data: any) => Promise<void>
}

/**
 * Composable for handling HST state management in detail pages
 * @param doctype - The doctype name for the HST store
 * @param recordId - Computed ref containing the record ID
 * @param fetchUrl - Optional computed ref for the API fetch URL
 * @param router - Vue router instance
 * @param defaultData - Default data for new records
 * @param listPath - Path to navigate back to (e.g., '/users')
 */
export function useHSTDetail({
	doctype,
	recordId,
	fetchUrl,
	router,
	defaultData = {},
	listPath,
}: UseHSTDetailOptions): UseHSTDetailReturn {
	// Initialize Stonecrop with basic mode
	const { stonecrop, operationLog } = useStonecrop()

	// Extract HST store for components
	const hstStore = computed(() => stonecrop.value?.getStore())

	// Extract operation log data
	const { operations, currentIndex, canUndo, canRedo } = operationLog

	function undo() {
		if (hstStore.value) {
			operationLog.undo(hstStore.value)
		}
	}

	function redo() {
		if (hstStore.value) {
			operationLog.redo(hstStore.value)
		}
	}

	function handleCancel() {
		router.back()
	}

	async function handleSave(data: any) {
		console.log(`Saving ${doctype}:`, data)
		router.push(listPath)
	}

	return {
		stonecrop,
		hstStore,
		operations,
		currentIndex,
		canUndo,
		canRedo,
		undo,
		redo,
		handleCancel,
		handleSave,
	}
}

/**
 * Helper function to sync record data with HST store
 * @param stonecrop - Stonecrop instance ref
 * @param doctype - The doctype name
 * @param recordId - The record ID
 * @param data - Reactive data ref to sync
 */
export function syncRecordWithHST(stonecrop: Ref<any>, doctype: string, recordId: string, data: Ref<any>) {
	watch(
		[stonecrop, data],
		() => {
			if (stonecrop.value && data.value && recordId !== 'new') {
				stonecrop.value.addRecord(doctype, recordId, data.value)
			}
		},
		{ immediate: true }
	)
}

/**
 * Helper function to sync HST changes back to data ref
 * @param hstStore - HST store computed ref
 * @param doctype - The doctype name
 * @param recordId - The record ID
 * @param data - Reactive data ref to update
 */
export function syncHSTToData(hstStore: ComputedRef<any>, doctype: string, recordId: string, data: Ref<any>) {
	watch(
		() => (hstStore.value && recordId !== 'new' ? hstStore.value.get(`${doctype}.${recordId}`) : null),
		hstData => {
			if (hstData && data.value) {
				// Update data with HST data to keep form in sync
				Object.assign(data.value, hstData)
			}
		},
		{ deep: true }
	)
}
