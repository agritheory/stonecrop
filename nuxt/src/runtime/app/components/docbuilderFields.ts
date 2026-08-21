/**
 * Pure write helpers backing {@link DocBuilderFieldsPanel}. Extracted from the SFC so they are
 * unit-testable in a plain node environment, matching {@link docbuilderActions}.
 *
 * These are hop 3 of the four that must each preserve keys the builder never displays: the graph
 * edit rebuilds `workflow.actions`, the actions panel writes a cell, **this** writes a field cell,
 * then the server merges onto what is on disk. The invariant has regressed twice upstream — once
 * dropping `clientHandler`, once dropping `triggers` — both times because a hop enumerated the
 * named keys it knew about instead of spreading whatever was there.
 *
 * This hop is the one with the widest blast radius, because the server replaces `fields` wholesale
 * with whatever the client sends. A key dropped here is dropped on disk. On the FAB app that is
 * `filterFunction` x7, `isAsync` x7, `collapsible` x4, nested `schema` x4, `options` x1 and
 * `source` x325 — none of which the panel renders, all of which must survive editing a label.
 */

import { inferFieldKind } from '@stonecrop/schema'

/** A doctype field as authored on disk: known keys plus anything the builder does not model. */
export type Field = Record<string, unknown>

/**
 * Whether an entry is a value field — the only kind the panel renders as a row. Fieldsets and
 * inline tables are preserved untouched.
 *
 * Classified by shape through `@stonecrop/schema`'s `inferFieldKind`, never by reading `kind`.
 * `kind` is Stonecrop's own discriminant — the parser synthesizes it and nothing writes it to disk
 * — so the builder, which reads raw JSON and never parses a doctype, has no business consulting it.
 * It used to, only because the generator and this very save path were leaking it into the files.
 *
 * The rule itself is imported rather than restated: getting it wrong re-types a field silently, and
 * a fieldset read as a value field renders as an editable row and loses its children on save.
 */
export function isValueField(field: Field): boolean {
	return inferFieldKind(field) === 'field'
}

/**
 * Set `key` on `field`, or remove it when `val` is `undefined`.
 *
 * Clearing a cell must delete the key rather than write `undefined`: the doctype is serialised with
 * `JSON.stringify`, which drops `undefined` values silently, so writing one would make "cleared" and
 * "never set" indistinguishable on disk while still differing in memory.
 */
export function setOrDelete(field: Field, key: string, val: unknown): Field {
	if (val === undefined) {
		const { [key]: _omit, ...rest } = field
		return rest
	}
	return { ...field, [key]: val }
}

/**
 * Rebuild the full field array with one cell changed at `realIndex`.
 *
 * Rebuilds every entry by index rather than splicing, so fields at other indices are returned
 * untouched and order is preserved. An out-of-range index is a no-op returning an equal array.
 */
export function updateFieldAt(fields: readonly Field[], realIndex: number, key: string, val: unknown): Field[] {
	return fields.map((f, i) => (i === realIndex ? setOrDelete(f, key, val) : f))
}
