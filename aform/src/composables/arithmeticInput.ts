import {
	arithmeticEntryPattern,
	evaluateArithmetic,
	isArithmeticKey,
	type NumberSeparators,
} from '@stonecrop/utilities'
import { ref, watch } from 'vue'

/**
 * A number box that takes arithmetic: `12*3+4` is read as `40`. The box holds the typed text while it has focus,
 * the model takes each well-formed result as it is typed, and on blur or Enter the box settles to the result.
 * Text that is no expression by then (`12*`) leaves the model at its last number.
 */
export function arithmeticInput({
	value,
	commit,
	format = n => (n === null ? '' : String(n)),
	separators = () => ({}),
	selectOnFocus = false,
}: {
	/** The model's number */
	value: () => number | null | undefined
	/** Hands the model a new number, or null once the box is emptied */
	commit: (value: number | null) => void
	/** The box's text for a number, once it settles */
	format?: (value: number | null) => string
	/** The marks the box writes numbers with; a plain `.` decimal point when omitted */
	separators?: () => NumberSeparators
	/** Select the box's text on focus, so typing replaces it */
	selectOnFocus?: boolean
}) {
	const text = ref('')
	const focused = ref(false)

	const syncText = () => {
		text.value = format(value() ?? null)
	}

	// Not while it is typed in: the box holds text on its way to a number ("12*"), which the number would overwrite.
	watch(
		value,
		() => {
			if (!focused.value) syncText()
		},
		{ immediate: true }
	)

	const commitText = () => {
		const result = text.value.trim() === '' ? null : evaluateArithmetic(text.value, separators())
		if (result === null && text.value.trim() !== '') return
		if (result !== (value() ?? null)) commit(result)
	}

	const settle = () => {
		commitText()
		syncText()
	}

	const onInput = (event: Event) => {
		if (!(event.target instanceof HTMLInputElement)) return
		text.value = event.target.value
		commitText()
	}

	const onKeydown = (event: KeyboardEvent) => {
		if (event.ctrlKey || event.metaKey || event.altKey) return
		if (event.key === 'Enter') {
			settle()
			return
		}
		if (event.key.length === 1 && !isArithmeticKey(event.key, separators())) event.preventDefault()
	}

	// The box's text once pasted: a pasted letter or exponent leaves the box as it was.
	const onPaste = (event: ClipboardEvent) => {
		const input = event.target
		if (!(input instanceof HTMLInputElement)) return
		const pasted = event.clipboardData?.getData('text') ?? ''
		const next = input.value.slice(0, input.selectionStart ?? 0) + pasted + input.value.slice(input.selectionEnd ?? 0)
		if (!arithmeticEntryPattern(separators()).test(next)) event.preventDefault()
	}

	const onFocus = (event: FocusEvent) => {
		focused.value = true
		const input = event.target
		if (selectOnFocus && input instanceof HTMLInputElement) requestAnimationFrame(() => input.select())
	}

	const onBlur = () => {
		focused.value = false
		settle()
	}

	return { text, focused, onInput, onKeydown, onPaste, onFocus, onBlur, settle, syncText }
}
