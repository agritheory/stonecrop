import { describe, it, expect } from 'vitest'

import { getPrimaryKeyField, getRecordIdentity, getRecordIdField, validateDoctype } from '../src/index'
import type { DoctypeField } from '../src/index'

const field = (fieldname: string, extra: Partial<DoctypeField> = {}): DoctypeField =>
	({ kind: 'field', fieldname, component: 'ATextInput', ...extra }) as DoctypeField

describe('getPrimaryKeyField', { tags: ['unit'] }, () => {
	it('finds the field marked primaryKey', () => {
		const fields = [field('name'), field('code', { primaryKey: true })]
		expect(getPrimaryKeyField(fields)?.fieldname).toBe('code')
	})

	it('returns undefined when no field is marked', () => {
		expect(getPrimaryKeyField([field('name'), field('id')])).toBeUndefined()
	})

	it('ignores primaryKey: false', () => {
		expect(getPrimaryKeyField([field('code', { primaryKey: false })])).toBeUndefined()
	})

	it('returns the first match when several are marked', () => {
		// Total by design, so a caller holding fields that never went through `DoctypeMeta` still
		// gets an answer. The gate is what refuses this shape — see the load-gate suite below.
		const fields = [field('a', { primaryKey: true }), field('b', { primaryKey: true })]
		expect(getPrimaryKeyField(fields)?.fieldname).toBe('a')
	})

	it('descends into fieldsets', () => {
		// A fieldset is layout, not scope: its children are fields of the doctype with columns of
		// their own, which is why `flattenFields` exists and why the sibling `displayField` gate
		// already descends. The behaviour this replaced neither descended nor refused — it ignored
		// an explicit `primaryKey: true`, so the author declared identity and nothing honoured it
		// and nothing said so.
		const fields = [
			{
				kind: 'fieldset',
				fieldname: 'group',
				schema: [field('inner', { primaryKey: true })],
			},
		] as unknown as DoctypeField[]
		expect(getPrimaryKeyField(fields)?.fieldname).toBe('inner')
	})

	it('prefers a top-level key over a nested one', () => {
		// Document order across the flattened set decides, and a top-level field precedes the
		// fieldset that follows it. Stated because the load gate now rejects this shape outright,
		// so the only callers reaching it hold fields that never went through `DoctypeMeta`.
		const fields = [
			field('code', { primaryKey: true }),
			{ kind: 'fieldset', fieldname: 'group', schema: [field('inner', { primaryKey: true })] },
		] as unknown as DoctypeField[]
		expect(getPrimaryKeyField(fields)?.fieldname).toBe('code')
	})

	it('ignores a table field even if flagged', () => {
		const fields = [{ kind: 'table', fieldname: 'rows', primaryKey: true }] as unknown as DoctypeField[]
		expect(getPrimaryKeyField(fields)).toBeUndefined()
	})
})

describe('getRecordIdentity', { tags: ['unit'] }, () => {
	const naturalKey = [field('name'), field('code', { primaryKey: true })]
	const surrogate = [field('id'), field('name')]

	it('reads the declared primary key for a natural-key doctype', () => {
		expect(getRecordIdentity(naturalKey, { code: 'EACH', name: 'Each' })).toBe('EACH')
	})

	it('prefers the declared primary key over an id column', () => {
		expect(getRecordIdentity(naturalKey, { code: 'EACH', id: 'surrogate' })).toBe('EACH')
	})

	it('falls back to id when the doctype declares no primary key', () => {
		expect(getRecordIdentity(surrogate, { id: 'abc', name: 'x' })).toBe('abc')
	})

	it('falls back to id when the declared key is absent from the record', () => {
		// PostGraphile renames a single-column `id` PK to `rowId`, so a doctype can declare a key
		// the row does not carry under that name — the surrogate id is still a real source.
		expect(getRecordIdentity(naturalKey, { id: 'fallback' })).toBe('fallback')
	})

	it('stringifies numeric keys', () => {
		expect(getRecordIdentity(surrogate, { id: 42 })).toBe('42')
	})

	it('treats 0 as a valid identity', () => {
		// A serial PK legitimately starts at 0 in some schemas; truthiness checks drop it.
		expect(getRecordIdentity(surrogate, { id: 0 })).toBe('0')
	})

	it('rejects an empty-string identity', () => {
		expect(getRecordIdentity(surrogate, { id: '' })).toBeUndefined()
	})

	it('returns undefined when neither source yields a value', () => {
		expect(getRecordIdentity(naturalKey, { name: 'no key here' })).toBeUndefined()
	})

	it('returns undefined for a null or object-valued key', () => {
		expect(getRecordIdentity(surrogate, { id: null })).toBeUndefined()
		expect(getRecordIdentity(surrogate, { id: { nested: true } })).toBeUndefined()
	})
})

