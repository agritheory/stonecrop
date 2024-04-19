import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ADatePicker from '@/components/form/ADatePicker.vue'

describe('datepicker component', () => {
	const datepickerValue = new Date('2023-1-1').getTime()

	let wrapper = mount(ADatePicker, {
		props: { modelValue: datepickerValue },
	})

	it('emits update event when date is changed', async () => {
		await wrapper.find('.todaysDate').trigger('click')
		await wrapper.vm.$nextTick()

		let todaysDate = new Date()
		todaysDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate())

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toBeTruthy()
		expect(updateEvents![0][0]).toEqual(todaysDate.getTime())
	})
})
