import { ref, watch, type Ref } from 'vue'

import { evaluateArithmetic, isArithmeticEntry, type NumberSeparators } from '../arithmetic'

/**
 * Configuration for {@link useArithmeticInput}.
 * @public
 */
export type ArithmeticInputOptions = {
	/** The model's number. A record may hand it over as text (`"40"`, as a database numeric arrives). */
	value: () => unknown
	/** Hands the model a new number, or null once the box is emptied */
	commit: (value: number | null) => void
	/** The box's text for the model's number */
	format?: (value: number | null) => string
	/** The marks the box writes numbers with; a plain `.` decimal point when omitted */
	separators?: () => NumberSeparators
	/** The field's decimal places, where it has a fixed number of them; at `0` (as for JPY) a decimal mark is refused */
	fractionDigits?: () => number | undefined
	/** Rounds a result before it is committed, as to a currency's decimals: `10/3` is `3.33`, as the box shows */
	round?: (value: number) => number
	/** Commit each well-formed result as it is typed (default), or only once the box settles */
	live?: boolean
	/** The box's text, when the caller already keeps it (as in `v-model`) */
	text?: Ref<string>
	/** Whether the box takes arithmetic at all; while false the box's text is left alone. Default true. */
	enabled?: () => boolean
	/** Select the box's text on focus, so typing replaces it */
	selectOnFocus?: boolean
}

/** The model's number, read from a number or from the text a record may carry instead. */
const numberOf = (value: unknown): number | null => {
	if (typeof value === 'number') return Number.isFinite(value) ? value : null
	if (typeof value === 'string' && value.trim() !== '') {
		const n = Number(value)
		return Number.isFinite(n) ? n : null
	}
	return null
}

/** The box's text once `inserted` replaces its selection. */
const textWith = (input: HTMLInputElement, inserted: string) =>
	input.value.slice(0, input.selectionStart ?? 0) + inserted + input.value.slice(input.selectionEnd ?? 0)

/**
 * A number box that takes arithmetic: `12*3+4` is read as `40`, and a leading `=` or `+` as a spreadsheet reads it.
 * The box holds the typed text while it is edited and settles to the result on blur or Enter; text that is no
 * expression by then (`12*`) leaves the model at its last number.
 *
 * Only an edit writes: a box focused and left as it was commits nothing, so a value is never rewritten (or rounded)
 * by being looked at. "Edited" means the text differs from what the box last showed or saved.
 *
 * Form inputs bind the returned `onFocus`, `onInput`, `onKeydown`, `onPaste` and `onBlur`. A box that is no
 * `<input>` (a contenteditable table cell) drives `begin`, `update`, `settle`, `end` and `accepts` itself.
 *
 * @public
 */
export function useArithmeticInput({
	value,
	commit,
	format = n => (n === null ? '' : String(n)),
	separators = () => ({}),
	fractionDigits = () => undefined,
	round = n => n,
	live = true,
	text = ref(''),
	enabled = () => true,
	selectOnFocus = false,
}: ArithmeticInputOptions) {
	const focused = ref(false)
	// What the box last showed or saved: the text that commits nothing.
	let committedText = text.value

	/** Set the box's text without it counting as an edit */
	const rebase = (current: string) => {
		text.value = current
		committedText = current
	}

	/** Show the model's number in the box */
	const syncText = () => rebase(format(numberOf(value())))

	// Not while it is typed in: the box holds text on its way to a number ("12*"), which the number would overwrite.
	watch(
		value,
		() => {
			if (enabled() && !focused.value) syncText()
		},
		{ immediate: true }
	)

	const commitText = () => {
		if (text.value === committedText) return
		const empty = text.value.trim() === ''
		const result = empty ? null : evaluateArithmetic(text.value, separators())
		if (result === null && !empty) return
		commit(result === null ? null : round(result))
		committedText = text.value
	}

	/**
	 * Whether the box may hold `next`: digits, `.`, `+ - * / %`, parentheses and a leading `=`, with each number
	 * written as the box writes numbers (so not `1.2.3`, nor `1.234,56` in English)
	 */
	const accepts = (next: string) => isArithmeticEntry(next, separators(), fractionDigits())

	/** The box gained focus; `current` is its text, when the caller keeps it */
	const begin = (current?: string) => {
		focused.value = true
		if (current !== undefined) rebase(current)
	}

	/** The box's text changed as it was typed in */
	const update = (next: string) => {
		text.value = next
		if (live) commitText()
	}

	/** Commit an edit, then show the result in place of the expression */
	const settle = () => {
		commitText()
		syncText()
	}

	/** The box lost focus */
	const end = () => {
		focused.value = false
		settle()
	}

	const onFocus = (event: FocusEvent) => {
		begin()
		const input = event.target
		if (selectOnFocus && input instanceof HTMLInputElement) requestAnimationFrame(() => input.select())
	}

	const onInput = (event: Event) => {
		if (event.target instanceof HTMLInputElement) update(event.target.value)
	}

	const onKeydown = (event: KeyboardEvent) => {
		if (event.ctrlKey || event.metaKey || event.altKey) return
		if (event.key === 'Enter') {
			settle()
			return
		}
		if (event.key.length !== 1) return
		// The box's text once typed in, as `=` may only start it.
		const input = event.target
		const next = input instanceof HTMLInputElement ? textWith(input, event.key) : event.key
		if (!accepts(next)) event.preventDefault()
	}

	// A pasted letter or exponent leaves the box as it was.
	const onPaste = (event: ClipboardEvent) => {
		const input = event.target
		if (!(input instanceof HTMLInputElement)) return
		if (!accepts(textWith(input, event.clipboardData?.getData('text') ?? ''))) event.preventDefault()
	}

	const onBlur = () => end()

	return {
		text,
		focused,
		accepts,
		begin,
		update,
		settle,
		end,
		rebase,
		syncText,
		onFocus,
		onInput,
		onKeydown,
		onPaste,
		onBlur,
	}
}
