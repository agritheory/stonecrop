import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AForm from '../src/components/AForm.vue'
import ATextInput from '../src/components/form/ATextInput.vue'

describe('AForm Component', () => {
	const form_schema = [
		{
			fieldname: 'first_name',
			component: 'ATextInput',
			label: 'First Name',
		},
	]

	const wrapper = mount(AForm, {
		props: {
			modelValue: form_schema,
			data: {},
		},
		components: {
			ATextInput,
		},
	})

	it('AForm v-model should update when the input is changed', async () => {
		await wrapper.vm.$nextTick()
		const aTextInputWrapper = wrapper.findComponent(ATextInput)
		await aTextInputWrapper.find('input').setValue('Steve')
		await wrapper.vm.$nextTick()

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toBeTruthy()
		expect(updateEvents![0]).toEqual([
			[
				{
					fieldname: 'first_name',
					component: 'ATextInput',
					label: 'First Name',
					value: 'Steve',
				},
			],
		])
	})
})
