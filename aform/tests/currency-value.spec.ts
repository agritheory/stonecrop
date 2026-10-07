import { describe, expect, it } from 'vitest'

import { patchCurrencyAmount, patchCurrencyCurrency } from '../src/utils/currencyValue'

describe('currencyValue helpers', { tags: ['unit'] }, () => {
	const usd = { id: 'USD', displayText: 'US Dollar', symbol: '$' }
	const eur = { id: 'EUR', displayText: 'Euro', symbol: '€' }
	const options = { baseCurrency: usd, exchangeRates: { EUR: 1.1 }, precision: 2 }
	const current = {
		amount: 10,
		currency: eur,
		baseAmount: 11,
		baseCurrency: usd,
		exchangeRate: 1.1,
	}

	it('patchCurrencyAmount updates amount and baseAmount', () => {
		const next = patchCurrencyAmount(current, 20, options, usd)
		expect(next.amount).toBe(20)
		expect(next.baseAmount).toBe(22)
	})

	it('patchCurrencyCurrency keeps amount and recomputes rate', () => {
		const next = patchCurrencyCurrency(current, usd, options, usd)
		expect(next.currency.id).toBe('USD')
		expect(next.exchangeRate).toBe(1)
		expect(next.baseAmount).toBe(10)
	})
})
