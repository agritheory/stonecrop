import type { ColumnSchema } from '@stonecrop/schema'

import type { TableColumn } from './types'

/**
 * Convert an array of doctype field descriptors into ATable column definitions.
 *
 * Fields are excluded when:
 * - `hidden: true` — field should not be visible in any view
 * - no `fieldtype` — non-scalar entry (nested table or fieldset), has no column equivalent
 *
 * Form-only properties (`hidden`, `component`, `mode`) are stripped from the output.
 * All other properties spread through automatically, so new `ColumnSchema` properties
 * flow to columns without changes here.
 *
 * @public
 */
export function schemaToColumns(schema: ColumnSchema[]): TableColumn[] {
	return schema
		.filter(f => !f.hidden && f.fieldtype)
		.map(({ fieldname, hidden: _hidden, component: _component, mode: _mode, ...rest }: any) => ({
			name: fieldname,
			...rest,
		})) as TableColumn[]
}
