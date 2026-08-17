import { describe, it, expect } from 'vitest'

import { getDisplayField, linkDisplayFieldname, validateDoctype } from '../src/index'
import type { DoctypeField } from '../src/index'

const field = (fieldname: string, extra: Record<string, unknown> = {}) =>
	({ kind: 'field', fieldname, component: 'ATextInput', ...extra }) as DoctypeField

describe('linkDisplayFieldname', { tags: ['unit'] }, () => {
	it('appends the display suffix to the fieldname', () => {
		expect(linkDisplayFieldname('customerId')).toBe('customerId__display')
	})
})

describe('DoctypeMeta — displayField', { tags: ['unit'] }, () => {
	const doctype = (fields: DoctypeField[], displayField?: string) => ({
		name: 'Thing',
		fields,
		...(displayField ? { displayField } : {}),
	})

	it('accepts displayField when it names a declared field', () => {
		expect(validateDoctype(doctype([field('id', { primaryKey: true }), field('name')], 'name')).success).toBe(true)
	})

	it('rejects displayField when it names no declared field', () => {
		const result = validateDoctype(doctype([field('id', { primaryKey: true })], 'missing'))
		expect(result.success).toBe(false)
		expect(result.errors[0].path).toEqual(['displayField'])
	})

	// A fieldset is a layout grouping, not a scope — its children are fields of the doctype with
	// columns of their own. The gate scanned top level only, so it refused a declaration the
	// adapter would happily have queried.
	it('accepts displayField naming a field inside a fieldset', () => {
		const fieldset = {
			kind: 'fieldset',
			fieldname: 'details',
			schema: [field('partyName')],
		} as unknown as DoctypeField

		expect(validateDoctype(doctype([field('id', { primaryKey: true }), fieldset], 'partyName')).success).toBe(true)
	})

	// The opposite miss: a computed field is declared precisely to say it has no column, so a
	// SELECT built from it names a column the database does not have. That passed the gate and
	// failed at query time instead.
	it('rejects displayField naming a computed field', () => {
		const result = validateDoctype(
			doctype([field('id', { primaryKey: true }), field('fullName', { computed: true })], 'fullName')
		)

		expect(result.success).toBe(false)
		expect(result.errors[0].path).toEqual(['displayField'])
		expect(result.errors[0].message).toMatch(/computed field/)
	})
})

describe('getDisplayField', { tags: ['unit'] }, () => {
	it('is the rule both the load gate and the adapter read', () => {
		const fields = [field('id', { primaryKey: true }), field('partyName'), field('fullName', { computed: true })]

		expect(getDisplayField(fields, 'partyName')?.fieldname).toBe('partyName')
		expect(getDisplayField(fields, 'fullName')).toBeUndefined()
		expect(getDisplayField(fields, 'nope')).toBeUndefined()
		expect(getDisplayField(fields, undefined)).toBeUndefined()
	})
})
