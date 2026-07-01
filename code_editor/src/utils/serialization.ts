/**
 * Coerces an unknown value to a string suitable for Monaco's initial content.
 * Objects are JSON-stringified with 2-space indentation.
 * Null and undefined become empty string.
 * Strings pass through unchanged.
 * @public
 */
export function toEditorString(value: unknown, _fieldtype?: string): string {
	if (value === null || value === undefined) return ''
	if (typeof value === 'string') return value
	return JSON.stringify(value, null, 2)
}
