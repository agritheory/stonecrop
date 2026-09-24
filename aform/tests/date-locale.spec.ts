import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import ADatePicker from '../src/components/form/ADatePicker.vue'
import ADateRange from '../src/components/form/ADateRange.vue'
import ADateTime from '../src/components/form/ADateTime.vue'

// A browser whose locale is French. Set before any import runs, because the Temporal polyfill keeps the
// `Intl.DateTimeFormat` it finds when it loads.
const runtimeDateTimeFormat = vi.hoisted(() => {
	const browserDateTimeFormat = Intl.DateTimeFormat
	Intl.DateTimeFormat = class extends browserDateTimeFormat {
		constructor(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions) {
			super(locales ?? 'fr-FR', options)
		}
	} as typeof Intl.DateTimeFormat
	return browserDateTimeFormat
})

describe('dates in a French browser', { tags: ['component'] }, () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date(2026, 1, 15, 12))
	})

	afterEach(() => vi.useRealTimers())

	afterAll(() => {
		Intl.DateTimeFormat = runtimeDateTimeFormat
	})

	it("names the calendar's weekdays in French", () => {
		const wrapper = mount(ADatePicker)
		expect(wrapper.findAll('tr.days-header td').map(cell => cell.text())).toEqual(['L', 'M', 'M', 'J', 'V', 'S', 'D'])
	})

	it('writes the picked days into the range boxes as French writes them', async () => {
		const wrapper = mount(ADatePicker, { props: { selectRange: true } })
		await nextTick()
		// February 2026's grid starts on Monday 26 January, so its cells 9 and 25 are 4 and 20 February.
		const cells = wrapper.findAll('td.date-cell')
		await cells[9].trigger('click')
		await cells[25].trigger('click')
		const boxes = ['start date', 'end date'].map(
			placeholder => (wrapper.find(`input[placeholder="${placeholder}"]`).element as HTMLInputElement).value
		)
		expect(boxes).toEqual(['04/02/2026', '20/02/2026'])
	})

	it('reads days typed into the range boxes as French writes them', async () => {
		const wrapper = mount(ADatePicker, { props: { selectRange: true } })
		await nextTick()
		const startInput = wrapper.find('input[placeholder="start date"]')
		await startInput.setValue('04/02/2026')
		await wrapper.find('input[placeholder="end date"]').setValue('20/02/2026')
		await startInput.trigger('blur')
		expect(wrapper.emitted('get-date')?.at(-1)?.[0]).toMatchObject({ start: '2026-02-04', end: '2026-02-20' })
	})

	it('reads no day from text in an order French does not write', async () => {
		const wrapper = mount(ADatePicker, { props: { selectRange: true } })
		await nextTick()
		const startInput = wrapper.find('input[placeholder="start date"]')
		await startInput.setValue('2026/02/04')
		await startInput.trigger('blur')
		expect(wrapper.emitted('get-date')?.at(-1)?.[0]).toMatchObject({ start: null })
	})

	it('shows a range in the range field as French writes it', () => {
		const wrapper = mount(ADateRange, { props: { modelValue: { start_date: '2026-02-04', end_date: '2026-02-20' } } })
		expect(wrapper.find('input').element.value).toBe('04/02/2026 — 20/02/2026')
	})

	it.each([
		{ useSeconds: true, text: '20/02/2026 12:34:56' },
		{ useSeconds: false, text: '20/02/2026 12:34' },
	])('shows a date and time as French writes it, with seconds only when used: $useSeconds', ({ useSeconds, text }) => {
		const modelValue = new Date(2026, 1, 20, 12, 34, 56).toISOString()
		const field = mount(ADateTime, { props: { modelValue, useSeconds } })
		expect(field.find<HTMLInputElement>('.aform_input-field').element.value).toBe(text)
		const display = mount(ADateTime, { props: { modelValue, useSeconds, mode: 'display' } })
		expect(display.find('.aform_display-value').text()).toBe(text)
	})
})
