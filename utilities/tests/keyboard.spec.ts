import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { defaultKeypressHandlers, useKeyboardNav } from '../src'

// jsdom reports offsetHeight as 0 for every element, which `isVisible` treats as hidden.
// Stub a non-zero height so visibility is governed by the (zero-rect, in-viewport) bounding box.
let offsetHeightSpy: PropertyDescriptor | undefined
beforeAll(() => {
	offsetHeightSpy = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
	Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
		configurable: true,
		get: () => 24,
	})
})
afterAll(() => {
	if (offsetHeightSpy) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', offsetHeightSpy)
})

/** Build a 3×3 table of focusable cells; returns the tbody's cells indexed [row][col]. */
function buildTable(): HTMLElement[][] {
	document.body.innerHTML = `
		<div id="nav-parent">
			<table>
				<tbody>
					<tr><td tabindex="0">r0c0</td><td tabindex="0">r0c1</td><td tabindex="0">r0c2</td></tr>
					<tr><td tabindex="0">r1c0</td><td tabindex="0">r1c1</td><td tabindex="0">r1c2</td></tr>
					<tr><td tabindex="0">r2c0</td><td tabindex="0">r2c1</td><td tabindex="0">r2c2</td></tr>
				</tbody>
			</table>
		</div>`
	return Array.from(document.querySelectorAll('tr')).map($row => Array.from($row.children) as HTMLElement[])
}

/** Dispatch a keydown on `el` (setting event.target) and return the event for direct handler calls. */
function keydownOn(el: HTMLElement, init: KeyboardEventInit = {}): KeyboardEvent {
	const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
	el.dispatchEvent(event)
	return event
}

