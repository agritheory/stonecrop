import { onClickOutside } from '@vueuse/core'
import { type ComponentPublicInstance, nextTick, ref, type ShallowRef, useId } from 'vue'

/** The keys a date field opens its calendar on: the ones a date input opens the browser's own calendar on, in Chrome. */
export const opensCalendar = (event: KeyboardEvent) =>
	event.key === ' ' || event.key === 'F4' || (event.altKey && event.key === 'ArrowDown')

/**
 * The calendar a date field opens from its box, and the keys and focus that go with it.
 * @param box - the field's box, which focus returns to when the calendar closes
 * @param calendar - the calendar, while it is open
 * @param uuid - the field's own id, when it has one
 */
export function useFieldCalendar(
	box: Readonly<ShallowRef<HTMLElement | null>>,
	calendar: Readonly<ShallowRef<ComponentPublicInstance | null>>,
	uuid: string | undefined
) {
	const showPicker = ref(false)
	// Unique for a standalone mount too, so two fields on one page can't cross-wire `aria-controls`.
	const calendarId = `${uuid ?? `aform-date-${useId()}`}-calendar`

	onClickOutside(calendar, () => (showPicker.value = false))

	const closePicker = () => {
		box.value?.focus()
		showPicker.value = false
	}

	const openFromKey = async (event: KeyboardEvent) => {
		// A read-only box's arrows have nothing else to do, so plain Down opens it too, as a combobox's does.
		const readOnlyDown = event.key === 'ArrowDown' && box.value instanceof HTMLInputElement && box.value.readOnly
		if (!opensCalendar(event) && !readOnlyDown) return
		event.preventDefault()
		showPicker.value = true
		await nextTick()
		const root: unknown = calendar.value?.$el
		// The calendar's one Tab stop is the day it has focused.
		if (root instanceof HTMLElement) root.querySelector<HTMLElement>('[role="grid"] [tabindex="0"]')?.focus()
	}

	const closeOnEscape = (event: KeyboardEvent) => {
		if (event.key !== 'Escape' || !showPicker.value) return
		event.stopPropagation()
		closePicker()
	}

	const closeWhenFocusLeaves = (event: FocusEvent) => {
		const field = event.currentTarget
		const next = event.relatedTarget
		if (!(field instanceof Node && next instanceof Node && field.contains(next))) showPicker.value = false
	}

	return { showPicker, calendarId, closePicker, openFromKey, closeOnEscape, closeWhenFocusLeaves }
}
