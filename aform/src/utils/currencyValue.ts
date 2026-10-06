import type { AFormLinkValue, CurrencyOptions, CurrencyValue } from '../types'

const FLOAT_NOISE_DECIMALS = 6

export function normalizeBaseCurrency(
	options: CurrencyOptions,
	current: CurrencyValue | null | undefined
): AFormLinkValue {
	const base = options.baseCurrency ?? current?.baseCurrency
	if (!base) return { id: '' }
	return typeof base === 'string' ? { id: base } : base
}

export function baseAmountDecimals(options: CurrencyOptions): number {
	const { precision } = options
	if (precision === undefined) return FLOAT_NOISE_DECIMALS
	return Number.isInteger(precision) && precision >= 0 && precision <= 100 ? precision : FLOAT_NOISE_DECIMALS
}

export function resolveCurrencyExchangeRate(
	currencyId: string | number | undefined,
	options: CurrencyOptions,
	baseCurrency: AFormLinkValue,
	current: CurrencyValue | null | undefined
): number {
	const baseId = baseCurrency.id
	if (!currencyId || String(currencyId) === String(baseId)) return 1
	if (String(currencyId) === String(current?.currency?.id)) {
		return current?.exchangeRate ?? options.exchangeRates?.[String(currencyId)] ?? 1
	}
	return options.exchangeRates?.[String(currencyId)] ?? 1
}

const roundAmount = (value: number, decimals: number): number => Number(value.toFixed(decimals))

export function recomputeCurrencyValue(
	amount: number | null,
	currencyValue: AFormLinkValue,
	options: CurrencyOptions,
	baseCurrency: AFormLinkValue,
	current: CurrencyValue | null | undefined
): CurrencyValue {
	const exchangeRate = resolveCurrencyExchangeRate(currencyValue.id, options, baseCurrency, current)
	const decimals = baseAmountDecimals(options)
	return {
		amount,
		currency: currencyValue,
		exchangeRate,
		baseCurrency,
		baseAmount: amount === null ? null : roundAmount(amount * exchangeRate, decimals),
	}
}

export function patchCurrencyAmount(
	current: CurrencyValue | null | undefined,
	amount: number | null,
	options: CurrencyOptions,
	baseCurrency: AFormLinkValue
): CurrencyValue {
	return recomputeCurrencyValue(amount, current?.currency ?? { id: '' }, options, baseCurrency, current)
}

export function patchCurrencyCurrency(
	current: CurrencyValue | null | undefined,
	currencyValue: AFormLinkValue,
	options: CurrencyOptions,
	baseCurrency: AFormLinkValue
): CurrencyValue {
	return recomputeCurrencyValue(current?.amount ?? null, currencyValue, options, baseCurrency, current)
}

/** Static currency choices when no async filterFunction is configured (base + exchangeRates keys). */
export function staticCurrencyChoices(
	options: CurrencyOptions,
	current: CurrencyValue | null | undefined
): AFormLinkValue[] {
	const base = normalizeBaseCurrency(options, current)
	const seen = new Set<string>()
	const choices: AFormLinkValue[] = []
	if (base.id) {
		choices.push(base)
		seen.add(String(base.id))
	}
	const currentCur = current?.currency
	if (currentCur?.id && !seen.has(String(currentCur.id))) {
		choices.push(currentCur)
		seen.add(String(currentCur.id))
	}
	for (const id of Object.keys(options.exchangeRates ?? {})) {
		if (!seen.has(id)) {
			choices.push({ id, displayText: id })
			seen.add(id)
		}
	}
	return choices
}
