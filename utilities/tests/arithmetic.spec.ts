import { describe, expect, it } from 'vitest'

import { arithmeticEntryPattern, evaluateArithmetic, isArithmeticKey } from '../src/arithmetic'

describe('evaluateArithmetic', () => {
	it('reads a plain number', () => {
		expect(evaluateArithmetic('42')).toBe(42)
		expect(evaluateArithmetic('-3.5')).toBe(-3.5)
		expect(evaluateArithmetic('.5')).toBe(0.5)
		expect(evaluateArithmetic('5.')).toBe(5)
	})

	it('evaluates + - * / % with the usual precedence', () => {
		expect(evaluateArithmetic('12*3+4')).toBe(40)
		expect(evaluateArithmetic('2+3*4')).toBe(14)
		expect(evaluateArithmetic('10-4-3')).toBe(3)
		expect(evaluateArithmetic('100/4/5')).toBe(5)
		expect(evaluateArithmetic('17%5')).toBe(2)
		expect(evaluateArithmetic('2+17%5*3')).toBe(8)
	})

	it('evaluates parentheses and signs', () => {
		expect(evaluateArithmetic('(2+3)*4')).toBe(20)
		expect(evaluateArithmetic('-(2+3)')).toBe(-5)
		expect(evaluateArithmetic('5--3')).toBe(8)
		expect(evaluateArithmetic('+5')).toBe(5)
		expect(evaluateArithmetic('((1))')).toBe(1)
	})

	it('ignores whitespace', () => {
		expect(evaluateArithmetic(' 12 * 3 + 4 ')).toBe(40)
	})

	it('sheds floating-point noise', () => {
		expect(evaluateArithmetic('0.1*3')).toBe(0.3)
		expect(evaluateArithmetic('0.1+0.2')).toBe(0.3)
	})

	it('reads -0 as 0', () => {
		expect(Object.is(evaluateArithmetic('-0'), 0)).toBe(true)
	})

	it('is null for an empty box', () => {
		expect(evaluateArithmetic('')).toBeNull()
		expect(evaluateArithmetic('   ')).toBeNull()
	})

	it('is null for an unfinished or malformed expression', () => {
		for (const text of ['12*', '(3+4', '3+4)', '*3', '-', '1..2', '()', '1(2)']) {
			expect(evaluateArithmetic(text), text).toBeNull()
		}
	})

	it('is null for division or remainder by zero', () => {
		expect(evaluateArithmetic('5/0')).toBeNull()
		expect(evaluateArithmetic('5%0')).toBeNull()
	})

	it('refuses exponents, powers and names', () => {
		for (const text of ['1e3', '1E3', '2^3', 'Infinity', 'NaN', 'abs(2)', '0x10']) {
			expect(evaluateArithmetic(text), text).toBeNull()
		}
	})

	it('refuses absurdly deep nesting rather than overflowing the stack', () => {
		expect(evaluateArithmetic('('.repeat(10000) + '1' + ')'.repeat(10000))).toBeNull()
		expect(evaluateArithmetic('-'.repeat(10000) + '1')).toBeNull()
	})

	it('reads numbers with the given separators', () => {
		const de = { group: '.', decimal: ',' }
		expect(evaluateArithmetic('1.000,5*2', de)).toBe(2001)
		expect(evaluateArithmetic('2,5+2,5', de)).toBe(5)
		const en = { group: ',', decimal: '.' }
		expect(evaluateArithmetic('1,000.5*2', en)).toBe(2001)
		const fr = { group: ' ', decimal: ',' }
		expect(evaluateArithmetic('1 000,5*2', fr)).toBe(2001)
	})

	it('refuses a comma without separators that make it a mark', () => {
		expect(evaluateArithmetic('1,5')).toBeNull()
	})
})

describe('arithmeticEntryPattern', () => {
	it('allows digits, operators, parentheses and a decimal point', () => {
		expect(arithmeticEntryPattern().test('(12.5*3)+4-1/2%3')).toBe(true)
	})

	it('refuses exponents and letters', () => {
		for (const text of ['1e3', '1E3', '2^3', 'abc']) {
			expect(arithmeticEntryPattern().test(text), text).toBe(false)
		}
	})

	it('allows the given separators', () => {
		expect(arithmeticEntryPattern().test('1,5')).toBe(false)
		expect(arithmeticEntryPattern({ group: '.', decimal: ',' }).test('1.000,5')).toBe(true)
		expect(arithmeticEntryPattern({ group: '’', decimal: '.' }).test('1’000')).toBe(true)
	})
})

describe('isArithmeticKey', () => {
	it('accepts the characters an expression is made of', () => {
		for (const key of ['0', '9', '+', '-', '*', '/', '%', '(', ')', '.', ' ']) {
			expect(isArithmeticKey(key), key).toBe(true)
		}
	})

	it('refuses exponent keys, letters and named keys', () => {
		for (const key of ['e', 'E', '^', 'a', 'Enter', ',']) {
			expect(isArithmeticKey(key), key).toBe(false)
		}
		expect(isArithmeticKey(',', { group: ',', decimal: '.' })).toBe(true)
	})
})
