import type { DoctypeSchema, DoctypeManySchema } from '../types'

/**
 * Type guard that checks whether a Doctype schema field has `cardinality: 'many'`
 *
 * @param field - A DoctypeSchema field to check
 * @returns `true` if the field has `cardinality: 'many'`
 * @public
 */
export function isDoctypeMany(field: DoctypeSchema): field is DoctypeManySchema {
	return field.cardinality === 'many'
}
