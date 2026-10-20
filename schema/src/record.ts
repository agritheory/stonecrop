import { componentLinkExpansion, resolveLinkRenderMode } from './component-meta'
import type { LinkDeclaration } from './doctype'
import type { DoctypeField } from './field'
import { flattenFields } from './flatten'

/**
 * A doctype as far as {@link unwrapInlineLinks} reads one: its fields, and the relations whose
 * rows its records carry.
 * @public
 */
export interface RelatedDoctype {
	/** The doctype's top-level fields */
	fields: readonly DoctypeField[]
	/** The doctype's declared relations, keyed as in its `links` */
	links?: Readonly<Record<string, Pick<LinkDeclaration, 'target' | 'cardinality' | 'component' | 'fieldname'>>>
}

/**
 * The relations a record carries rows for, and how to find each target's doctype.
 * @public
 */
export interface RecordRelations {
	/** The record's doctype's declared relations, keyed as in its `links` */
	links?: RelatedDoctype['links']
	/** Finds a relation's target doctype by the `target` it declares; `undefined` leaves that relation's rows as they came */
	resolve: (target: string) => RelatedDoctype | undefined
}

/**
 * Reduce a record's *inline* link values to the ids that get persisted.
 *
 * The adapter returns an inline link as `{ id, displayText }`, so that is what a record holds
 * everywhere it is read — the store, a list row, a form field. A column takes the id alone, so
 * this is the single definition of the shape a record leaves in, and it belongs at the boundary
 * a record crosses on its way to the server, never on the way into the store.
 *
 * Doing it on the way in destroys the text the adapter looked up: nothing else holds it, so the
 * field that resolved a moment ago renders its raw id, and the same record then renders
 * differently depending on whether anything had edited the form yet. That is the bug this exists
 * to prevent, and its damage is a wrong render, not a throw.
 *
 * Only *inline* links may be reduced. An inline link's value is indistinguishable by inspection
 * from an expanded one (`{ id, ...the whole target record }`), so `component` — which states
 * which of the two a field is — is what tells them apart, via {@link componentLinkExpansion}.
 * Reducing an expanded link would send the id in place of the record.
 *
 * A fieldset's children are the record's own keys, since a fieldset is layout, so they are
 * reduced where every other field is.
 *
 * A record also carries the rows of each relation its doctype declares in `links`, under the key
 * the read path writes them to (`link.fieldname ?? key`), and each row is a record of the target
 * doctype. Given `relations`, those rows are reduced by the target's own fields and relations, so
 * a link picked inside a row leaves as its id too. A relation rendered as a picker is a link field,
 * reduced above, never a record to descend into; {@link resolveLinkRenderMode} decides which, as it
 * does for the read path.
 *
 * @param fields - the doctype's top-level fields
 * @param record - the record to reduce; not mutated
 * @param relations - the doctype's `links` and a lookup for each target's doctype; without them
 *   only the record's own fields are reduced
 * @returns a shallow copy with every inline link reduced to its id
 * @public
 */
export function unwrapInlineLinks(
	fields: readonly DoctypeField[],
	record: Record<string, any>,
	relations?: RecordRelations
): Record<string, any> {
	const flat = flattenFields(fields)
	const inline = new Set(
		flat
			.filter(field => field.kind === 'field' && Boolean(field.doctype))
			.filter(field => componentLinkExpansion(field.component) === 'inline')
			.map(field => field.fieldname)
	)
	const nested = Object.entries(relations?.links ?? {}).flatMap(([linkName, link]) => {
		const fieldname = link.fieldname ?? linkName
		const mode = resolveLinkRenderMode(link, flat.find(field => field.fieldname === fieldname)?.component)
		const target = mode === 'inline' ? undefined : relations?.resolve(link.target)
		return target ? [{ fieldname, mode, target }] : []
	})
	if (inline.size === 0 && nested.length === 0) return record

	const result: Record<string, any> = { ...record }
	for (const [key, value] of Object.entries(result)) {
		if (!inline.has(key) || value === null || typeof value !== 'object' || Array.isArray(value)) continue
		// `'id' in value` rather than a truthiness test: an inline link that was never resolved
		// is still a bare scalar, and reducing it a second time would be a no-op at best.
		if ('id' in value) result[key] = value.id
	}
	for (const { fieldname, mode, target } of nested) {
		const value = result[fieldname]
		const unwrapRow = (row: Record<string, any>) =>
			unwrapInlineLinks(target.fields, row, { links: target.links, resolve: relations!.resolve })
		if (mode === 'table' && Array.isArray(value)) {
			result[fieldname] = value.map(row => (row !== null && typeof row === 'object' ? unwrapRow(row) : row))
		} else if (mode === 'record' && value !== null && typeof value === 'object' && !Array.isArray(value)) {
			result[fieldname] = unwrapRow(value)
		}
	}
	return result
}

/**
 * A field's value, read part by part from the fields its `parts` names.
 *
 * @param parts - the field's `parts`: the field holding each part, keyed by part
 * @param record - the record holding those fields
 * @returns the value, keyed by part
 * @public
 */
export function readParts(
	parts: Readonly<Record<string, string>>,
	record: Readonly<Record<string, unknown>>
): Record<string, unknown> {
	return Object.fromEntries(Object.entries(parts).map(([part, fieldname]) => [part, record[fieldname]]))
}

/**
 * The fields to set after a field's component edits its value: one per part that changed. A part
 * left alone keeps exactly what the record holds, and anything the component derives (a stock
 * quantity, a conversion factor) is no part, so it is never written.
 *
 * @param parts - the field's `parts`: the field holding each part, keyed by part
 * @param record - the record before the edit
 * @param value - the component's edited value, keyed by part
 * @returns the changed fields and their new values
 * @public
 */
export function partsPatch(
	parts: Readonly<Record<string, string>>,
	record: Readonly<Record<string, unknown>>,
	value: Readonly<Record<string, unknown>>
): Record<string, unknown> {
	const patch: Record<string, unknown> = {}
	for (const [part, fieldname] of Object.entries(parts)) {
		if (!Object.is(value[part], record[fieldname])) patch[fieldname] = value[part]
	}
	return patch
}
