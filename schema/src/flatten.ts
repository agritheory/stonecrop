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
 * Generic over the field shape, so the same walk serves authored `DoctypeField`s and the resolved fields
 * a form renders (AForm words its errors from every field it holds, fieldset children included). Any
 * entry with `kind: 'fieldset'` is replaced by its `schema`, which holds fields of the same shape.
 *
 * @param fields - the doctype's top-level fields
 * @returns every non-container field, fieldset children included
 * @public
 */
export function flattenFields<F extends { kind: string }>(fields: readonly F[]): Exclude<F, { kind: 'fieldset' }>[] {
	const result: Exclude<F, { kind: 'fieldset' }>[] = []
	for (const f of fields) {
		if (isFieldset(f)) result.push(...flattenFields(f.schema))
		else if (isLeaf(f)) result.push(f)
	}
	return result
}

function isFieldset<F extends { kind: string }>(
	field: F
): field is Extract<F, { kind: 'fieldset' }> & { schema: readonly F[] } {
	return field.kind === 'fieldset'
}

// The complement of `isFieldset`. A generic does not narrow in an `else`, so each branch names its own type.
function isLeaf<F extends { kind: string }>(field: F): field is Exclude<F, { kind: 'fieldset' }> {
	return field.kind !== 'fieldset'
}
