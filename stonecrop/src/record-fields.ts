import type { ColumnSchema, LinkDeclaration, ValueField } from '@stonecrop/schema'
import { flattenFields, resolveLinkRenderMode } from '@stonecrop/schema'

import type Doctype from './doctype'
import type Registry from './registry'

/**
 * One key of a record and what it holds, read from the doctype's declarations: a value of its own, an embedded
 * record or rows of a linked doctype, or the rows of an inline table.
 * @internal
 */
export type RecordField =
	| { holds: 'value'; fieldname: string; component?: string; default?: unknown }
	| { holds: 'record'; fieldname: string; target: Doctype }
	| { holds: 'rows'; fieldname: string; target: Doctype }
	| { holds: 'columns'; fieldname: string; columns: ColumnSchema[] }

/**
 * A doctype's link declarations by the field each one binds to: `link.fieldname`, or the declaration's key when it
 * names none.
 * @internal
 */
export function linksByFieldname(doctype: Doctype): Map<string, LinkDeclaration> {
	const links = new Map<string, LinkDeclaration>()
	for (const [key, link] of Object.entries(doctype.links ?? {})) {
		links.set(link.fieldname ?? key, link)
	}
	return links
}

/**
 * The doctype a field's value is made of, when it holds one: an embedded record (`'record'`) or rows (`'table'`)
 * of a registered, linked doctype. Undefined when the field holds a value of its own: a plain field, an inline
 * link's id, or a link whose target is not registered.
 *
 * The single definition of what a link field holds. `resolveSchema` renders from it and a new record is composed
 * from it, so the form and the record cannot disagree about a field's shape.
 * @internal
 */
export function expandedLink(
	registry: Registry,
	field: ValueField,
	links: ReadonlyMap<string, LinkDeclaration>
): { mode: 'record' | 'table'; link: LinkDeclaration; target: Doctype } | undefined {
	const link = links.get(field.fieldname)
	if (!link) return undefined
	const mode = resolveLinkRenderMode(link, field.component)
	if (mode === 'inline') return undefined
	const target = registry.registry[link.target]
	return target ? { mode, link, target } : undefined
}

/**
 * The keys of a doctype's record, by name. A grouped section adds none of its own: it only groups fields, and
 * each of them is a key of the record.
 * @internal
 */
export function recordFields(registry: Registry, doctype: Doctype): Map<string, RecordField> {
	const links = linksByFieldname(doctype)
	const fields = new Map<string, RecordField>()
	for (const field of flattenFields(doctype.getSchemaArray())) {
		const { fieldname } = field
		if (field.kind === 'table') {
			fields.set(fieldname, { holds: 'columns', fieldname, columns: field.columns })
			continue
		}
		const expanded = expandedLink(registry, field, links)
		if (!expanded) {
			fields.set(fieldname, { holds: 'value', fieldname, component: field.component, default: field.default })
		} else {
			fields.set(fieldname, {
				holds: expanded.mode === 'table' ? 'rows' : 'record',
				fieldname,
				target: expanded.target,
			})
		}
	}
	return fields
}

/**
 * The keys of an inline table's row: one per column.
 * @internal
 */
export function columnFields(columns: readonly ColumnSchema[]): Map<string, RecordField> {
	return new Map(
		columns.map((column): [string, RecordField] => [
			column.fieldname,
			{ holds: 'value', fieldname: column.fieldname, component: column.component },
		])
	)
}
