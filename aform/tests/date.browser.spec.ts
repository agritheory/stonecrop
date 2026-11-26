import { afterEach, describe, expect, it } from 'vite-plus/test'
import { page, userEvent } from 'vite-plus/test/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'

import ADate from '../src/components/form/ADate.vue'
import { focusedDay } from './focused-day'

let wrapper: VueWrapper | undefined

afterEach(() => wrapper?.unmount())

const mountDate = (initial: string | null, { required = false, errors = ref<string[]>([]) } = {}) => {
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
					required,
					errors: errors.value,
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

/** The field's clear button, when it shows one. */
const clearButton = () => document.querySelector<HTMLButtonElement>('button[aria-label="Clear Date"]')

/** What the box holds: its value, and whether the browser can't read what it shows. */
const boxState = (input: HTMLInputElement) => ({ value: input.value, unreadable: input.validity.badInput })

/** The text under the field, or '' while none shows. */
const noticeText = () => {
	const slot = document.querySelector<HTMLElement>('.aform_error')
	return slot && slot.style.display !== 'none' ? (slot.textContent?.trim() ?? '') : ''
}

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

	// Chrome reports a date input with any part missing, or a day that does not exist, as `''`, and keeps the parts typed.
	it('keeps its day while a part is cleared, and takes the day once it is retyped', async () => {
		const { input, model, renderErrors } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('{Backspace}')
		await expect.poll(() => input.validity.badInput).toBe(true)
		expect(model.value).toBe('2026-01-10')

		await userEvent.keyboard('03')
		await expect
			.poll(() => ({ model: model.value, renderErrors: renderErrors.map(String) }))
			.toEqual({ model: '2026-03-10', renderErrors: [] })
	})

	// One Backspace leaves two parts showing, so it is never a clear: a Save clicked next would otherwise send no day.
	it('puts its day back, and says so, when it is left with a part cleared', async () => {
		const { input, before, model } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('{Backspace}')
		before.focus()

		await expect
			.poll(() => ({ model: model.value, box: boxState(input), notice: noticeText() }))
			.toEqual({
				model: '2026-01-10',
				box: { value: '2026-01-10', unreadable: false },
				notice: 'Date: not a date, so 01/10/2026 was kept',
			})
	})

	// Clearing the last part fires no input event, since the box read as `''` already.
	it('saves no day when every part is cleared by keyboard and it is left', async () => {
		const { input, before, model } = mountDate('2026-01-31')
		input.focus()
		await userEvent.keyboard('{Backspace}{Tab}{Backspace}{Tab}{Backspace}')
		await expect.poll(() => boxState(input)).toEqual({ value: '', unreadable: false })
		before.focus()

		await expect.poll(() => ({ model: model.value, notice: noticeText() })).toEqual({ model: null, notice: '' })
	})

	it('puts a required day back, and says so, when every part is cleared by keyboard', async () => {
		const { input, before, model } = mountDate('2026-01-31', { required: true })
		input.focus()
		await userEvent.keyboard('{Backspace}{Tab}{Backspace}{Tab}{Backspace}')
		await expect.poll(() => boxState(input)).toEqual({ value: '', unreadable: false })
		before.focus()

		await expect
			.poll(() => ({ model: model.value, box: boxState(input), notice: noticeText() }))
			.toEqual({
				model: '2026-01-31',
				box: { value: '2026-01-31', unreadable: false },
				notice: 'Date is required, so 01/31/2026 was kept',
			})
	})

	// Firefox's Ctrl+Backspace empties every part at once and reports the box as `''` it can read, which Chrome has no key
	// for; the box is emptied and the event sent as Firefox sends them.
	describe('when one key empties every part, as Firefox Ctrl+Backspace does', () => {
		const emptyAtOnce = (input: HTMLInputElement) => {
			input.value = ''
			input.dispatchEvent(new Event('input', { bubbles: true }))
		}

		it('saves no day on an optional field once it is left', async () => {
			const { input, before, model } = mountDate('2026-01-31')
			input.focus()
			emptyAtOnce(input)
			before.focus()

			await expect.poll(() => ({ model: model.value, notice: noticeText() })).toEqual({ model: null, notice: '' })
		})

		it('puts the day back on a required field once it is left', async () => {
			const { input, before, model } = mountDate('2026-01-31', { required: true })
			input.focus()
			emptyAtOnce(input)
			before.focus()

			await expect
				.poll(() => ({ model: model.value, box: boxState(input), notice: noticeText() }))
				.toEqual({
					model: '2026-01-31',
					box: { value: '2026-01-31', unreadable: false },
					notice: 'Date is required, so 01/31/2026 was kept',
				})
		})
	})

	it('puts its day back, and says so, when it is left holding a day that does not exist', async () => {
		const { input, before, model } = mountDate('2026-01-31')
		input.focus()
		await userEvent.keyboard('02')
		await expect.poll(() => input.validity.badInput).toBe(true)
		before.focus()

		await expect
			.poll(() => ({ model: model.value, box: boxState(input), notice: noticeText(), invalid: input.ariaInvalid }))
			.toEqual({
				model: '2026-01-31',
				box: { value: '2026-01-31', unreadable: false },
				notice: 'Date: not a date, so 01/31/2026 was kept',
				invalid: null,
			})
		expect(input.getAttribute('aria-describedby')).toBe(document.querySelector('.aform_error')?.id)
	})

	it('shows the errors it is handed before what it put back, and is invalid only for those', async () => {
		const errors = ref(['Must be after the first day'])
		const { input, before } = mountDate('2026-01-31', { errors })
		input.focus()
		await userEvent.keyboard('02')
		before.focus()

		await expect
			.poll(() => ({ notice: noticeText(), invalid: input.ariaInvalid }))
			.toEqual({ notice: 'Must be after the first day; Date: not a date, so 01/31/2026 was kept', invalid: 'true' })
	})

	// Left with nowhere to put focus, as a click on the page's background leaves it.
	it('puts its day back, and says so, when it is left part typed', async () => {
		const { input, model } = mountDate('2026-01-31')
		input.focus()
		await userEvent.keyboard('{Backspace}{Tab}1')
		await expect.poll(() => input.validity.badInput).toBe(true)
		input.blur()

		await expect
			.poll(() => ({ model: model.value, box: boxState(input), notice: noticeText() }))
			.toEqual({
				model: '2026-01-31',
				box: { value: '2026-01-31', unreadable: false },
				notice: 'Date: not a date, so 01/31/2026 was kept',
			})
	})

	it('stays empty, and says so, when it is left part typed with no day before', async () => {
		const { input, before, model } = mountDate(null)
		input.focus()
		await userEvent.keyboard('06')
		await expect.poll(() => input.validity.badInput).toBe(true)
		before.focus()

		await expect
			.poll(() => ({ model: model.value, box: boxState(input), notice: noticeText() }))
			.toEqual({ model: null, box: { value: '', unreadable: false }, notice: 'Date: not a date, so it was left empty' })
	})

	it('leaves the box as the person edits it when they come back after a day was put back', async () => {
		const { input, before, model } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('{Backspace}')
		before.focus()
		await expect.poll(noticeText).not.toBe('')

		input.focus()
		await userEvent.keyboard('{Backspace}')
		await expect
			.poll(() => ({ model: model.value, box: boxState(input), notice: noticeText() }))
			.toEqual({
				model: '2026-01-10',
				box: { value: '', unreadable: true },
				notice: '',
			})
	})

	it('leaves a part-cleared box alone when the errors it is handed change', async () => {
		const errors = ref<string[]>([])
		const { input } = mountDate('2026-01-10', { errors })
		input.focus()
		await userEvent.keyboard('{Backspace}')
		await expect.poll(() => input.validity.badInput).toBe(true)

		errors.value = ['Must be after the first day']
		await expect.poll(noticeText).toBe('Must be after the first day')
		expect(boxState(input)).toEqual({ value: '', unreadable: true })
	})

	it('takes the notice away once a day is typed again', async () => {
		const { input, before, model } = mountDate('2026-01-31')
		input.focus()
		await userEvent.keyboard('02')
		before.focus()
		await expect.poll(noticeText).not.toBe('')

		input.focus()
		await userEvent.keyboard('03')
		await expect.poll(() => ({ model: model.value, notice: noticeText() })).toEqual({ model: '2026-03-31', notice: '' })
	})

	it('clears only the part Backspace is pressed in while a day is typed', async () => {
		const { input, before, model } = mountDate(null)
		input.focus()
		await userEvent.keyboard('063{Backspace}292026')
		before.focus()

		await expect.poll(() => ({ model: model.value, notice: noticeText() })).toEqual({ model: '2026-06-29', notice: '' })
	})

	it('clears only the part Backspace is pressed in on a whole day, so that part can be retyped', async () => {
		const { input, before, model } = mountDate('2026-01-31')
		input.focus()
		await userEvent.keyboard('{Tab}{Backspace}')
		await expect.poll(() => input.value).toBe('')
		await userEvent.keyboard('29')
		before.focus()

		await expect.poll(() => ({ model: model.value, notice: noticeText() })).toEqual({ model: '2026-01-29', notice: '' })
	})

	describe('clear button', () => {
		it('empties an optional field, and saves no day, with focus back in the box', async () => {
			const { input, before, model } = mountDate('2026-01-31')
			expect(clearButton()?.type).toBe('button')
			clearButton()?.click()
			await expect
				.poll(() => ({
					model: model.value,
					box: boxState(input),
					focused: document.activeElement,
					button: clearButton(),
				}))
				.toEqual({ model: null, box: { value: '', unreadable: false }, focused: input, button: null })
			before.focus()

			await expect.poll(() => ({ model: model.value, notice: noticeText() })).toEqual({ model: null, notice: '' })
		})

		// Tabbing first steps through the box's own stops, whose count is the browser's: Chrome's has its parts and its
		// calendar icon.
		it('is reached by Tab from the box and pressed with Enter', async () => {
			const { input, model } = mountDate('2026-01-31')
			input.focus()
			for (let presses = 0; presses < 6 && document.activeElement !== clearButton(); presses++) {
				// oxlint-disable-next-line eslint/no-await-in-loop -- one Tab at a time, until focus reaches the button
				await userEvent.keyboard('{Tab}')
			}
			expect(document.activeElement).toBe(clearButton())
			await userEvent.keyboard('{Enter}')

			await expect.poll(() => model.value).toBeNull()
		})

		it('is not shown on a required field', () => {
			mountDate('2026-01-31', { required: true })
			expect(clearButton()).toBeNull()
		})

		it('is not shown while the field holds no day', () => {
			mountDate(null)
			expect(clearButton()).toBeNull()
		})
	})

	it('leaves the box alone when focus moves into its own calendar, and takes the day picked there', async () => {
		const { input, model } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('{Backspace}{F4}')
		await expect.poll(focusedDay).toBe('January 2026 10')
		expect({ box: boxState(input), notice: noticeText() }).toEqual({ box: { value: '', unreadable: true }, notice: '' })

		await userEvent.keyboard('{ArrowRight}{Enter}')
		await expect
			.poll(() => ({ model: model.value, box: boxState(input), focused: document.activeElement }))
			.toEqual({ model: '2026-01-11', box: { value: '2026-01-11', unreadable: false }, focused: input })
	})

	it('shows the same day picked again in its calendar while the box is part cleared', async () => {
		const { input, model } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('{Backspace}{F4}')
		await expect.poll(focusedDay).toBe('January 2026 10')
		await userEvent.keyboard('{Enter}')

		await expect
			.poll(() => ({ model: model.value, box: boxState(input) }))
			.toEqual({ model: '2026-01-10', box: { value: '2026-01-10', unreadable: false } })
	})

	it('empties the box when the day is cleared from outside while the box is part cleared', async () => {
		const { input, before, model } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('{Backspace}')
		await expect.poll(() => input.validity.badInput).toBe(true)
		model.value = null
		await expect.poll(() => boxState(input)).toEqual({ value: '', unreadable: false })
		before.focus()

		await expect.poll(() => ({ model: model.value, notice: noticeText() })).toEqual({ model: null, notice: '' })
	})

	it('shows a day set from outside while the box is part cleared, and keeps it when left', async () => {
		const { input, before, model } = mountDate('2026-01-10')
		input.focus()
		await userEvent.keyboard('{Backspace}')
		await expect.poll(() => input.validity.badInput).toBe(true)
		model.value = '2026-05-05'
		await expect.poll(() => boxState(input)).toEqual({ value: '2026-05-05', unreadable: false })
		before.focus()

		await expect
			.poll(() => ({ model: model.value, box: boxState(input), notice: noticeText() }))
			.toEqual({ model: '2026-05-05', box: { value: '2026-05-05', unreadable: false }, notice: '' })
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
