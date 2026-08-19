import { describe, expect, it } from 'vitest'

import { inferFieldKind, normalizeFieldKind, stripFieldKind } from '../src/index'

/**
 * `kind` is the discriminated-union tag, not authored data. `normalizeFieldKind` synthesizes it on
 * the way in; `stripFieldKind` is the other half of that boundary, removing it on the way back out
 * so nothing writes it to disk. The pair has to round-trip, or a save would change the meaning of
 * the file it saved.
 */

const field = (fieldname: string, extra: Record<string, unknown> = {}) => ({
	kind: 'field',
	fieldname,
	component: 'ATextInput',
	...extra,
})

describe('stripFieldKind', { tags: ['unit'] }, () => {
	it('removes kind from a value field', () => {
		expect(stripFieldKind(field('code'))).toEqual({ fieldname: 'code', component: 'ATextInput' })
	})

	it('descends into a fieldset schema', () => {
		const fieldset = {
			kind: 'fieldset',
			fieldname: 'details',
			schema: [field('inner'), { kind: 'fieldset', fieldname: 'deeper', schema: [field('deepest')] }],
		}
		expect(stripFieldKind(fieldset)).toEqual({
			fieldname: 'details',
			schema: [
				{ fieldname: 'inner', component: 'ATextInput' },
				{ fieldname: 'deeper', schema: [{ fieldname: 'deepest', component: 'ATextInput' }] },
			],
		})
	})

	it('leaves table columns untouched', () => {
		// `columns` are ColumnSchema entries, not DoctypeFields — `injectKind` never injects into
		// them, so nothing there has a `kind` to remove and descending would be inventing a rule.
		const table = { kind: 'table', fieldname: 'rows', columns: [{ fieldname: 'qty', kind: 'not-a-doctype-field' }] }
		expect(stripFieldKind(table)).toEqual({
			fieldname: 'rows',
			columns: [{ fieldname: 'qty', kind: 'not-a-doctype-field' }],
		})
	})

	it('keeps kind when re-inference would disagree', () => {
		// A fieldset with no `schema` cannot be recovered — `injectKind` would call it a field. The
		// schema requires `schema` on a fieldset so this shape is already invalid, but stripping
		// only when the round-trip is provably safe means an invalid file is left alone rather than
		// quietly re-typed.
		const malformed = { kind: 'fieldset', fieldname: 'empty' }
		expect(stripFieldKind(malformed)).toEqual(malformed)
	})

	it('passes non-objects through', () => {
		expect(stripFieldKind(null)).toBeNull()
		expect(stripFieldKind('x')).toBe('x')
		expect(stripFieldKind(7)).toBe(7)
	})

	it('preserves key order so a save stays byte-stable', () => {
		const stripped = stripFieldKind({ kind: 'field', fieldname: 'a', label: 'A', component: 'ATextInput' })
		expect(Object.keys(stripped as object)).toEqual(['fieldname', 'label', 'component'])
	})
})

describe('stripFieldKind / normalizeFieldKind round-trip', { tags: ['unit'] }, () => {
	// The property that makes stripping safe: normalize(strip(x)) === x for every shape the schema
	// accepts. Asserted rather than argued, because "it is obviously lossless" is how the inbound
	// and outbound halves of a boundary drift apart.
	it.each([
		['value field', field('code', { primaryKey: true, required: true })],
		['computed field', field('total', { computed: true })],
		['fieldset', { kind: 'fieldset', fieldname: 'g', schema: [field('a'), field('b')] }],
		[
			'nested fieldset',
			{ kind: 'fieldset', fieldname: 'g', schema: [{ kind: 'fieldset', fieldname: 'h', schema: [field('a')] }] },
		],
		['empty fieldset', { kind: 'fieldset', fieldname: 'g', schema: [] }],
		['table', { kind: 'table', fieldname: 'rows', columns: [{ fieldname: 'qty' }] }],
		['empty table', { kind: 'table', fieldname: 'rows', columns: [] }],
	])('round-trips a %s', (_label, original) => {
		expect(normalizeFieldKind(stripFieldKind(original))).toEqual(original)
	})
})

describe('inferFieldKind', { tags: ['unit'] }, () => {
	// The one definition of "which shape is this entry". It had three copies before this: the
	// parser's `injectKind`, `stripFieldKind`'s agreement check, and the docbuilder's own
	// `isValueField` — one per package, each free to drift.
	it('reads a fieldset from its schema array', () => {
		expect(inferFieldKind({ fieldname: 'g', schema: [] })).toBe('fieldset')
	})

	it('reads a table from its columns array', () => {
		expect(inferFieldKind({ fieldname: 'rows', columns: [] })).toBe('table')
	})

	it('reads anything else as a value field', () => {
		expect(inferFieldKind({ fieldname: 'code', component: 'ATextInput' })).toBe('field')
	})

	it('prefers schema over columns', () => {
		// Pins `injectKind`'s existing precedence rather than inventing one. A malformed entry
		// carrying both is refused downstream; what matters here is that all three callers agree
		// on which way it is refused.
		expect(inferFieldKind({ fieldname: 'x', schema: [], columns: [] })).toBe('fieldset')
	})

	it('ignores a declared kind, reporting only what the shape says', () => {
		// Deliberately shape-only: `stripFieldKind` compares this against the declared value to
		// decide whether removing it is lossless, which it cannot do if this honours the
		// declaration. Callers that want "declared wins" apply that themselves.
		expect(inferFieldKind({ kind: 'fieldset', fieldname: 'lying' })).toBe('field')
	})

	it('reports non-objects as value fields', () => {
		expect(inferFieldKind(null)).toBe('field')
		expect(inferFieldKind('x')).toBe('field')
	})
})
