import { describe, expect, it } from 'vitest'

import { lookupBadge } from '../src/badge'

const TYPO = 'warnin' // one character short of 'warning'

const structured = (spec: unknown) => ({ choices: ['Active'], badges: { Active: spec } }) as never

describe('malformed badge specs', { tags: ['unit'] }, () => {
	it('CONTROL — a well-formed spec still resolves', () => {
		expect(lookupBadge(structured('success'), 'Active')).toEqual({
			label: 'Active',
			variant: 'success',
			color: undefined,
		})
	})

	it('keeps the label and drops the styling when the variant is misspelt', () => {
		expect(lookupBadge(structured(TYPO), 'Active')).toEqual({ label: 'Active' })
	})

	it('does not let an invalid variant reach the caller', () => {
		expect(lookupBadge(structured({ variant: 'nope' }), 'Active')).toEqual({ label: 'Active' })
	})

	it('does not throw on a null spec', () => {
		expect(() => lookupBadge(structured(null), 'Active')).not.toThrow()
		expect(lookupBadge(structured(null), 'Active')).toEqual({ label: 'Active' })
	})

	it.each([123, true, ['success'], { variant: 'success', shade: 'dark' }])(
		'degrades rather than misrenders for %j',
		spec => {
			expect(lookupBadge(structured(spec), 'Active')).toEqual({ label: 'Active' })
		}
	)
})
