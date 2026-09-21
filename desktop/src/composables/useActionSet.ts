import { computed, inject, markRaw, ref, shallowRef, type ComputedRef, type InjectionKey, type ShallowRef } from 'vue'

import type { ActionSetContext, ActionSetPreview, ActionSetSlotId } from '../types'

export type CreateActionSetOptions = {
	doctype: ComputedRef<string>
	recordId: ComputedRef<string>
	onDrawerChange?: (open: boolean) => void
	onPreviewChange?: (open: boolean) => void
}

export type ActionSetController = ActionSetContext & {
	previewSubject: ComputedRef<ActionSetPreview | null>
	isPreviewOpen: ComputedRef<boolean>
	openSlot: (slotId: ActionSetSlotId) => void
	toggleSlot: (slotId: ActionSetSlotId) => void
	reset: () => void
}

export const actionSetKey: InjectionKey<ShallowRef<ActionSetController | null>> = Symbol('actionSet')

export function createActionSet(options: CreateActionSetOptions): ActionSetController {
	const activeSlotId = ref<ActionSetSlotId | null>(null)
	const previewSubject = shallowRef<ActionSetPreview | null>(null)
	const previewId = ref<string | undefined>(undefined)

	const isPreviewOpen = computed(() => previewSubject.value !== null)

	function openSlot(slotId: ActionSetSlotId) {
		if (activeSlotId.value === slotId) {
			return
		}
		activeSlotId.value = slotId
		closePreview()
		options.onDrawerChange?.(true)
	}

	function toggleSlot(slotId: ActionSetSlotId) {
		if (activeSlotId.value === slotId) {
			close()
			return
		}
		openSlot(slotId)
	}

	function present(subject: ActionSetPreview) {
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
export function useActionSet(): ActionSetContext {
	const actionSetRef = inject(actionSetKey, null)
	const actionSet = actionSetRef?.value
	if (!actionSet) {
		throw new Error('useActionSet() must be called inside Desktop with actionSetSlots configured')
	}
	return actionSet
}
