import { describe, it, expect } from 'vitest'

import { isDraftRecordId, newDraftRecordId } from '../../src/draft'

describe('draft record identity', { tags: ['unit'] }, () => {
	it('recognises an id it minted itself', () => {
		// The round trip is the contract. It used to be broken across packages: the desktop shell
		// minted `new-<timestamp>` while this package tested `=== 'new'`, so every guard here was
		// dead and an unsaved record was fetched, left uninitialized, and judged for workflow
		// readiness against links it could not possibly have.
		expect(isDraftRecordId(newDraftRecordId())).toBe(true)
	})

	it('still recognises the bare legacy placeholder', () => {
		// A host that routes to /{doctype}/new, and records keyed under the bare placeholder,
		// predate the timestamped scheme and must keep working.
		expect(isDraftRecordId('new')).toBe(true)
	})

	it('does not treat a saved record as a draft', () => {
		expect(isDraftRecordId('7')).toBe(false)
		expect(isDraftRecordId('Kilogram')).toBe(false)
	})

	it('does not match a real identity that merely starts with the same letters', () => {
		// `newsletter` starts with "new" but is not "new" and does not carry the separator.
		expect(isDraftRecordId('newsletter')).toBe(false)
		expect(isDraftRecordId('newton')).toBe(false)
	})

	it('treats a missing id as not-a-draft', () => {
		expect(isDraftRecordId(undefined)).toBe(false)
		expect(isDraftRecordId(null)).toBe(false)
		expect(isDraftRecordId('')).toBe(false)
	})

	it('mints ids that carry the separator, so a bare prefix cannot collide', () => {
		expect(newDraftRecordId()).toMatch(/^new-\d+$/)
	})
})
