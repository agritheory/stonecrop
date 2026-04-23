import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ADateSelection from '../src/components/form/ADateSelection.vue'
import ADatePicker from '../src/components/form/ADatePicker.vue'
import ADateTime from '../src/components/form/ADateTime.vue'

describe('date-selection component', () => {
	const globalComponents = {
		global: {
			components: {
				ADatePicker,
				ADateTime,
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
		const dateTime = wrapper.findComponent(ADateTime)
		await dateTime.vm.$emit('get-time', timeData)
		const emitted = wrapper.emitted('get-time')
		expect(emitted).toBeTruthy()
		// ADateTime emits on mount, so our event is the last one
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
		const dateTime = wrapper.findComponent(ADateTime)
		expect(dateTime.props('allowMilitaryTime')).toBe(true)
		expect(dateTime.props('defaultHours')).toBe(10)
		expect(dateTime.props('defaultMinutes')).toBe(30)
		expect(dateTime.props('defaultSeconds')).toBe(45)
		expect(dateTime.props('defaultMeridiem')).toBe('PM')
		expect(dateTime.props('useSeconds')).toBe(false)
	})
})
