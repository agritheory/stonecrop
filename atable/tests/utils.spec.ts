import { describe, it, expect } from 'vitest'
import { isHtmlString, generateHash } from '../src/utils'

describe('utils', () => {
	describe('isHtmlString', () => {
		it('should return true for valid HTML strings', () => {
			expect(isHtmlString('<div>Hello</div>')).toBe(true)
			expect(isHtmlString('<span>Test</span>')).toBe(true)
			expect(isHtmlString('<p><strong>Bold</strong> text</p>')).toBe(true)
			expect(isHtmlString('<img src="test.jpg" />')).toBe(true)
		})

		it('should return false for plain text strings', () => {
			expect(isHtmlString('Hello World')).toBe(false)
			expect(isHtmlString('Just plain text')).toBe(false)
			expect(isHtmlString('123456')).toBe(false)
			expect(isHtmlString('')).toBe(false)
		})

		it('should return false for strings with HTML-like characters but not valid HTML', () => {
			expect(isHtmlString('< not html >')).toBe(false)
			expect(isHtmlString('&lt;escaped&gt;')).toBe(false)
		})
	})

	describe('generateHash', () => {
		it('should generate a hash with default length of 8', () => {
			const hash = generateHash()
			expect(hash).toHaveLength(8)
			expect(hash).toMatch(/^[0-9a-f]+$/)
		})

		it('should generate a hash with specified length', () => {
			const hash4 = generateHash(4)
			expect(hash4).toHaveLength(4)
			expect(hash4).toMatch(/^[0-9a-f]+$/)

			const hash16 = generateHash(16)
			expect(hash16).toHaveLength(16)
			expect(hash16).toMatch(/^[0-9a-f]+$/)
		})

		it('should generate different hashes on multiple calls', () => {
			const hash1 = generateHash()
			const hash2 = generateHash()
			expect(hash1).not.toBe(hash2)
		})

		it('should handle edge cases', () => {
			const hash0 = generateHash(0)
			expect(hash0).toBe('')

			const hash1 = generateHash(1)
			expect(hash1).toHaveLength(1)
			expect(hash1).toMatch(/^[0-9a-f]$/)
		})
	})
})
