import type { ColumnSchema } from '@stonecrop/schema'

import type { ResolvedField } from '../types'

/**
 * The resolved fields that can be columns in a list or table view, in declaration order.
 *
 * A cell renders one value, so only `kind: 'field'` qualifies. The other three kinds are
 * containers: a `fieldset` groups fields for layout and has no value of its own, while a `link`
 * and a `table` hold a nested record and an array of them. Neither has a `cellComponent`, so a
 * container reaching `ACell` falls through to plain-text rendering and stringifies its children —
 * no error and no log, just a wrong column.
 *
 * A fieldset's *children* are real columns, so it is flattened rather than dropped; losing them is
 * the same silent defect in the other direction.
 *
 * One definition, called by both consumers: `Registry.buildTableConfig` (a child table's columns,
 * from its target's resolved schema) and Desktop's records list. Re-deriving it at either call
 * site produced exactly one of the two failures above at each.
 *
 * @param fields - resolved fields, as produced by `resolveSchema`
 * @returns column definitions, with the `kind` discriminator stripped
 * @public
 */
export function resolvedFieldsToColumns(fields: readonly ResolvedField[]): ColumnSchema[] {
	const columns: ColumnSchema[] = []

	for (const field of fields) {
		if (field.kind === 'fieldset') {
			columns.push(...resolvedFieldsToColumns(field.schema))
		} else if (field.kind === 'field') {
			const { kind: _kind, ...column } = field
			columns.push(column)
		}
	}

	return columns
}
