import type { ResolvedField } from '@stonecrop/aform'
import { componentCategory } from '@stonecrop/schema'

import type Doctype from './doctype'
import type Registry from './registry'
import { rowComposeSchema } from './table-row-schema'
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
 * Walk a composed record and resolve `"now"` / `"uuidv7"` on scalars using the resolved schema.
 * @internal
 */
export function resolveTokensInRecord(
	record: Record<string, unknown>,
	schema: ResolvedField[],
	now: Date,
	options?: { registry?: Registry; doctype?: Doctype }
): Record<string, unknown> {
	const out: Record<string, unknown> = { ...record }

	for (const field of schema) {
		if (field.kind === 'table') {
			const rows = out[field.fieldname]
			if (!Array.isArray(rows)) continue
			const rowSchema =
				options?.registry && options?.doctype ? rowComposeSchema(field, options.registry, options.doctype) : []
			out[field.fieldname] = rows.map(row => {
				if (isPlainObject(row)) {
					return resolveTokensInRecord(row, rowSchema, now, options)
				}
				return row
			})
		} else if (field.kind === 'link' || field.kind === 'fieldset') {
			const nested = out[field.fieldname]
			if (isPlainObject(nested)) {
				out[field.fieldname] = resolveTokensInRecord(nested, field.schema, now)
			}
		} else if (field.kind === 'field') {
			if (field.fieldname in out) {
				out[field.fieldname] = resolveDefaultToken(out[field.fieldname], field.component, now)
			} else if (field.default !== undefined) {
				out[field.fieldname] = resolveDefaultToken(field.default, field.component, now)
			}
		}
	}

	return out
}
