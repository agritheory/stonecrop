import { describe, expect, it } from 'vitest'

import { toEditorString } from '../src/utils/serialization'

describe('toEditorString', { tag: 'unit' }, () => {
	it('passes strings through unchanged', () => {
		expect(toEditorString('hello')).toBe('hello')
		expect(toEditorString('', 'Code')).toBe('')
		expect(toEditorString('type Foo = {}', 'Code')).toBe('type Foo = {}')
	})

	it('stringifies objects to formatted JSON', () => {
		expect(toEditorString({ foo: 'bar' }, 'JSON')).toBe('{\n  "foo": "bar"\n}')
		expect(toEditorString({ a: 1, b: [2, 3] })).toBe('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}')
	})

	it('returns empty string for null', () => {
		expect(toEditorString(null)).toBe('')
		expect(toEditorString(null, 'JSON')).toBe('')
	})

	it('returns empty string for undefined', () => {
		expect(toEditorString(undefined)).toBe('')
		expect(toEditorString(undefined, 'Code')).toBe('')
	})
})
