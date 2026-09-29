import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
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
		const datePicker = wrapper.findComponent(ADatePicker)
		await datePicker.vm.$emit('get-date', { selected: '2023-06-15', start: null, end: null })
		const emitted = wrapper.emitted('get-date')
		expect(emitted).toBeTruthy()
		expect(emitted![0][0]).toEqual({ selected: '2023-06-15', start: null, end: null })
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
		const datePicker = wrapper.findComponent(ADatePicker)
		await datePicker.vm.$emit('get-date', { selected: '2023-06-15', start: '2023-06-15', end: '2023-06-15' })
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

	// Pinned zones, because a day read as UTC midnight only shifts west of UTC, and CI runs in UTC.
	describe.each(['Asia/Kolkata', 'America/New_York'])('in %s', zone => {
		beforeEach(() => vi.stubEnv('TZ', zone))
		afterEach(() => vi.unstubAllEnvs())

		it('builds the range from the days picked at the times picked', async () => {
			const wrapper = mount(ADateSelection, {
				...globalComponents,
				props: { selectRange: true, showTime: true, showEndTime: true },
			})
			await wrapper.vm.$nextTick()
			await wrapper
				.findComponent(ADatePicker)
				.vm.$emit('get-date', { selected: '2026-03-04', start: '2026-03-02', end: '2026-03-04' })
			const [startTime, endTime] = wrapper.findAllComponents(ADateTimeInput)
			await startTime.vm.$emit('get-time', { hours: 9, minutes: 0, seconds: 0, meridiem: 'AM', militaryTime: 9 })
			await endTime.vm.$emit('get-time', { hours: 5, minutes: 0, seconds: 0, meridiem: 'PM', militaryTime: 17 })
			expect(wrapper.emitted('get-range')?.at(-1)).toEqual([
				{ start: new Date(2026, 2, 2, 9), end: new Date(2026, 2, 4, 17), source: 'user' },
			])
		})
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
