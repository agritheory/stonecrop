import { componentCategory } from '@stonecrop/schema'
import type { ColumnSchema } from '@stonecrop/schema'

import type { TableColumn } from './types'
import { formatCurrency, formatQuantity } from './utils'

/**
 * Convert an array of doctype field descriptors into ATable column definitions.
 *
 * Fields are excluded when:
 *
 * - `hidden: true` — field should not be visible in any view
 *
 * - no `component` — non-scalar entry (nested table or fieldset), no column equivalent
 *
 * `fieldname` is renamed to `name`; `hidden` is stripped. All other `ColumnSchema` properties
 * spread through automatically.
 *
 * For link fields (those carrying `doctype`) without an explicit `cellComponent`:
 *
 * - `linkDoctype` is set from the field's `doctype` property, the doctype a cell resolves the link's text from.
 *
 * - A synchronous `format` function is added (unless the field already has one) that handles
 *   both bare ID strings and pre-resolved `{ id, displayText }` objects.
 *
 * For quantity fields — those whose `component` carries the `'quantity'` category — without an
 * explicit `format`, a synchronous `format` is added that renders the `{ qty, uom, stockUom }`
 * value (see `QuantityValue` in `@stonecrop/aform`), omitting the UOM when it matches `stockUom`.
 *
 * For currency fields — those whose `component` carries the `'currency'` category — without an
 * explicit `format`, a synchronous `format` is added that renders the `{ amount, currency }`
 * value (see `CurrencyValue` in `@stonecrop/aform`) with `Intl` currency formatting when possible.
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

			// Quantity fields: render the composite { qty, uom } value as "<qty> <uom>".
			if (componentCategory(rest.component) === 'quantity' && !rest.format) {
				col.format = formatQuantity
			}

			// Currency fields: render the composite { amount, currency } value as "<amount> <currency>".
			if (componentCategory(rest.component) === 'currency' && !rest.format) {
				col.format = formatCurrency
			}

			return col
		})
}
