import { describe, it, expect } from 'vitest'

import { linkDisplayFieldname, validateDoctype } from '../src/index'
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
})
