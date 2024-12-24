import type { DirectiveBinding } from 'vue'

import type { FormSchema } from '../types'

/**
 * Named masks for common input types
 */
const NAMED_MASKS = {
	date: '##/##/####',
	datetime: '####/##/## ##:##',
	time: '##:##',
	fulltime: '##:##:##',
	phone: '(###) ### - ####',
	card: '#### #### #### ####',
}

/**
 * Extracts a mask function from a stringified function
 * @param mask - Mask string
 * @returns Mask function
 */
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

/**
 * Gets the mask for a given directive binding
 * @param binding - Binding object from directive hook
 * @returns Mask string
 */
function getMask(binding: DirectiveBinding<string>) {
	let mask = binding.value

	if (mask) {
		const maskFn = extractMaskFn(mask)
		if (maskFn) {
			// TODO: (state) replace with state management;
			// pass the entire form/table data to the function
			const locale = binding.instance['locale']
			mask = maskFn(locale)
		}
	} else {
		// TODO: (state) handle using state management
		const schema = binding.instance['schema'] as FormSchema
		const fieldType: string | undefined = schema?.fieldtype?.toLowerCase()
		if (fieldType && NAMED_MASKS[fieldType]) {
			mask = NAMED_MASKS[fieldType]
		}
	}

	return mask
}

/**
 * Unmasks the input string
 * @param input - Input string
 * @param maskToken - Mask token character
 * @returns Unmasked input string
 */
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

/**
 * Fills the mask with the input string
 * @param input - Input string
 * @param mask - Mask string
 * @param maskToken - Mask token character
 * @returns Masked input string
 */
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

/**
 * Applies a mask to an input element
 * @param el - Input element
 * @param binding - Binding object from directive hook
 * @returns void
 * @public
 */
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

		if (binding.instance['maskFilled']) {
			binding.instance['maskFilled'] = !replacement.includes(maskToken)
		}

		el.value = replacement
	} else {
		el.value = mask
	}
}
