import { afterEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

import AForm from '../src/components/AForm.vue'
import ACurrencyInput from '../src/components/form/ACurrencyInput.vue'
import ADropdown from '../src/components/form/ADropdown.vue'
import AFormLink from '../src/components/form/AFormLink.vue'
import AQuantityInput from '../src/components/form/AQuantityInput.vue'
import type { ResolvedField } from '../src/types'

let wrapper: VueWrapper | undefined

const startingViewport = { width: window.innerWidth, height: window.innerHeight }

afterEach(async () => {
	wrapper?.unmount()
	document.documentElement.removeAttribute('style')
	document.body.removeAttribute('style')
	window.scrollTo(0, 0)
	if (window.innerHeight !== startingViewport.height) {
		await page.viewport(startingViewport.width, startingViewport.height)
	}
})

// The borders take their colour from these tokens; unset, a border is not drawn and has no width.
const borderTokens = '--sc-input-border-color: gray; --sc-input-active-border-color: black'

// Inside a form, as every field is used: AForm's own sheet is what lifts each label out of its row.
// `spaceAbove` pushes the form down the window, for a field near the window's bottom.
const mountInForm = (component: string, props: Record<string, unknown>, spaceAbove = 0) => {
	const field = { kind: 'field', fieldname: 'value', label: 'Value', component, ...props } as ResolvedField
	const Host = defineComponent({
		setup: () => () =>
			h('div', { style: `width: 800px; ${borderTokens}` }, [
				h('div', { style: `height: ${spaceAbove}px` }),
				h(AForm, { schema: [field], data: {} }),
			]),
	})
	wrapper = mount(Host, {
		attachTo: document.body,
		global: { components: { ACurrencyInput, ADropdown, AFormLink, AQuantityInput } },
	})
}

const edges = (selector: string) => document.querySelector(selector)!.getBoundingClientRect()

const currencies = () => [
	{ id: 'EUR', displayText: 'Euro' },
	{ id: 'JPY', displayText: 'Yen' },
]

const openQuantityMenu = async () => {
	mountInForm('AQuantityInput', { options: { uoms: ['Nos', 'Box'], stockUom: 'Nos' } })
	document.querySelector<HTMLButtonElement>('.aform_dropdown-button')!.click()
	await nextTick()
	return '.autocomplete-results'
}

const focusAndWait = async (selector: string) => {
	document.querySelector<HTMLInputElement>(selector)!.dispatchEvent(new FocusEvent('focus'))
	await nextTick()
	await nextTick()
}

const openCurrencyList = async () => {
	mountInForm('ACurrencyInput', { options: { filterFunction: currencies } })
	await focusAndWait('.acurrency__currency input')
	return '.acurrency__currency .autocomplete-results'
}

const openLinkList = async () => {
	mountInForm('AFormLink', { filterFunction: () => [{ id: 1, displayText: 'Liberty' }] })
	await focusAndWait('input[role="combobox"]')
	return '.autocomplete-results'
}

const openDropdownList = async () => {
	mountInForm('ADropdown', { options: ['Open', 'Closed'] })
	await focusAndWait('input')
	return '.autocomplete-results'
}

// Needs real layout and the real cascade: what is measured is where the browser draws each list.
describe('an open dropdown list', { tags: ['component'] }, () => {
	it('under the quantity field, spans the full merged qty+uom group', async () => {
		const menu = edges(await openQuantityMenu())

		expect(menu.left).toBeCloseTo(edges('.aquantity__group').left, 0)
		expect(menu.right).toBeCloseTo(edges('.aquantity__group').right, 0)
	})

	it('under the currency picker, spans the full merged amount+currency group', async () => {
		const list = edges(await openCurrencyList())

		expect(list.left).toBeCloseTo(edges('.acurrency__group').left, 0)
		expect(list.right).toBeCloseTo(edges('.acurrency__group').right, 0)
	})

	it.each([
		['the quantity field’s unit menu', openQuantityMenu],
		['the currency picker’s list', openCurrencyList],
		['the link field’s list', openLinkList],
		['the plain dropdown’s list', openDropdownList],
	])('%s takes the colour and shadow a host sets for overlays', async (_, open) => {
		document.documentElement.style.cssText =
			'--sc-overlay-background: rgb(1, 2, 3); --sc-overlay-shadow: rgb(4, 5, 6) 0px 0px 7px 0px'

		const style = getComputedStyle(document.querySelector(await open())!)

		expect(style.display).not.toBe('none')
		expect(style.backgroundColor).toBe('rgb(1, 2, 3)')
		expect(style.boxShadow).toBe('rgb(4, 5, 6) 0px 0px 7px 0px')
	})

	it('highlights the keyboard-active option from host tokens', async () => {
		document.documentElement.style.cssText = '--sc-dropdown-option-hover-background: rgb(7, 8, 9)'

		await openQuantityMenu()
		const option = document.querySelector<HTMLElement>('.autocomplete-result')!
		option.classList.add('is-active')

		expect(getComputedStyle(option).backgroundColor).toBe('rgb(7, 8, 9)')
	})
})

// As long as a real host's: every link field in FAB lists up to 200 records before anything is typed.
const records = () => Array.from({ length: 200 }, (_, index) => ({ id: index + 1, displayText: `Record ${index + 1}` }))
const currencyList = () =>
	Array.from({ length: 200 }, (_, index) => ({ id: `C${index}`, displayText: `Currency ${index}` }))
const units = Array.from({ length: 60 }, (_, index) => `Unit ${index + 1}`)

type LongList = { list: string; keys: string }

const openLongUnitMenu = async (spaceAbove = 0): Promise<LongList> => {
	mountInForm('AQuantityInput', { options: { uoms: units, stockUom: 'Unit 1' } }, spaceAbove)
	document.querySelector<HTMLButtonElement>('.aform_dropdown-button')!.click()
	await nextTick()
	return { list: '.autocomplete-results', keys: '.aform_dropdown-button' }
}

const openLongCurrencyList = async (spaceAbove = 0): Promise<LongList> => {
	mountInForm('ACurrencyInput', { options: { filterFunction: currencyList } }, spaceAbove)
	await focusAndWait('.acurrency__currency input')
	return { list: '.acurrency__currency .autocomplete-results', keys: '.acurrency__currency input' }
}

const openLongLinkList = async (spaceAbove = 0): Promise<LongList> => {
	mountInForm('AFormLink', { filterFunction: records }, spaceAbove)
	await focusAndWait('input[role="combobox"]')
	return { list: '.autocomplete-results', keys: 'input[role="combobox"]' }
}

const openLongDropdownList = async (spaceAbove = 0): Promise<LongList> => {
	mountInForm('ADropdown', { options: records().map(record => record.displayText) }, spaceAbove)
	await focusAndWait('input')
	return { list: '.autocomplete-results', keys: 'input' }
}

const longLists = [
	['the quantity field’s unit menu', openLongUnitMenu],
	['the currency picker’s list', openLongCurrencyList],
	['the link field’s list', openLongLinkList],
	['the plain dropdown’s list', openLongDropdownList],
] as const

const settle = async () => {
	await nextTick()
	await new Promise(requestAnimationFrame)
}

const box = (selector: string) => document.querySelector<HTMLElement>(selector)!

describe('a long dropdown list', { tags: ['component'] }, () => {
	it.each(longLists)('%s stops at the height a host sets, and scrolls inside', async (_, open) => {
		document.documentElement.style.cssText = '--sc-dropdown-max-height: 150px'
		const { list } = await open()
		await settle()

		expect(box(list).getBoundingClientRect().height).toBeCloseTo(150, 0)
		expect(box(list).scrollHeight).toBeGreaterThan(box(list).clientHeight)
	})

	it.each(longLists)('%s near the window’s bottom, shrinks to the room left below it', async (_, open) => {
		document.documentElement.style.cssText = '--sc-dropdown-max-height: 17rem'
		const { list } = await open(window.innerHeight - 220)
		await settle()
		const listEdges = box(list).getBoundingClientRect()

		// Down to 8 px above the window's bottom: shorter than its limit, and no shorter than the room allows.
		expect(listEdges.bottom).toBeLessThanOrEqual(window.innerHeight - 8)
		expect(listEdges.bottom).toBeGreaterThan(window.innerHeight - 10)
		expect(listEdges.height).toBeLessThan(272)
	})

	it.each(longLists)('%s with less than four rows of room below, still shows about four', async (_, open) => {
		document.documentElement.style.cssText = '--sc-dropdown-max-height: 17rem'
		const { list } = await open(window.innerHeight - 90)
		await settle()
		const row = box(list).querySelector('[role="option"]')!.getBoundingClientRect().height
		const height = box(list).getBoundingClientRect().height

		expect(height).toBeGreaterThanOrEqual(3.5 * row)
		expect(height).toBeLessThan(5 * row)
	})

	it.each(longLists)('%s grows back to its limit when the page scrolls its field up', async (_, open) => {
		document.documentElement.style.cssText = '--sc-dropdown-max-height: 17rem'
		document.body.style.paddingBottom = `${2 * window.innerHeight}px`
		const { list } = await open(window.innerHeight - 60)
		await settle()
		window.scrollTo(0, window.innerHeight - 160)
		await settle()

		expect(box(list).getBoundingClientRect().height).toBeCloseTo(272, 0)
	})

	it.each(longLists)('%s shrinks to fit when the window gets shorter', async (_, open) => {
		document.documentElement.style.cssText = '--sc-dropdown-max-height: 17rem'
		const { list } = await open(window.innerHeight - 420)
		await settle()
		await page.viewport(window.innerWidth, window.innerHeight - 200)
		await settle()
		const listEdges = box(list).getBoundingClientRect()

		expect(listEdges.bottom).toBeLessThanOrEqual(window.innerHeight - 8)
		expect(listEdges.bottom).toBeGreaterThan(window.innerHeight - 10)
	})

	it.each(longLists)('%s keeps the highlighted option in sight as the arrow keys move it', async (_, open) => {
		document.documentElement.style.cssText = '--sc-dropdown-max-height: 17rem'
		const { list, keys } = await open()
		await settle()
		for (let press = 0; press < 45; press++) {
			box(keys).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
		}
		await settle()
		const listEdges = box(list).getBoundingClientRect()
		const active = box(`${list} .is-active`).getBoundingClientRect()

		expect(active.top).toBeGreaterThanOrEqual(listEdges.top - 1)
		expect(active.bottom).toBeLessThanOrEqual(Math.min(listEdges.bottom, window.innerHeight) + 1)
	})
})
