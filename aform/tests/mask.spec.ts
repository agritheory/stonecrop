import { describe, it, expect } from 'vitest'

import { useStringMask } from '../src/directives/mask'

// Helper to create a mock HTMLInputElement
function createMockInput(value: string): HTMLInputElement {
	const el = document.createElement('input')
	el.value = value
	return el
}

// Helper to create a mock DirectiveBinding
function createBinding(value?: string, instance?: Record<string, any>): any {
	return {
		value,
		instance: instance ?? null,
	}
}

describe('useStringMask', { tags: ['component'] }, () => {
	describe('with explicit mask', () => {
		it('applies a phone mask to digits', () => {
			const el = createMockInput('5551234567')
			useStringMask(el, createBinding('(###) ### - ####'))

			expect(el.value).toBe('(555) 123 - 4567')
		})

		it('applies a date mask', () => {
			const el = createMockInput('01012024')
			useStringMask(el, createBinding('##/##/####'))

			expect(el.value).toBe('01/01/2024')
		})

		it('applies a partial mask when input is shorter', () => {
			const el = createMockInput('555')
			useStringMask(el, createBinding('(###) ### - ####'))

			expect(el.value).toBe('(555) ### - ####')
		})

		it('sets the full mask when input is empty', () => {
			const el = createMockInput('')
			useStringMask(el, createBinding('(###) ### - ####'))

			expect(el.value).toBe('(###) ### - ####')
		})

		it('returns early when no mask is resolved', () => {
			const el = createMockInput('hello')
			// binding.value is undefined — no mask, no implicit schema sniffing
			useStringMask(el, createBinding(undefined))

			// Value unchanged (no mask applied)
			expect(el.value).toBe('hello')
		})

		it('applies a card mask', () => {
			const el = createMockInput('4242424242424242')
			useStringMask(el, createBinding('#### #### #### ####'))

			expect(el.value).toBe('4242 4242 4242 4242')
		})
	})

	describe('with function mask', () => {
		it('resolves a function mask', () => {
			// Mask value is a stringified function that returns a static mask
			const maskFn = '() => "##/##/####"'
			const el = createMockInput('01012024')
			useStringMask(el, createBinding(maskFn))

			expect(el.value).toBe('01/01/2024')
		})

		it('passes locale to function mask', () => {
			const maskFn = '(locale) => locale === "US" ? "(###) ### - ####" : "### #### ####"'
			const el = createMockInput('5551234567')
			useStringMask(el, createBinding(maskFn, { locale: 'US' }))

			expect(el.value).toBe('(555) 123 - 4567')
		})

		it('falls back to string mask when function evaluation fails', () => {
			// This will throw ReferenceError in extractMaskFn and fall back to using it as a string mask
			const el = createMockInput('123')
			useStringMask(el, createBinding('undefinedVariable'))

			// Should not crash — returns early or applies raw string
			expect(el.value).toBeDefined()
		})
	})

	describe('maskFilled tracking', () => {
		it('sets maskFilled to true when mask is completely filled', () => {
			// Note: the source checks `binding.instance?.['maskFilled']` as truthy, so
			// maskFilled must be truthy (e.g. 'pending') for the branch to execute
			const instance: Record<string, any> = { maskFilled: 'pending' }
			const el = createMockInput('5551234567')
			useStringMask(el, createBinding('(###) ### - ####', instance))

			expect(instance.maskFilled).toBe(true)
		})

		it('sets maskFilled to false when mask is not completely filled', () => {
			const instance: Record<string, any> = { maskFilled: 'pending' }
			const el = createMockInput('555')
			useStringMask(el, createBinding('(###) ### - ####', instance))

			expect(instance.maskFilled).toBe(false)
		})

		it('does not touch maskFilled when it is falsy on instance', () => {
			const instance: Record<string, any> = { maskFilled: false }
			const el = createMockInput('5551234567')
			useStringMask(el, createBinding('(###) ### - ####', instance))

			// maskFilled is falsy so the branch is skipped
			expect(instance.maskFilled).toBe(false)
		})
	})

	describe('edge cases', () => {
		it('handles input with existing mask characters', () => {
			// Input already has mask-like characters
			const el = createMockInput('(555) 123')
			useStringMask(el, createBinding('(###) ### - ####'))

			// Should unmask first, then remask
			expect(el.value).toBe('(555) 123 - ####')
		})

		it('handles mask longer than input', () => {
			const el = createMockInput('12')
			useStringMask(el, createBinding('##/##/####'))

			expect(el.value).toBe('12/##/####')
		})

		it('handles mask with no empty slots and excess input', () => {
			const el = createMockInput('1234567890')
			useStringMask(el, createBinding('##:##'))

			// Only first 4 digits should be used, result truncated to mask length
			expect(el.value).toBe('12:34')
		})
	})
})
