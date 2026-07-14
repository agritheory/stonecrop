import type { ColumnSchema } from '@stonecrop/schema'

import type { TableColumn } from './types'

/**
 * Convert an array of doctype field descriptors into ATable column definitions.
 *
 * Fields are excluded when:
 * - `hidden: true` — field should not be visible in any view
 * - no `component` and no `fieldtype` — non-scalar entry (nested table or fieldset), no column equivalent
 *
 * `fieldname` is renamed to `name`; `hidden` is stripped. All other `ColumnSchema` properties
 * spread through automatically.
 *
 * For `fieldtype: 'Link'` fields without an explicit `cellComponent`:
 * - `linkDoctype` is set from the field's `doctype` property (used by ACell's async resolver).
 * - A synchronous `format` function is added (unless the field already has one) that handles
 *   both bare ID strings and pre-resolved `{ id, displayText }` objects.
 *
 * @public
 */
export function schemaToColumns(schema: ColumnSchema[]): TableColumn[] {
	return schema
		.filter(f => !f.hidden && (f.component || f.fieldtype))
		.map(({ fieldname, hidden: _hidden, ...rest }) => {
			const col: TableColumn = Object.assign({ name: fieldname }, rest)

			// Link fields: store the linked doctype for async resolution by ACell,
			// and add a sync format that handles pre-resolved AFormLinkValue objects.
			if (rest.fieldtype === 'Link' && !rest.cellComponent) {
				const fields = rest as Record<string, unknown>
				const linkedDoctype = typeof fields.doctype === 'string' ? fields.doctype : undefined
				if (linkedDoctype) col.linkDoctype = linkedDoctype

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
