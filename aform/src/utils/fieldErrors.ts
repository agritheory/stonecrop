/**
 * The errors reported on one field, worded for display.
 *
 * An error reported without a message (a trigger's `setError(field)`) takes the field's own
 * `validation.errorMessage`; one with no message and no wording to give it is dropped. A static
 * message is never an error on its own: a field cannot tell that its value failed validation, so a
 * message shown with no reported error would sit on every record, valid or not, and mark the input
 * `aria-invalid` for a screen reader.
 *
 * Applied by AForm, the only place that knows which field an error came from: a component bound to
 * several fields' parts is handed all of their errors and cannot tell whose wording each one needs.
 */
export function wordErrors(errors: readonly string[], validation: { errorMessage?: string } | undefined): string[] {
	const messages = errors.map(error => error || validation?.errorMessage || '').filter(Boolean)
	return [...new Set(messages)]
}
