import { computed, inject, markRaw, ref, shallowRef, type ComputedRef, type InjectionKey } from 'vue'

import type { ActionSetContext, ActionSetPreview, ActionSetSlotId } from '../types'

export type CreateActionSetOptions = {
	doctype: ComputedRef<string>
	recordId: ComputedRef<string>
}

/**
 * The only owner of what the drawer shows. ActionSet and Desktop both read it, so the tile
 * column, the drawer and the workspace margin cannot disagree about whether the drawer is open.
 */
export type ActionSetController = ActionSetContext & {
	previewSubject: ComputedRef<ActionSetPreview | null>
	isPreviewOpen: ComputedRef<boolean>
	isActionsOpen: ComputedRef<boolean>
	isSearchOpen: ComputedRef<boolean>
	isDrawerOpen: ComputedRef<boolean>
	openActions: () => void
	openSearch: () => void
	openSlot: (slotId: ActionSetSlotId) => void
}

export const actionSetKey: InjectionKey<ActionSetController> = Symbol('actionSet')

export function createActionSet(options: CreateActionSetOptions): ActionSetController {
	const activeSlotId = ref<ActionSetSlotId | null>(null)
	const actionsOpen = ref(false)
	const searchOpen = ref(false)
	const previewSubject = shallowRef<ActionSetPreview | null>(null)
	const previewId = ref<string | undefined>(undefined)

	function openActions() {
		activeSlotId.value = null
		searchOpen.value = false
		closePreview()
		actionsOpen.value = true
	}

	function openSearch() {
		activeSlotId.value = null
		actionsOpen.value = false
		closePreview()
		searchOpen.value = true
	}

	function openSlot(slotId: ActionSetSlotId) {
		actionsOpen.value = false
		searchOpen.value = false
		if (activeSlotId.value === slotId) {
			return
		}
		activeSlotId.value = slotId
		closePreview()
	}

	function present(subject: ActionSetPreview) {
		if (subject.id !== undefined && subject.id === previewId.value) {
			return
		}
		previewId.value = subject.id
		previewSubject.value = { ...subject, view: markRaw(subject.view) }
	}

	function closePreview() {
		previewSubject.value = null
		previewId.value = undefined
	}

	function close() {
		activeSlotId.value = null
		actionsOpen.value = false
		searchOpen.value = false
		closePreview()
	}

	return {
		doctype: options.doctype,
		recordId: options.recordId,
		activeSlotId: computed(() => activeSlotId.value),
		previewSubject: computed(() => previewSubject.value),
		isPreviewOpen: computed(() => previewSubject.value !== null),
		isActionsOpen: computed(() => actionsOpen.value),
		isSearchOpen: computed(() => searchOpen.value),
		isDrawerOpen: computed(() => actionsOpen.value || searchOpen.value || activeSlotId.value !== null),
		present,
		closePreview,
		close,
		openActions,
		openSearch,
		openSlot,
	}
}

/** @public */
export function useActionSet(): ActionSetContext {
	const actionSet = inject(actionSetKey, null)
	if (!actionSet) {
		throw new Error('useActionSet() must be called inside a component rendered by Desktop')
	}
	return actionSet
}
