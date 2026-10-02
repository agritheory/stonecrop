import { componentLinkExpansion } from './component-meta'
import type { DoctypeField } from './field'
import { flattenFields } from './flatten'

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
 * @param fields - the doctype's top-level fields
 * @param record - the record to reduce; not mutated
 * @returns a shallow copy with every inline link reduced to its id
 * @public
 */
export function unwrapInlineLinks(fields: readonly DoctypeField[], record: Record<string, any>): Record<string, any> {
	const inline = new Set(
		flattenFields(fields)
			.filter(field => field.kind === 'field' && Boolean(field.doctype))
			.filter(field => componentLinkExpansion(field.component) === 'inline')
			.map(field => field.fieldname)
	)
	if (inline.size === 0) return record

	const result: Record<string, any> = { ...record }
	for (const [key, value] of Object.entries(result)) {
		if (!inline.has(key) || value === null || typeof value !== 'object' || Array.isArray(value)) continue
		// `'id' in value` rather than a truthiness test: an inline link that was never resolved
		// is still a bare scalar, and reducing it a second time would be a no-op at best.
		if ('id' in value) result[key] = value.id
	}
	return result
}
