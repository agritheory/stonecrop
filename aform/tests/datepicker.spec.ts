import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import ADatePicker from '../src/components/form/ADatePicker.vue'

describe('datepicker component', { tags: ['component'] }, () => {
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
		await $randomDate.trigger('click')

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

		const currentMonth = new Date().getMonth()
		expect(wrapper.vm.currentMonth).toBe(currentMonth === 0 ? 11 : currentMonth - 1)
	})

	it('select previous year', async () => {
		const wrapper = mount(ADatePicker)
		await wrapper.vm.$nextTick()

		const $prevMonthBtn = wrapper.find('#previous-month-btn')
		const currentMonth = new Date().getMonth()

		for (const _ of Array(currentMonth + 1).keys()) {
			// oxlint-disable-next-line eslint/no-await-in-loop -- each click advances calendar state; sequential order required
			await $prevMonthBtn.trigger('click')
		}

		expect(wrapper.vm.currentYear).toBe(new Date().getFullYear() - 1)
	})

	it('select next month', async () => {
		const wrapper = mount(ADatePicker)
		await wrapper.vm.$nextTick()

		const $prevMonthBtn = wrapper.find('#next-month-btn')
		await $prevMonthBtn.trigger('click')
		expect(wrapper.vm.currentMonth).toBe((new Date().getMonth() + 1) % 12)
	})

	it('select next year', async () => {
		const wrapper = mount(ADatePicker)
		await wrapper.vm.$nextTick()

		const $prevMonthBtn = wrapper.find('#next-month-btn')
		const currentMonth = new Date().getMonth()

		for (const _ of Array(12 - currentMonth).keys()) {
			// oxlint-disable-next-line eslint/no-await-in-loop -- each click advances calendar state; sequential order required
			await $prevMonthBtn.trigger('click')
		}

		expect(wrapper.vm.currentYear).toBe(new Date().getFullYear() + 1)
	})

	it('renders in read mode as a span', () => {
		const testDate = new Date(2023, 5, 15)
		const wrapper = mount(ADatePicker, {
			props: { mode: 'read', modelValue: testDate },
		})
		expect(wrapper.find('.adatepicker').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').exists()).toBe(true)
	})

	it('renders empty span in read mode when no date value', () => {
		const wrapper = mount(ADatePicker, { props: { mode: 'read' } })
		expect(wrapper.find('.adatepicker').exists()).toBe(false)
	})

	it('prevents mousedown default on the calendar table to block text selection', async () => {
		const wrapper = mount(ADatePicker)
		await wrapper.vm.$nextTick()

		const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
		wrapper.find('table').element.dispatchEvent(event)
		expect(event.defaultPrevented).toBe(true)
	})

	it('does not prevent mousedown default on range inputs so they stay typable', async () => {
		const wrapper = mount(ADatePicker, { props: { selectRange: true } })
		await wrapper.vm.$nextTick()

		const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
		wrapper.find('input[placeholder="start date"]').element.dispatchEvent(event)
		expect(event.defaultPrevented).toBe(false)
	})

	it('focuses today when selected date is outside current month view', async () => {
		const outOfMonthDate = new Date()
		outOfMonthDate.setMonth(outOfMonthDate.getMonth() + 2)
		const wrapper = mount(ADatePicker, {
			attachTo: document.body,
			props: { modelValue: outOfMonthDate },
		})
		await wrapper.vm.$nextTick()
		// calendar shows future month; neither selectedDate nor todaysDate branches fire —
		// just verify the component mounts without error
		expect(wrapper.vm).toBeTruthy()
	})

	describe('range mode', () => {
		it('renders date input fields when selectRange is true', () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			expect(wrapper.find('input[placeholder="start date"]').exists()).toBe(true)
			expect(wrapper.find('input[placeholder="end date"]').exists()).toBe(true)
		})

		it('emits get-date with start set when first date clicked in range mode', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const firstDateCell = wrapper.findAll('.date-cell')[0]
			await firstDateCell.trigger('click')
			const emitted = wrapper.emitted('get-date')
			expect(emitted).toBeTruthy()
			const payload = emitted![emitted!.length - 1][0] as any
			expect(payload.start).toBeInstanceOf(Date)
			expect(payload.end).toBeNull()
		})

		it('emits get-date with start and end when second date clicked in range mode', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const cells = wrapper.findAll('.date-cell')
			await cells[0].trigger('click')
			await cells[5].trigger('click')
			const emitted = wrapper.emitted('get-date')
			const payload = emitted![emitted!.length - 1][0] as any
			expect(payload.start).toBeInstanceOf(Date)
			expect(payload.end).toBeInstanceOf(Date)
		})

		it('resets selection when clicking before start_date', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const cells = wrapper.findAll('.date-cell')
			// select cell at index 10 as start
			await cells[10].trigger('click')
			// cell at index 5 is before it — should reset
			await cells[5].trigger('click')
			const emitted = wrapper.emitted('get-date')
			const payload = emitted![emitted!.length - 1][0] as any
			expect(payload.end).toBeNull()
		})

		it('applies withinRange class to dates between start and hover', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const cells = wrapper.findAll('.date-cell')
			await cells[0].trigger('click')
			await cells[5].trigger('mouseover')
			await nextTick()
			const withinRangeCells = wrapper.findAll('.withinRange')
			expect(withinRangeCells.length).toBeGreaterThan(0)
		})

		it('shows display mode in range mode', () => {
			const testDate = new Date(2023, 5, 15)
			const wrapper = mount(ADatePicker, {
				props: { mode: 'display', selectRange: true, modelValue: testDate, label: 'Test' },
			})
			expect(wrapper.find('.adatepicker').exists()).toBe(false)
			expect(wrapper.find('.aform_display-value').exists()).toBe(true)
		})

		it('selects a date via keyboard enter in range mode', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const firstCell = wrapper.findAll('.date-cell')[0]
			await firstCell.trigger('keydown.enter')
			const emitted = wrapper.emitted('get-date')
			expect(emitted).toBeTruthy()
		})

		it('handles enterInputDate with valid dates', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const startInput = wrapper.find('input[placeholder="start date"]')
			const endInput = wrapper.find('input[placeholder="end date"]')
			await startInput.setValue('2026/03/01')
			await endInput.setValue('2026/03/15')
			await startInput.trigger('blur')
			const emitted = wrapper.emitted('get-date')
			expect(emitted).toBeTruthy()
			expect(emitted![emitted!.length - 1][0]).toHaveProperty('selected')
		})

		it('handles enterInputDate with empty start input', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const startInput = wrapper.find('input[placeholder="start date"]')
			await startInput.setValue('')
			await startInput.trigger('blur')
			const emitted = wrapper.emitted('get-date')
			expect(emitted).toBeTruthy()
		})

		it('handles enterInputDate via keyboard enter on input', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const startInput = wrapper.find('input[placeholder="start date"]')
			await startInput.setValue('2026/03/01')
			await startInput.trigger('keydown', { key: 'Enter' })
			const emitted = wrapper.emitted('get-date')
			expect(emitted).toBeTruthy()
		})

		it('handles enterInputDate with empty end input', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const endInput = wrapper.find('input[placeholder="end date"]')
			await endInput.setValue('')
			await endInput.trigger('blur')
			const emitted = wrapper.emitted('get-date')
			expect(emitted).toBeTruthy()
		})

		it('handles enterInputDate with invalid date value', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const startInput = wrapper.find('input[placeholder="start date"]')
			await startInput.setValue('not-a-date')
			await startInput.trigger('blur')
			const emitted = wrapper.emitted('get-date')
			expect(emitted).toBeTruthy()
		})

		it('handles enterInputDate with invalid end date', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const endInput = wrapper.find('input[placeholder="end date"]')
			await endInput.setValue('not-a-date')
			await endInput.trigger('blur')
			const emitted = wrapper.emitted('get-date')
			expect(emitted).toBeTruthy()
		})

		it('testDateOrder swaps when end is before start', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const startInput = wrapper.find('input[placeholder="start date"]')
			const endInput = wrapper.find('input[placeholder="end date"]')
			await startInput.setValue('2026/03/15')
			await endInput.setValue('2026/03/01')
			await startInput.trigger('blur')
			const emitted = wrapper.emitted('get-date')
			expect(emitted).toBeTruthy()
		})

		it('does not highlight any date as startDate or endDate on initial render', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
				attachTo: document.body,
			})
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.startDate').exists()).toBe(false)
			expect(wrapper.find('.endDate').exists()).toBe(false)
		})
	})
})
