import type { QuantityOptions, QuantityValue } from '../types'

/** What a quantity box may hold, typed or pasted: digits, one decimal point and a leading minus sign. */
export const quantityEntryPattern = /^-?\d*\.?\d*$/

const roundQty = (value: number): number => Number(value.toFixed(6))

export function resolveQuantityConversionFactor(
	uom: string,
	options: QuantityOptions,
	current: QuantityValue | null | undefined
): number {
	const stockUom = options.stockUom ?? current?.stockUom
	if (!uom || uom === stockUom) return 1
	const mapped = options.conversionFactors?.[uom]
	if (mapped !== undefined) return mapped
	if (uom === current?.uom) return current.conversionFactor ?? 1
	return 1
}

export function recomputeQuantityValue(
	qty: number | null,
	uom: string,
	options: QuantityOptions,
	current: QuantityValue | null | undefined
): QuantityValue {
	const conversionFactor = resolveQuantityConversionFactor(uom, options, current)
	return {
		qty,
		uom,
		conversionFactor,
		stockUom: options.stockUom ?? current?.stockUom ?? '',
		stockQty: qty === null ? null : roundQty(qty * conversionFactor),
	}
}

export function patchQuantityQty(
	current: QuantityValue | null | undefined,
	qty: number | null,
	options: QuantityOptions
): QuantityValue {
	return recomputeQuantityValue(qty, current?.uom ?? '', options, current)
}

export function patchQuantityUom(
	current: QuantityValue | null | undefined,
	uom: string,
	options: QuantityOptions
): QuantityValue {
	return recomputeQuantityValue(current?.qty ?? null, uom, options, current)
}
