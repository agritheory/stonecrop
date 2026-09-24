import { Temporal } from 'temporal-polyfill'

/**
 * Reads a `YYYY-MM-DD` day. Anything that is not a real day written exactly that way reads as no day.
 *
 * Not `Temporal.PlainDate.from` alone: it also takes the day out of a date-time, which would show a day
 * field over a date-time column as a day instead of as the mismatch it is.
 * @param day - The day, as `YYYY-MM-DD`
 * @public
 */
export function fromISODate(day: string): Temporal.PlainDate | undefined {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return undefined

	try {
		return Temporal.PlainDate.from(day)
	} catch {
		return undefined
	}
}
