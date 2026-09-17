import { componentCategory } from '@stonecrop/schema'
import type { ColumnSchema } from '@stonecrop/schema'

import type { TableColumn } from './types'
import { formatCalendarDate, formatCurrency, formatQuantity } from './utils'

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
 * For quantity fields — those whose `component` carries the `'quantity'` category — without an
 * explicit `format`, a synchronous `format` is added that renders the `{ qty, uom }` value (see
 * `QuantityValue` in `@stonecrop/aform`) as `"<qty> <uom>"`.
 *
 * For currency fields — those whose `component` carries the `'currency'` category — without an
 * explicit `format`, a synchronous `format` is added that renders the `{ amount, currency }` value
 * (see `CurrencyValue` in `@stonecrop/aform`) as `"<amount> <currency>"`.
 *
 * For date fields — those whose `component` carries the `'date'` category — without an explicit
 * `format`, a synchronous `format` is added that treats `YYYY-MM-DD` as a local calendar day.
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

			// Date fields: YYYY-MM-DD is a local calendar day. The JS Date constructor treats that
			// string as UTC midnight, which shifts the displayed day west of UTC.
			if (componentCategory(rest.component) === 'date' && !rest.format) {
				col.format = formatCalendarDate
			}

			return col
		})
}
