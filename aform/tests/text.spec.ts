import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ATextInput from '@/components/form/ATextInput.vue'

describe('text input component', () => {
	it('skip input mask when one is not provided', async () => {
		const textInputModel = '123-456-7890'
		const wrapper = mount(ATextInput, {
			props: {
				label: 'Phone Number',
				modelValue: textInputModel,
				schema: {
					fieldname: 'phone',
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
					fieldname: 'phone',
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
					fieldname: 'first_name',
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
})
