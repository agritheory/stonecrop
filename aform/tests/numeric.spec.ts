import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ANumericInput from '@/components/form/ANumericInput.vue'

describe('numeric input component', () => {
	const numericInputModel = 25
	const wrapper = mount(ANumericInput, {
		props: { modelValue: numericInputModel, label: 'Age' },
	})

	it('emits update event when input changed', async () => {
		await wrapper.find('input').setValue(26)
		await wrapper.vm.$nextTick()

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toHaveLength(1)
		expect(updateEvents![0]).toEqual([26])
	})
})
