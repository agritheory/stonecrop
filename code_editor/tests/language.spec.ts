import { describe, expect, it } from 'vitest'

import { detectLanguage } from '../src/utils/language'

describe('detectLanguage', { tag: 'unit' }, () => {
	it('returns json for JSON fieldtype', () => {
		expect(detectLanguage('JSON')).toBe('json')
	})

	it('JSON fieldtype always wins — explicit language is ignored', () => {
		expect(detectLanguage('JSON', 'python')).toBe('json')
	})

	it('returns typescript as default for Code fieldtype', () => {
		expect(detectLanguage('Code')).toBe('typescript')
	})

	it('explicit language overrides the Code default', () => {
		expect(detectLanguage('Code', 'python')).toBe('python')
		expect(detectLanguage('Code', 'sql')).toBe('sql')
	})

	it('explicit language wins when fieldtype is unknown', () => {
		expect(detectLanguage('Data', 'javascript')).toBe('javascript')
		expect(detectLanguage(undefined, 'sql')).toBe('sql')
	})

	it('returns plaintext as fallback when both are absent or unrecognised', () => {
		expect(detectLanguage()).toBe('plaintext')
		expect(detectLanguage('Data')).toBe('plaintext')
		expect(detectLanguage(undefined, undefined)).toBe('plaintext')
	})
})
