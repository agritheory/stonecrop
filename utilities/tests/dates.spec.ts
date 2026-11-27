import { Temporal } from 'temporal-polyfill'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { formatTimeOfDay, fromISODate, fromISOTime } from '../src/dates'

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

describe('times of day', { tags: ['unit'] }, () => {
	it.each([
		['09:30', '09:30:00'],
		['09:30:15', '09:30:15'],
		['09:30:00.000000', '09:30:00'],
		['23:59:59.5', '23:59:59.5'],
	])('reads %j as %s', (value, time) => {
		expect(fromISOTime(value)?.toString()).toBe(time)
	})

	// Temporal's own reader accepts the date-times, taking a time out of a moment's text.
	it.each(['', 'after lunch', '9:30', '24:00', '09:60', '2026-01-10T09:30:00Z', '2026-01-10T09:30', '0930'])(
		'reads %j as no time',
		value => {
			expect(fromISOTime(value)).toBeUndefined()
		}
	)

	it('writes a time as the locale does, with seconds only when it has some', () => {
		expect(formatTimeOfDay(Temporal.PlainTime.from('09:30'), 'en-US')).toBe('9:30 AM')
		expect(formatTimeOfDay(Temporal.PlainTime.from('21:30'), 'en-GB')).toBe('21:30')
		expect(formatTimeOfDay(Temporal.PlainTime.from('14:05:09'), 'en-US')).toBe('2:05:09 PM')
	})
})
