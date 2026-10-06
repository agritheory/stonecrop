import { describe, expect, it } from 'vitest'

import {
	currencyAmountEntryPattern,
	currencyInputFractionDigits,
	formatCurrencyAmountInput,
	parseCurrencyAmountInput,
} from '../src/currencyAmountFormat'
import { formatCurrencyCell } from '../src/denominatedFormat'

describe('currencyAmountFormat', () => {
	it('formats USD with grouping and two decimals', () => {
		expect(formatCurrencyAmountInput(10050.45, 'USD', 'en-US')).toBe('10,050.45')
	})

	// The separators are the language's, whatever the currency.
	it("formats an amount with the language's separators", () => {
		expect(formatCurrencyAmountInput(10050.45, 'EUR', 'en-US')).toBe('10,050.45')
		expect(formatCurrencyAmountInput(10050.45, 'USD', 'de-DE')).toBe('10.050,45')
	})

	it('formats JPY without fraction digits or grouping', () => {
		expect(formatCurrencyAmountInput(10050, 'JPY', 'ja-JP')).toBe('10050')
		expect(currencyInputFractionDigits('JPY')).toBe(0)
	})

	it("parses an amount back with the language's separators", () => {
		expect(parseCurrencyAmountInput('10,050.45', 'en-US')).toBe(10050.45)
		expect(parseCurrencyAmountInput('10.050,45', 'de-DE')).toBe(10050.45)
		expect(parseCurrencyAmountInput('10050', 'ja-JP')).toBe(10050)
	})

	// German writes 1234 as "1.234,00", so "1.234" is read the same way.
	it('reads a point as grouping in a language that groups with one', () => {
		expect(parseCurrencyAmountInput('1.234', 'de-DE')).toBe(1234)
	})

	it('reads text with no digits as no amount', () => {
		expect(parseCurrencyAmountInput('abc', 'en-US')).toBeNull()
		expect(parseCurrencyAmountInput(',', 'en-US')).toBeNull()
	})

	it('validates entry patterns per currency', () => {
		expect(currencyAmountEntryPattern('USD', 'en-US').test('1,234.56')).toBe(true)
		expect(currencyAmountEntryPattern('EUR', 'de-DE').test('1.234,56')).toBe(true)
		expect(currencyAmountEntryPattern('JPY', 'ja-JP').test('10050')).toBe(true)
		expect(currencyAmountEntryPattern('JPY', 'ja-JP').test('100.50')).toBe(false)
	})

	// The editor and the cell show the same amount, so they must agree on which mark is the decimal point.
	it('writes an EUR amount with the same separators in the editor as in the cell', () => {
		const inEditor = formatCurrencyAmountInput(1234.5, 'EUR')
		const inCell = formatCurrencyCell({ amount: 1234.5, currency: { id: 'EUR' } })

		expect(inCell).toContain(inEditor)
	})
})
