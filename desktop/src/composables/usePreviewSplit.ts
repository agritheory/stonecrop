import { useResizeObserver } from '@vueuse/core'
import { computed, ref, type Ref } from 'vue'

import { readActionSetLayoutSession, writeActionSetLayoutSession } from '../action-set-layout-session'

export const PREVIEW_DEFAULT_FRACTION = 0.5
export const PREVIEW_MIN_FRACTION = 0.2
export const PREVIEW_MAX_FRACTION = 0.8
/** The narrowest the pane is drawn, and the room it always leaves the page beside it. */
export const PREVIEW_MIN_PX = 320
export const PAGE_MIN_PX = 360
const PREVIEW_KEY_STEP = 0.05

const round = (value: number) => Math.round(value * 1000) / 1000

export function clampPreviewFraction(value: number, min = PREVIEW_MIN_FRACTION, max = PREVIEW_MAX_FRACTION): number {
	return round(Math.min(max, Math.max(min, value)))
}

/**
 * The fractions the pane can actually be drawn at in a workspace this wide: the fixed bounds,
 * narrowed by the pane's and the page's minimum widths. An unmeasured workspace gets the fixed bounds.
 */
export function previewBounds(width: number): { min: number; max: number } {
	if (width <= 0) return { min: PREVIEW_MIN_FRACTION, max: PREVIEW_MAX_FRACTION }
	const min = round(Math.max(PREVIEW_MIN_FRACTION, PREVIEW_MIN_PX / width))
	const max = round(Math.min(PREVIEW_MAX_FRACTION, (width - PAGE_MIN_PX) / width))
	// Too narrow for both minimums: the pane keeps its own, as the CSS clamp does.
	return { min, max: Math.max(min, max) }
}

export function usePreviewSplit(workspace: Ref<HTMLElement | null>) {
	// The width the user chose. What is drawn, reported and stepped from is `fraction`, kept within bounds.
	const preferred = ref(readActionSetLayoutSession().previewFraction ?? PREVIEW_DEFAULT_FRACTION)
	const resizing = ref(false)
	const workspaceWidth = ref(0)

	function measure() {
		workspaceWidth.value = workspace.value?.getBoundingClientRect().width ?? 0
	}
	useResizeObserver(workspace, measure)

	const bounds = computed(() => previewBounds(workspaceWidth.value))
	const fraction = computed(() => clampPreviewFraction(preferred.value, bounds.value.min, bounds.value.max))

	function setFraction(value: number, persist = false) {
		preferred.value = clampPreviewFraction(value, bounds.value.min, bounds.value.max)
		if (persist) {
			writeActionSetLayoutSession({ previewFraction: preferred.value })
		}
	}

	function fractionAt(clientX: number) {
		const rect = workspace.value?.getBoundingClientRect()
		if (!rect || rect.width === 0) return fraction.value
		return (rect.right - clientX) / rect.width
	}

	const onMove = (move: PointerEvent) => setFraction(fractionAt(move.clientX))

	// Ends the drag in progress, keeping or dropping its width. Held so Escape, or the pane closing, can end it.
	let endDrag: ((keep: boolean) => void) | null = null

	function onPointerDown(event: PointerEvent) {
		const handle = event.currentTarget
		if (event.button !== 0 || !(handle instanceof HTMLElement)) return
		event.preventDefault()
		measure()
		handle.setPointerCapture?.(event.pointerId)
		resizing.value = true
		const start = preferred.value

		const onEnd = () => endDrag?.(true)
		endDrag = keep => {
			endDrag = null
			if (handle.hasPointerCapture?.(event.pointerId)) handle.releasePointerCapture(event.pointerId)
			handle.removeEventListener('pointermove', onMove)
			handle.removeEventListener('pointerup', onEnd)
			handle.removeEventListener('pointercancel', onEnd)
			handle.removeEventListener('lostpointercapture', onEnd)
			resizing.value = false
			setFraction(keep ? preferred.value : start, keep)
		}
		handle.addEventListener('pointermove', onMove)
		handle.addEventListener('pointerup', onEnd)
		handle.addEventListener('pointercancel', onEnd)
		handle.addEventListener('lostpointercapture', onEnd)
	}

	/** Abandons a drag in progress, if any, putting the width back where the drag started. */
	function cancel() {
		endDrag?.(false)
	}

	function onKeydown(event: KeyboardEvent) {
		measure()
		const next = {
			ArrowLeft: fraction.value + PREVIEW_KEY_STEP,
			ArrowRight: fraction.value - PREVIEW_KEY_STEP,
			Home: bounds.value.max,
			End: bounds.value.min,
		}[event.key]
		if (next === undefined) return
		event.preventDefault()
		setFraction(next, true)
	}

	function reset() {
		setFraction(PREVIEW_DEFAULT_FRACTION, true)
	}

	const previewStyle = computed(() => ({
		flexBasis: `clamp(${PREVIEW_MIN_PX}px, ${(fraction.value * 100).toFixed(2)}%, calc(100% - ${PAGE_MIN_PX}px))`,
	}))

	return { fraction, bounds, resizing, previewStyle, onPointerDown, onKeydown, reset, cancel }
}
