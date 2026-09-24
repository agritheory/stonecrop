import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import AForm from '../src/components/AForm.vue'
import ACheckbox from '../src/components/form/ACheckbox.vue'
import ACurrencyInput from '../src/components/form/ACurrencyInput.vue'
import ADate from '../src/components/form/ADate.vue'
import ADateRange from '../src/components/form/ADateRange.vue'
import ADateTime from '../src/components/form/ADateTime.vue'
import ADropdown from '../src/components/form/ADropdown.vue'
import AFormLink from '../src/components/form/AFormLink.vue'
import ANumericInput from '../src/components/form/ANumericInput.vue'
import AQuantityInput from '../src/components/form/AQuantityInput.vue'
import ASegmentedControl from '../src/components/form/ASegmentedControl.vue'
import ATextboxInput from '../src/components/form/ATextboxInput.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import Login from '../src/components/utilities/Login.vue'
import type { ResolvedField } from '../src/types'

/*
A floating label or field error straddles its field's top border. Above the border it paints the
form colour, which masks the border behind the text; below it paints nothing, so whatever the field
shows there (its own background, a disabled or hovered state, a segment, a unit picker) shows
through. A colour painted below the border can match only one of those surfaces.
*/

const FORM_ABOVE_THE_BORDER = 'linear-gradient(var(--sc-form-background) calc(50% + 1px), transparent calc(50% + 1px))'

const SRC = join(__dirname, '..', 'src')

const globalStyles = (): string => {
	const sfc = readFileSync(join(SRC, 'components', 'AForm.vue'), 'utf8')
	const blocks = Array.from(sfc.matchAll(/<style>([\s\S]*?)<\/style>/g), match => match[1])
	expect(blocks).toHaveLength(1)
	return blocks[0]
}

const collect = (dir: string, out: string[] = []): string[] => {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry)
		if (statSync(path).isDirectory()) collect(path, out)
		else if (/\.(vue|css)$/.test(entry)) out.push(path)
	}
	return out
}

const styleRules = (css: string): CSSStyleRule[] => {
	const style = document.createElement('style')
	style.textContent = css
	document.head.appendChild(style)
	const flatten = (rules: CSSRuleList): CSSStyleRule[] =>
		Array.from(rules).flatMap(rule =>
			rule instanceof CSSStyleRule ? [rule] : 'cssRules' in rule ? flatten((rule as CSSGroupingRule).cssRules) : []
		)
	const rules = flatten(style.sheet!.cssRules)
	style.remove()
	return rules
}

const schemaField = (component: string, fieldname: string, extra: Record<string, unknown> = {}) =>
	({ kind: 'field', component, fieldname, label: fieldname, ...extra }) as ResolvedField

const schema = [
	schemaField('ATextInput', 'name'),
	schemaField('ANumericInput', 'count'),
	schemaField('ATextboxInput', 'notes'),
	schemaField('ADate', 'day'),
	schemaField('ADateRange', 'window'),
	schemaField('ADateTime', 'at'),
	schemaField('ACheckbox', 'paid'),
	schemaField('ADropdown', 'status', { options: ['Draft', 'Closed'] }),
	schemaField('AFormLink', 'customer', { doctype: 'customer' }),
	schemaField('ACurrencyInput', 'total', { options: { baseCurrency: { id: 'USD' } } }),
	schemaField('AQuantityInput', 'quantity', { options: { uoms: ['Nos'], stockUom: 'Nos' } }),
	schemaField('ASegmentedControl', 'priority', { options: ['Low', 'High'] }),
]

const components = {
	ACheckbox,
	ACurrencyInput,
	ADate,
	ADateRange,
	ADateTime,
	ADropdown,
	AFormLink,
	ANumericInput,
	AQuantityInput,
	ASegmentedControl,
	ATextboxInput,
	ATextInput,
}

const errors = Object.fromEntries(schema.map(field => [field.fieldname, ['Required']]))

/**
 * Every declaration of the given properties in every rule that matches the element. jsdom cannot
 * compute a gradient built from `var()`, so this reads the rules instead; requiring them all to
 * agree makes the cascade order irrelevant. A pseudo-element rule paints another box and is skipped.
 */
const declarationsReaching = (element: Element, properties: string[]): string[] =>
	Array.from(document.styleSheets).flatMap(sheet =>
		Array.from(sheet.cssRules).flatMap(rule =>
			rule instanceof CSSStyleRule && !rule.selectorText.includes('::') && element.matches(rule.selectorText)
				? properties.map(property => rule.style.getPropertyValue(property)).filter(Boolean)
				: []
		)
	)

