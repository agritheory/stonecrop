import {
	type ConfigurableWindow,
	type MaybeComputedElementRef,
	type MaybeRefOrGetter,
	defaultWindow,
	unrefElement,
	useEventListener,
} from '@vueuse/core'
import { ref, watch } from 'vue'

export interface UseElementVisibilityOptions extends ConfigurableWindow {
	scrollTarget?: MaybeRefOrGetter<HTMLElement | undefined | null>
}

/**
 * Tracks the visibility of an element within the viewport.
 *
 * Compatibility version to get Stonecrop keyboard navigation to work. This function is a copy of the
 * `useElementVisibility` function from VueUse v9.13.0, with the `IntersectionObserver` API removed.
 *
 * This version uses the `getBoundingClientRect` method to determine if an element is visible
 * in the viewport. This is less performant than the `IntersectionObserver` API, but it is
 * more compatible.
 *
 * Note: the newer versions of the VueUse dependencies imported here are sufficient for this composable.
 * (Last verified: v10.9.0 on May 2, 2024)
 *
 * @see https://v9-13-0.vueuse.org/core/useElementVisibility
 * @param element
 * @param options
 */
export function useElementVisibility(
	element: MaybeComputedElementRef,
	{ window = defaultWindow, scrollTarget }: UseElementVisibilityOptions = {}
) {
	const elementIsVisible = ref(false)

	const testBounding = () => {
		if (!window) return

		const document = window.document
		const el = unrefElement(element)
		if (!el) {
			elementIsVisible.value = false
		} else {
			const rect = el.getBoundingClientRect()
			elementIsVisible.value =
				rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
				rect.bottom >= 0 &&
				rect.right >= 0
		}
	}

	watch(
		() => unrefElement(element),
		() => testBounding(),
		{ immediate: true, flush: 'post' }
	)

	if (window) {
		useEventListener(scrollTarget || window, 'scroll', testBounding, {
			capture: false,
			passive: true,
		})
	}

	return elementIsVisible
}
