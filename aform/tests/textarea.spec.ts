import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ATextarea from '../src/components/form/ATextarea.vue'

describe('textarea component', { tags: ['component'] }, () => {
	it('renders a textarea in edit mode', () => {
		const w = mount(ATextarea, {
			props: {
				label: 'Address',
				modelValue: '123 Main St',
				schema: { fieldname: 'address', label: 'Address' },
			},
		})
		expect(w.find('textarea').exists()).toBe(true)
		expect(w.find('input').exists()).toBe(false)
	})

	it('emits update event when the textarea is changed', async () => {
		const w = mount(ATextarea, {
			props: {
				label: 'Address',
				modelValue: 'old',
				schema: { fieldname: 'address', label: 'Address' },
			},
		})

		await w.find('textarea').setValue('new value')
		await w.vm.$nextTick()

		const updateEvents = w.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual(['new value'])
	})

	it('is disabled in read mode', () => {
		const w = mount(ATextarea, { props: { label: 'Address', modelValue: 'x', mode: 'read' } })
		expect(w.find('textarea').attributes()).toHaveProperty('disabled')
	})

	it('renders value in display mode without a textarea', () => {
		const w = mount(ATextarea, { props: { label: 'Address', modelValue: 'John', mode: 'display' } })
		expect(w.find('textarea').exists()).toBe(false)
		expect(w.find('.aform_display-value').text()).toBe('John')
	})

	it('renders empty string in display mode when no value', () => {
		const w = mount(ATextarea, { props: { label: 'Address', mode: 'display' } })
		expect(w.find('textarea').exists()).toBe(false)
		expect(w.find('.aform_display-value').text()).toBe('')
	})
})
