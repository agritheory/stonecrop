import type { DoctypeField, TableField, ValueField } from './field'

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
 * Lives here rather than in the adapter because both sides need it: the middleware builds SQL from
 * it, and `DoctypeMeta`'s own validation asks the same question at the load gate. It sat in the
 * adapter while the validator hand-rolled a top-level-only scan, and that is exactly the second
 * failure this comment names — a `displayField` inside a fieldset was rejected at authoring time
 * and would have worked at runtime.
 *
 * A module of its own, importing nothing at runtime, because callers need the descent without
 * needing the rest of `field.ts` — which defines the Zod schemas, so a runtime edge to it is a
 * runtime edge to Zod. Zod reaching a Nitro SSR entry collides with the `process` Nitro imports
 * there and takes the server down with a `SyntaxError` per request, which no build reports.
 * `field.ts` still calls this and `index.ts` still exports it, so nothing outside moves.
 *
 * @param fields - the doctype's top-level fields
 * @returns every non-container field, fieldset children included
 * @public
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
