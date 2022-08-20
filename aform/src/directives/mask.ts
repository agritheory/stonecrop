import { FormSchema } from 'types'
import { DirectiveBinding } from 'vue'

const NAMED_MASKS = {
	date: '##/##/####',
	datetime: '####/##/## ##:##',
	time: '##:##',
	fulltime: '##:##:##',
	phone: '(###) ### - ####',
	card: '#### #### #### ####',
}

function extractMaskFn(mask: string): ((args: any) => string) | void {
	try {
		// eslint-disable-next-line @typescript-eslint/no-implied-eval
		return Function(`"use strict";return (${mask})`)()
	} catch (error) {
		if (error instanceof ReferenceError) {
			// assume mask is a string
		}
	}
}

function getMask(binding: DirectiveBinding<string>) {
	let mask = binding.value

	if (mask) {
		const maskFn = extractMaskFn(mask)
		if (maskFn) {
			// TODO: (state) replace with state management;
			// pass the entire form/table data to the function
			const locale = binding.instance.locale
			mask = maskFn(locale)
		}
	} else {
		// TODO: (state) handle using state management
		const schema: FormSchema = binding.instance.schema
		const fieldType: string | undefined = schema.fieldtype?.toLowerCase()
		if (fieldType && NAMED_MASKS[fieldType]) {
			mask = NAMED_MASKS[fieldType]
		}
	}

	return mask
}

function unmaskInput(input: string, maskToken?: string) {
	if (!maskToken) {
		maskToken = '#'
	}

	let unmaskedInput = input
	const maskChars = [maskToken, '/', '-', '(', ')', ' ']

	for (const char of maskChars) {
		unmaskedInput = unmaskedInput.replaceAll(char, '')
	}

	return unmaskedInput
}

function fillMask(input: string, mask: string, maskToken?: string) {
	if (!maskToken) {
		maskToken = '#'
	}

	let replacement = mask
	for (const inputChar of input) {
		const replaceIndex = replacement.indexOf(maskToken)
		if (replaceIndex !== -1) {
			const prefix = replacement.substring(0, replaceIndex)
			const suffix = replacement.substring(replaceIndex + 1)
			replacement = prefix + inputChar + suffix
		}
	}

	return replacement.slice(0, mask.length)
}

export function useStringMask(el: HTMLInputElement, binding: DirectiveBinding<string>) {
	const mask = getMask(binding)
	if (!mask) return

	const maskToken = '#'
	const inputText = el.value

	// process input value with mask
	const unmaskedInput = unmaskInput(inputText, maskToken)
	if (unmaskedInput) {
		const replacement = fillMask(unmaskedInput, mask, maskToken)

		// TODO: (state) this is very opinionated;
		// most likely fixed with state management;
		// a better way could be to emit back to instance;
		if (binding.instance.maskFilled) {
			binding.instance.maskFilled = !replacement.includes(maskToken)
		}

		el.value = replacement
	} else {
		el.value = mask
	}
}