describe('defaultKeypressHandlers', { tags: ['component'] }, () => {
	let cells: HTMLElement[][]
	beforeEach(() => {
		cells = buildTable()
	})

	it('moves focus down a column on keydown.down', () => {
		const event = keydownOn(cells[0][1])
		defaultKeypressHandlers['keydown.down'](event)
		expect(document.activeElement).toBe(cells[1][1])
		expect(event.defaultPrevented).toBe(true)
	})

	it('moves focus up a column on keydown.up', () => {
		const event = keydownOn(cells[2][2])
		defaultKeypressHandlers['keydown.up'](event)
		expect(document.activeElement).toBe(cells[1][2])
	})

	it('does nothing on keydown.down from the last row', () => {
		cells[0][0].focus()
		const event = keydownOn(cells[2][0])
		defaultKeypressHandlers['keydown.down'](event)
		expect(document.activeElement).toBe(cells[0][0])
		expect(event.defaultPrevented).toBe(false)
	})

	it('moves focus right and wraps to the next row from the last cell', () => {
		defaultKeypressHandlers['keydown.right'](keydownOn(cells[0][0]))
		expect(document.activeElement).toBe(cells[0][1])

		// wrap: last cell of row 0 → first cell of row 1
		defaultKeypressHandlers['keydown.right'](keydownOn(cells[0][2]))
		expect(document.activeElement).toBe(cells[1][0])
	})

	it('moves focus left and wraps to the previous row from the first cell', () => {
		defaultKeypressHandlers['keydown.left'](keydownOn(cells[1][1]))
		expect(document.activeElement).toBe(cells[1][0])

		// wrap: first cell of row 1 → last cell of row 0
		defaultKeypressHandlers['keydown.left'](keydownOn(cells[1][0]))
		expect(document.activeElement).toBe(cells[0][2])
	})

	it('always prevents default for left/right so the cell does not enter edit mode', () => {
		// first cell of first row: no previous cell exists, but default is still prevented
		const event = keydownOn(cells[0][0])
		defaultKeypressHandlers['keydown.left'](event)
		expect(event.defaultPrevented).toBe(true)
	})

	it('jumps to the top/bottom of a column on keydown.control.up/down', () => {
		defaultKeypressHandlers['keydown.control.up'](keydownOn(cells[2][1], { ctrlKey: true }))
		expect(document.activeElement).toBe(cells[0][1])

		defaultKeypressHandlers['keydown.control.down'](keydownOn(cells[0][1], { ctrlKey: true }))
		expect(document.activeElement).toBe(cells[2][1])
	})

	it('jumps to the first/last cell of a row on keydown.home/end', () => {
		defaultKeypressHandlers['keydown.home'](keydownOn(cells[1][2]))
		expect(document.activeElement).toBe(cells[1][0])

		defaultKeypressHandlers['keydown.end'](keydownOn(cells[1][0]))
		expect(document.activeElement).toBe(cells[1][2])
	})

	it('moves down on enter and up on shift+enter within a table cell', () => {
		defaultKeypressHandlers['keydown.enter'](keydownOn(cells[0][0]))
		expect(document.activeElement).toBe(cells[1][0])

		defaultKeypressHandlers['keydown.shift.enter'](keydownOn(cells[1][0], { shiftKey: true }))
		expect(document.activeElement).toBe(cells[0][0])
	})

	it('ignores enter outside a table cell', () => {
		cells[0][0].focus()
		const $div = document.createElement('div')
		$div.tabIndex = 0
		document.body.appendChild($div)
		defaultKeypressHandlers['keydown.enter'](keydownOn($div))
		expect(document.activeElement).toBe(cells[0][0])
	})

	it('moves to the next/previous cell on tab/shift+tab', () => {
		defaultKeypressHandlers['keydown.tab'](keydownOn(cells[0][0]))
		expect(document.activeElement).toBe(cells[0][1])

		defaultKeypressHandlers['keydown.shift.tab'](keydownOn(cells[0][1], { shiftKey: true }))
		expect(document.activeElement).toBe(cells[0][0])
	})

	it('skips unfocusable cells when navigating', () => {
		// make the middle row unfocusable; down from row 0 should land on row 2
		for (const $cell of cells[1]) $cell.tabIndex = -1
		defaultKeypressHandlers['keydown.down'](keydownOn(cells[0][0]))
		expect(document.activeElement).toBe(cells[2][0])
	})

	it('navigates between whole rows when the target is a focusable <tr>', () => {
		const $rows = Array.from(document.querySelectorAll('tr')) as HTMLElement[]
		for (const $row of $rows) $row.tabIndex = 0

		defaultKeypressHandlers['keydown.down'](keydownOn($rows[0]))
		expect(document.activeElement).toBe($rows[1])

		defaultKeypressHandlers['keydown.up'](keydownOn($rows[1]))
		expect(document.activeElement).toBe($rows[0])

		defaultKeypressHandlers['keydown.control.down'](keydownOn($rows[0], { ctrlKey: true }))
		expect(document.activeElement).toBe($rows[2])

		defaultKeypressHandlers['keydown.control.up'](keydownOn($rows[2], { ctrlKey: true }))
		expect(document.activeElement).toBe($rows[0])
	})

	it('ignores events whose target is not an element', () => {
		cells[0][0].focus()
		const event = new KeyboardEvent('keydown', { cancelable: true })
		document.dispatchEvent(event) // target = document, not an HTMLElement
		defaultKeypressHandlers['keydown.down'](event)
		expect(document.activeElement).toBe(cells[0][0])
	})
})

function mountWithNav(options?: Parameters<typeof useKeyboardNav>[0]) {
	const Host = defineComponent({
		setup() {
			useKeyboardNav(options ?? [{ parent: '#nav-parent' }])
			return () => h('div')
		},
	})
	return mount(Host, { attachTo: document.body })
}

