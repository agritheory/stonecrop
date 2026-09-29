import { describe, expect, it } from 'vitest'
import { Temporal } from 'temporal-polyfill'

import { readTypedDay, writeTypedDay } from '../src/utils/typedDay'

const fourthOfFebruary = Temporal.PlainDate.from('2026-02-04')
const twentiethOfFebruary = Temporal.PlainDate.from('2026-02-20')

describe('typed days', { tags: ['unit'] }, () => {
	it.each([
		['en-US', '2/4/2026'],
		['en-IN', '4/2/2026'],
		['de-DE', '4.2.2026'],
		['ja-JP', '2026/2/4'],
		// Their own calendar or digits would not read back: Buddhist years, and Persian with Eastern Arabic digits.
		['th-TH', '4/2/2026'],
		['fa-IR', '2026/2/4'],
	])('writes a day as %s writes it, in Gregorian years and Western digits', (locale, written) => {
		expect(writeTypedDay(fourthOfFebruary, locale)).toBe(written)
	})

	it.each(['en-US', 'en-IN', 'en-GB', 'de-DE', 'fr-FR', 'ja-JP', 'sv-SE', 'bg-BG', 'ko-KR', 'th-TH', 'ar-EG', 'fa-IR'])(
		'reads back the days it writes for %s',
		locale => {
			for (const day of [fourthOfFebruary, twentiethOfFebruary]) {
				expect(readTypedDay(writeTypedDay(day, locale), locale)?.toString()).toBe(day.toString())
			}
		}
	)

	it.each(['en-US', 'en-IN', 'ja-JP'])('reads YYYY-MM-DD in %s', locale => {
		expect(readTypedDay(' 2026-02-20 ', locale)?.toString()).toBe('2026-02-20')
	})

	it.each([
		['a month name', 'Feb 4 2026'],
		['a two-digit year', '2/4/26'],
		['another order', '2026/02/04'],
		['a day that does not exist', '2/30/2026'],
		['a month that does not exist', '13/1/2026'],
		['a time as well', '2/4/2026 10:00'],
		['nothing', ''],
	])('reads no day from %s', (_, text) => {
		expect(readTypedDay(text, 'en-US')).toBeUndefined()
	})
})
