/**
 * Normalize a scalar cell value to a non-empty string, or nothing.
 *
 * Rejecting objects is what the haystack wants: a nested value has no single textual form, and
 * `String()` on one contributes `[object Object]`, which matches a search for "object" and nothing
 * a user would actually type.
 */
function scalarText(value: unknown): string | undefined {
	if (value == null || typeof value === 'object') return undefined
	if (typeof value === 'string') return value === '' ? undefined : value
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
		return String(value)
	}
	return undefined
}

/**
 * Build the substring-search haystack for a link column cell.
 * Server middleware enriches inline FKs to `{ id, displayText }`; search both.
 * @public
 */
export function linkSearchableText(cellValue: unknown): string {
	if (cellValue == null || cellValue === '') return ''

	// `in` rather than an assertion to `Record<string, unknown>`: the assertion claims the value has
	// string keys of unknown type, which is narrower than `object` and so is a claim this function
	// cannot make about a cell it did not build.
	if (typeof cellValue === 'object') {
		const parts: string[] = []
		if ('id' in cellValue) {
			const id = scalarText(cellValue.id)
			if (id !== undefined) parts.push(id)
		}
		if ('displayText' in cellValue) {
			const displayText = scalarText(cellValue.displayText)
			if (displayText !== undefined) parts.push(displayText)
		}
		return parts.join(' ')
	}

	return scalarText(cellValue) ?? ''
}
