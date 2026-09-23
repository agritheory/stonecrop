import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
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
A field's label takes the active colour while the field holds focus. The rules are read from every
stylesheet in the package, and a label counts as active when a rule setting that colour matches it.
*/

const SRC = join(__dirname, '..', 'src')
const ACTIVE = 'var(--sc-input-active-label-color)'

const collect = (dir: string, out: string[] = []): string[] => {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry)
		if (statSync(path).isDirectory()) collect(path, out)
		else if (entry.endsWith('.vue')) out.push(path)
	}
	return out
}

let activeSelectors: string[] = []

/** jsdom never matches `:hover`, so the hover case asks whether the rule reaches the label at all. */
const isActive = (label: Element, { assumeHover = false } = {}) =>
	activeSelectors.some(selector => label.matches(assumeHover ? selector.replaceAll(':hover', '') : selector))

const schemaField = (component: string, fieldname: string, extra: Record<string, unknown> = {}) =>
	({ kind: 'field', component, fieldname, label: fieldname, uuid: fieldname, ...extra }) as ResolvedField

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

/** Each focusable control a person can land on, with the label it belongs to. */
const controls = (root: HTMLElement) =>
	Array.from(root.querySelectorAll<HTMLElement>('.aform_form-element:not(.aform_form-element--embedded)')).flatMap(
		field => {
			const labels = Array.from(field.querySelectorAll('.aform_field-label'))
			const focusable = field.querySelectorAll<HTMLElement>(
				'input:not([disabled]), textarea:not([disabled]), button:not([disabled])'
			)
			return Array.from(focusable, control => ({ main: labels[0], others: labels.slice(1), control }))
		}
	)

describe('label focus colour', { tags: ['component'] }, () => {
	beforeAll(() => {
		const style = document.createElement('style')
		style.textContent = collect(SRC)
			.flatMap(file => Array.from(readFileSync(file, 'utf8').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g), m => m[1]))
			.join('\n')
		document.head.appendChild(style)
		// An empty extraction cannot pass: every test below needs a label to come out active.
		activeSelectors = Array.from(style.sheet!.cssRules)
			.filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.style.color === ACTIVE)
			.flatMap(rule => rule.selectorText.split(',').map(selector => selector.trim()))
	})

	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('darkens the label of whichever control holds focus, and no other label', () => {
		const wrapper = mount(AForm, {
			props: { schema, data: {}, mode: 'edit' },
			global: { components },
			attachTo: document.body,
		})
		const all = controls(wrapper.element as HTMLElement)
		const reached = new Set<string>()

		expect(all.length).toBeGreaterThan(schema.length)
		for (const { main, others, control } of all) {
			control.focus()
			expect(document.activeElement).toBe(control)
			expect({ label: main.textContent?.trim(), active: isActive(main) }).toEqual({
				label: main.textContent?.trim(),
				active: true,
			})
			for (const other of others) {
				expect({ label: other.textContent?.trim(), active: isActive(other) }).toEqual({
					label: other.textContent?.trim(),
					active: false,
				})
			}
			reached.add(main.textContent?.trim() ?? '')
			// No after-blur assertion: jsdom keeps answering a bare `:focus-within` as it did while focused.
			control.blur()
		}
		expect(reached).toEqual(new Set(schema.map(field => field.fieldname)))
	})

	it('darkens the login labels on focus', () => {
		const wrapper = mount(Login, { attachTo: document.body })
		for (const input of (wrapper.element as HTMLElement).querySelectorAll<HTMLInputElement>('.aform_input-field')) {
			input.focus()
			const label = input.parentElement!.querySelector('.aform_field-label')!
			expect({ label: label.textContent, active: isActive(label) }).toEqual({ label: label.textContent, active: true })
		}
	})

	it('darkens the checkbox label while its box is hovered', () => {
		const wrapper = mount(ACheckbox, { props: { label: 'Paid', uuid: 'paid' }, attachTo: document.body })
		const label = wrapper.element.querySelector('.aform_field-label')!
		expect(isActive(label, { assumeHover: true })).toBe(true)
	})
})
