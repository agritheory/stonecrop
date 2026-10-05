type CurrencyLike = {
	id?: string | number
	symbol?: string
	displayText?: string
}

function displayScalar(value: unknown): string {
	if (typeof value === 'string') return value
	if (typeof value === 'number' || typeof value === 'bigint') return String(value)
	if (typeof value === 'boolean') return String(value)
	return ''
}

function displayQty(qty: unknown): string {
	if (qty === null || qty === undefined || qty === '') return ''
	return displayScalar(qty)
}

/**
 * Format a currency amount for display (forms, table cells). Uses `Intl` when `currency.id` is a
 * valid ISO code; otherwise falls back to symbol, display text, or id.
 * @public
 */
export function formatCurrencyAmount(amount: number | null | undefined, currency: CurrencyLike | undefined): string {
	if (amount === null || amount === undefined) return ''
	const id = currency?.id != null ? String(currency.id) : ''
	if (id) {
		try {
			return new Intl.NumberFormat(undefined, {
				style: 'currency',
				currency: id,
				currencyDisplay: 'symbol',
			}).format(amount)
		} catch {
			// Not a valid ISO 4217 code — fall through to symbol / displayText.
		}
	}
	const suffix = currency?.symbol ?? currency?.displayText ?? id
	return suffix ? `${amount} ${suffix}`.trim() : String(amount)
}

/**
 * Render a composite quantity value for table cells. Omits the UOM when it matches `stockUom`.
 * @public
 */
export function formatQuantityCell(value: unknown): string {
	if (value === null || value === undefined) return ''
	if (typeof value !== 'object') return displayScalar(value)
	const record = value as { qty?: unknown; uom?: string; stockUom?: string }
	const qtyText = displayQty(record.qty)
	const uom = record.uom ?? ''
	const stockUom = record.stockUom ?? ''
	if (!uom) return qtyText
	if (stockUom && uom === stockUom) return qtyText
	return `${qtyText} ${uom}`.trim()
}

/**
 * Render a composite currency value for table cells.
 * @public
 */
export function formatCurrencyCell(value: unknown): string {
	if (value === null || value === undefined) return ''
	if (typeof value !== 'object') return displayScalar(value)
	const record = value as { amount?: number | null; currency?: CurrencyLike }
	return formatCurrencyAmount(record.amount, record.currency)
}
