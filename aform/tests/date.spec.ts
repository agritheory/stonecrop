import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import ADate from '../src/components/form/ADate.vue'
import ADateSelection from '../src/components/form/ADateSelection.vue'
import ADatePicker from '../src/components/form/ADatePicker.vue'
import ADateTimeInput from '../src/components/form/ADateTimeInput.vue'

const globalComponents = {
	global: {
		components: {
			ADateSelection,
			ADatePicker,
			ADateTimeInput,
		},
	},
}

describe('date component', { tags: ['component'] }, () => {
	it('uses shared form field classes', () => {
		const wrapper = mount(ADate, globalComponents)
		expect(wrapper.find('.aform_form-element').exists()).toBe(true)
		expect(wrapper.find('.aform_input-field').exists()).toBe(true)
		expect(wrapper.find('.aform_field-label').exists()).toBe(true)
	})

	it('date input is rendered', async () => {
		const wrapper = mount(ADate, globalComponents)
		const $input = wrapper.find('input')
		expect($input.exists()).toBe(true)
		expect($input.attributes('type')).toBe('date')
	})

	it('date input is rendered with value', async () => {
		const wrapper = mount(ADate, {
			...globalComponents,
			props: {
				modelValue: '2021-01-01',
			},
		})

		const $input = wrapper.find('input')
		expect($input.element.value).toBe('2021-01-01')
	})

	it('date input is disabled by default', async () => {
		const wrapper = mount(ADate, {
			...globalComponents,
			props: {
				mode: 'read',
			},
		})

		const $input = wrapper.find('input')
		expect($input.attributes()).toHaveProperty('disabled')
	})

	it('date input is required', async () => {
		const wrapper = mount(ADate, globalComponents)
		const $input = wrapper.find('input')

		// TODO: setup environment to test spawning the datepicker
		await $input.trigger('click')
		expect($input.element.showPicker).toBeUndefined()
	})

	it('formats date value on input change', async () => {
		const wrapper = mount(ADate, globalComponents)
		const $input = wrapper.find('input')
		await $input.setValue('2023-06-15')
		await wrapper.vm.$nextTick()
		expect(($input.element as HTMLInputElement).value).toBe('2023-06-15')
	})

	it('renders in display mode with formatted date', () => {
		const wrapper = mount(ADate, {
			...globalComponents,
			props: { modelValue: '2021-01-01', mode: 'display' },
		})
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').exists()).toBe(true)
	})

	it('renders in display mode with empty span when no value', () => {
		const wrapper = mount(ADate, {
			...globalComponents,
			props: { mode: 'display' },
		})
		expect(wrapper.find('input').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').text()).toBe('')
	})

	it('toggles custom date picker when input is clicked', async () => {
		const wrapper = mount(ADate, globalComponents)
		expect(wrapper.findComponent(ADateSelection).exists()).toBe(false)
		await wrapper.find('input').trigger('click')
		expect(wrapper.findComponent(ADateSelection).exists()).toBe(true)
		await wrapper.find('input').trigger('click')
		expect(wrapper.findComponent(ADateSelection).exists()).toBe(false)
	})

	it('handles date selection from picker', async () => {
		const emitted: (string | null | undefined)[] = []
		const wrapper = mount(ADate, {
			...globalComponents,
			props: { 'onUpdate:modelValue': (v: string | null | undefined) => emitted.push(v) },
		})
		await wrapper.find('input').trigger('click')
		const picker = wrapper.findComponent(ADateSelection)
		await picker.vm.$emit('get-date', { selected: '2023-06-15' })
		expect(emitted).toEqual(['2023-06-15'])
	})

	// A day field over a date-time column must show its mismatch rather than a day read out of the moment.
	it('shows a value that is not a day as an invalid date', () => {
		const wrapper = mount(ADate, {
			...globalComponents,
			props: { modelValue: '2026-01-10T09:00:00+00:00', mode: 'display' },
		})
		expect(wrapper.find('.aform_display-value').text()).toBe('Invalid Date')
	})

	it('shows an empty input when the field has no value', () => {
		const wrapper = mount(ADate, globalComponents)
		expect(wrapper.find('input').element.value).toBe('')
	})

	it('empties the input when the value is cleared', async () => {
		const wrapper = mount(ADate, { ...globalComponents, props: { modelValue: '2026-01-10' } })
		await wrapper.setProps({ modelValue: '' })
		expect(wrapper.find('input').element.value).toBe('')
	})

	it('holds null once the input is cleared by hand', async () => {
		const emitted: (string | null | undefined)[] = []
		const renderErrors: unknown[] = []
		const wrapper = mount(ADate, {
			global: { ...globalComponents.global, config: { errorHandler: error => void renderErrors.push(error) } },
			props: { modelValue: '2026-01-10', 'onUpdate:modelValue': (v: string | null | undefined) => emitted.push(v) },
		})
		await wrapper.find('input').setValue('')
		expect(renderErrors).toEqual([])
		expect(emitted).toEqual([null])
	})

	it('opens the calendar on the month of the field value', async () => {
		const wrapper = mount(ADate, { ...globalComponents, props: { modelValue: '2024-03-15' } })
		await wrapper.find('input').trigger('click')
		const picker = wrapper.findComponent(ADatePicker)
		expect([picker.vm.currentYear, picker.vm.currentMonth]).toEqual([2024, 2])
	})

	it('marks a day typed while the calendar is open, on its month', async () => {
		const wrapper = mount(ADate, { ...globalComponents, props: { modelValue: '2024-03-15' } })
		const $input = wrapper.find('input')
		await $input.trigger('click')
		await $input.setValue('2024-05-20')
		const picker = wrapper.findComponent(ADatePicker)
		expect([
			picker.vm.currentYear,
			picker.vm.currentMonth,
			wrapper.findAll('td.selectedDate').map(cell => cell.text()),
		]).toEqual([2024, 4, ['20']])
	})

	it('marks the day the field holds as picked', async () => {
		const wrapper = mount(ADate, { ...globalComponents, props: { modelValue: '2024-03-15' } })
		await wrapper.find('input').trigger('click')
		expect(wrapper.findAll('td.selectedDate').map(cell => cell.text())).toEqual(['15'])
	})

	// Pinned zones, because the runner's own zone hides these: CI runs in UTC, where both pass.
	describe.each(['Asia/Kolkata', 'America/New_York'])('in %s', zone => {
		beforeEach(() => {
			vi.stubEnv('TZ', zone)
			vi.useFakeTimers({ toFake: ['Date'] })
			vi.setSystemTime(new Date(2026, 0, 15, 12))
		})

		afterEach(() => {
			vi.useRealTimers()
			vi.unstubAllEnvs()
		})

		it('saves the day picked in the calendar', async () => {
			const emitted: (string | null | undefined)[] = []
			const wrapper = mount(ADate, {
				...globalComponents,
				props: { 'onUpdate:modelValue': (v: string | null | undefined) => emitted.push(v) },
			})
			await wrapper.find('input').trigger('click')
			const tenth = wrapper.findAll('td.date-cell').filter(cell => cell.text() === '10')
			expect(tenth).toHaveLength(1)
			await tenth[0].trigger('click')
			expect(emitted.at(-1)).toBe('2026-01-10')
		})

		it('displays the stored day', () => {
			const wrapper = mount(ADate, {
				...globalComponents,
				props: { modelValue: '2026-01-10', mode: 'display' },
			})
			expect(wrapper.find('.aform_display-value').text()).toBe(new Date(2026, 0, 10).toLocaleDateString())
		})
	})
})
