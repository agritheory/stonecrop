import { describe, expect, it } from 'vitest'

import { patchQuantityQty, patchQuantityUom } from '../src/utils/quantityValue'

describe('quantityValue helpers', { tags: ['unit'] }, () => {
	const options = { uoms: ['Nos', 'Box'], stockUom: 'Nos', conversionFactors: { Box: 10 } }
	const current = { qty: 2, uom: 'Box', stockQty: 20, stockUom: 'Nos', conversionFactor: 10 }

	it('patchQuantityQty updates qty and stockQty', () => {
		const next = patchQuantityQty(current, 5, options)
		expect(next.qty).toBe(5)
		expect(next.uom).toBe('Box')
		expect(next.stockQty).toBe(50)
	})

	it('patchQuantityUom updates uom and conversion', () => {
		const next = patchQuantityUom(current, 'Nos', options)
		expect(next.uom).toBe('Nos')
		expect(next.conversionFactor).toBe(1)
		expect(next.stockQty).toBe(2)
	})
})
