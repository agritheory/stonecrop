import { afterEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { type Component, defineComponent, h, ref } from 'vue'

import ADateRange from '../src/components/form/ADateRange.vue'
import ADateTime from '../src/components/form/ADateTime.vue'
import { focusedDay } from './focused-day'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

/** Today as the calendar's title and day number show it, written with `Date` to check the calendar independently. */
const today = () => {
	const now = new Date()
	return `${now.toLocaleString('en-US', { month: 'long', year: 'numeric' })} ${now.getDate()}`
}

// Midday UTC, so the calendar opens on the 10th in any zone within eleven hours of it.
const FIELDS: { name: string; component: Component; value: unknown; label: string; opensOn: () => string }[] = [
	{
		name: 'date-time',
		component: ADateTime,
		value: '2026-01-10T12:00:00.000Z',
		label: 'Due',
		opensOn: () => 'January 2026 10',
	},
	// The range's calendar opens on today whatever the range holds (date item 9).
	{
		name: 'date range',
		component: ADateRange,
		value: { start_date: '2026-01-10', end_date: '2026-01-20' },
		label: 'Period',
		opensOn: today,
	},
]

const mountField = (field: (typeof FIELDS)[number]) => {
	const model = ref<unknown>(field.value)
	const Host = defineComponent({
		setup: () => () =>
			h('div', { style: 'position: relative; padding: 40px; width: 300px' }, [
				h('input', { class: 'before' }),
				h(field.component, {
					modelValue: model.value,
					'onUpdate:modelValue': (next: unknown) => (model.value = next),
					mode: 'edit',
					uuid: 'field',
					label: field.label,
				}),
			]),
	})
	wrapper = mount(Host, { attachTo: document.body })
	const before = wrapper.find('input.before').element as HTMLInputElement
	const input = wrapper.find('input#field').element as HTMLInputElement
	return { model, input, before }
}

const calendarOpen = () => document.querySelector('.adate-selection') !== null

describe('date-time and date range fields in a browser', { tags: ['browser'] }, () => {
	describe.each(FIELDS)('$name field keys', field => {
		// Plain Down too, as a combobox opens on it; the box is read-only, so its arrows have nothing else to do.
		it('opens its calendar on Space, F4, Alt+Down and Down, with focus on a day', async () => {
			const landed: Record<string, string | null> = {}
			for (const key of ['[Space]', '{F4}', '{Alt>}{ArrowDown}{/Alt}', '{ArrowDown}']) {
				const { input } = mountField(field)
				input.focus()
				// oxlint-disable-next-line eslint/no-await-in-loop -- one key at a time, each on a fresh field
				await userEvent.keyboard(key)
				// oxlint-disable-next-line eslint/no-await-in-loop -- the calendar renders after the key
				await expect.poll(calendarOpen).toBe(true)
				landed[key] = focusedDay()
				wrapper?.unmount()
			}
			const opensOn = field.opensOn()
			expect(landed).toEqual({
				'[Space]': opensOn,
				'{F4}': opensOn,
				'{Alt>}{ArrowDown}{/Alt}': opensOn,
				'{ArrowDown}': opensOn,
			})
		})

		it('closes its calendar on Escape, with focus back in the box', async () => {
			const { input } = mountField(field)
			input.focus()
			await userEvent.keyboard('[Space]')
			await expect.poll(focusedDay).toBe(field.opensOn())

			await userEvent.keyboard('{Escape}')
			await expect
				.poll(() => ({ focused: document.activeElement, calendarOpen: calendarOpen() }))
				.toEqual({ focused: input, calendarOpen: false })
		})

		it('closes its calendar when focus leaves the field', async () => {
			const { input, before } = mountField(field)
			await userEvent.click(input)
			await expect.poll(calendarOpen).toBe(true)

			await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
			await expect
				.poll(() => ({ focused: document.activeElement, calendarOpen: calendarOpen() }))
				.toEqual({ focused: before, calendarOpen: false })
		})

		it('tells a screen reader its box opens a calendar dialog named by the field, and whether it is open', async () => {
			const { input } = mountField(field)
			await expect.element(page.getByRole('combobox', { name: field.label, expanded: false })).toBeVisible()

			input.focus()
			await userEvent.keyboard('[Space]')
			await expect.element(page.getByRole('combobox', { name: field.label, expanded: true })).toBeVisible()
			const dialog = page.getByRole('dialog', { name: field.label })
			await expect.element(dialog).toBeVisible()
			expect(input.getAttribute('aria-controls')).toBe(dialog.element().id)
		})
	})

	it("puts focus back in the box once the range's end is picked by key", async () => {
		const { input, model } = mountField(FIELDS[1])
		input.focus()
		await userEvent.keyboard('[Space]')
		await expect.poll(focusedDay).toBe(today())

		await userEvent.keyboard('{Enter}{ArrowRight}{Enter}')
		await expect
			.poll(() => ({ focused: document.activeElement, calendarOpen: calendarOpen() }))
			.toEqual({ focused: input, calendarOpen: false })
		const { start_date, end_date } = model.value as { start_date: string; end_date: string }
		expect(new Date(end_date).getTime() - new Date(start_date).getTime()).toBe(24 * 60 * 60 * 1000)
	})

	// The time is picked after the day, so the calendar stays open.
	it('keeps its calendar open, with focus on the day, once a day is picked by key', async () => {
		const { input } = mountField(FIELDS[0])
		input.focus()
		await userEvent.keyboard('[Space]')
		await expect.poll(focusedDay).toBe('January 2026 10')

		await userEvent.keyboard('{ArrowRight}{Enter}')
		await expect
			.poll(() => ({ day: focusedDay(), calendarOpen: calendarOpen() }))
			.toEqual({ day: 'January 2026 11', calendarOpen: true })
	})

	it('moves focus to a day clicked while focus is on a day', async () => {
		const { input } = mountField(FIELDS[0])
		input.focus()
		await userEvent.keyboard('[Space]')
		await expect.poll(focusedDay).toBe('January 2026 10')

		await userEvent.click(page.getByRole('gridcell', { name: 'Thursday, January 15, 2026' }))
		await expect.poll(focusedDay).toBe('January 2026 15')
	})

	it('leaves focus in the box when a day is clicked', async () => {
		const { input } = mountField(FIELDS[0])
		await userEvent.click(input)
		await userEvent.click(page.getByRole('gridcell', { name: 'Thursday, January 15, 2026' }))
		await expect
			.poll(() => ({ focused: document.activeElement, value: input.value }))
			.toEqual({ focused: input, value: expect.stringContaining('1/15/2026') })
	})
})
