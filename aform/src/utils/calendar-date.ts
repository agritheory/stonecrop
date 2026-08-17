const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

/** Parse a date-only ISO string (`YYYY-MM-DD`) as a local calendar day. */
export function parseCalendarDate(value: string | Date | null | undefined): Date | null {
	if (value == null || value === '') return null
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value

	const iso = value.trim().match(ISO_DATE)
	if (iso) {
		const year = Number(iso[1])
		const month = Number(iso[2])
		const day = Number(iso[3])
		const date = new Date(year, month - 1, day)
		if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
		return date
	}

	const parsed = new Date(value)
	return Number.isNaN(parsed.getTime()) ? null : parsed
}

/** Coerce a cell or field value (ISO string, locale string, timestamp, or Date) to a Date. */
export function toDate(value: number | Date | string | null | undefined): Date | null {
	if (value == null || value === '') return null
	if (typeof value === 'number') {
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? null : parsed
	}
	return parseCalendarDate(value)
}

/** Minimal table-store surface used when a date widget is mounted as a cell modal. */
export type TableDateStore = {
	getCellData?: (colIndex: number, rowIndex: number) => unknown
	setCellData?: (colIndex: number, rowIndex: number, value: unknown) => void
	columns?: { name?: string; fieldname?: string }[]
	rows?: Record<string, unknown>[]
	modal?: { visible: boolean }
}

export function readTableCell(store: TableDateStore, colIndex: number, rowIndex: number): unknown {
	if (typeof store.getCellData === 'function') return store.getCellData(colIndex, rowIndex)
	const column = store.columns?.[colIndex]
	const row = store.rows?.[rowIndex]
	const name = column?.name ?? column?.fieldname
	if (!row || !name) return undefined
	return row[name]
}

export function readTableDate(store: TableDateStore, colIndex: number, rowIndex: number): Date | null {
	return toDate(readTableCell(store, colIndex, rowIndex) as number | Date | string | null)
}

export function writeTableDate(store: TableDateStore, colIndex: number, rowIndex: number, value: Date) {
	const current = readTableCell(store, colIndex, rowIndex)
	const next = typeof current === 'number' ? value.getTime() : toCalendarDateString(value)
	if (typeof store.setCellData === 'function') {
		store.setCellData(colIndex, rowIndex, next)
	} else {
		const column = store.columns?.[colIndex]
		const row = store.rows?.[rowIndex]
		const name = column?.name ?? column?.fieldname
		if (row && name) row[name] = next
	}
	if (store.modal) store.modal.visible = false
}

/** Format a Date as `YYYY-MM-DD` from its local calendar parts. */
export function toCalendarDateString(date: Date): string {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

const RANGE_SPLIT = /\s*[—–]\s*|\s+-\s+|\s+to\s+/i

/** Parse a typed range such as `3/1/2026 — 3/15/2026` or `2026-03-01 to 2026-03-15`. */
export function parseDateRange(value: string): { start: Date | null; end: Date | null } | null {
	const trimmed = value.trim()
	if (!trimmed) return { start: null, end: null }

	const parts = trimmed
		.split(RANGE_SPLIT)
		.map(part => part.trim())
		.filter(part => part && part !== '...')

	if (parts.length === 0) return { start: null, end: null }
	if (parts.length === 1) {
		const start = parseCalendarDate(parts[0])
		if (!start) return null
		return { start, end: null }
	}

	const start = parseCalendarDate(parts[0])
	const end = parseCalendarDate(parts[1])
	if (!start || !end) return null
	return { start, end }
}
