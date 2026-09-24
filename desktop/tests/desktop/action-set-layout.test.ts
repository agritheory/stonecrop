import { describe, expect, it } from 'vitest'

import {
	clampTileTop,
	isAtLowerVerticalLimit,
	maxRailBottomY,
	maxTopForRailHeight,
	SHEET_NAV_CLUSTER_SELECTOR,
	type ActionSetLayoutBounds,
} from '../../src/action-set-layout'

const bounds = (sheetNavTop: number | null, innerHeight = 900, margin = 4): ActionSetLayoutBounds => ({
	margin,
	innerHeight,
	sheetNavTop,
})

describe('action-set-layout', { tags: ['unit'] }, () => {
	it('maxRailBottomY uses SheetNav top when present', () => {
		expect(maxRailBottomY(bounds(860))).toBe(856)
	})

	it('maxRailBottomY falls back to viewport when SheetNav missing', () => {
		expect(maxRailBottomY(bounds(null))).toBe(896)
	})

	it('clampTileTop keeps rail above SheetNav', () => {
		const b = bounds(860)
		const railHeight = 120
		const maxTop = maxTopForRailHeight(railHeight, b)
		expect(maxTop).toBe(736)
		expect(clampTileTop(900, railHeight, b)).toBe(736)
		expect(clampTileTop(736, railHeight, b)).toBe(736)
		expect(clampTileTop(4, railHeight, b)).toBe(4)
	})

	it('isAtLowerVerticalLimit detects bottom clamp', () => {
		const b = bounds(860)
		const railHeight = 80
		const maxTop = maxTopForRailHeight(railHeight, b)
		expect(isAtLowerVerticalLimit(maxTop, railHeight, b)).toBe(true)
		expect(isAtLowerVerticalLimit(maxTop - 2, railHeight, b)).toBe(false)
	})

	it('documents SheetNav DOM selector for footer root + cluster', () => {
		expect(SHEET_NAV_CLUSTER_SELECTOR).toBe('.desktop__sheetnav .sheetnav-footer-cluster')
	})
})
