/**
 * Reading an authored doctype — the JSON as it sits on disk, before any parsing.
 *
 * A separate reader from `@stonecrop/schema`'s `flattenFields`/`getPrimaryKeyField` because the two
 * operate on different *shapes*, not different rules: those take parsed `DoctypeField`s and branch
 * on the `kind` discriminant the Zod parser synthesizes, which authored JSON does not carry.
 * `getPrimaryKeyField` on a raw file therefore returns `undefined` — indistinguishable from "no key
 * declared", which is the exact condition its callers are testing.
 *
 * Every question about authored JSON is answered here once, so the rule cannot drift between the
 * merge and the generation plan.
 *
 * @internal
 */

/**
 * A doctype as it exists on disk: a plain object that may carry keys this package does not model
 * (`handler` on an action, `filterFunction` on a field, whatever an app has added). Typing it
 * loosely is what lets the merge round-trip those keys untouched instead of dropping them.
 *
 * @public
 */
export type AuthoredDoctype = Record<string, unknown>

/** @internal */
export function isAuthoredRecord(value: unknown): value is AuthoredDoctype {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Flatten authored fields, descending into fieldsets.
 *
 * A fieldset is a layout grouping, not a scope: a field inside one is still a field of the doctype,
 * with a column of its own and a key it may declare.
 *
 * @internal
 */
export function flattenAuthored(fields: readonly AuthoredDoctype[]): AuthoredDoctype[] {
	const out: AuthoredDoctype[] = []
	for (const field of fields) {
		if (Array.isArray(field.schema)) {
			out.push(...flattenAuthored(field.schema.filter(isAuthoredRecord)))
		} else {
			out.push(field)
		}
	}
	return out
}

/**
 * The fieldname an authored doctype declares as its identity, or `undefined` when it declares none.
 *
 * Descends into fieldsets, because a nested `primaryKey` is a real declaration — ignoring one is
 * what `getPrimaryKeyField` was fixed for.
 *
 * @internal
 */
export function authoredPrimaryKey(doctype: AuthoredDoctype): string | undefined {
	if (!Array.isArray(doctype.fields)) return undefined
	const declared = flattenAuthored(doctype.fields.filter(isAuthoredRecord)).find(f => f.primaryKey === true)
	return typeof declared?.fieldname === 'string' ? declared.fieldname : undefined
}
