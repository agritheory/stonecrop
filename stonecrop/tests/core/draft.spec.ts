import { describe, it, expect } from 'vitest'

import { DRAFT_RECORD_ID, isDraftRecordId } from '../../src/draft'

describe('draft record identity', { tags: ['unit'] }, () => {
	it('recognises the draft route segment', () => {
		// The round trip is the contract. It used to be broken across packages: the desktop shell
		// minted `new-<timestamp>` while this package tested `=== 'new'`, so every guard here was
		// dead and an unsaved record was fetched, left uninitialized, and judged for workflow
		// readiness against links it could not possibly have.
		expect(isDraftRecordId(DRAFT_RECORD_ID)).toBe(true)
	})

	it('does not treat a saved record as a draft', () => {
		expect(isDraftRecordId('7')).toBe(false)
		expect(isDraftRecordId('Kilogram')).toBe(false)
	})

	it('does not match a real identity that merely starts with the same letters', () => {
		expect(isDraftRecordId('newsletter')).toBe(false)
		expect(isDraftRecordId('newton')).toBe(false)
	})

	it('no longer matches the timestamped ids the shell used to mint', () => {
		// A record genuinely keyed `new-1785924403901` is a real record now, not a draft. Nothing
		// mints these any more, and treating one as a draft would suppress its fetch.
		expect(isDraftRecordId('new-1785924403901')).toBe(false)
	})

	it('treats a missing id as not-a-draft', () => {
		expect(isDraftRecordId(undefined)).toBe(false)
		expect(isDraftRecordId(null)).toBe(false)
		expect(isDraftRecordId('')).toBe(false)
	})
})
