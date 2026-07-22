import { describe, it, expect, vi, afterEach } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import { useElementVisibility } from '../src/composables/visibility'

function makeElement(): HTMLElement {
	const $el = document.createElement('div')
	document.body.appendChild($el)
	return $el
}

function mockRect($el: HTMLElement, rect: Partial<DOMRect>) {
	vi.spyOn($el, 'getBoundingClientRect').mockReturnValue({
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		width: 0,
		height: 0,
		x: 0,
		y: 0,
		toJSON: () => ({}),
		...rect,
	} as DOMRect)
}

describe('useElementVisibility', { tags: ['component'] }, () => {
	afterEach(() => {
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	it('reports an in-viewport element as visible', async () => {
		const $el = makeElement()
		const scope = effectScope()
		const visible = scope.run(() => useElementVisibility(ref($el)))!
		await nextTick()
		expect(visible.value).toBe(true)
		scope.stop()
	})

	it('reports a missing element as not visible', async () => {
		const scope = effectScope()
		const visible = scope.run(() => useElementVisibility(ref(null)))!
		await nextTick()
		expect(visible.value).toBe(false)
		scope.stop()
	})

	it('reports an element scrolled out of the viewport as not visible', async () => {
		const $el = makeElement()
		mockRect($el, { top: 5000, bottom: 5040, right: 100 })
		const scope = effectScope()
		const visible = scope.run(() => useElementVisibility(ref($el)))!
		await nextTick()
		expect(visible.value).toBe(false)
		scope.stop()
	})

	it('recomputes visibility on window scroll', async () => {
		const $el = makeElement()
		mockRect($el, { top: 5000, bottom: 5040, right: 100 })
		const scope = effectScope()
		const visible = scope.run(() => useElementVisibility(ref($el)))!
		await nextTick()
		expect(visible.value).toBe(false)

		// element scrolls into view
		mockRect($el, { top: 10, bottom: 50, right: 100 })
		window.dispatchEvent(new Event('scroll'))
		await nextTick()
		expect(visible.value).toBe(true)
		scope.stop()
	})

	it('listens on a custom scrollTarget instead of the window', async () => {
		const $container = makeElement()
		const $el = makeElement()
		mockRect($el, { top: 5000, bottom: 5040, right: 100 })

		const scope = effectScope()
		const visible = scope.run(() => useElementVisibility(ref($el), { scrollTarget: ref($container) }))!
		await nextTick()
		expect(visible.value).toBe(false)

		mockRect($el, { top: 10, bottom: 50, right: 100 })
		$container.dispatchEvent(new Event('scroll'))
		await nextTick()
		expect(visible.value).toBe(true)
		scope.stop()
	})

	it('stays not visible when no window is available (SSR guard)', async () => {
		const $el = makeElement()
		const scope = effectScope()
		// `undefined` would trigger the `window = defaultWindow` destructuring default, so force the
		// no-window branch with `null` — defaults only apply to undefined.
		const visible = scope.run(() => useElementVisibility(ref($el), { window: null as unknown as Window }))!
		await nextTick()
		expect(visible.value).toBe(false)
		scope.stop()
	})
})
