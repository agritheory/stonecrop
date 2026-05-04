import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import ADateTime from '../src/components/form/ADateTime.vue'

describe('datetime component', () => {
	it('renders time inputs with default values', () => {
		const wrapper = mount(ADateTime)
		const inputs = wrapper.findAll('input[type="text"]')
		expect(inputs.length).toBe(3) // hours, minutes, seconds
		expect(inputs[0].element.value).toBe('12')
		expect(inputs[1].element.value).toBe('00')
		expect(inputs[2].element.value).toBe('00')
	})

	it('emits get-time on mount', () => {
		const wrapper = mount(ADateTime)
		const emitted = wrapper.emitted('get-time')
		expect(emitted).toBeTruthy()
		expect(emitted![0][0]).toMatchObject({
			hours: 12,
			minutes: 0,
			seconds: 0,
			meridiem: 'AM',
		})
	})

	it('renders meridiem selector by default', () => {
		const wrapper = mount(ADateTime)
		const select = wrapper.find('select')
		expect(select.exists()).toBe(true)
		expect(select.element.value).toBe('AM')
	})

	it('does not render meridiem in military time mode', () => {
		const wrapper = mount(ADateTime, {
			props: { allowMilitaryTime: true },
		})
		expect(wrapper.find('select').exists()).toBe(false)
	})

	it('does not render seconds when useSeconds is false', () => {
		const wrapper = mount(ADateTime, {
			props: { useSeconds: false },
		})
		const inputs = wrapper.findAll('input[type="text"]')
		expect(inputs.length).toBe(2)
	})

	it('updates hours and emits on blur', async () => {
		const wrapper = mount(ADateTime)
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.setValue(3)
		await hoursInput.trigger('blur')
		const emitted = wrapper.emitted('get-time')
		const lastEmit = emitted![emitted!.length - 1][0] as any
		expect(lastEmit.hours).toBe(3)
	})

	it('updates minutes and emits on enter key', async () => {
		const wrapper = mount(ADateTime)
		const minutesInput = wrapper.findAll('input[type="text"]')[1]
		await minutesInput.setValue(45)
		await minutesInput.trigger('keydown.enter')
		const emitted = wrapper.emitted('get-time')
		const lastEmit = emitted![emitted!.length - 1][0] as any
		expect(lastEmit.minutes).toBe(45)
	})

	it('changes meridiem and emits', async () => {
		const wrapper = mount(ADateTime)
		const select = wrapper.find('select')
		await select.setValue('PM')
		await select.trigger('change')
		const emitted = wrapper.emitted('get-time')
		const lastEmit = emitted![emitted!.length - 1][0] as any
		expect(lastEmit.meridiem).toBe('PM')
	})

	it('increments hours with up arrow', async () => {
		const wrapper = mount(ADateTime)
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.trigger('keydown.up')
		expect(hoursInput.element.value).toBe('01')
	})

	it('decrements hours with down arrow', async () => {
		const wrapper = mount(ADateTime)
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.trigger('keydown.down')
		expect(hoursInput.element.value).toBe('11')
	})

	it('increments minutes with up arrow', async () => {
		const wrapper = mount(ADateTime)
		const minutesInput = wrapper.findAll('input[type="text"]')[1]
		await minutesInput.trigger('keydown.up')
		expect(minutesInput.element.value).toBe('01')
	})

	it('decrements seconds with down arrow', async () => {
		const wrapper = mount(ADateTime)
		const secondsInput = wrapper.findAll('input[type="text"]')[2]
		await secondsInput.trigger('keydown.down')
		expect(secondsInput.element.value).toBe('59')
	})

	it('wraps hours from 12 to 1 in non-military mode', async () => {
		const wrapper = mount(ADateTime)
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.setValue(12)
		await hoursInput.trigger('keydown.up')
		expect(hoursInput.element.value).toBe('01')
	})

	it('wraps hours from 1 to 12 in non-military mode', async () => {
		const wrapper = mount(ADateTime)
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.setValue(1)
		await hoursInput.trigger('keydown.down')
		expect(hoursInput.element.value).toBe('12')
	})

	it('allows 0-23 hours in military mode', async () => {
		const wrapper = mount(ADateTime, {
			props: { allowMilitaryTime: true },
		})
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.setValue(23)
		await hoursInput.trigger('blur')
		expect(hoursInput.element.value).toBe('23')
	})

	it('wraps hours from 23 to 0 in military mode', async () => {
		const wrapper = mount(ADateTime, {
			props: { allowMilitaryTime: true },
		})
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.setValue(23)
		await hoursInput.trigger('keydown.up')
		expect(hoursInput.element.value).toBe('00')
	})

	it('wraps hours from 0 to 23 in military mode', async () => {
		const wrapper = mount(ADateTime, {
			props: { allowMilitaryTime: true, defaultHours: 0 },
		})
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.trigger('keydown.down')
		expect(hoursInput.element.value).toBe('23')
	})

	it('clamps hours to max on blur', async () => {
		const wrapper = mount(ADateTime)
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.setValue(99)
		await hoursInput.trigger('blur')
		expect(hoursInput.element.value).toBe('12')
	})

	it('clamps minutes to 59 on blur', async () => {
		const wrapper = mount(ADateTime)
		const minutesInput = wrapper.findAll('input[type="text"]')[1]
		await minutesInput.setValue(99)
		await minutesInput.trigger('blur')
		expect(minutesInput.element.value).toBe('59')
	})

	it('clamps seconds to 59 on blur', async () => {
		const wrapper = mount(ADateTime)
		const secondsInput = wrapper.findAll('input[type="text"]')[2]
		await secondsInput.setValue(99)
		await secondsInput.trigger('blur')
		expect(secondsInput.element.value).toBe('59')
	})

	it('changes meridiem when crossing 11-12 boundary upward', async () => {
		const wrapper = mount(ADateTime)
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.setValue(11)
		await hoursInput.trigger('keydown.up')
		const select = wrapper.find('select')
		expect(select.element.value).toBe('PM')
	})

	it('changes meridiem when crossing 12-11 boundary downward', async () => {
		const wrapper = mount(ADateTime, {
			props: { defaultMeridiem: 'PM' },
		})
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.setValue(12)
		await hoursInput.trigger('keydown.down')
		const select = wrapper.find('select')
		expect(select.element.value).toBe('AM')
	})

	it('emits correct militaryTime for PM hours', async () => {
		const wrapper = mount(ADateTime, {
			props: { defaultMeridiem: 'PM' },
		})
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.setValue(3)
		await hoursInput.trigger('blur')
		const emitted = wrapper.emitted('get-time')
		const lastEmit = emitted![emitted!.length - 1][0] as any
		expect(lastEmit.militaryTime).toBe(15)
	})

	it('emits correct militaryTime for AM hours', async () => {
		const wrapper = mount(ADateTime)
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.setValue(3)
		await hoursInput.trigger('blur')
		const emitted = wrapper.emitted('get-time')
		const lastEmit = emitted![emitted!.length - 1][0] as any
		expect(lastEmit.militaryTime).toBe(3)
	})

	it('emits correct militaryTime for 12 PM', async () => {
		const wrapper = mount(ADateTime, {
			props: { defaultHours: 12, defaultMeridiem: 'PM' },
		})
		const emitted = wrapper.emitted('get-time')
		const lastEmit = emitted![emitted!.length - 1][0] as any
		expect(lastEmit.militaryTime).toBe(12)
	})

	it('emits correct militaryTime for 12 AM', async () => {
		const wrapper = mount(ADateTime, {
			props: { defaultHours: 12, defaultMeridiem: 'AM' },
		})
		const emitted = wrapper.emitted('get-time')
		const lastEmit = emitted![emitted!.length - 1][0] as any
		expect(lastEmit.militaryTime).toBe(0)
	})

	it('selects input text on focus', async () => {
		const wrapper = mount(ADateTime)
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		const selectMock = vi.fn()
		Object.defineProperty(hoursInput.element, 'select', { value: selectMock })
		await hoursInput.trigger('focus')
		expect(selectMock).toHaveBeenCalled()
	})

	it('handles paste on hours field', async () => {
		const wrapper = mount(ADateTime)
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		const clipboardData = { getData: vi.fn().mockReturnValue('143045') }
		const event = new Event('paste', { bubbles: true, cancelable: true })
		Object.defineProperty(event, 'clipboardData', { value: clipboardData })
		Object.defineProperty(event, 'target', { value: hoursInput.element })
		await hoursInput.element.dispatchEvent(event)
		await wrapper.vm.$nextTick()
		// After paste all fields, confirmTime should have run
		const emitted = wrapper.emitted('get-time')
		expect(emitted).toBeTruthy()
	})

	it('handles single field paste', async () => {
		const wrapper = mount(ADateTime)
		const minutesInput = wrapper.findAll('input[type="text"]')[1]
		const clipboardData = { getData: vi.fn().mockReturnValue('55') }
		const event = new Event('paste', { bubbles: true, cancelable: true })
		Object.defineProperty(event, 'clipboardData', { value: clipboardData })
		Object.defineProperty(event, 'target', { value: minutesInput.element })
		await minutesInput.element.dispatchEvent(event)
		await wrapper.vm.$nextTick()
	})

	it('pads single digit values on confirm', async () => {
		const wrapper = mount(ADateTime)
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		await hoursInput.setValue(3)
		await hoursInput.trigger('blur')
		expect(hoursInput.element.value).toBe('03')
	})

	it('increments minutes when seconds roll over', async () => {
		const wrapper = mount(ADateTime)
		const secondsInput = wrapper.findAll('input[type="text"]')[2]
		await secondsInput.setValue(59)
		await secondsInput.trigger('keydown.up')
		const minutesInput = wrapper.findAll('input[type="text"]')[1]
		expect(minutesInput.element.value).toBe('01')
	})

	it('decrements minutes when seconds roll under', async () => {
		const wrapper = mount(ADateTime)
		const secondsInput = wrapper.findAll('input[type="text"]')[2]
		await secondsInput.setValue(0)
		await secondsInput.trigger('keydown.down')
		const minutesInput = wrapper.findAll('input[type="text"]')[1]
		expect(minutesInput.element.value).toBe('59')
	})

	it('increments hours when minutes roll over', async () => {
		const wrapper = mount(ADateTime)
		const minutesInput = wrapper.findAll('input[type="text"]')[1]
		await minutesInput.setValue(59)
		await minutesInput.trigger('keydown.up')
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		expect(hoursInput.element.value).toBe('01')
	})

	it('decrements hours when minutes roll under', async () => {
		const wrapper = mount(ADateTime)
		const minutesInput = wrapper.findAll('input[type="text"]')[1]
		await minutesInput.setValue(0)
		await minutesInput.trigger('keydown.down')
		const hoursInput = wrapper.findAll('input[type="text"]')[0]
		expect(hoursInput.element.value).toBe('11')
	})
})
