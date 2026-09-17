import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fromISODate, toISODate } from '../src/dates'

describe('ISO dates', { tags: ['unit'] }, () => {
	// Pinned zones, because the runner's own zone hides these: CI runs in UTC, where a UTC reading passes.
	describe.each(['Asia/Kolkata', 'America/New_York'])('in %s', zone => {
		beforeEach(() => vi.stubEnv('TZ', zone))
		afterEach(() => vi.unstubAllEnvs())

		it('reads a day as its local midnight', () => {
			expect(fromISODate('2026-01-10')).toEqual(new Date(2026, 0, 10))
		})

		it('writes the local day at either end of it', () => {
			expect([toISODate(new Date(2026, 0, 10)), toISODate(new Date(2026, 0, 10, 23, 59))]).toEqual([
				'2026-01-10',
				'2026-01-10',
			])
		})
	})

	it('keeps a year below 100', () => {
		expect(toISODate(fromISODate('0099-03-01'))).toBe('0099-03-01')
	})

	it.each(['', '2026-01-10T00:00:00Z', '2026-02-30', '10/01/2026'])('reads %j as an invalid date', value => {
		expect(fromISODate(value).getTime()).toBeNaN()
	})
})
