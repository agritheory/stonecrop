import { componentCategory } from '@stonecrop/schema'

import { columnFields, recordFields, type RecordField } from './record-fields'
import type Registry from './registry'
import { createUuidv7 } from './uuidv7'

export const DEFAULT_TOKEN_NOW = 'now'
export const DEFAULT_TOKEN_UUIDV7 = 'uuidv7'

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Resolve compose-time tokens on a scalar value for a field component.
 * @internal
 */
export function resolveDefaultToken(value: unknown, component: string | undefined, now: Date): unknown {
	if (value === DEFAULT_TOKEN_UUIDV7) {
		return createUuidv7(now)
	}
	if (value !== DEFAULT_TOKEN_NOW) {
		return value
	}
	const category = componentCategory(component)
	if (category === 'datetime') {
		return now.toISOString()
	}
	if (category === 'date') {
		return now.toISOString().slice(0, 10)
	}
	return value
}

/**
 * Walk a composed record and resolve `"now"` / `"uuidv7"` on its values. Each key is read through its field in the
 * doctype's declarations, so embedded records and rows use their own doctype, and an inline table's rows use its
 * columns.
 * @internal
 */
export function resolveTokensInRecord(
	record: Record<string, unknown>,
	fields: ReadonlyMap<string, RecordField>,
	registry: Registry,
	now: Date
): Record<string, unknown> {
	const out: Record<string, unknown> = { ...record }

	for (const field of fields.values()) {
		const value = out[field.fieldname]
		if (field.holds === 'value') {
			if (field.fieldname in out) {
				out[field.fieldname] = resolveDefaultToken(value, field.component, now)
			} else if (field.default !== undefined) {
				out[field.fieldname] = resolveDefaultToken(field.default, field.component, now)
			}
		} else if (field.holds === 'record') {
			if (isPlainObject(value)) {
				out[field.fieldname] = resolveTokensInRecord(value, recordFields(registry, field.target), registry, now)
			}
		} else if (Array.isArray(value)) {
			const rowFields = field.holds === 'rows' ? recordFields(registry, field.target) : columnFields(field.columns)
			out[field.fieldname] = value.map(row =>
				isPlainObject(row) ? resolveTokensInRecord(row, rowFields, registry, now) : row
			)
		}
	}

	return out
}
