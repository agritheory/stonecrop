import { describe, it, expect } from 'vitest'

import { getPrimaryKeyField, getRecordIdentity } from '../src/index'
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
		// Nothing in the schema enforces exactly one; first-wins is the documented behaviour.
		const fields = [field('a', { primaryKey: true }), field('b', { primaryKey: true })]
		expect(getPrimaryKeyField(fields)?.fieldname).toBe('a')
	})

	it('does not descend into fieldsets', () => {
		// A fieldset's children are not identity columns — a nested match would be an authoring
		// error, and matching it would make the client key records by a column the server's
		// identity predicate never uses.
		const fields = [
			{
				kind: 'fieldset',
				fieldname: 'group',
				schema: [field('inner', { primaryKey: true })],
			},
		] as unknown as DoctypeField[]
		expect(getPrimaryKeyField(fields)).toBeUndefined()
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
