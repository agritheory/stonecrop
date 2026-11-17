import { currencyInputFractionDigits } from '@stonecrop/utilities'

import type { AFormLinkValue, CurrencyOptions, CurrencyValue } from '../types'
import { linkId } from './linkValue'

const FLOAT_NOISE_DECIMALS = 6

/**
 * An amount worked out in a currency box, rounded to the currency's decimals as the box shows it: `10/3` in USD is
 * `3.33`, not `3.3333333333333`.
 */
export function roundToCurrency(amount: number, currencyId: string | undefined): number {
	return Number(amount.toFixed(currencyInputFractionDigits(currencyId)))
}

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
	// `linkId`, never `.id`: a currency read from a record's own field may be its bare id, and taking it for
	// another currency replaces the stored rate.
	if (String(currencyId) === linkId(current?.currency)) {
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
	if (!current) return recomputeCurrencyValue(amount, { id: '' }, options, baseCurrency, current)
	// Currency and rate exactly as given, never re-derived: they are often fields of their own, which
	// an order's totals share, so typing one amount must not change them.
	const recomputed = recomputeCurrencyValue(amount, current.currency ?? { id: '' }, options, baseCurrency, current)
	return { ...recomputed, currency: current.currency, exchangeRate: current.exchangeRate }
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
