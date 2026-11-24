import { computed, type ComputedRef } from 'vue'

/**
 * The message a field shows: the errors it is handed, joined, and nothing when it is handed none.
 *
 * A field only shows; it never words. Wording an error reported without a message is AForm's job
 * (see `wordErrors`), since only the form knows which field each error came from.
 */
export function fieldErrorText(errors: string[] | undefined) {
	return (errors ?? []).filter(Boolean).join('; ')
}

export function fieldErrorA11y(
	uuid: string | undefined,
	errorText: ComputedRef<string>,
	extraDescribedBy?: ComputedRef<string | undefined>
) {
	const errorId = computed(() => (uuid ? `${uuid}-error` : undefined))
	const hasError = computed(() => Boolean(errorText.value))
	const describedBy = computed(() => {
		if (hasError.value && errorId.value) return errorId.value
		return extraDescribedBy?.value
	})
	const invalid = computed(() => (hasError.value ? true : undefined))

	return { errorId, hasError, describedBy, invalid }
}
