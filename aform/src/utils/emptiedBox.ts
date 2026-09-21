/**
 * A date box's day as `v-model` hands it back, or null once any part of the box is empty, which the
 * browser reports as `''`.
 */
export function dayFromBox(text: string): string | null {
	return text === '' ? null : text
}

/**
 * A number box's number as `v-model` hands it back, or null once the box is empty. `v-model` hands
 * back the box's text when it holds no number, and the browser reports an empty box as `''`.
 */
export function numberFromBox(value: number | ''): number | null {
	return value === '' ? null : value
}
