import {
	type DoctypeManySchema,
	type DoctypeOneSchema,
	type DoctypeSchema,
	type SchemaTypes,
	isDoctypeMany,
} from '@stonecrop/aform'

import type { HSTNode } from './stores/hst'

/**
 * Recursively collect nested data from HST using pre-resolved schemas.
 *
 * Walks through a resolved schema and collects all values from the HST store,
 * including nested 1:1 Doctype fields and 1:many child arrays.
 *
 * @param resolvedSchema - The already-resolved schema (with nested schemas embedded)
 * @param basePath - The base path in HST (e.g., "customer.123.address")
 * @param hstStore - The HST store instance
 * @returns The collected data object with all nested fields
 *
 * @example
 * ```ts
 * const addressSchema = registry.resolveSchema(addressDoctype.schema)
 * const addressData = collectNestedData(addressSchema, 'customer.123.address', hstStore)
 * // Returns: { street: '123 Main St', city: 'Portland', ... }
 * ```
 *
 * @public
 */
export function collectNestedData(
	resolvedSchema: SchemaTypes[],
	basePath: string,
	hstStore: HSTNode
): Record<string, unknown> {
	const data = hstStore.get(basePath) || {}
	const payload: Record<string, unknown> = { ...data }

	const doctypeFields = resolvedSchema.filter(
		field =>
			'fieldtype' in field &&
			field.fieldtype === 'Doctype' &&
			!isDoctypeMany(field as DoctypeSchema) &&
			'schema' in field &&
			Array.isArray(field.schema)
	)

	for (const field of doctypeFields) {
		const doctypeField = field as DoctypeOneSchema
		const fieldPath = `${basePath}.${doctypeField.fieldname}`
		const nestedData = collectNestedData(doctypeField.schema!, fieldPath, hstStore)
		payload[doctypeField.fieldname] = nestedData
	}

	const doctypeManyFields = resolvedSchema.filter(
		field => 'fieldtype' in field && field.fieldtype === 'Doctype' && isDoctypeMany(field as DoctypeSchema)
	)

	for (const field of doctypeManyFields) {
		const doctypeField = field as DoctypeManySchema
		const fieldPath = `${basePath}.${doctypeField.fieldname}`
		const arrayData = hstStore.get(fieldPath)
		if (Array.isArray(arrayData)) {
			payload[doctypeField.fieldname] = arrayData
		}
	}

	return payload
}
