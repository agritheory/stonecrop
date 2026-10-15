import { computed, ref, type Ref } from 'vue'

import { readActionSetLayoutSession, writeActionSetLayoutSession } from '../action-set-layout-session'

export const PREVIEW_DEFAULT_FRACTION = 0.5
export const PREVIEW_MIN_FRACTION = 0.2
export const PREVIEW_MAX_FRACTION = 0.8
const PREVIEW_KEY_STEP = 0.05

export function clampPreviewFraction(value: number): number {
	return Math.round(Math.min(PREVIEW_MAX_FRACTION, Math.max(PREVIEW_MIN_FRACTION, value)) * 1000) / 1000
}

export function usePreviewSplit(workspace: Ref<HTMLElement | null>) {
	const fraction = ref(readActionSetLayoutSession().previewFraction ?? PREVIEW_DEFAULT_FRACTION)
	const resizing = ref(false)

	function setFraction(value: number, persist = false) {
		fraction.value = clampPreviewFraction(value)
		if (persist) {
			writeActionSetLayoutSession({ previewFraction: fraction.value })
		}
	}

	function fractionAt(clientX: number) {
		const rect = workspace.value?.getBoundingClientRect()
		if (!rect || rect.width === 0) return fraction.value
		return (rect.right - clientX) / rect.width
	}

	function onPointerDown(event: PointerEvent) {
		const handle = event.currentTarget
		if (event.button !== 0 || !(handle instanceof HTMLElement)) return
		event.preventDefault()
		handle.setPointerCapture?.(event.pointerId)
		resizing.value = true

		const onMove = (move: PointerEvent) => setFraction(fractionAt(move.clientX))
		const onEnd = (end: PointerEvent) => {
			handle.releasePointerCapture?.(end.pointerId)
			handle.removeEventListener('pointermove', onMove)
			handle.removeEventListener('pointerup', onEnd)
			handle.removeEventListener('pointercancel', onEnd)
			resizing.value = false
			setFraction(fraction.value, true)
		}
		handle.addEventListener('pointermove', onMove)
		handle.addEventListener('pointerup', onEnd)
		handle.addEventListener('pointercancel', onEnd)
	}

	function onKeydown(event: KeyboardEvent) {
		const next = {
			ArrowLeft: fraction.value + PREVIEW_KEY_STEP,
			ArrowRight: fraction.value - PREVIEW_KEY_STEP,
			Home: PREVIEW_MAX_FRACTION,
			End: PREVIEW_MIN_FRACTION,
		}[event.key]
		if (next === undefined) return
		event.preventDefault()
		setFraction(next, true)
	}

	function reset() {
		setFraction(PREVIEW_DEFAULT_FRACTION, true)
	}

	const previewStyle = computed(() => ({
		flexBasis: `clamp(320px, ${(fraction.value * 100).toFixed(2)}%, calc(100% - 360px))`,
	}))

	return { fraction, resizing, previewStyle, onPointerDown, onKeydown, reset }
}