describe('getRecordIdField', { tags: ['unit'] }, () => {
	it('names the declared primary key', () => {
		expect(getRecordIdField([field('name'), field('code', { primaryKey: true })])).toBe('code')
	})

	it('falls back to `id` when nothing is declared', () => {
		// Load-bearing, not defensive: a surrogate-key doctype carries an `id` column and marks no
		// primary key, so "nothing declared" means `id` rather than "no identity".
		expect(getRecordIdField([field('name'), field('id')])).toBe('id')
	})

	it('returns `id` even when no such field is declared', () => {
		// The rule is total, so the name it yields is not a promise that the field exists. An
		// adapter building a SQL predicate has to check that separately — selecting a column the
		// doctype never declared returns nothing rather than failing.
		expect(getRecordIdField([field('label')])).toBe('id')
	})

	it('descends into fieldsets rather than falling back to `id`', () => {
		// The `id` fallback means "nothing was declared". A nested declaration is a declaration,
		// so falling back here answered a question the doctype had already answered.
		const fields = [
			field('id'),
			{ kind: 'fieldset', fieldname: 'group', schema: [field('inner', { primaryKey: true })] },
		] as unknown as DoctypeField[]
		expect(getRecordIdField(fields)).toBe('inner')
	})
})

describe('DoctypeMeta — declared primary keys', { tags: ['unit'] }, () => {
	const doctype = (fields: DoctypeField[]) => ({ name: 'Thing', fields })

	it('accepts exactly one declared key', () => {
		expect(validateDoctype(doctype([field('code', { primaryKey: true }), field('name')])).success).toBe(true)
	})

	it('accepts none — a surrogate-key doctype resolves through the `id` fallback', () => {
		expect(validateDoctype(doctype([field('id'), field('name')])).success).toBe(true)
	})

	it('rejects more than one, naming every field that claims the key', () => {
		// Silently ignoring the extras is the defect: `getPrimaryKeyField` takes the first, so a
		// record would key off whichever field happens to come first, and an adapter would build
		// its lookup on a column that need not be unique.
		const result = validateDoctype(
			doctype([field('code', { primaryKey: true }), field('altCode', { primaryKey: true })])
		)
		expect(result.success).toBe(false)
		expect(result.errors[0].path).toEqual(['fields'])
		expect(result.errors[0].message).toContain('code')
		expect(result.errors[0].message).toContain('altCode')
	})

	it('counts a fieldset-nested key toward the limit', () => {
		// The gate asks the same question `getPrimaryKeyField` asks, so it has to descend the same
		// way. Not counting nested keys let a doctype declare two and pass, and the resolution then
		// took the first and ignored the other — the silent multi-key case this gate exists to stop.
		const fields = [
			field('code', { primaryKey: true }),
			{ kind: 'fieldset', fieldname: 'group', component: 'AFieldset', schema: [field('inner', { primaryKey: true })] },
		] as unknown as DoctypeField[]
		const result = validateDoctype(doctype(fields))
		expect(result.success).toBe(false)
		expect(result.errors[0].path).toEqual(['fields'])
		expect(result.errors[0].message).toContain('code')
		expect(result.errors[0].message).toContain('inner')
	})

	it('accepts a single key that is nested', () => {
		// One key is one key wherever it is declared; the limit is on how many, not on where.
		const fields = [
			field('name'),
			{ kind: 'fieldset', fieldname: 'group', component: 'AFieldset', schema: [field('inner', { primaryKey: true })] },
		] as unknown as DoctypeField[]
		expect(validateDoctype(doctype(fields)).success).toBe(true)
	})
})
