import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import ADatePicker from '../src/components/form/ADatePicker.vue'

/** The `YYYY-MM-DD` day a Date falls on locally, written out by hand so it checks the calendar independently. */
const localDay = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

/** The day in grid cell `index` of this month's calendar, which starts on the Monday on or before the 1st. */
const gridDay = (index: number) => {
	const today = new Date()
	const daysSinceMonday = (new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 6) % 7
	return localDay(new Date(today.getFullYear(), today.getMonth(), 1 + index - daysSinceMonday))
}

describe('datepicker component', { tags: ['component'] }, () => {
	it('emits update event when date is changed', async () => {
		const wrapper = mount(ADatePicker)
		await wrapper.vm.$nextTick()

		await wrapper.find('.todaysDate').trigger('click')
		await wrapper.vm.$nextTick()

		const updateEvents = wrapper.emitted('update:modelValue')
		expect(updateEvents).toBeTruthy()
		expect(updateEvents![0][0]).toBe(localDay(new Date()))
	})

	// A field that opens the calendar keeps focus in its box, and a form showing one inline keeps focus where it was.
	it('leaves focus where it was when it appears', async () => {
		const box = document.createElement('input')
		document.body.append(box)
		box.focus()
		const wrapper = mount(ADatePicker, { attachTo: document.body })
		await nextTick()
		await nextTick()

		expect(document.activeElement).toBe(box)
		wrapper.unmount()
		box.remove()
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

	it('moves to a day handed to it, and marks it', async () => {
		const wrapper = mount(ADatePicker, { props: { modelValue: '2026-03-10' } })
		await wrapper.setProps({ modelValue: '2026-05-24' })
		expect([
			wrapper.vm.currentYear,
			wrapper.vm.currentMonth,
			wrapper.findAll('td.selectedDate').map(cell => cell.text()),
		]).toEqual([2026, 4, ['24']])
	})

	it('stays where it was when handed no day', async () => {
		const wrapper = mount(ADatePicker, { props: { modelValue: '2026-03-10' } })
		await wrapper.setProps({ modelValue: null })
		expect([
			wrapper.vm.currentYear,
			wrapper.vm.currentMonth,
			wrapper.findAll('td.selectedDate').map(cell => cell.text()),
		]).toEqual([2026, 2, ['10']])
	})

	// March 2026's grid runs from Monday 23 February to Sunday 5 April.
	it('stays on the month shown when a day of the next month is picked in it', async () => {
		const wrapper = mount(ADatePicker, {
			props: {
				modelValue: '2026-03-10',
				'onUpdate:modelValue': (day: string | null | undefined) => wrapper.setProps({ modelValue: day }),
			},
		})
		await wrapper.findAll('td.date-cell').at(-1)!.trigger('click')
		expect([wrapper.props('modelValue'), wrapper.vm.currentMonth]).toEqual(['2026-04-05', 2])
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
		const wrapper = mount(ADatePicker, {
			props: { mode: 'read', modelValue: '2023-06-15' },
		})
		expect(wrapper.find('.adatepicker').exists()).toBe(false)
		expect(wrapper.find('.aform_display-value').text()).toBe(new Date(2023, 5, 15).toLocaleDateString())
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
			expect(payload.start).toBe(gridDay(0))
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
			expect([payload.start, payload.end]).toEqual([gridDay(0), gridDay(5)])
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
			const wrapper = mount(ADatePicker, {
				props: { mode: 'display', selectRange: true, modelValue: '2023-06-15', label: 'Test' },
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
			await startInput.setValue('2026-03-01')
			await endInput.setValue('2026-03-15')
			await startInput.trigger('blur')
			expect(wrapper.emitted('get-date')?.at(-1)).toEqual([
				{ start: '2026-03-01', end: '2026-03-15', selected: '2026-03-01' },
			])
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
			await startInput.setValue('2026-03-01')
			await startInput.trigger('keydown', { key: 'Enter' })
			expect(wrapper.emitted('get-date')?.at(-1)?.[0]).toMatchObject({ start: '2026-03-01' })
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
			expect(wrapper.emitted('get-date')?.at(-1)?.[0]).toMatchObject({ start: null })
		})

		it('handles enterInputDate with invalid end date', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const endInput = wrapper.find('input[placeholder="end date"]')
			await endInput.setValue('not-a-date')
			await endInput.trigger('blur')
			expect(wrapper.emitted('get-date')?.at(-1)?.[0]).toMatchObject({ end: null })
		})

		it('testDateOrder swaps when end is before start', async () => {
			const wrapper = mount(ADatePicker, {
				props: { selectRange: true },
			})
			await wrapper.vm.$nextTick()
			const startInput = wrapper.find('input[placeholder="start date"]')
			const endInput = wrapper.find('input[placeholder="end date"]')
			await startInput.setValue('2026-03-15')
			await endInput.setValue('2026-03-01')
			await startInput.trigger('blur')
			expect(wrapper.emitted('get-date')?.at(-1)?.[0]).toMatchObject({ start: '2026-03-01', end: '2026-03-15' })
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

	describe('month grid', () => {
		const days = (first: number, last: number) => Array.from({ length: last - first + 1 }, (_, index) => first + index)

		const gridFor = async (zone: string, today: [number, number, number]) => {
			vi.stubEnv('TZ', zone)
			vi.useFakeTimers({ toFake: ['Date'] })
			vi.setSystemTime(new Date(...today, 12))
			const wrapper = mount(ADatePicker)
			await nextTick()
			return wrapper.findAll('td.date-cell').map(cell => Number(cell.text()))
		}

		afterEach(() => {
			vi.useRealTimers()
			vi.unstubAllEnvs()
		})

		it('starts on the Monday before a month that begins on a Sunday', async () => {
			// February 2026 begins on a Sunday.
			expect(await gridFor('UTC', [2026, 1, 15])).toEqual([...days(26, 31), ...days(1, 28), ...days(1, 8)])
		})

		it('numbers each day once across a daylight saving change', async () => {
			// October 2026's grid runs to 8 November, and New York leaves daylight saving on 1 November.
			expect(await gridFor('America/New_York', [2026, 9, 15])).toEqual([...days(28, 30), ...days(1, 31), ...days(1, 8)])
		})
	})

	// Pinned zones, because a day read as UTC midnight only shifts west of UTC, and CI runs in UTC.
	describe.each(['Asia/Kolkata', 'America/New_York'])('holding a day, in %s', zone => {
		beforeEach(() => {
			vi.stubEnv('TZ', zone)
			vi.useFakeTimers({ toFake: ['Date'] })
			vi.setSystemTime(new Date(2026, 0, 15, 12))
		})

		afterEach(() => {
			vi.useRealTimers()
			vi.unstubAllEnvs()
		})

		it('opens on the day it holds', async () => {
			const wrapper = mount(ADatePicker, { props: { modelValue: '2026-02-01' } })
			await nextTick()
			expect([wrapper.vm.currentYear, wrapper.vm.currentMonth]).toEqual([2026, 1])
			expect(wrapper.findAll('td.selectedDate').map(cell => cell.text())).toEqual(['1'])
		})

		it('hands back the day picked as that day', async () => {
			const wrapper = mount(ADatePicker, { props: { modelValue: '2026-02-01' } })
			await nextTick()
			const tenth = wrapper.findAll('td.date-cell').filter(cell => cell.text() === '10')
			expect(tenth).toHaveLength(1)
			await tenth[0].trigger('click')
			expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-02-10'])
			expect(wrapper.emitted('get-date')?.at(-1)).toEqual([{ start: null, end: null, selected: '2026-02-10' }])
		})

		it('sets an empty calendar to today when today is picked', async () => {
			const wrapper = mount(ADatePicker)
			await nextTick()
			await wrapper.find('td.todaysDate').trigger('click')
			expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-01-15'])
		})

		it('shows no day when it holds none', () => {
			const wrapper = mount(ADatePicker, { props: { mode: 'read' } })
			expect(wrapper.find('.aform_display-value').text()).toBe('')
		})

		it('reads a day typed as YYYY-MM-DD into a range box as that day', async () => {
			const wrapper = mount(ADatePicker, { props: { selectRange: true } })
			await nextTick()
			const startInput = wrapper.find('input[placeholder="start date"]')
			await startInput.setValue('2026-02-04')
			await startInput.trigger('blur')
			expect(wrapper.emitted('get-date')?.at(-1)).toEqual([{ start: '2026-02-04', end: null, selected: '2026-02-04' }])
		})

		it('reads no day from a day typed into a range box that does not exist', async () => {
			const wrapper = mount(ADatePicker, { props: { selectRange: true } })
			await nextTick()
			const startInput = wrapper.find('input[placeholder="start date"]')
			await startInput.setValue('2026-02-30')
			await startInput.trigger('blur')
			expect(wrapper.emitted('get-date')?.at(-1)).toEqual([{ start: null, end: null, selected: '2026-01-15' }])
		})
	})
})
