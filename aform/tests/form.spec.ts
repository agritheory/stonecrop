import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AForm from '../src/components/AForm.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { SchemaTypes } from '../src/types'

describe('AForm Component', () => {
	const wrapper = mount(AForm, {
		props: {
			modelValue: [
				{
					fieldname: 'first_name',
					component: 'ATextInput',
					label: 'First Name',
				},
			] as SchemaTypes[],
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
