import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AForm from '../src/components/AForm.vue'
import ADate from '../src/components/form/ADate.vue'
import ADatePicker from '../src/components/form/ADatePicker.vue'
import ADateRange from '../src/components/form/ADateRange.vue'
import ADropdown from '../src/components/form/ADropdown.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { ResolvedField } from '../src/types'

describe('inline field errors', { tags: ['component'] }, () => {
	describe('field component (ATextInput)', () => {
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

	// Date-family field components (non-uniform: ADate/ADateRange own their error <p>; ADatePicker
	// is a calendar grid). Each must surface the dynamic `errors` prop, preferring it over the
	// static schema `validation.errorMessage`, and hide the slot when there is no message.
	describe('field component (ADate)', () => {
		it('renders a dynamic error from the errors prop', () => {
			const w = mount(ADate, { props: { label: 'When', errors: ['End before start'] } })
			const err = w.find('p')
			expect(err.text()).toBe('End before start')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ADate, { props: { label: 'When' } })
			expect(w.find('p').attributes('style') ?? '').toContain('display: none')
		})

		it('dynamic errors take precedence over a static validation.errorMessage', () => {
			const w = mount(ADate, { props: { label: 'When', errors: ['dyn'], validation: { errorMessage: 'stat' } } })
			expect(w.find('p').text()).toBe('dyn')
		})
	})

	describe('field component (ADateRange)', () => {
		it('renders a dynamic error from the errors prop', () => {
			const w = mount(ADateRange, { props: { label: 'Range', errors: ['End before start'] } })
			const err = w.find('p')
			expect(err.text()).toBe('End before start')
			expect(err.attributes('style') ?? '').not.toContain('display: none')
		})

		it('hides the error slot when there are no errors', () => {
			const w = mount(ADateRange, { props: { label: 'Range' } })
			expect(w.find('p').attributes('style') ?? '').toContain('display: none')
		})

		it('dynamic errors take precedence over a static validation.errorMessage', () => {
			const w = mount(ADateRange, { props: { label: 'Range', errors: ['dyn'], validation: { errorMessage: 'stat' } } })
			expect(w.find('p').text()).toBe('dyn')
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
						{ fieldname: 'start_date', fieldtype: 'Data', component: 'ATextInput', label: 'Start' },
						{ fieldname: 'end_date', fieldtype: 'Data', component: 'ATextInput', label: 'End' },
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
