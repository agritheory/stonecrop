import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ACurrencyInput from '../src/components/form/ACurrencyInput.vue'
import AFormLink from '../src/components/form/AFormLink.vue'
import type { AFormLinkValue } from '../src/types'

/*
The currency group is two inputs in one bordered box: the currency picker (an embedded AFormLink)
and the amount. Its text must sit where every other field's text sits, and the picker must be as
wide as what it shows rather than the browser's default input width.
*/

const COMPONENTS = join(__dirname, '..', 'src', 'components')

/** Every declaration of every rule whose selector is exactly `selector`, in one SFC's styles. */
const declared = (sfcPath: string, selector: string): CSSStyleDeclaration[] => {
	const sfc = readFileSync(join(COMPONENTS, sfcPath), 'utf8')
	const style = document.createElement('style')
	style.textContent = Array.from(sfc.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g), match => match[1]).join('\n')
	document.head.appendChild(style)
	const rules = Array.from(style.sheet!.cssRules).filter(
		(rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText === selector
	)
	style.remove()
	expect(rules.length, `no rule "${selector}" in ${sfcPath}`).toBeGreaterThan(0)
	return rules.map(rule => rule.style)
}

const value = (declarations: CSSStyleDeclaration[], property: string): string =>
	declarations.map(declaration => declaration.getPropertyValue(property)).findLast(Boolean) ?? ''

const options = { doctype: 'currency', baseCurrency: { id: 'USD', displayText: 'US Dollar' } }

const prefixInput = (currency: AFormLinkValue) =>
	mount(ACurrencyInput, {
		props: {
			label: 'Total',
			modelValue: { amount: 100, currency, baseAmount: 100, baseCurrency: options.baseCurrency, exchangeRate: 1 },
			options,
		},
	}).find<HTMLInputElement>('.acurrency__currency input[type="text"]')

describe('currency group layout', { tags: ['component'] }, () => {
	it.each([
		['a symbol', { id: 'EUR', displayText: 'Euro', symbol: '€' }, '1'],
		['a name, when the currency has no symbol', { id: 'USD', displayText: 'US Dollar' }, '9'],
		['the placeholder, when no currency is picked', { id: '' }, '8'],
	])('sizes the currency picker to %s', (_, currency, size) => {
		expect(prefixInput(currency).attributes('size')).toBe(size)
	})

	it("leaves a standalone link at the browser's input width", () => {
		const wrapper = mount(AFormLink, { props: { label: 'Customer', modelValue: { id: 'C-1', displayText: 'Acme' } } })
		expect(wrapper.find('input').attributes('size')).toBeUndefined()
	})

	it('gives the embedded picker no room for a label it does not render', () => {
		expect(value(declared('form/AFormLink.vue', '.aform_form-element--embedded'), 'padding-top')).toBe('0px')
	})

	it.each([
		[
			'form/ACurrencyInput.vue',
			'.acurrency__amount',
			['padding-top', 'padding-bottom', 'font-size', 'font-family', 'color'],
		],
		['form/AFormLink.vue', '.aform_input-field--embedded', ['padding-top', 'padding-bottom']],
		['form/ACurrencyInput.vue', '.acurrency__base-field', ['padding-top', 'padding-bottom', 'font-size']],
		[
			'form/AQuantityInput.vue',
			'.aquantity__qty',
			['padding-top', 'padding-bottom', 'font-size', 'font-family', 'color'],
		],
		['form/AQuantityInput.vue', '.aquantity__stock-field', ['padding-top', 'padding-bottom', 'font-size']],
		['form/AQuantityInput.vue', '.aquantity__uom-toggle', ['font-size', 'font-family', 'color']],
		['form/AFormLink.vue', '.aform_form-btn', ['padding-top', 'padding-bottom', 'font-size', 'font-family']],
	])('sets %s %s like every other field', (sfcPath, selector, properties) => {
		const field = declared('AForm.vue', '.aform_input-field')
		const own = declared(sfcPath, selector)
		for (const property of properties) {
			expect({ property, value: value(own, property) }).toEqual({ property, value: value(field, property) })
		}
	})
})

describe('link navigate button', { tags: ['component'] }, () => {
	it('lays out a line of text as the input does, rather than centring its icon in the box', () => {
		const button = declared('form/AFormLink.vue', '.aform_form-btn')
		expect(value(button, 'display')).toBe('block')
		expect(value(button, 'line-height')).toBe('normal')
	})

	it("stands the icon on the text's baseline at capital height", () => {
		const icon = declared('form/AFormLink.vue', '.aform_form-btn-icon')
		expect(value(icon, 'vertical-align')).toBe('baseline')
		expect(value(icon, 'height')).toBe('0.716em')
		expect(value(icon, 'width')).toBe('auto')
	})

	it("crops the drawing to the arrow's ink, stroke included, so capital height is the arrow's height", () => {
		const wrapper = mount(AFormLink, { props: { label: 'Customer', modelValue: { id: 'C-1', displayText: 'Acme' } } })
		expect(wrapper.find('.aform_form-btn-icon').attributes('viewBox')).toBe('1.75 2.75 12.5 10.5')
	})
})
