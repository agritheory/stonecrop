/** Seed shapes for quantity/currency columns in the documentation playground mock store. */

export const playgroundUsd = { id: 'USD', displayText: 'US Dollar', symbol: '$' }
export const playgroundEur = { id: 'EUR', displayText: 'Euro', symbol: '€' }

export function playgroundQtyNos(qty: number) {
	return { qty, uom: 'Nos', stockQty: qty, stockUom: 'Nos', conversionFactor: 1 }
}

export function playgroundQtyBox(boxes: number, factor = 10) {
	const stockQty = boxes * factor
	return { qty: boxes, uom: 'Box', stockQty, stockUom: 'Nos', conversionFactor: factor }
}

export function playgroundMoneyUsd(amount: number) {
	return {
		amount,
		currency: playgroundUsd,
		baseAmount: amount,
		baseCurrency: playgroundUsd,
		exchangeRate: 1,
	}
}

export function playgroundMoneyEur(amount: number, exchangeRate = 1.1) {
	const baseAmount = Number((amount * exchangeRate).toFixed(2))
	return {
		amount,
		currency: playgroundEur,
		baseAmount,
		baseCurrency: playgroundUsd,
		exchangeRate,
	}
}

export function sumPlaygroundMoney(values: unknown[]): number {
	return values.reduce<number>((sum, value) => {
		if (value !== null && typeof value === 'object') {
			const record = value as { baseAmount?: unknown; amount?: unknown }
			if (record.baseAmount != null) return sum + Number(record.baseAmount)
			if (record.amount != null) return sum + Number(record.amount)
		}
		return sum + Number(value)
	}, 0)
}
