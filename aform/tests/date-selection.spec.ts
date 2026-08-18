import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ADateSelection from '../src/components/form/ADateSelection.vue'
import ADatePicker from '../src/components/form/ADatePicker.vue'
import ADateTimeInput from '../src/components/form/ADateTimeInput.vue'

describe('date-selection component', () => {
	const globalComponents = {
		global: {
			components: {
				ADatePicker,
				ADateTimeInput,
			},
		},
	}

	it('renders date picker and time picker by default', () => {
		const wrapper = mount(ADateSelection, globalComponents)
		expect(wrapper.find('.adatepicker').exists()).toBe(true)
		expect(wrapper.find('.adate_time').exists()).toBe(true)
	})

	it('renders only date picker when showTime is false', () => {
		const wrapper = mount(ADateSelection, {
			...globalComponents,
			props: { showTime: false },
		})
		expect(wrapper.find('.adatepicker').exists()).toBe(true)
		expect(wrapper.find('.adate_time').exists()).toBe(false)
	})

	it('renders only time picker when showDate is false', () => {
		const wrapper = mount(ADateSelection, {
			...globalComponents,
			props: { showDate: false },
		})
		expect(wrapper.find('.adatepicker').exists()).toBe(false)
		expect(wrapper.find('.adate_time').exists()).toBe(true)
	})

	it('renders empty message when neither date nor time is shown', () => {
		const wrapper = mount(ADateSelection, {
			...globalComponents,
			props: { showDate: false, showTime: false },
		})
		expect(wrapper.find('p.empty').exists()).toBe(true)
		expect(wrapper.find('p.empty').text()).toBe('empty')
	})

	it('emits get-date when date is selected', async () => {
		const wrapper = mount(ADateSelection, globalComponents)
		const testDate = new Date(2023, 5, 15)
		const datePicker = wrapper.findComponent(ADatePicker)
		await datePicker.vm.$emit('get-date', { selected: testDate, start: null, end: null })
		const emitted = wrapper.emitted('get-date')
		expect(emitted).toBeTruthy()
		expect(emitted![0][0]).toEqual({ selected: testDate, start: null, end: null })
	})

	it('emits get-time when time is selected', async () => {
		const wrapper = mount(ADateSelection, globalComponents)
		const timeData = { hours: 3, minutes: 30, seconds: 0, meridiem: 'PM', militaryTime: 15 }
		const dateTime = wrapper.findComponent(ADateTimeInput)
		await dateTime.vm.$emit('get-time', timeData)
		const emitted = wrapper.emitted('get-time')
		expect(emitted).toBeTruthy()
		// ADateTimeInput emits on mount, so our event is the last one
		expect(emitted![emitted!.length - 1][0]).toEqual(timeData)
	})

	it('passes selectRange prop to date picker', () => {
		const wrapper = mount(ADateSelection, {
			...globalComponents,
			props: { selectRange: false },
		})
		const datePicker = wrapper.findComponent(ADatePicker)
		expect(datePicker.props('selectRange')).toBe(false)
	})

	it('passes time props to time picker', () => {
		const wrapper = mount(ADateSelection, {
			...globalComponents,
			props: {
				allowMilitaryTime: true,
				defaultHours: 10,
				defaultMinutes: 30,
				defaultSeconds: 45,
				defaultMeridiem: 'PM',
				useSeconds: false,
			},
		})
		const dateTime = wrapper.findComponent(ADateTimeInput)
		expect(dateTime.props('allowMilitaryTime')).toBe(true)
		expect(dateTime.props('defaultHours')).toBe(10)
		expect(dateTime.props('defaultMinutes')).toBe(30)
		expect(dateTime.props('defaultSeconds')).toBe(45)
		expect(dateTime.props('defaultMeridiem')).toBe('PM')
		expect(dateTime.props('useSeconds')).toBe(false)
	})

	it('emits get-range when date and both times are set', async () => {
		const wrapper = mount(ADateSelection, {
			...globalComponents,
			props: { selectRange: true, showTime: true, showEndTime: true },
		})
		const testDate = new Date(2023, 5, 15)
		const datePicker = wrapper.findComponent(ADatePicker)
		await datePicker.vm.$emit('get-date', { selected: testDate, start: testDate, end: testDate })
		const emitted = wrapper.emitted('get-range')
		expect(emitted).toBeTruthy()
		expect(emitted![0][0]).toHaveProperty('start')
		expect(emitted![0][0]).toHaveProperty('end')
	})

	it('emits get-time (not get-range) when showEndTime is false and time changes', async () => {
		const wrapper = mount(ADateSelection, {
			...globalComponents,
			props: { selectRange: true, showTime: true, showEndTime: false },
		})
		await wrapper.vm.$nextTick()
		const dateTime = wrapper.findComponent(ADateTimeInput)
		const timeData = { hours: 5, minutes: 15, seconds: 30, meridiem: 'PM', militaryTime: 17 }
		await dateTime.vm.$emit('get-time', timeData)
		const rangeEvents = wrapper.emitted('get-range')
		expect(rangeEvents).toBeFalsy()
		const timeEvents = wrapper.emitted('get-time')
		expect(timeEvents).toBeTruthy()
		expect(timeEvents![timeEvents!.length - 1][0]).toEqual(timeData)
	})

	it('emits get-range when end time is set with showEndTime', async () => {
		const wrapper = mount(ADateSelection, {
			...globalComponents,
			props: { selectRange: true, showTime: true, showEndTime: true },
		})
		await wrapper.vm.$nextTick()
		const dateTimes = wrapper.findAllComponents(ADateTimeInput)
		expect(dateTimes.length).toBe(2)
		const endTime = dateTimes[1]
		await endTime.vm.$emit('get-time', { hours: 5, minutes: 0, seconds: 0, meridiem: 'PM', militaryTime: 17 })
		const rangeEvents = wrapper.emitted('get-range')
		expect(rangeEvents).toBeTruthy()
	})

	it('renders end time picker when selectRange, showTime, and showEndTime are all true', () => {
		const wrapper = mount(ADateSelection, {
			...globalComponents,
			props: { selectRange: true, showTime: true, showEndTime: true },
		})
		const dateTimes = wrapper.findAllComponents(ADateTimeInput)
		expect(dateTimes.length).toBe(2)
		expect(wrapper.text()).toContain('End time')
	})
})
