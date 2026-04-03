import type { DoctypeSchema, DoctypeManySchema } from '../types'

/**
 * Type guard that checks whether a Doctype schema field represents a 1:many child table
 *
 * @param field - A DoctypeSchema field to check
 * @returns `true` if the field has `cardinality: 'noneOrMany'` or `'atLeastOne'`
 * @public
 */
export function isDoctypeMany(field: DoctypeSchema): field is DoctypeManySchema {
	return field.cardinality === 'noneOrMany' || field.cardinality === 'atLeastOne'
}