describe('useKeyboardNav', { tags: ['component'] }, () => {
	it('attaches navigation to a parent selector once focus is within it', async () => {
		const cells = buildTable()
		const wrapper = mountWithNav()
		await nextTick()

		cells[0][0].focus()
		await nextTick()

		keydownOn(cells[0][0], { key: 'ArrowDown' })
		expect(document.activeElement).toBe(cells[1][0])
		wrapper.unmount()
	})

	it('stops handling keys after focus leaves the parent', async () => {
		const cells = buildTable()
		const $outside = document.createElement('input')
		document.body.appendChild($outside)
		const wrapper = mountWithNav()
		await nextTick()

		cells[0][0].focus()
		await nextTick()
		$outside.focus()
		await nextTick()

		// listener is removed, so dispatching on a cell no longer navigates
		keydownOn(cells[0][0], { key: 'ArrowDown' })
		expect(document.activeElement).toBe($outside)
		wrapper.unmount()
	})

	it('supports custom handlers with exact modifier matching', async () => {
		const cells = buildTable()
		const plain = vi.fn()
		const withControl = vi.fn()
		const wrapper = mountWithNav([
			{ parent: '#nav-parent', handlers: { 'keydown.x': plain, 'keydown.control.y': withControl } },
		])
		await nextTick()
		cells[0][0].focus()
		await nextTick()

		keydownOn(cells[0][0], { key: 'x' })
		expect(plain).toHaveBeenCalledTimes(1)

		// modifier held → the modifier-less handler must NOT fire
		keydownOn(cells[0][0], { key: 'x', ctrlKey: true })
		expect(plain).toHaveBeenCalledTimes(1)

		// modifier handler fires only with its modifier held
		keydownOn(cells[0][0], { key: 'y' })
		expect(withControl).not.toHaveBeenCalled()
		keydownOn(cells[0][0], { key: 'y', ctrlKey: true })
		expect(withControl).toHaveBeenCalledTimes(1)
		wrapper.unmount()
	})

	it('accepts explicit element selectors instead of a parent', async () => {
		const cells = buildTable()
		const wrapper = mountWithNav([{ selectors: cells.flat() }])
		await nextTick()

		cells[1][1].focus()
		await nextTick()
		keydownOn(cells[1][1], { key: 'ArrowUp' })
		expect(document.activeElement).toBe(cells[0][1])
		wrapper.unmount()
	})

	it('resolves string selectors against the document', async () => {
		const cells = buildTable()
		const wrapper = mountWithNav([{ selectors: 'td' }])
		await nextTick()

		cells[2][2].focus()
		await nextTick()
		keydownOn(cells[2][2], { key: 'ArrowLeft' })
		expect(document.activeElement).toBe(cells[2][1])
		wrapper.unmount()
	})

	it('resolves string selectors within a parent element', async () => {
		const cells = buildTable()
		const $parent = document.querySelector('#nav-parent') as HTMLElement
		const wrapper = mountWithNav([{ parent: $parent, selectors: 'td' }])
		await nextTick()

		cells[0][1].focus()
		await nextTick()
		keydownOn(cells[0][1], { key: 'ArrowRight' })
		expect(document.activeElement).toBe(cells[0][2])
		wrapper.unmount()
	})

	it('accepts a ref of elements as selectors', async () => {
		const cells = buildTable()
		const selectorRef = ref(cells.flat())
		const wrapper = mountWithNav([{ selectors: selectorRef }])
		await nextTick()

		cells[1][0].focus()
		await nextTick()
		keydownOn(cells[1][0], { key: 'ArrowDown' })
		expect(document.activeElement).toBe(cells[2][0])
		wrapper.unmount()
	})

	it('accepts a parent ref and ignores non-keydown handler keys', async () => {
		const cells = buildTable()
		const $parent = document.querySelector('#nav-parent') as HTMLElement
		const keyup = vi.fn()
		const wrapper = mountWithNav([{ parent: ref($parent), handlers: { 'keyup.x': keyup } }])
		await nextTick()

		cells[0][0].focus()
		await nextTick()
		keydownOn(cells[0][0], { key: 'x' })
		expect(keyup).not.toHaveBeenCalled() // non-keydown handler entries are skipped
		wrapper.unmount()
	})
})
