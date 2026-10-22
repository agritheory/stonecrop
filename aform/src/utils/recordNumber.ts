/**
 * A number part of a box's value as a number, or null when it holds none. A part read from a record's
 * own field holds what the server sent, and Postgres sends a `numeric` column as its decimal text.
 */
export function numberFromRecord(value: number | string | null | undefined): number | null {
	if (value === null || value === undefined || value === '') return null
	return typeof value === 'number' ? value : Number(value)
}
