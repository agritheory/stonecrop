import { computed, type ComputedRef } from 'vue'

/**
 * The message a field shows: the errors its host reports, and nothing when it reports none.
 *
 * `validation.errorMessage` is wording, not a verdict: it stands in for a reported error that has no
 * text of its own, and never raises an error on its own. A field cannot tell that its value failed
 * validation, so a static message shown with no reported error is on every record, valid or not, and
 * marks the input `aria-invalid` for a screen reader.
 */
export function fieldErrorText(errors: string[] | undefined, validation: { errorMessage?: string } | undefined) {
	const messages = (errors ?? []).map(error => error || validation?.errorMessage || '').filter(Boolean)
	return [...new Set(messages)].join('; ')
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
