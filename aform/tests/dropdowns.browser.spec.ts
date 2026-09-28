import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

import AForm from '../src/components/AForm.vue'
import ACurrencyInput from '../src/components/form/ACurrencyInput.vue'
import ADropdown from '../src/components/form/ADropdown.vue'
import AFormLink from '../src/components/form/AFormLink.vue'
import AQuantityInput from '../src/components/form/AQuantityInput.vue'
import type { ResolvedField } from '../src/types'

let wrapper: VueWrapper | undefined

afterEach(() => {
	wrapper?.unmount()
	document.documentElement.removeAttribute('style')
})

// The borders take their colour from these tokens; unset, a border is not drawn and has no width.
const borderTokens = '--sc-input-border-color: gray; --sc-input-active-border-color: black'

// Inside a form, as every field is used: AForm's own sheet is what lifts each label out of its row.
const mountInForm = (component: string, props: Record<string, unknown>) => {
	const field = { kind: 'field', fieldname: 'value', label: 'Value', component, ...props } as ResolvedField
	const Host = defineComponent({
		setup: () => () => h('div', { style: `width: 800px; ${borderTokens}` }, [h(AForm, { schema: [field], data: {} })]),
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
	document.querySelector<HTMLButtonElement>('.aquantity__uom-toggle')!.click()
	await nextTick()
	return '.aquantity__uom-menu'
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
	it('under the quantity field, runs from the divider beside the unit to the field’s outer border', async () => {
		const menu = edges(await openQuantityMenu())

		expect(menu.left).toBeCloseTo(edges('.aquantity__uom').left, 0)
		expect(menu.right).toBeCloseTo(edges('.aquantity__group').right, 0)
	})

	it('under the currency picker, runs from the field’s outer border to the divider beside the picker', async () => {
		const list = edges(await openCurrencyList())

		expect(list.left).toBeCloseTo(edges('.acurrency__group').left, 0)
		expect(list.right).toBeCloseTo(edges('.acurrency__currency').right, 0)
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
})
