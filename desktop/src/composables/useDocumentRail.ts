import { computed, inject, markRaw, ref, shallowRef, type ComputedRef, type InjectionKey } from 'vue'

import type { DocumentRail, DocumentRailSlotId, RailSubject } from '../types'

export type CreateDocumentRailOptions = {
	doctype: ComputedRef<string>
	recordId: ComputedRef<string>
	onDrawerChange?: (open: boolean) => void
	onPreviewChange?: (open: boolean) => void
}

export type DocumentRailController = DocumentRail & {
	previewSubject: ComputedRef<RailSubject | null>
	isPreviewOpen: ComputedRef<boolean>
	openSlot: (slotId: DocumentRailSlotId) => void
	toggleSlot: (slotId: DocumentRailSlotId) => void
	reset: () => void
}

export const documentRailKey: InjectionKey<DocumentRailController> = Symbol('documentRail')

export function createDocumentRail(options: CreateDocumentRailOptions): DocumentRailController {
	const activeSlotId = ref<DocumentRailSlotId | null>(null)
	const previewSubject = shallowRef<RailSubject | null>(null)
	const previewId = ref<string | undefined>(undefined)

	const isPreviewOpen = computed(() => previewSubject.value !== null)

	function notifyDrawer(open: boolean) {
		options.onDrawerChange?.(open)
	}

	function notifyPreview(open: boolean) {
		options.onPreviewChange?.(open)
	}

	function openSlot(slotId: DocumentRailSlotId) {
		if (activeSlotId.value === slotId) {
			return
		}
		activeSlotId.value = slotId
		closePreview()
		notifyDrawer(true)
	}

	function toggleSlot(slotId: DocumentRailSlotId) {
		if (activeSlotId.value === slotId) {
			close()
			return
		}
		openSlot(slotId)
	}

	function present(subject: RailSubject) {
		const normalized: RailSubject = {
			...subject,
			view: markRaw(subject.view),
		}
		if (subject.id !== undefined && subject.id === previewId.value) {
			return
		}
		previewId.value = subject.id
		previewSubject.value = normalized
		notifyPreview(true)
	}

	function closePreview() {
		if (!previewSubject.value) {
			return
		}
		previewSubject.value = null
		previewId.value = undefined
		notifyPreview(false)
	}

	function close() {
		activeSlotId.value = null
		closePreview()
		notifyDrawer(false)
	}

	function reset() {
		close()
	}

	return {
		doctype: options.doctype,
		recordId: options.recordId,
		activeSlotId: computed(() => activeSlotId.value),
		previewSubject: computed(() => previewSubject.value),
		isPreviewOpen,
		present,
		closePreview,
		close,
		openSlot,
		toggleSlot,
		reset,
	}
}

/**
 * Consumes the document rail provided by Desktop. Slot panels use this to request
 * the 50% preview surface via `present({ view })`.
 * @public
 */
export function useDocumentRail(): DocumentRail {
	const rail = inject(documentRailKey, null)
	if (!rail) {
		throw new Error('useDocumentRail() must be called inside Desktop with railSlots configured')
	}
	return rail
}
