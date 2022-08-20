import { DirectiveBinding } from 'vue'

export function useStringMask(el: HTMLInputElement, binding: DirectiveBinding<string>) {
	let mask = binding.value
	if (!mask) return

	// process mask if it's a function
	try {
		// TODO: replace with state management
		const locale = binding.instance.locale
		// eslint-disable-next-line @typescript-eslint/no-implied-eval
		const maskFn = Function(`"use strict";return (${mask})`)()
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		mask = maskFn(locale)
	} catch (error) {
		if (error instanceof ReferenceError) {
			// assume mask is a string
		}
	}

	// get initial mask values
	const maskToken = '#'
	const maskChars = [maskToken, '/', '-', '(', ')', ' ']
	const maskLength = mask.split('#').length - 1

	// un-mask all input before processing mask
	const inputText = el.value
	let unmaskedInput = inputText
	for (const char of maskChars) {
		unmaskedInput = unmaskedInput.replaceAll(char, '')
	}
	unmaskedInput = unmaskedInput.slice(0, maskLength)

	// process input value with mask
	if (unmaskedInput) {
		let replacement = mask

		for (const char of unmaskedInput) {
			const replaceIndex = replacement.indexOf(maskToken)
			if (replaceIndex !== -1) {
				const prefix = replacement.substring(0, replaceIndex)
				const suffix = replacement.substring(replaceIndex + 1)
				replacement = prefix + char + suffix
			}
		}

		// TODO: this is very opinionated;
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
