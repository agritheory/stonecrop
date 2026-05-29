import type { DirectiveBinding } from 'vue'

import { deserializeFunction } from '../utils/deserialize'

/**
 * Extracts a mask function from a stringified function
 * @param mask - Mask string
 * @returns Mask function, or undefined if the string is not a valid function expression
 */
function extractMaskFn(mask: string): ((locale: any) => string) | undefined {
	try {
		return deserializeFunction<(locale: any) => string>(mask)
	} catch {
		return undefined
	}
}

/**
 * Gets the mask for a given directive binding
 * @param binding - Binding object from directive hook
 * @returns Mask string
 */
function getMask(binding: DirectiveBinding<string>) {
	const mask = binding.value
	if (!mask) return undefined

	const maskFn = extractMaskFn(mask)
	if (maskFn) {
		// TODO: (state) replace with state management;
		// pass the entire form/table data to the function
		// Vue directive reads arbitrary fields off host component instance; type is unknown at this layer.
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion
		const instance = binding.instance as Record<string, unknown> | null | undefined
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion
		const locale = instance?.['locale'] as string | undefined
		return maskFn(locale)
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

		// Vue directive reads/writes arbitrary fields on host component instance.
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion
		const instance = binding.instance as Record<string, unknown> | null | undefined
		if (instance?.['maskFilled'] !== undefined) {
			instance['maskFilled'] = !replacement.includes(maskToken)
		}

		el.value = replacement
	} else {
		el.value = mask
	}
}
