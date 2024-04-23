import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ADatePicker from '@/components/form/ADatePicker.vue'

describe('datepicker component', () => {
	const wrapper = mount(ADatePicker)

	it('emits update event when date is changed', async () => {
		await wrapper.find('.todaysDate').trigger('click')
		await wrapper.vm.$nextTick()

		// ADatePicker assumes midnight for all dates while building the calendar
		const todaysDatetime = new Date().setHours(0, 0, 0, 0)
		const todaysDate = new Date(todaysDatetime)

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toBeTruthy()
		expect(updateEvents![0][0]).toEqual(todaysDate)
	})
})
