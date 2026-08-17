import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ATextInput from '../src/components/form/ATextInput.vue'

describe('text input component', { tags: ['component'] }, () => {
	it('skip input mask when one is not provided', async () => {
		const textInputModel = '123-456-7890'
		const wrapper = mount(ATextInput, {
			props: {
				label: 'Phone Number',
				modelValue: textInputModel,
				schema: {
					kind: 'field',
					fieldname: 'phone',
					component: 'ATextInput',
					label: 'Phone Number',
				},
			},
		})

		const input = wrapper.find('input')
		expect(input.attributes().maxlength).toBe(undefined)
	})

	it('setup input mask when one is provided', async () => {
		const textInputModel = '123-456-7890'
		const wrapper = mount(ATextInput, {
			props: {
				label: 'Phone Number',
				modelValue: textInputModel,
				mask: '###-###-####',
				schema: {
					kind: 'field',
					fieldname: 'phone',
					component: 'ATextInput',
					label: 'Phone Number',
				},
			},
		})

		const input = wrapper.find('input')
		expect(input.attributes().maxlength).toBe('12')
	})

	it('emits update event when input is changed', async () => {
		const textInputModel = 'John'
		const wrapper = mount(ATextInput, {
			props: {
				label: 'First Name',
				modelValue: textInputModel,
				schema: {
					kind: 'field',
					fieldname: 'first_name',
					component: 'ATextInput',
					label: 'First Name',
				},
			},
		})

		await wrapper.find('input').setValue('Jane')
		await wrapper.vm.$nextTick()

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual(['Jane'])
	})

	it('is disabled in read mode', () => {
		const w = mount(ATextInput, { props: { label: 'Name', modelValue: 'John', mode: 'read' } })
		expect(w.find('input').attributes()).toHaveProperty('disabled')
	})

	it('renders value in display mode without input', () => {
		const w = mount(ATextInput, { props: { label: 'Name', modelValue: 'John', mode: 'display' } })
		expect(w.find('input').exists()).toBe(false)
		expect(w.find('.aform_display-value').text()).toBe('John')
	})

	it('renders empty string in display mode when no value', () => {
		const w = mount(ATextInput, { props: { label: 'Name', mode: 'display' } })
		expect(w.find('input').exists()).toBe(false)
		expect(w.find('.aform_display-value').text()).toBe('')
	})
})
