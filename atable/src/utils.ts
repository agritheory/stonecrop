export const isHtmlString = (htmlString: string) => {
	const $document = new DOMParser().parseFromString(htmlString, 'text/html')
	return Array.from($document.body.childNodes).some(node => node.nodeType === 1)
}

export const generateHash = (length = 8) => {
	return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

/**
 * Render a composite quantity value (`{ qty, uom }`, see `QuantityValue` in `@stonecrop/aform`)
 * as `"<qty> <uom>"`. Shared by the two paths a quantity column can reach formatting through:
 * the `format` that `schemaToColumns` attaches, and the table store's category-based default.
 */
export const formatQuantity = (value: any): string => {
	if (value === null || value === undefined) return ''
	if (typeof value === 'object') {
		const qty = value.qty ?? ''
		const uom = value.uom ?? ''
		return uom ? `${qty} ${uom}`.trim() : String(qty)
	}
	return String(value)
}

/**
 * Render a composite currency value (`{ amount, currency }`, see `CurrencyValue` in
 * `@stonecrop/aform`) as `"<amount> <currency>"`. `currency` is an AFormLinkValue FK reference —
 * its `displayText` is preferred, falling back to `id`. Shared by the two paths a currency column
 * can reach formatting through: the `format` that `schemaToColumns` attaches, and the table
 * store's category-based default.
 */
/**
 * Format a calendar date for a table cell. `YYYY-MM-DD` is a local day, not UTC midnight —
 * `new Date('2025-08-05')` is the previous evening in US timezones and shows the wrong day.
 */
export const formatCalendarDate = (value: any): string => {
	if (value === null || value === undefined || value === '') return ''
	if (typeof value === 'number' || value instanceof Date) {
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleDateString()
	}

	const iso = String(value)
		.trim()
		.match(/^(\d{4})-(\d{2})-(\d{2})$/)
	if (iso) {
		const parsed = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
		return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleDateString()
	}

	const parsed = new Date(value)
	return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleDateString()
}

export const formatCurrency = (value: any): string => {
	if (value === null || value === undefined) return ''
	if (typeof value === 'object') {
		const amount = value.amount ?? ''
		const currency = value.currency?.displayText ?? value.currency?.id ?? ''
		return currency ? `${amount} ${currency}`.trim() : String(amount)
	}
	return String(value)
}
