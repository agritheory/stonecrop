import type { DoctypeField, ValueField } from '@stonecrop/schema'
import { flattenFields } from '@stonecrop/schema'

// Re-exported so this module stays the one place the adapter asks about a doctype's fields, while
// the definition itself lives in `@stonecrop/schema`. It moved there because `DoctypeMeta`'s own
// validation needs the same descent, and the copy it had written instead scanned top level only —
// so the load gate and the read path disagreed about what a doctype declares, which is exactly
// what keeping one definition is for.
export { flattenFields }

/**
 * The fields that have a database column of their own — the one definition of that question.
 *
 * Two properties disqualify a field, and both are the field saying so itself: a `computed` field is
 * declared precisely to state it has no column, and a container (a table field) is a relation
 * rather than a value. Everything else names a column.
 *
 * This is deliberately **not** the same question as "does this column belong in a record payload".
 * An *expanding* link's foreign key has a real column that this returns, while `collectColumns`
 * omits it from the SELECT on purpose because the relation is fetched separately. Conflating the
 * two is how the read path came to drop the very column its expansion needed. Callers wanting the
 * payload projection filter this further by render mode; callers asking whether a column exists —
 * link validation, and the write path deciding what it may set — want it unfiltered.
 *
 * Extracted because the rule had grown three statements across two modules, one of them a comment
 * reading "mirrors `collectColumns`". A rule that has to be mirrored by hand is one edit away from
 * the read path and the validator disagreeing about what a doctype declares.
 */
export function columnBackedFields(fields: readonly DoctypeField[]): ValueField[] {
	return flattenFields(fields).filter((f): f is ValueField => f.kind === 'field' && !f.computed)
}
