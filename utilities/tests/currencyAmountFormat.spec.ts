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
		expect(formatCurrencyAmountInput(10050.45, 'USD')).toBe('10,050.45')
	})

	it('formats EUR with European separators', () => {
		expect(formatCurrencyAmountInput(10050.45, 'EUR')).toBe('10.050,45')
	})

	it('formats JPY without fraction digits or grouping', () => {
		expect(formatCurrencyAmountInput(10050, 'JPY')).toBe('10050')
		expect(currencyInputFractionDigits('JPY')).toBe(0)
	})

	it('parses locale-specific input back to numbers', () => {
		expect(parseCurrencyAmountInput('10,050.45', 'USD')).toBe(10050.45)
		expect(parseCurrencyAmountInput('10.050,45', 'EUR')).toBe(10050.45)
		expect(parseCurrencyAmountInput('10050', 'JPY')).toBe(10050)
	})

	it('parses ASCII decimal entry for comma-decimal locales', () => {
		expect(parseCurrencyAmountInput('10.75', 'EUR')).toBe(10.75)
	})

	it('validates entry patterns per currency', () => {
		expect(currencyAmountEntryPattern('USD').test('1,234.56')).toBe(true)
		expect(currencyAmountEntryPattern('EUR').test('1.234,56')).toBe(true)
		expect(currencyAmountEntryPattern('JPY').test('10050')).toBe(true)
		expect(currencyAmountEntryPattern('JPY').test('100.50')).toBe(false)
	})

	// A US keyboard groups thousands with ',' and ends with a '.' decimal, which EUR entry already accepts on its own.
	it('parses a US-style EUR amount with thousands grouping as the amount typed', () => {
		expect(parseCurrencyAmountInput('1,234.56', 'EUR')).toBe(1234.56)
	})

	// The editor and the cell show the same amount, so they must agree on which mark is the decimal point.
	it('writes an EUR amount with the same separators in the editor as in the cell', () => {
		const inEditor = formatCurrencyAmountInput(1234.5, 'EUR')
		const inCell = formatCurrencyCell({ amount: 1234.5, currency: { id: 'EUR' } })

		expect(inCell).toContain(inEditor)
	})
})
