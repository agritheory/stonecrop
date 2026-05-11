import type { ColumnSchema } from '@stonecrop/schema'

import type { TableColumn } from './types'

/**
 * Convert an array of doctype field descriptors into ATable column definitions.
 *
 * Fields are excluded when:
 * - `hidden: true` — field should not be visible in any view
 * - no `fieldtype` — non-scalar entry (nested table or fieldset), has no column equivalent
 *
 * `fieldname` is renamed to `name`; `hidden` is stripped. All other `ColumnSchema` properties
 * spread through automatically.
 *
 * @public
 */
export function schemaToColumns(schema: ColumnSchema[]): TableColumn[] {
	return schema
		.filter(f => !f.hidden && f.fieldtype)
		.map(({ fieldname, hidden: _hidden, ...rest }) => ({
			name: fieldname,
			...rest,
		}))
}
