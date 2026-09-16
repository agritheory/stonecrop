import { computed, inject, markRaw, ref, shallowRef, type ComputedRef, type InjectionKey, type ShallowRef } from 'vue'

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

export const documentRailKey: InjectionKey<ShallowRef<DocumentRailController | null>> = Symbol('documentRail')

export function createDocumentRail(options: CreateDocumentRailOptions): DocumentRailController {
	const activeSlotId = ref<DocumentRailSlotId | null>(null)
	const previewSubject = shallowRef<RailSubject | null>(null)
	const previewId = ref<string | undefined>(undefined)

	const isPreviewOpen = computed(() => previewSubject.value !== null)

	function openSlot(slotId: DocumentRailSlotId) {
		if (activeSlotId.value === slotId) {
			return
		}
		activeSlotId.value = slotId
		closePreview()
		options.onDrawerChange?.(true)
	}

	function toggleSlot(slotId: DocumentRailSlotId) {
		if (activeSlotId.value === slotId) {
			close()
			return
		}
		openSlot(slotId)
	}

	function present(subject: RailSubject) {
		if (subject.id !== undefined && subject.id === previewId.value) {
			return
		}
		previewId.value = subject.id
		previewSubject.value = { ...subject, view: markRaw(subject.view) }
		options.onPreviewChange?.(true)
	}

	function closePreview() {
		if (!previewSubject.value) {
			return
		}
		previewSubject.value = null
		previewId.value = undefined
		options.onPreviewChange?.(false)
	}

	function close() {
		activeSlotId.value = null
		closePreview()
		options.onDrawerChange?.(false)
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
		reset: close,
	}
}

/** @public */
export function useDocumentRail(): DocumentRail {
	const railRef = inject(documentRailKey, null)
	const rail = railRef?.value
	if (!rail) {
		throw new Error('useDocumentRail() must be called inside Desktop with railSlots configured')
	}
	return rail
}
