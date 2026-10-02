import { describe, expect, it } from 'vitest'

import { compareSemver, isSemver, isSemverPrefix } from '../src/semver'

// The spec's own examples, plus a version too big for a JavaScript number to hold exactly.
const VERSIONS = [
	'0.0.0',
	'1.9.0',
	'1.10.0',
	'1.0.0-alpha',
	'1.0.0-alpha.1',
	'1.0.0-0.3.7',
	'1.0.0-x.7.z.92',
	'1.0.0-x-y-z.--',
	'1.0.0-alpha+001',
	'1.0.0+20130313144700',
	'1.0.0-beta+exp.sha.5114f85',
	'1.0.0+21AF26D3----117B344092BD',
	'1.0.0-01a',
	'99999999999999999999.0.0',
]

describe('SemVer', { tags: ['unit'] }, () => {
	it.each(VERSIONS)('takes %s as a version', version => {
		expect(isSemver(version)).toBe(true)
	})

	// The forms a looser reading accepts, and the spec's own invalid examples.
	it.each([
		'',
		'v1.2.3',
		'V1.2.3',
		'1',
		'1.2',
		'1.2.3.4',
		'01.2.3',
		'1.02.3',
		'1.2.03',
		'1.2.3b1',
		'1.2.3-',
		'1.2.3+',
		'1.2.3-01',
		'1.2.3-alpha..1',
		'1.2.3-alpha_1',
		'1.2.3+build+5',
		' 1.2.3',
	])('does not take %j as a version', text => {
		expect(isSemver(text)).toBe(false)
	})

	describe('text a version can start with', () => {
		// Typing a version one key at a time passes through each of its prefixes.
		it.each(VERSIONS)('takes every prefix of %s', version => {
			const prefixes = Array.from({ length: version.length }, (_, end) => version.slice(0, end + 1))
			const refused = prefixes.filter(text => !isSemverPrefix(text))
			expect(refused).toEqual([])
		})

		it.each(['', '1', '1.', '1.2.', '1.2.3-', '1.2.3-alpha.', '1.2.3-01', '1.2.3+', '1.2.3+build.'])(
			'takes %j',
			text => {
				expect(isSemverPrefix(text)).toBe(true)
			}
		)

		it.each([
			'v',
			'v1',
			'01',
			'1.02',
			'1..',
			'.1',
			'1.2.3.',
			'1.2-',
			'1.2+',
			'1.2.3-+',
			'1.2.3-01+b',
			'1.2.3+b+',
			'1.2.3_',
			'apple',
		])('refuses %j', text => {
			expect(isSemverPrefix(text)).toBe(false)
		})
	})

	describe('precedence', () => {
		const sorted = (versions: string[]) => versions.toSorted(compareSemver)

		it('compares major, minor and patch as numbers', () => {
			expect(sorted(['2.1.1', '1.10.0', '2.0.0', '1.9.0', '2.1.0', '1.0.0'])).toEqual([
				'1.0.0',
				'1.9.0',
				'1.10.0',
				'2.0.0',
				'2.1.0',
				'2.1.1',
			])
		})

		it("orders prereleases as the spec's example does", () => {
			const order = [
				'1.0.0-alpha',
				'1.0.0-alpha.1',
				'1.0.0-alpha.beta',
				'1.0.0-beta',
				'1.0.0-beta.2',
				'1.0.0-beta.11',
				'1.0.0-rc.1',
				'1.0.0',
			]
			expect(sorted(order.toReversed())).toEqual(order)
		})

		it('ignores build metadata', () => {
			expect(compareSemver('1.0.0+a', '1.0.0+b')).toBe(0)
			expect(compareSemver('1.0.0-rc.1+b', '1.0.0+a')).toBeLessThan(0)
		})

		it('orders numbers too big for a JavaScript number', () => {
			expect(compareSemver('99999999999999999998.0.0', '99999999999999999999.0.0')).toBeLessThan(0)
		})

		it('puts text that is not a version after every version', () => {
			expect(sorted(['', '2.0.0', 'v1.0.0', '1.0.0'])).toEqual(['1.0.0', '2.0.0', '', 'v1.0.0'])
		})
	})
})
