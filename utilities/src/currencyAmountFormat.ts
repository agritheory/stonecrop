/**
 * Fraction digits for a currency in amount inputs (e.g. JPY → 0).
 * @public
 */
export function currencyInputFractionDigits(currencyId: string | undefined): number {
	const id = currencyId?.toUpperCase() ?? ''
	if (!id) return 2
	try {
		return (
			new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: id,
			}).resolvedOptions().maximumFractionDigits ?? 2
		)
	} catch {
		return 2
	}
}

function separatorsForLocale(locale: string | undefined): { group: string; decimal: string } {
	const parts = new Intl.NumberFormat(locale).formatToParts(1234567.89)
	return {
		group: parts.find(part => part.type === 'group')?.value ?? ',',
		decimal: parts.find(part => part.type === 'decimal')?.value ?? '.',
	}
}

/**
 * Format a numeric amount for display in a currency amount field (no currency symbol). The currency
 * sets the decimals; the separators are the locale's, as in the table cell.
 * @param locale - The browser's own when omitted
 * @public
 */
export function formatCurrencyAmountInput(
	amount: number | null | undefined,
	currencyId: string | undefined,
	locale?: string
): string {
	if (amount === null || amount === undefined) return ''
	const id = currencyId?.toUpperCase() ?? ''
	const fractionDigits = currencyInputFractionDigits(id)
	return new Intl.NumberFormat(locale, {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
		useGrouping: id !== 'JPY',
	}).format(amount)
}

/**
 * Parse user-entered text in a currency amount field back to a number, read with the separators the
 * field writes it with.
 * @param locale - The browser's own when omitted
 * @public
 */
export function parseCurrencyAmountInput(text: string, locale?: string): number | null {
	const { group, decimal } = separatorsForLocale(locale)
	const normalized = text
		.replace(/\s/g, '')
		.replace(/[^\d.,\-+]/g, '')
		.replaceAll(group, '')
		.replace(decimal, '.')
	// No digits is no amount, though `Number('')` is 0.
	if (!/\d/.test(normalized)) return null
	const value = Number(normalized)
	return Number.isFinite(value) ? value : null
}

/**
 * What a masked currency amount field may hold while it is typed in: digits and grouping marks, then at most one
 * decimal point followed by digits.
 * @param locale - The browser's own when omitted
 * @public
 */
export function currencyAmountEntryPattern(currencyId: string | undefined, locale?: string): RegExp {
	const { group, decimal } = separatorsForLocale(locale)
	const escape = (mark: string) => mark.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const whole = `-?[\\d${escape(group)}]*`
	if (currencyInputFractionDigits(currencyId) === 0) return new RegExp(`^${whole}$`)
	// US-style keyboards often paste/type '.' even when the locale decimal is ','.
	const point = decimal === '.' ? '\\.' : `[${escape(decimal)}.]`
	return new RegExp(`^${whole}(?:${point}\\d*)?$`)
}
