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

/**
 * Reads a time of day: `HH:MM`, `HH:MM:SS`, or `HH:MM:SS` with a fraction of a second, as Postgres writes a
 * `time` column (`09:30:00.000000`). Anything else, a date-time included, reads as no time.
 * @param time - The time of day
 * @public
 */
export function fromISOTime(time: string): Temporal.PlainTime | undefined {
	if (!/^\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?$/.test(time)) return undefined

	try {
		return Temporal.PlainTime.from(time)
	} catch {
		return undefined
	}
}

/**
 * A time of day as the user's locale writes one: `9:30 AM` in `en-US`, `09:30` in `en-GB`. The seconds show
 * only when the time has some.
 * @param time - The time of day
 * @param locales - The locale to write it in; the user's own by default
 * @public
 */
export function formatTimeOfDay(time: Temporal.PlainTime, locales?: Intl.LocalesArgument): string {
	return time.toLocaleString(locales, {
		hour: 'numeric',
		minute: '2-digit',
		...(time.second || time.millisecond || time.microsecond || time.nanosecond ? { second: '2-digit' } : {}),
	})
}
