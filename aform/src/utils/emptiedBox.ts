/**
 * A number box's number as `v-model` hands it back, or null once the box is empty. `v-model` hands
 * back the box's text when it holds no number, and the browser reports an empty box as `''`.
 */
export function numberFromBox(value: number | ''): number | null {
	return value === '' ? null : value
}
