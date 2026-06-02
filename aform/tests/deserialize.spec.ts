import { describe, it, expect } from 'vitest'

import { deserializeFunction } from '../src/utils/deserialize'

describe('deserializeFunction', { tags: ['component'] }, () => {
	it('deserializes a sync arrow function string', () => {
		const fn = deserializeFunction<(x: number) => number>('(x) => x * 2')
		expect(fn(5)).toBe(10)
	})

	it('deserializes an async arrow function string', async () => {
		const fn = deserializeFunction<(x: string) => Promise<string>>('async (x) => x.toUpperCase()')
		await expect(fn('hello')).resolves.toBe('HELLO')
	})

	it('deserializes a function expression with no arguments', () => {
		const fn = deserializeFunction<() => string>('() => "hello"')
		expect(fn()).toBe('hello')
	})

	it('deserializes a function with multiple parameters', () => {
		const fn = deserializeFunction<(a: number, b: number) => number>('(a, b) => a + b')
		expect(fn(3, 4)).toBe(7)
	})

	it('throws SyntaxError for an unparseable string', () => {
		expect(() => deserializeFunction('NOT VALID JS %%%')).toThrow(SyntaxError)
	})

	it('throws ReferenceError for an undefined variable reference', () => {
		expect(() => deserializeFunction('undefinedVariable')).toThrow(ReferenceError)
	})
})
