import { computed, type ComputedRef } from 'vue'

export function fieldErrorA11y(uuid: string | undefined, errorText: ComputedRef<string>) {
	const errorId = computed(() => (uuid ? `${uuid}-error` : undefined))
	const hasError = computed(() => Boolean(errorText.value))
	const describedBy = computed(() => (hasError.value && errorId.value ? errorId.value : undefined))
	const invalid = computed(() => (hasError.value ? true : undefined))

	return { errorId, hasError, describedBy, invalid }
}
