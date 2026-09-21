import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'

import ADatePicker from '../src/components/form/ADatePicker.vue'
import { focusedDay } from './focused-day'
// For the shared field styles aform's stylesheet gives every app, which size the boxes' text at 1rem.
// oxlint-disable-next-line import/no-unassigned-import
import '../src/components/AForm.vue'

let wrapper: VueWrapper | undefined
let hostReset: HTMLStyleElement | undefined

afterEach(() => wrapper?.unmount())

describe('datepicker component in a browser', { tags: ['browser'] }, () => {
	// A host page styling table cells as the docs site does, collapsed and padded inside their own width,
	// which leaves the calendar's boxes the least room.
	beforeAll(() => {
		hostReset = document.createElement('style')
		hostReset.textContent =
			'table { border-collapse: collapse; border-spacing: 0 } td, th { padding: 8px 12px; box-sizing: border-box }'
		document.head.append(hostReset)
	})

	afterAll(() => hostReset?.remove())

	// Ten characters, as French and British English write a day.
	it('fits a ten-character day in each range box, inside the calendar', () => {
		wrapper = mount(ADatePicker, { props: { selectRange: true }, attachTo: document.body })
		const calendar = wrapper.find('table').element.getBoundingClientRect()
		for (const box of wrapper.findAll('.date-input > input').map(input => input.element as HTMLInputElement)) {
			box.value = '20/09/2026'
			expect(box.scrollWidth).toBeLessThanOrEqual(box.clientWidth)
			expect(box.getBoundingClientRect().right).toBeLessThanOrEqual(calendar.right)
		}
	})
})

/** A calendar between two boxes, so a test can Tab into it and out again. */
const mountBetweenBoxes = (initial: string | null, selectRange = false) => {
	const model = ref<string | null | undefined>(initial)
	const Host = defineComponent({
		setup: () => () =>
			h('div', [
				h('input', { class: 'before' }),
				h(ADatePicker, {
					modelValue: model.value,
					'onUpdate:modelValue': (next: string | null | undefined) => (model.value = next),
					selectRange,
				}),
				h('input', { class: 'after' }),
			]),
	})
	wrapper = mount(Host, { attachTo: document.body })
	const before = wrapper.find('input.before').element as HTMLInputElement
	const after = wrapper.find('input.after').element as HTMLInputElement
	return { model, before, after }
}

describe('datepicker keys in a browser', { tags: ['browser'] }, () => {
	it('is one Tab stop, on its picked day', async () => {
		const { before, after } = mountBetweenBoxes('2026-03-31')
		before.focus()
		await userEvent.keyboard('{Tab}')
		expect(focusedDay()).toBe('March 2026 31')

		await userEvent.keyboard('{Tab}')
		expect(document.activeElement).toBe(after)
	})

	it('moves focus by a day and a week with the arrow keys, into the next and previous month', async () => {
		const { before } = mountBetweenBoxes('2026-03-31')
		before.focus()
		await userEvent.keyboard('{Tab}')
		const visited: (string | null)[] = []
		for (const key of ['{ArrowRight}', '{ArrowDown}', '{ArrowLeft}', '{ArrowUp}', '{ArrowUp}']) {
			// oxlint-disable-next-line eslint/no-await-in-loop -- each key moves from where the last one left focus
			await userEvent.keyboard(key)
			visited.push(focusedDay())
		}
		expect(visited).toEqual(['April 2026 1', 'April 2026 8', 'April 2026 7', 'March 2026 31', 'March 2026 24'])
	})

	it('moves by a month with PageUp and PageDown, and by a year with Shift', async () => {
		const { before } = mountBetweenBoxes('2026-03-31')
		before.focus()
		await userEvent.keyboard('{Tab}')
		const visited: (string | null)[] = []
		for (const key of ['{PageDown}', '{PageUp}', '{Shift>}{PageDown}{/Shift}', '{Shift>}{PageUp}{/Shift}']) {
			// oxlint-disable-next-line eslint/no-await-in-loop -- each key moves from where the last one left focus
			await userEvent.keyboard(key)
			visited.push(focusedDay())
		}
		// April has no 31st, so the day stays on the month's last.
		expect(visited).toEqual(['April 2026 30', 'March 2026 30', 'March 2027 30', 'March 2026 30'])
	})

	it("moves to the week's first and last day with Home and End", async () => {
		// A Wednesday; the calendar's weeks start on Monday.
		const { before } = mountBetweenBoxes('2026-03-18')
		before.focus()
		await userEvent.keyboard('{Tab}{Home}')
		expect(focusedDay()).toBe('March 2026 16')

		await userEvent.keyboard('{End}')
		expect(focusedDay()).toBe('March 2026 22')
	})

	it('picks the focused day with Enter or Space', async () => {
		const { before, model } = mountBetweenBoxes('2026-03-18')
		before.focus()
		await userEvent.keyboard('{Tab}{ArrowRight}{Enter}')
		await expect.poll(() => model.value).toBe('2026-03-19')

		await userEvent.keyboard('{ArrowRight}[Space]')
		await expect.poll(() => model.value).toBe('2026-03-20')
	})

	it('moves its Tab stop with the month shown, so the month buttons leave it on a day', async () => {
		const { before } = mountBetweenBoxes('2026-03-31')
		await userEvent.click(document.querySelector<HTMLElement>('#next-month-btn')!)
		before.focus()
		await userEvent.keyboard('{Tab}')
		expect(focusedDay()).toBe('April 2026 30')
	})

	// The other side of the grid's keys: a range's typed-day boxes sit in the same table, and keep their caret keys.
	it("leaves the arrow keys to a range's typed-day boxes", async () => {
		mountBetweenBoxes(null, true)
		const startBox = document.querySelector<HTMLInputElement>('.date-input-start')!
		startBox.focus()
		await userEvent.keyboard('03/10/2026{ArrowLeft}{ArrowLeft}')
		expect({ focused: document.activeElement, caret: startBox.selectionStart }).toEqual({
			focused: startBox,
			caret: 8,
		})
	})

	it('names each day by its full date and month, and marks the picked day selected', async () => {
		mountBetweenBoxes('2026-03-31')
		const grid = page.getByRole('grid', { name: 'March 2026' })
		await expect.element(grid.getByRole('gridcell', { name: 'Tuesday, March 31, 2026', selected: true })).toBeVisible()
		await expect.element(grid.getByRole('gridcell', { name: 'Monday, March 30, 2026', selected: false })).toBeVisible()
	})

	it("marks a range's start and end selected, as it marks them on screen", async () => {
		mountBetweenBoxes('2026-03-10', true)
		await userEvent.click(page.getByRole('gridcell', { name: 'Tuesday, March 10, 2026' }))
		await userEvent.click(page.getByRole('gridcell', { name: 'Friday, March 13, 2026' }))
		const selected = [...document.querySelectorAll('[aria-selected="true"]')].map(cell => cell.textContent?.trim())
		const marked = [...document.querySelectorAll('.startDate, .endDate, .selectedDate')].map(cell =>
			cell.textContent?.trim()
		)
		expect({ selected, marked }).toEqual({ selected: ['10', '13'], marked: ['10', '13'] })
	})

	it('marks today as the current date', () => {
		mountBetweenBoxes(null)
		expect(document.querySelector('.todaysDate')?.getAttribute('aria-current')).toBe('date')
		expect(document.querySelectorAll('[aria-current]')).toHaveLength(1)
	})
})
