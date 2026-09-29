import { Temporal } from 'temporal-polyfill'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fromISODate } from '../src/dates'

describe('ISO dates', { tags: ['unit'] }, () => {
	// Pinned zones, because the runner's own zone hides these: CI runs in UTC, where a UTC reading passes.
	describe.each(['Asia/Kolkata', 'America/New_York'])('in %s', zone => {
		beforeEach(() => vi.stubEnv('TZ', zone))
		afterEach(() => vi.unstubAllEnvs())

		it('reads a day as that day', () => {
			expect(fromISODate('2026-01-10')?.equals(Temporal.PlainDate.from({ year: 2026, month: 1, day: 10 }))).toBe(true)
		})
	})

	it('keeps a year below 100', () => {
		expect(fromISODate('0099-03-01')?.toString()).toBe('0099-03-01')
	})

	// Temporal's own reader accepts the last four, taking a day out of a moment's text.
	it.each([
		'',
		'2026-02-30',
		'10/01/2026',
		'2026-01-10T00:00:00Z',
		'2026-01-10T09:00:00+05:30',
		'2026-01-10T09:00',
		'20260110',
		'+002026-01-10',
	])('reads %j as no day', value => {
		expect(fromISODate(value)).toBeUndefined()
	})
})
