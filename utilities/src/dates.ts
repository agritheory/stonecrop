/**
 * Reads a `YYYY-MM-DD` day as its local midnight, the Date a calendar shows as that day. Anything
 * that is not a real day written that way reads as an invalid Date.
 * @param day - The day, as `YYYY-MM-DD`
 * @public
 */
export function fromISODate(day: string): Date {
	const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day)
	if (!parts) return new Date(NaN)

	const year = Number(parts[1])
	const monthIndex = Number(parts[2]) - 1
	const dayOfMonth = Number(parts[3])

	// Not `new Date(year, monthIndex, dayOfMonth)`: it reads a year below 100 as 19xx.
	const date = new Date(0)
	date.setFullYear(year, monthIndex, dayOfMonth)
	date.setHours(0, 0, 0, 0)
	return date.getMonth() === monthIndex && date.getDate() === dayOfMonth ? date : new Date(NaN)
}

/**
 * Writes a Date as the `YYYY-MM-DD` day it falls on in local time, the day a calendar showed for it.
 * Not `toISOString()`, which gives the UTC day: a day early east of UTC.
 * @param date - The Date to write
 * @public
 */
export function toISODate(date: Date): string {
	const year = String(date.getFullYear()).padStart(4, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const dayOfMonth = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${dayOfMonth}`
}
