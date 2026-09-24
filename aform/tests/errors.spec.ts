import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Component } from 'vue'

import AForm from '../src/components/AForm.vue'
import ACurrencyInput from '../src/components/form/ACurrencyInput.vue'
import AQuantityInput from '../src/components/form/AQuantityInput.vue'
import ADate from '../src/components/form/ADate.vue'
import ADatePicker from '../src/components/form/ADatePicker.vue'
import ADateTime from '../src/components/form/ADateTime.vue'
import ADateRange from '../src/components/form/ADateRange.vue'
import ADropdown from '../src/components/form/ADropdown.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { ResolvedField } from '../src/types'

describe('inline field errors', { tags: ['component'] }, () => {
	describe('field component (ATextInput)', () => {
		it('wires aria-invalid and aria-describedby when an error is present', () => {
			const w = mount(ATextInput, {
				props: { uuid: 'end_date', label: 'End date', modelValue: '', errors: ['End before start'] },
			})
			const input = w.find('input')
			const err = w.find('.aform_error')
			expect(input.attributes('aria-invalid')).toBe('true')
			expect(input.attributes('aria-describedby')).toBe('end_date-error')
			expect(err.attributes('id')).toBe('end_date-error')
			expect(err.attributes('role')).toBe('alert')
		})

		it('renders a dynamic error message from the errors prop', () => {
			const w = mount(ATextInput, {
				props: { label: 'End date', modelValue: '2020-01-01', errors: ['End before start'] },
			})
			const err = w.find('.aform_error')
			expect(err.exists()).toBe(true)
			expect(err.text()).toBe('End before start')
			// v-show keeps it visible (no inline display:none) when there is a real error
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('joins multiple errors', () => {
			const w = mount(ATextInput, { props: { label: 'x', modelValue: '', errors: ['A', 'B'] } })
			expect(w.find('.aform_error').text()).toBe('A; B')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ATextInput, { props: { label: 'x', modelValue: '' } })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('')
			// present in the DOM (v-show), but hidden because there is no message
			expect(err.attributes('style') ?? '').toContain('display: none')
		})

		it('dynamic errors take precedence over a static validation.errorMessage', () => {
			const w = mount(ATextInput, {
				props: { label: 'x', modelValue: '', errors: ['dynamic'], validation: { errorMessage: 'static' } },
			})
			expect(w.find('.aform_error').text()).toBe('dynamic')
		})

		it('falls back to static validation.errorMessage when there are no dynamic errors', () => {
			const w = mount(ATextInput, {
				props: { label: 'x', modelValue: '', validation: { errorMessage: 'static' } },
			})
			expect(w.find('.aform_error').text()).toBe('static')
		})
	})

	// Date-family field components (non-uniform: ADate/ADateRange/ADateTime own their error <p>; ADatePicker
	// is a calendar grid). Each must surface the dynamic `errors` prop, preferring it over the
	// static schema `validation.errorMessage`, and hide the slot when there is no message.
	describe('field component (ADate)', () => {
		it('renders a dynamic error from the errors prop', () => {
			const w = mount(ADate, { props: { label: 'When', errors: ['End before start'] } })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('End before start')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ADate, { props: { label: 'When' } })
			expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
		})

		it('dynamic errors take precedence over a static validation.errorMessage', () => {
			const w = mount(ADate, { props: { label: 'When', errors: ['dyn'], validation: { errorMessage: 'stat' } } })
			expect(w.find('.aform_error').text()).toBe('dyn')
		})
	})

	describe('field component (ADateRange)', () => {
		it('renders a dynamic error from the errors prop', () => {
			const w = mount(ADateRange, { props: { label: 'Range', errors: ['End before start'] } })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('End before start')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ADateRange, { props: { label: 'Range' } })
			expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
		})

		it('dynamic errors take precedence over a static validation.errorMessage', () => {
			const w = mount(ADateRange, { props: { label: 'Range', errors: ['dyn'], validation: { errorMessage: 'stat' } } })
			expect(w.find('.aform_error').text()).toBe('dyn')
		})
	})

	describe('field component (ADateTime)', () => {
		it('renders a dynamic error from the errors prop', () => {
			const w = mount(ADateTime, { props: { label: 'Created', errors: ['Invalid datetime'] } })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('Invalid datetime')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ADateTime, { props: { label: 'Created' } })
			expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
		})

		it('dynamic errors take precedence over a static validation.errorMessage', () => {
			const w = mount(ADateTime, {
				props: { label: 'Created', errors: ['dyn'], validation: { errorMessage: 'stat' } },
			})
			expect(w.find('.aform_error').text()).toBe('dyn')
		})
	})

	describe('field component (ADatePicker)', () => {
		it('renders a dynamic error from the errors prop', () => {
			const w = mount(ADatePicker, { props: { errors: ['bad date'] } })
			const err = w.find('.aform_error')
			expect(err.exists()).toBe(true)
			expect(err.text()).toBe('bad date')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ADatePicker, { props: {} })
			expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
		})
	})

	describe('date fields', () => {
		it.each([
			['ADate', ADate],
			['ADateRange', ADateRange],
			['ADateTime', ADateTime],
		])('%s wires aria-invalid and aria-describedby to its error', (_name, component) => {
			const w = mount(component, { props: { uuid: 'due', label: 'Due', errors: ['Due is required'] } })
			const input = w.find('input')
			const err = w.find('.aform_error')
			expect(input.attributes('aria-invalid')).toBe('true')
			expect(input.attributes('aria-describedby')).toBe('due-error')
			expect(err.attributes('id')).toBe('due-error')
			expect(err.attributes('role')).toBe('alert')
		})

		it.each([
			['ADate', ADate],
			['ADateRange', ADateRange],
			['ADateTime', ADateTime],
			['ADatePicker', ADatePicker],
		])('%s renders an error message as text, never as markup', (_name, component) => {
			const w = mount(component, { props: { uuid: 'due', label: 'Due', errors: ['<b>late</b>'] } })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('<b>late</b>')
			expect(err.find('b').exists()).toBe(false)
		})
	})

	describe('grouped fields (ACurrencyInput, AQuantityInput)', () => {
		const grouped = [
			[
				'ACurrencyInput',
				ACurrencyInput,
				'.acurrency__amount',
				{
					amount: 1,
					currency: { id: 'USD' },
					baseAmount: 1,
					baseCurrency: { id: 'USD' },
					exchangeRate: 1,
				},
				{ baseCurrency: { id: 'USD' } },
			],
			[
				'AQuantityInput',
				AQuantityInput,
				'.aquantity__qty',
				{ qty: 1, uom: 'Nos', stockQty: 1, stockUom: 'Nos', conversionFactor: 1 },
				{ uoms: ['Nos'], stockUom: 'Nos' },
			],
		] as const

		// The two components take different value shapes, so the table's rows are mounted untyped.
		const mountGrouped = (component: Component, props: Record<string, unknown>) => mount(component, { props })

		it.each(grouped)('%s renders the errors prop, as text', (_name, component, _input, modelValue, options) => {
			const w = mountGrouped(component, { uuid: 'f', label: 'F', modelValue, options, errors: ['<b>late</b>'] })
			const err = w.find('.aform_error')
			expect(err.text()).toBe('<b>late</b>')
			expect(err.find('b').exists()).toBe(false)
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it.each(grouped)(
			'%s hides the error slot when there are no errors',
			(_name, component, _input, modelValue, options) => {
				const w = mountGrouped(component, { uuid: 'f', label: 'F', modelValue, options })
				expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
			}
		)

		it.each(grouped)(
			'%s falls back to a static validation.errorMessage',
			(_name, component, _input, modelValue, options) => {
				const w = mountGrouped(component, {
					uuid: 'f',
					label: 'F',
					modelValue,
					options,
					validation: { errorMessage: 'static' },
				})
				expect(w.find('.aform_error').text()).toBe('static')
			}
		)

		it.each(grouped)(
			'%s wires aria-invalid and aria-describedby to its error',
			(_name, component, input, modelValue, options) => {
				const w = mountGrouped(component, { uuid: 'f', label: 'F', modelValue, options, errors: ['Required'] })
				expect(w.find(input).attributes('aria-invalid')).toBe('true')
				expect(w.find(input).attributes('aria-describedby')).toBe('f-error')
				expect(w.find('.aform_error').attributes('id')).toBe('f-error')
				expect(w.find('.aform_error').attributes('role')).toBe('alert')
			}
		)
	})

	describe('field component (ADropdown)', () => {
		it('renders a dynamic error from the errors prop', () => {
			const w = mount(ADropdown, { props: { label: 'Pick', errors: ['Required'] } })
			const err = w.find('.aform_error')
			expect(err.exists()).toBe(true)
			expect(err.text()).toBe('Required')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ADropdown, { props: { label: 'Pick' } })
			expect(w.find('.aform_error').attributes('style') ?? '').toContain('display: none')
		})
	})

	describe('AForm wiring', () => {
		it('routes errors to the correct field by fieldname', () => {
			const w = mount(AForm, {
				props: {
					schema: [
						{ fieldname: 'start_date', component: 'ATextInput', label: 'Start' },
						{ fieldname: 'end_date', component: 'ATextInput', label: 'End' },
					] as ResolvedField[],
					data: { start_date: '2020-01-02', end_date: '2020-01-01' },
					errors: { end_date: ['End before start'] },
				},
				global: { components: { ATextInput } },
			})
			const fields = w.findAllComponents(ATextInput)
			expect(fields[0].find('.aform_error').text()).toBe('') // start_date: no error
			expect(fields[1].find('.aform_error').text()).toBe('End before start') // end_date: flagged
		})
	})
})
