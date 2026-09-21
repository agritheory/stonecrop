import { fromISODate } from '@stonecrop/utilities'
import { Temporal } from 'temporal-polyfill'

// The locale's numeric day in the Gregorian calendar with Western digits, whatever the locale's own
// calendar and digits, so that `readTypedDay` reads back what `writeTypedDay` writes.
const TYPED_DAY_FORMAT: Intl.DateTimeFormatOptions = { calendar: 'gregory', numberingSystem: 'latn' }

/**
 * A day written as the locale writes it in numbers, for a box a user types days into.
 * @param locale - The browser's own when omitted
 */
export function writeTypedDay(day: Temporal.PlainDate, locale?: string): string {
	return day.toLocaleString(locale, TYPED_DAY_FORMAT)
}

/**
 * Reads a day typed as `writeTypedDay` writes it, or as `YYYY-MM-DD`. Any other text, or a day that does
 * not exist, reads as no day. Not `new Date(text)`, which reads `YYYY-MM-DD` as UTC midnight and rolls an
 * impossible day over.
 * @param locale - The browser's own when omitted
 */
export function readTypedDay(text: string, locale?: string): Temporal.PlainDate | undefined {
	const isoDay = fromISODate(text.trim())
	if (isoDay) return isoDay

	const numbers = text.match(/\d+/g)
	if (numbers?.length !== 3) return undefined
	const order = new Intl.DateTimeFormat(locale, TYPED_DAY_FORMAT)
		.formatToParts(0)
		.map(part => part.type)
		.filter(type => type === 'year' || type === 'month' || type === 'day')
	const typed = Object.fromEntries(order.map((type, index) => [type, numbers[index]]))
	if (typed.year?.length !== 4) return undefined

	try {
		return Temporal.PlainDate.from(
			{ year: Number(typed.year), month: Number(typed.month), day: Number(typed.day) },
			{ overflow: 'reject' }
		)
	} catch {
		return undefined
	}
}
