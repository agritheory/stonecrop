import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ATextboxInput from '../src/components/form/ATextboxInput.vue'

describe('ATextboxInput', { tags: ['component'] }, () => {
	describe('rendering', () => {
		it('renders a textarea in edit mode', () => {
			const w = mount(ATextboxInput, { props: { label: 'Notes' } })
			expect(w.find('textarea').exists()).toBe(true)
			expect(w.find('input').exists()).toBe(false)
		})

		it('renders the label and associates it with the textarea via for/id', () => {
			const w = mount(ATextboxInput, { props: { label: 'Notes', uuid: 'todo-notes' } })
			expect(w.find('label').text()).toContain('Notes')
			expect(w.find('label').attributes('for')).toBe('todo-notes')
			expect(w.find('textarea').attributes('id')).toBe('todo-notes')
		})

		it('marks the textarea required when required is set', () => {
			const required = mount(ATextboxInput, { props: { label: 'Notes', required: true } })
			expect(required.find('textarea').attributes()).toHaveProperty('required')

			const optional = mount(ATextboxInput, { props: { label: 'Notes' } })
			expect(optional.find('textarea').attributes()).not.toHaveProperty('required')
		})

		it('binds placeholder, rows, and maxlength to the textarea', () => {
			const w = mount(ATextboxInput, { props: { placeholder: 'Type…', rows: 8, maxlength: 200 } })
			const ta = w.find('textarea')
			expect(ta.attributes('placeholder')).toBe('Type…')
			expect(ta.attributes('rows')).toBe('8')
			expect(ta.attributes('maxlength')).toBe('200')
		})

		it('defaults to 4 rows', () => {
			const w = mount(ATextboxInput, {})
			expect(w.find('textarea').attributes('rows')).toBe('4')
		})

		it('renders the modelValue in the textarea', () => {
			const w = mount(ATextboxInput, { props: { modelValue: 'hello' } })
			expect((w.find('textarea').element as HTMLTextAreaElement).value).toBe('hello')
		})
	})

	describe('input handling', () => {
		it('emits update:modelValue when the textarea changes', async () => {
			const w = mount(ATextboxInput, { props: { modelValue: 'old' } })
			await w.find('textarea').setValue('new value')

			const updates = w.emitted('update:modelValue')
			expect(updates).toHaveLength(1)
			expect(updates![0]).toEqual(['new value'])
		})
	})

	describe('mode handling', () => {
		it('renders a display span (no textarea) in display mode', () => {
			const w = mount(ATextboxInput, { props: { modelValue: 'read me', mode: 'display' } })
			expect(w.find('textarea').exists()).toBe(false)
			expect(w.find('.aform_display-value').text()).toBe('read me')
		})

		it('renders an empty display span when there is no value', () => {
			const w = mount(ATextboxInput, { props: { mode: 'display' } })
			expect(w.find('.aform_display-value').text()).toBe('')
		})

		it('disables the textarea in read mode (still editable-looking but not editable)', () => {
			const w = mount(ATextboxInput, { props: { modelValue: 'x', mode: 'read' } })
			expect(w.find('textarea').attributes()).toHaveProperty('disabled')
		})

		it('leaves the textarea enabled in edit mode', () => {
			const w = mount(ATextboxInput, { props: { modelValue: 'x', mode: 'edit' } })
			expect(w.find('textarea').attributes()).not.toHaveProperty('disabled')
		})
	})

	describe('validation errors', () => {
		it('shows dynamic trigger errors joined together', () => {
			const w = mount(ATextboxInput, { props: { errors: ['Too short', 'Required'] } })
			expect(w.find('.aform_error').text()).toBe('Too short; Required')
		})

		it('falls back to the static schema errorMessage when there are no trigger errors', () => {
			const w = mount(ATextboxInput, { props: { validation: { errorMessage: 'Invalid' } } })
			expect(w.find('.aform_error').text()).toBe('Invalid')
		})
	})
})
