import type { AFormLinkValue } from '@stonecrop/aform'

export const playgroundCurrencies: AFormLinkValue[] = [
	{ id: 'USD', displayText: 'US Dollar', symbol: '$' },
	{ id: 'EUR', displayText: 'Euro', symbol: '€' },
	{ id: 'GBP', displayText: 'British Pound', symbol: '£' },
	{ id: 'NZD', displayText: 'New Zealand Dollar', symbol: 'NZD' },
	{ id: 'JPY', displayText: 'Japanese Yen', symbol: '¥' },
]

export const playgroundBaseCurrency: AFormLinkValue = { id: 'USD', displayText: 'US Dollar', symbol: '$' }

/** Shared ACurrencyInput options for playground doctypes (JSON cannot carry filterFunction). */
export const playgroundCurrencyOptions = {
	doctype: 'currency',
	baseCurrency: playgroundBaseCurrency,
	exchangeRates: { EUR: 1.1, GBP: 1.3, NZD: 0.6, JPY: 0.0067 },
	precision: 2,
	filterFunction: (search: string) =>
		playgroundCurrencies.filter(c => c.displayText!.toLowerCase().includes(search.toLowerCase())),
}
