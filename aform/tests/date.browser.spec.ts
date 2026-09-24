import { afterEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'

import ADate from '../src/components/form/ADate.vue'
import { focusedDay } from './focused-day'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

const mountDate = (initial: string) => {
	const model = ref<string | null | undefined>(initial)
	const renderErrors: unknown[] = []
	const Host = defineComponent({
		setup: () => () =>
			h('div', { style: 'position: relative; padding: 40px; width: 300px' }, [
				h('input', { class: 'before' }),
				h(ADate, {
					modelValue: model.value,
					'onUpdate:modelValue': (next: string | null | undefined) => (model.value = next),
					mode: 'edit',
					uuid: 'date',
				}),
			]),
	})
	wrapper = mount(Host, {
		attachTo: document.body,
		global: { config: { errorHandler: error => void renderErrors.push(error) } },
	})
	const before = wrapper.find('input.before').element as HTMLInputElement
	const input = wrapper.find('input#date').element as HTMLInputElement
	return { model, input, before, renderErrors }
}

const calendarOpen = () => document.querySelector('.adate-selection') !== null

// Keys a date input could plausibly open its calendar on, in `userEvent.keyboard` syntax.
const CANDIDATE_KEYS = [
	'[Space]',
	'{Enter}',
	'{F4}',
	'{Alt>}{ArrowDown}{/Alt}',
	'{Alt>}{ArrowUp}{/Alt}',
	'{ArrowDown}',
	'{ArrowUp}',
	'{PageDown}',
	'{PageUp}',
	'{Home}',
	'{End}',
]

/** Whether pressing `key` in `input` opens the browser's own calendar. */
const opensBrowserCalendar = async (input: HTMLInputElement, key: string) => {
	input.focus()
	await userEvent.keyboard(key)
	// A fixed wait rather than a poll: for most keys the assertion is that the calendar never opens.
	await new Promise(settled => setTimeout(settled, 100))
	return input.matches(':open')
}

describe('date component in a browser', { tags: ['browser'] }, () => {
	it('keeps a month typed with a leading zero', async () => {
		const { input, model, renderErrors } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('03')

		await expect
			.poll(() => ({ model: model.value, renderErrors: renderErrors.map(String) }))
			.toEqual({ model: '2026-03-10', renderErrors: [] })
	})

	// Chrome reports a date input with any part missing as `''`, and keeps the parts still typed.
	it('holds null once a part of its day is cleared, and the day again once it is retyped', async () => {
		const { input, model, renderErrors } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('{Backspace}')
		await expect.poll(() => model.value).toBeNull()

		await userEvent.keyboard('03')
		await expect
			.poll(() => ({ model: model.value, renderErrors: renderErrors.map(String) }))
			.toEqual({ model: '2026-03-10', renderErrors: [] })
	})

	it("opens only aform's calendar when the calendar icon is clicked", async () => {
		const { input } = mountDate('2026-01-10')
		const box = input.getBoundingClientRect()
		await userEvent.click(input, { position: { x: box.width - 10, y: box.height / 2 } })
		// A fixed wait rather than a poll: the assertion is that the browser's calendar never opens.
		await new Promise(settled => setTimeout(settled, 200))

		expect({ browser: input.matches(':open'), aform: calendarOpen() }).toEqual({ browser: false, aform: true })
	})

	it('keeps focus in the field after a click, so a month can be typed', async () => {
		const { input, model, renderErrors } = mountDate('2026-01-10')
		await userEvent.click(input, { position: { x: 12, y: input.getBoundingClientRect().height / 2 } })
		await userEvent.keyboard('3')

		await expect
			.poll(() => ({
				focused: document.activeElement,
				model: model.value,
				calendarOpen: calendarOpen(),
				renderErrors: renderErrors.map(String),
			}))
			.toEqual({ focused: input, model: '2026-03-10', calendarOpen: true, renderErrors: [] })
	})

	// The keys a plain date input opens its calendar on, so a key a later Chrome adds among them goes red here.
	it("finds the browser's calendar opening on exactly Space, F4 and Alt+Down in a plain date input", async () => {
		const opening: string[] = []
		for (const key of CANDIDATE_KEYS) {
			const plain = document.createElement('input')
			plain.type = 'date'
			document.body.append(plain)
			// oxlint-disable-next-line eslint/no-await-in-loop -- one key at a time, each on a fresh input
			if (await opensBrowserCalendar(plain, key)) opening.push(key)
			plain.remove()
		}
		expect(opening).toEqual(['[Space]', '{F4}', '{Alt>}{ArrowDown}{/Alt}'])
	})

	it("opens the browser's calendar on none of those keys", async () => {
		const opening: string[] = []
		for (const key of CANDIDATE_KEYS) {
			const { input } = mountDate('2026-01-10')
			// oxlint-disable-next-line eslint/no-await-in-loop -- one key at a time, each on a fresh field
			if (await opensBrowserCalendar(input, key)) opening.push(key)
			wrapper?.unmount()
		}
		expect(opening).toEqual([])
	})

	// The month is the first part, so Shift+Tab from it leaves the field rather than moving to another part.
	// The other side of the key block: it must not swallow the arrows that step a part.
	it('still steps a part of its day with the arrow keys', async () => {
		const { input, model } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('{ArrowUp}')
		await expect.poll(() => model.value).toBe('2026-02-10')

		await userEvent.keyboard('{ArrowDown}{ArrowDown}')
		await expect.poll(() => model.value).toBe('2026-12-10')
	})

	it('closes the calendar when focus leaves the field', async () => {
		const { input, before } = mountDate('2026-01-10')
		await userEvent.click(input, { position: { x: 12, y: input.getBoundingClientRect().height / 2 } })
		await expect.poll(calendarOpen).toBe(true)

		await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
		await expect
			.poll(() => ({ focused: document.activeElement, calendarOpen: calendarOpen() }))
			.toEqual({ focused: before, calendarOpen: false })
	})

	it("opens aform's calendar on Space, F4 and Alt+Down, with focus on the field's day", async () => {
		const landed: Record<string, string | null> = {}
		for (const key of ['[Space]', '{F4}', '{Alt>}{ArrowDown}{/Alt}']) {
			const { input } = mountDate('2026-01-10')
			input.focus()
			// oxlint-disable-next-line eslint/no-await-in-loop -- one key at a time, each on a fresh field
			await userEvent.keyboard(key)
			// oxlint-disable-next-line eslint/no-await-in-loop -- the calendar renders after the key
			await expect.poll(calendarOpen).toBe(true)
			landed[key] = focusedDay()
			wrapper?.unmount()
		}
		expect(landed).toEqual({
			'[Space]': 'January 2026 10',
			'{F4}': 'January 2026 10',
			'{Alt>}{ArrowDown}{/Alt}': 'January 2026 10',
		})
	})

	it('closes the calendar on Escape, with focus back in the box', async () => {
		const { input } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('[Space]')
		await expect.poll(focusedDay).toBe('January 2026 10')

		await userEvent.keyboard('{Escape}')
		await expect
			.poll(() => ({ focused: document.activeElement, calendarOpen: calendarOpen() }))
			.toEqual({ focused: input, calendarOpen: false })
	})

	it('puts focus back in the box once a day is picked by key', async () => {
		const { input, model } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('[Space]')
		await expect.poll(focusedDay).toBe('January 2026 10')

		await userEvent.keyboard('{ArrowRight}{Enter}')
		await expect
			.poll(() => ({ model: model.value, focused: document.activeElement, calendarOpen: calendarOpen() }))
			.toEqual({ model: '2026-01-11', focused: input, calendarOpen: false })
	})

	// A date input cannot take the combobox role, and `aria-expanded` is not allowed on it.
	it('tells a screen reader its box opens a calendar dialog named by the field', async () => {
		const { input } = mountDate('2026-01-10')
		expect(input.getAttribute('aria-haspopup')).toBe('dialog')

		input.focus()
		await userEvent.keyboard('[Space]')
		const dialog = page.getByRole('dialog', { name: 'Date' })
		await expect.element(dialog).toBeVisible()
		expect(input.getAttribute('aria-controls')).toBe(dialog.element().id)
	})
})
