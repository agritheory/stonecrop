import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AForm from '../src/components/AForm.vue'
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
