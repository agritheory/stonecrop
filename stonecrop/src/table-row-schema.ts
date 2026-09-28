import type { ResolvedField, ResolvedTable } from '@stonecrop/aform'
import type { ColumnSchema } from '@stonecrop/schema'

import type Doctype from './doctype'
import type Registry from './registry'

/**
 * Schema used to compose one row of a table field (link child or inline columns).
 * @internal
 */
export function rowComposeSchema(field: ResolvedTable, registry: Registry, parentDoctype: Doctype): ResolvedField[] {
	const link = parentDoctype.links?.[field.fieldname]
	if (link) {
		const child = registry.getDoctype(link.target)
		if (child) {
			return registry.resolveSchema(child)
		}
	}

	return field.schema.map((col: ColumnSchema): ResolvedField => ({
		kind: 'field',
		fieldname: col.fieldname,
		component: col.component ?? 'ATextInput',
		label: col.label,
	}))
}
