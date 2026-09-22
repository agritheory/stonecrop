import { describe, expect, it } from 'vitest'

import { parseSemver } from '../src/utils/semver'

describe('parseSemver', { tags: ['unit'] }, () => {
	const validCases: Array<[string, { major: number; minor: number; patch: number }]> = [
		['1.2.3', { major: 1, minor: 2, patch: 3 }],
		['1.2.3-pre', { major: 1, minor: 2, patch: 3 }],
		['1.2.3-pre.1', { major: 1, minor: 2, patch: 3 }],
		['1.2.3+b', { major: 1, minor: 2, patch: 3 }],
		['1.2.3+build.5', { major: 1, minor: 2, patch: 3 }],
		['1.2.3-pre+b', { major: 1, minor: 2, patch: 3 }],
		['1.2.3b', { major: 1, minor: 2, patch: 3 }],
		['1.2.3b1', { major: 1, minor: 2, patch: 3 }],
		['1.2.3pre', { major: 1, minor: 2, patch: 3 }],
		['v1.2.3', { major: 1, minor: 2, patch: 3 }],
		['V1.2.3', { major: 1, minor: 2, patch: 3 }],
		['1.2', { major: 1, minor: 2, patch: 0 }],
		['1', { major: 1, minor: 0, patch: 0 }],
		['01.02.03', { major: 1, minor: 2, patch: 3 }],
	]

	it.each(validCases)('parses %s', (input, expected) => {
		expect(parseSemver(input)).toEqual(expected)
	})

	const invalidCases = ['', 'not-a-version', '1.2.3-', '1..2', '+1.0.0', '1.2.3+']

	it.each(invalidCases)('rejects %s', input => {
		expect(parseSemver(input)).toBeUndefined()
	})
})
