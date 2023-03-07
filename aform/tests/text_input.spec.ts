import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ATextInput from '@/components/form/ATextInput.vue'

describe('text input component', () => {
	let textInputModel = 'John'
	let schema = {
		fieldname: 'first_name',
		label: 'First Name',
	}

	let wrapper = mount(ATextInput, {
		props: { modelValue: textInputModel, schema: schema },
	})

	it('emits update event when input changed', async () => {
		await wrapper.find('input').setValue('Jane')
		await wrapper.vm.$nextTick()

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual(['Jane'])
	})
})
