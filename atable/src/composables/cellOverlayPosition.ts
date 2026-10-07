import type { StyleValue } from 'vue'

/** Container that {@link ATableModal} overlays position against. */
export function cellOverlayContainer(cell: HTMLElement): HTMLElement | null {
	const container = cell.closest('.atable-container') ?? cell.closest('table')
	return container instanceof HTMLElement ? container : null
}

export type CellOverlayPositionInput = {
	cell: HTMLElement
	overlayWidth: number
	/** Minimum overlay width; {@link ATableModal} sets this to the anchor cell width. */
	minWidth?: number
}

/**
 * Positions a sibling overlay below the active cell, aligned to its left edge,
 * clamped to the table container width — same rules as {@link ATableModal}.
 */
export function computeCellOverlayStyle(input: CellOverlayPositionInput): StyleValue {
	const container = cellOverlayContainer(input.cell)
	if (!container) return {}

	const cellRect = input.cell.getBoundingClientRect()
	const containerRect = container.getBoundingClientRect()
	const top = cellRect.bottom - containerRect.top

	let left = cellRect.left - containerRect.left
	const maxWidth = container.clientWidth || containerRect.width
	if (input.overlayWidth && left + input.overlayWidth > maxWidth) {
		left = Math.max(0, maxWidth - input.overlayWidth)
	}

	const style: Record<string, string> = {
		left: `${left}px`,
		top: `${top}px`,
	}
	if (input.minWidth !== undefined) {
		style.minWidth = `${input.minWidth}px`
	}
	return style
}
