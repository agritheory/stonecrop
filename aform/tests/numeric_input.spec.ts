import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ANumericInput from '@/components/form/ANumericInput.vue'

describe('numeric input component', () => {
	let numericInputModel = 25
	let schema = {
		fieldname: 'age',
		label: 'Age',
	}

	let wrapper = mount(ANumericInput, {
		props: { modelValue: numericInputModel, schema: schema },
	})

	it('emits update event when input changed', async () => {
		await wrapper.find('input').setValue(26)
		await wrapper.vm.$nextTick()

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual([26])
	})
})
