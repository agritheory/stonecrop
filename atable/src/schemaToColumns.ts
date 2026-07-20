import type { ColumnSchema } from '@stonecrop/schema'

import type { TableColumn } from './types'

/**
 * Convert an array of doctype field descriptors into ATable column definitions.
 *
 * Fields are excluded when:
 * - `hidden: true` — field should not be visible in any view
 * - no `component` — non-scalar entry (nested table or fieldset), no column equivalent
 *
 * `fieldname` is renamed to `name`; `hidden` is stripped. All other `ColumnSchema` properties
 * spread through automatically.
 *
 * For link fields (those carrying `doctype`) without an explicit `cellComponent`:
 * - `linkDoctype` is set from the field's `doctype` property (used by ACell's async resolver).
 * - A synchronous `format` function is added (unless the field already has one) that handles
 *   both bare ID strings and pre-resolved `{ id, displayText }` objects.
 *
 * @public
 */
export function schemaToColumns(schema: ColumnSchema[]): TableColumn[] {
	return schema
		.filter(f => !f.hidden && f.component)
		.map(({ fieldname, hidden: _hidden, ...rest }) => {
			const col: TableColumn = Object.assign({ name: fieldname }, rest)

			// Link fields: store the linked doctype for async resolution by ACell, and add a sync
			// format that handles pre-resolved AFormLinkValue objects.
			if (rest.doctype && !rest.cellComponent) {
				col.linkDoctype = rest.doctype

				if (!rest.format) {
					col.format = (v: any): string => {
						if (v === null || v === undefined) return ''
						if (typeof v === 'object') {
							const display: unknown = v.displayText ?? v.id ?? ''
							return typeof display === 'string' || typeof display === 'number' ? String(display) : ''
						}
						return String(v)
					}
				}
			}

			return col
		})
}
