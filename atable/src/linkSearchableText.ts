/**
 * Build the substring-search haystack for a link column cell.
 * Server middleware enriches inline FKs to `{ id, displayText }`; search both.
 * @public
 */
export function linkSearchableText(cellValue: unknown): string {
	if (cellValue == null || cellValue === '') return ''

	if (typeof cellValue === 'object') {
		const obj = cellValue as Record<string, unknown>
		const parts: string[] = []
		if (obj.id != null && obj.id !== '') parts.push(String(obj.id))
		if (obj.displayText != null && obj.displayText !== '') parts.push(String(obj.displayText))
		return parts.join(' ')
	}

	return String(cellValue)
}
