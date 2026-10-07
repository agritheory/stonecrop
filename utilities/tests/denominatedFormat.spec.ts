import { describe, expect, it } from 'vitest'

import { formatCurrencyAmount, formatCurrencyCell, formatQuantityCell } from '../src/denominatedFormat'

describe('a quantity in a table cell', { tags: ['unit'] }, () => {
	it('shows the unit unless it is the stock unit', () => {
		expect(formatQuantityCell({ qty: 2, uom: 'Box', stockUom: 'Nos' })).toBe('2 Box')
		expect(formatQuantityCell({ qty: 2, uom: 'Nos', stockUom: 'Nos' })).toBe('2')
		expect(formatQuantityCell({ qty: 3, uom: 'Kg' })).toBe('3 Kg')
	})

	it('shows a zero quantity', () => {
		expect(formatQuantityCell({ qty: 0, uom: 'Box', stockUom: 'Nos' })).toBe('0 Box')
	})

	it('shows nothing for no quantity', () => {
		expect(formatQuantityCell(null)).toBe('')
		expect(formatQuantityCell({})).toBe('')
	})

	// A quantity column may still hold a plain number.
	it('shows a plain number as it is', () => {
		expect(formatQuantityCell(5)).toBe('5')
	})
})

describe('a price in a table cell', { tags: ['unit'] }, () => {
	// A currency that is not an ISO code, such as an app's own points, has no format of its own.
	it('names a currency that is not an ISO code by its symbol, name or id', () => {
		expect(formatCurrencyAmount(50.5, { id: 'points', symbol: 'pts', displayText: 'Points' })).toBe('50.5 pts')
		expect(formatCurrencyAmount(50, { id: 'points', displayText: 'Points' })).toBe('50 Points')
		expect(formatCurrencyAmount(50, { id: 'points' })).toBe('50 points')
	})

	it('shows a zero price', () => {
		expect(formatCurrencyCell({ amount: 0, currency: { id: 'points', symbol: 'pts' } })).toBe('0 pts')
	})

	it('shows an amount with no currency as the number', () => {
		expect(formatCurrencyCell({ amount: 50 })).toBe('50')
	})

	it('shows nothing for no price', () => {
		expect(formatCurrencyCell(null)).toBe('')
		expect(formatCurrencyCell({ amount: null, currency: { id: 'USD' } })).toBe('')
	})

	// A price column may still hold a plain number.
	it('shows a plain number as it is', () => {
		expect(formatCurrencyCell(12)).toBe('12')
	})
})
