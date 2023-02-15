import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AForm from '@/components/AForm.vue'
import ATextInput from '@/components/form/ATextInput.vue'
import { ref } from 'vue'

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

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')[0]).toEqual([
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