const painted = (root: HTMLElement) =>
	Array.from(root.querySelectorAll<HTMLElement>('.aform_field-label, p.aform_error'), element => ({
		element: `${element.className} "${element.textContent?.trim()}"`,
		backgrounds: declarationsReaching(element, ['background', 'background-color', 'background-image']),
	}))

describe('floating label and error background', { tags: ['component'] }, () => {
	beforeAll(() => {
		const style = document.createElement('style')
		style.textContent = globalStyles()
		document.head.appendChild(style)
	})

	afterEach(() => {
		document.body.innerHTML = ''
	})

	it.each([
		['edit', {}],
		['read', {}],
		['display', {}],
		['edit', { errors }],
	] as const)('paints only the form colour, and only above the border, in %s mode %j', (mode, extra) => {
		const wrapper = mount(AForm, {
			props: { schema, data: {}, mode, ...extra },
			global: { components },
			attachTo: document.body,
		})
		const elements = painted(wrapper.element as HTMLElement)

		expect(elements.length).toBeGreaterThan(10)
		for (const { element, backgrounds } of elements) {
			expect({ element, backgrounds }).toEqual({ element, backgrounds: [FORM_ABOVE_THE_BORDER] })
		}
	})

	it('paints the same way on the login form', () => {
		const wrapper = mount(Login, { attachTo: document.body })
		const elements = painted(wrapper.element as HTMLElement)

		expect(elements).toHaveLength(2)
		for (const { element, backgrounds } of elements) {
			expect({ element, backgrounds }).toEqual({ element, backgrounds: [FORM_ABOVE_THE_BORDER] })
		}
	})

	it('puts the login labels on the form colour they paint, whatever page hosts Login', () => {
		// The nearest ancestor that paints a background is what shows around a label's upper half.
		const login = readFileSync(join(SRC, 'components', 'utilities', 'Login.vue'), 'utf8')
		const style = document.createElement('style')
		style.textContent = Array.from(login.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g), match => match[1]).join('\n')
		document.head.appendChild(style)
		const wrapper = mount(Login, { attachTo: document.body })
		const labels = Array.from((wrapper.element as HTMLElement).querySelectorAll('.aform_field-label'))

		expect(labels).toHaveLength(2)
		for (const label of labels) {
			let surface: string[] = []
			for (let node = label.parentElement; node && surface.length === 0; node = node.parentElement) {
				surface = declarationsReaching(node, ['background', 'background-color'])
			}
			expect({ label: label.textContent, surface }).toEqual({
				label: label.textContent,
				surface: ['var(--sc-form-background)'],
			})
		}
		style.remove()
	})

	it('is painted by the two shared rules alone, never by a component stylesheet', () => {
		// The render above loads only AForm's global rules; a component's scoped rule reaches the same
		// elements in the browser, so every stylesheet in the package is read here by name.
		const files = collect(SRC)
		const painting = files.flatMap(file => {
			const sfc = readFileSync(file, 'utf8')
			const css = file.endsWith('.css')
				? sfc
				: Array.from(sfc.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g), match => match[1]).join('\n')
			return styleRules(css)
				.filter(rule => /aform_field-label|aform_error/.test(rule.selectorText) && !rule.selectorText.includes('::'))
				.flatMap(rule =>
					['background', 'background-color', 'background-image']
						.map(property => rule.style.getPropertyValue(property))
						.filter(Boolean)
						.map(value => `${relative(SRC, file)} ${rule.selectorText} ${value}`)
				)
		})

		expect(files.length).toBeGreaterThan(20)
		expect(painting).toEqual([
			`components/AForm.vue .aform_field-label ${FORM_ABOVE_THE_BORDER}`,
			`components/AForm.vue p.aform_error ${FORM_ABOVE_THE_BORDER}`,
		])
	})

	it("drops the browser's own border on a field outside a form, so the label covers the field's edge", () => {
		// The label covers one pixel below its centre line: the field's 1px outline, never a 2px inset border.
		const wrapper = mount(Login, { attachTo: document.body })
		const fields = Array.from((wrapper.element as HTMLElement).querySelectorAll('.aform_input-field'))

		expect(fields).toHaveLength(2)
		for (const field of fields) {
			expect(declarationsReaching(field, ['border-top-style'])).toEqual(['none'])
		}
	})
})
