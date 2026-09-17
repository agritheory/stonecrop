import { describe, it, expect } from 'vitest'

import {
	parseCalendarDate,
	parseDateRange,
	readTableDate,
	toCalendarDateString,
	toDate,
	writeTableDate,
} from '../src/utils/calendar-date'

describe('calendar-date', () => {
	it('parses YYYY-MM-DD as a local calendar day', () => {
		const parsed = parseCalendarDate('2026-03-01')
		expect(parsed).not.toBeNull()
		expect(parsed!.getFullYear()).toBe(2026)
		expect(parsed!.getMonth()).toBe(2)
		expect(parsed!.getDate()).toBe(1)
	})

	it('rejects impossible calendar days', () => {
		expect(parseCalendarDate('2026-02-31')).toBeNull()
	})

	it('formats a Date as YYYY-MM-DD from local parts', () => {
		expect(toCalendarDateString(new Date(2026, 2, 1))).toBe('2026-03-01')
	})

	it('parses an em-dash range', () => {
		const parsed = parseDateRange('2026-03-01 — 2026-03-15')
		expect(parsed).not.toBeNull()
		expect(toCalendarDateString(parsed!.start!)).toBe('2026-03-01')
		expect(toCalendarDateString(parsed!.end!)).toBe('2026-03-15')
	})

	it('parses a "to" range', () => {
		const parsed = parseDateRange('2026-03-01 to 2026-03-15')
		expect(parsed).not.toBeNull()
		expect(toCalendarDateString(parsed!.start!)).toBe('2026-03-01')
		expect(toCalendarDateString(parsed!.end!)).toBe('2026-03-15')
	})

	it('parses a single date as a start-only range', () => {
		const parsed = parseDateRange('2026-03-01')
		expect(parsed).not.toBeNull()
		expect(toCalendarDateString(parsed!.start!)).toBe('2026-03-01')
		expect(parsed!.end).toBeNull()
	})

	it('returns null for an unparseable range', () => {
		expect(parseDateRange('not a date — also not')).toBeNull()
	})

	it('clears an empty range', () => {
		expect(parseDateRange('   ')).toEqual({ start: null, end: null })
	})

	it('coerces timestamps and ISO strings to dates', () => {
		expect(toDate('2025-07-24')?.getDate()).toBe(24)
		expect(toDate(new Date(2025, 6, 24).getTime())?.getDate()).toBe(24)
	})

	it('reads a table cell from rows/columns when getCellData is absent', () => {
		const store = {
			columns: [{ name: 'ship_date' }],
			rows: [{ ship_date: '2025-07-24' }],
		}
		expect(toCalendarDateString(readTableDate(store, 0, 0)!)).toBe('2025-07-24')
	})

	it('reads and writes a table cell date, preserving ISO vs timestamp', () => {
		const cells: unknown[][] = [['2025-07-24']]
		const store = {
			getCellData: (col: number, row: number) => cells[row][col],
			setCellData: (col: number, row: number, value: unknown) => {
				cells[row][col] = value
			},
			modal: { visible: true },
		}

		expect(toCalendarDateString(readTableDate(store, 0, 0)!)).toBe('2025-07-24')
		writeTableDate(store, 0, 0, new Date(2025, 6, 20))
		expect(cells[0][0]).toBe('2025-07-20')
		expect(store.modal.visible).toBe(false)

		cells[0][0] = new Date(2025, 6, 24).getTime()
		store.modal.visible = true
		writeTableDate(store, 0, 0, new Date(2025, 6, 20))
		expect(cells[0][0]).toBe(new Date(2025, 6, 20).getTime())
	})
})
