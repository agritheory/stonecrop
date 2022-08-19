import { DirectiveBinding } from 'vue'

export function useStringMask(el: HTMLInputElement, binding: DirectiveBinding<string>) {
	const mask = binding.value
	if (!mask) return

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

		// TODO: this feels very opinionated
		// maybe needs some kind of state management?
		// another easier way could be to emit back to instance
		if (binding.instance.maskFilled) {
			binding.instance.maskFilled = !replacement.includes(maskToken)
		}

		el.value = replacement
	} else {
		el.value = mask
	}
}
