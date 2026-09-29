/** SheetNav root is `<footer class="desktop__sheetnav">`; cluster holds tabs + toolbar. */
export const SHEET_NAV_CLUSTER_SELECTOR = '.desktop__sheetnav .sheetnav-footer-cluster'

export type ActionSetLayoutBounds = {
	margin: number
	innerHeight: number
	/** Viewport Y of the top of SheetNav chrome, or null when SheetNav is absent. */
	sheetNavTop: number | null
}

/** Maximum viewport Y for the bottom edge of the tile rail (above SheetNav). */
export function maxRailBottomY(bounds: ActionSetLayoutBounds): number {
	const { margin, innerHeight, sheetNavTop } = bounds
	if (sheetNavTop === null) {
		return innerHeight - margin
	}
	return sheetNavTop - margin
}

export function maxTopForRailHeight(railHeight: number, bounds: ActionSetLayoutBounds): number {
	const margin = bounds.margin
	return Math.max(margin, maxRailBottomY(bounds) - railHeight)
}

export function clampTileTop(top: number, railHeight: number, bounds: ActionSetLayoutBounds): number {
	const margin = bounds.margin
	const maxTop = maxTopForRailHeight(railHeight, bounds)
	return Math.min(Math.max(margin, top), maxTop)
}

export function isAtLowerVerticalLimit(
	top: number,
	railHeight: number,
	bounds: ActionSetLayoutBounds,
	epsilon = 1
): boolean {
	const maxTop = maxTopForRailHeight(railHeight, bounds)
	return top >= maxTop - epsilon
}
