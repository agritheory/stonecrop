/** BCP 47 locales used for amount entry/display (grouping + decimal separators). */
const CURRENCY_INPUT_LOCALE: Record<string, string> = {
	USD: 'en-US',
	NZD: 'en-NZ',
	GBP: 'en-GB',
	EUR: 'de-DE',
	JPY: 'ja-JP',
}

/**
 * Locale for formatting/parsing the numeric portion of a currency amount in inputs.
 * @public
 */
export function currencyInputLocale(currencyId: string | undefined): string {
	if (!currencyId) return 'en-US'
	return CURRENCY_INPUT_LOCALE[currencyId.toUpperCase()] ?? 'en-US'
}

/**
 * Fraction digits for a currency in amount inputs (e.g. JPY → 0).
 * @public
 */
export function currencyInputFractionDigits(currencyId: string | undefined): number {
	const id = currencyId?.toUpperCase() ?? ''
	if (!id) return 2
	try {
		return (
			new Intl.NumberFormat(currencyInputLocale(id), {
				style: 'currency',
				currency: id,
			}).resolvedOptions().maximumFractionDigits ?? 2
		)
	} catch {
		return 2
	}
}

function separatorsForLocale(locale: string): { group: string; decimal: string } {
	const parts = new Intl.NumberFormat(locale).formatToParts(1234567.89)
	return {
		group: parts.find(part => part.type === 'group')?.value ?? ',',
		decimal: parts.find(part => part.type === 'decimal')?.value ?? '.',
	}
}

/**
 * Format a numeric amount for display in a currency amount field (no currency symbol).
 * @public
 */
export function formatCurrencyAmountInput(amount: number | null | undefined, currencyId: string | undefined): string {
	if (amount === null || amount === undefined) return ''
	const id = currencyId?.toUpperCase() ?? ''
	const locale = currencyInputLocale(id)
	const fractionDigits = currencyInputFractionDigits(id)
	return new Intl.NumberFormat(locale, {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
		useGrouping: id !== 'JPY',
	}).format(amount)
}

/**
 * Parse user-entered text in a currency amount field back to a number.
 * @public
 */
export function parseCurrencyAmountInput(text: string, currencyId: string | undefined): number | null {
	const trimmed = text.trim()
	if (!trimmed || trimmed === '-') return null
	const locale = currencyInputLocale(currencyId)
	const { group, decimal } = separatorsForLocale(locale)
	let normalized = trimmed.replace(/\s/g, '')
	normalized = normalized.replace(/[^\d.,\-+]/g, '')
	// Locale may use "." as grouping (de-DE) while the user typed an ASCII decimal (common on US keyboards).
	if (group && normalized.includes(group)) {
		const typedAsciiDecimal =
			decimal !== '.' && !normalized.includes(decimal) && (normalized.match(/\./g)?.length ?? 0) === 1
		if (!typedAsciiDecimal) normalized = normalized.replaceAll(group, '')
	}
	if (decimal !== '.') {
		const lastDecimal = normalized.lastIndexOf(decimal)
		if (lastDecimal !== -1) {
			normalized =
				normalized.slice(0, lastDecimal).replaceAll(decimal, '') +
				'.' +
				normalized.slice(lastDecimal + decimal.length).replaceAll(decimal, '')
		}
	}
	const value = Number(normalized)
	return Number.isFinite(value) ? value : null
}

/**
 * Characters allowed while typing in a masked currency amount field.
 * @public
 */
export function currencyAmountEntryPattern(currencyId: string | undefined): RegExp {
	const locale = currencyInputLocale(currencyId)
	const { group, decimal } = separatorsForLocale(locale)
	const grp = group.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const fractionDigits = currencyInputFractionDigits(currencyId)
	let extra = grp
	if (fractionDigits > 0) {
		const dec = decimal === '.' ? '\\.' : decimal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		extra += dec
		// US-style keyboards often paste/type '.' even when the locale decimal is ','.
		if (decimal !== '.') extra += '\\.'
	}
	return new RegExp(`^-?[\\d${extra}]*$`)
}
