import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ADatePicker from '@/components/form/ADatePicker.vue'

describe('datepicker component', () => {
	it('emits update event when date is changed', async () => {
		const wrapper = mount(ADatePicker)
		await wrapper.vm.$nextTick()

		await wrapper.find('.todaysDate').trigger('click')
		await wrapper.vm.$nextTick()

		// ADatePicker assumes midnight for all dates while building the calendar
		const todaysDatetime = new Date().setHours(0, 0, 0, 0)
		const todaysDate = new Date(todaysDatetime)

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toBeTruthy()
		expect(updateEvents![0][0]).toEqual(todaysDate)
	})

	it('default date is focused', async () => {
		const wrapper = mount(ADatePicker, { attachTo: document.body })
		await wrapper.vm.$nextTick()

		const $selectedDate = wrapper.find('.selectedDate')
		expect($selectedDate.element).toBe(document.activeElement)
	})

	it('selected date is focused', async () => {
		const wrapper = mount(ADatePicker, { attachTo: document.body })
		await wrapper.vm.$nextTick()

		const $randomDate = wrapper.find({ ref: 'celldate' })
		$randomDate.trigger('click')

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toBeTruthy()

		// TODO: check if the selected date is focused
		// expect($randomDate.element).toBe(document.activeElement)
	})

	it('select previous month', async () => {
		const wrapper = mount(ADatePicker)
		await wrapper.vm.$nextTick()

		const $prevMonthBtn = wrapper.find('#previous-month-btn')
		await $prevMonthBtn.trigger('click')
		expect(wrapper.vm.currentMonth).toBe(new Date().getMonth() - 1)
	})

	it('select previous year', async () => {
		const wrapper = mount(ADatePicker)
		await wrapper.vm.$nextTick()

		const $prevMonthBtn = wrapper.find('#previous-month-btn')
		const currentMonth = new Date().getMonth()

		for (const _ of Array(currentMonth + 1).keys()) {
			await $prevMonthBtn.trigger('click')
		}

		expect(wrapper.vm.currentYear).toBe(new Date().getFullYear() - 1)
	})

	it('select next month', async () => {
		const wrapper = mount(ADatePicker)
		await wrapper.vm.$nextTick()

		const $prevMonthBtn = wrapper.find('#next-month-btn')
		await $prevMonthBtn.trigger('click')
		expect(wrapper.vm.currentMonth).toBe(new Date().getMonth() + 1)
	})

	it('select next year', async () => {
		const wrapper = mount(ADatePicker)
		await wrapper.vm.$nextTick()

		const $prevMonthBtn = wrapper.find('#next-month-btn')
		const currentMonth = new Date().getMonth()

		for (const _ of Array(12 - currentMonth).keys()) {
			await $prevMonthBtn.trigger('click')
		}

		expect(wrapper.vm.currentYear).toBe(new Date().getFullYear() + 1)
	})
})
