import type { DoctypeField, TableField, ValueField } from '@stonecrop/schema'

/**
 * Recursively flatten Fieldset containers into a flat array of non-container fields.
 * Fieldset entries are replaced by their children; all other fields pass through.
 *
 * A fieldset is a layout grouping, not a scope: every field inside one is a field of the doctype,
 * with a column of its own and a name a link can bind to. Anything asking "what does this doctype
 * declare" must therefore descend, and the two ways to get that wrong point opposite ways — the
 * SELECT builder would omit real columns, while a validator would report a working declaration as
 * broken.
 *
 * Lives here rather than beside either caller because it now has three of them across two modules
 * (`getSqlColumns` and `knownFields` in the plugin, `validateReferences` in the registry), and a
 * second copy is how the plugin and the registry would come to disagree about what a doctype
 * declares. Internal — not re-exported from the package index.
 */
export function flattenFields(fields: readonly DoctypeField[]): (ValueField | TableField)[] {
	const result: (ValueField | TableField)[] = []
	for (const f of fields) {
		if (f.kind === 'fieldset') {
			result.push(...flattenFields(f.schema))
		} else {
			result.push(f)
		}
	}
	return result
}

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
