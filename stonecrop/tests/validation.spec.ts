import { List } from 'immutable'
import { describe, expect, it } from 'vitest'
import { validateSchema } from '../src/schema-validator'
import type { SchemaTypes } from '@stonecrop/aform'
import type Registry from '../src/registry'

describe('Schema Validator', () => {
	describe('validateSchema', () => {
		it('should pass validation for valid schema', () => {
			const schema = List<SchemaTypes>([
				{
					fieldname: 'name',
					label: 'Name',
					fieldtype: 'Data',
				},
				{
					fieldname: 'email',
					label: 'Email',
					fieldtype: 'Data',
				},
			])

			const result = validateSchema('TestDoctype', schema, {} as Registry)

			expect(result.issues).toHaveLength(0)
			expect(result.errorCount).toBe(0)
			expect(result.warningCount).toBe(0)
		})

		it('should detect missing fieldname', () => {
			const schema = List<SchemaTypes>([
				{
					label: 'Name',
					fieldtype: 'Data',
				} as SchemaTypes,
			])

			const result = validateSchema('TestDoctype', schema, {} as Registry)

			expect(result.issues).toHaveLength(1)
			expect(result.issues[0].severity).toBe('error')
			expect(result.issues[0].message).toContain('missing required property: fieldname')
			expect(result.errorCount).toBe(1)
		})

		it('should detect missing fieldtype when no component provided', () => {
			const schema = List<SchemaTypes>([
				{
					fieldname: 'name',
					label: 'Name',
				} as SchemaTypes,
			])

			const result = validateSchema('TestDoctype', schema, {} as Registry)

			expect(result.issues).toHaveLength(1)
			expect(result.issues[0].severity).toBe('error')
			expect(result.issues[0].message).toContain('must have either component or fieldtype')
			expect(result.errorCount).toBe(1)
		})

		it('should pass when component is provided instead of fieldtype', () => {
			const schema = List<SchemaTypes>([
				{
					fieldname: 'name',
					label: 'Name',
					component: 'CustomComponent',
				} as SchemaTypes,
			])

			const result = validateSchema('TestDoctype', schema, {} as Registry)

			expect(result.issues).toHaveLength(0)
			expect(result.errorCount).toBe(0)
		})

		it('should detect multiple missing fieldnames', () => {
			const schema = List<SchemaTypes>([
				{
					fieldtype: 'Data',
				} as SchemaTypes,
				{
					fieldtype: 'Text',
				} as SchemaTypes,
			])

			const result = validateSchema('TestDoctype', schema, {} as Registry)

			expect(result.errorCount).toBe(2) // Both missing fieldname
		})

		it('should pass validation for Link with fieldtype but no options in registry', () => {
			const schema = List<SchemaTypes>([
				{
					fieldname: 'user',
					label: 'User',
					fieldtype: 'Data',
				},
			])

			const result = validateSchema('TestDoctype', schema, {} as Registry)

			expect(result.issues).toHaveLength(0)
		})

		it('should pass validation for Link with valid doctype in registry', () => {
			const schema = List<SchemaTypes>([
				{
					fieldname: 'user',
					label: 'User',
					fieldtype: 'Link',
					options: 'User',
				} as any,
			])

			const registry = {
				registry: { User: {} },
			} as unknown as Registry

			const result = validateSchema('TestDoctype', schema, registry)

			expect(result.issues).toHaveLength(0)
		})

		it('should pass validation for Select fieldtype', () => {
			const schema = List<SchemaTypes>([
				{
					fieldname: 'status',
					label: 'Status',
					fieldtype: 'Select',
				},
			])

			const result = validateSchema('TestDoctype', schema, {} as Registry)

			expect(result.issues).toHaveLength(0)
		})

		it('should pass validation for Select with options', () => {
			const schema = List<SchemaTypes>([
				{
					fieldname: 'status',
					label: 'Status',
					fieldtype: 'Select',
				},
			])

			const result = validateSchema('TestDoctype', schema, {} as Registry)

			expect(result.issues).toHaveLength(0)
		})

		it('should handle empty schema', () => {
			const schema = List<SchemaTypes>([])

			const result = validateSchema('TestDoctype', schema, {} as Registry)

			expect(result.issues).toHaveLength(0)
			expect(result.errorCount).toBe(0)
		})

		it('should report error for missing fieldname on second field', () => {
			const schema = List<SchemaTypes>([
				{
					fieldname: 'valid',
					label: 'Valid',
					fieldtype: 'Data',
				},
				{
					label: 'Invalid',
					fieldtype: 'Data',
				} as SchemaTypes,
			])

			const result = validateSchema('TestDoctype', schema, {} as Registry)

			expect(result.issues).toHaveLength(1)
			expect(result.issues[0].message).toContain('missing required property: fieldname')
		})

		it('should handle schema with nested table fields', () => {
			const schema = List<SchemaTypes>([
				{
					fieldname: 'items',
					label: 'Items',
					fieldtype: 'Doctype',
					cardinality: 'many',
				},
			])

			const result = validateSchema('TestDoctype', schema, {} as Registry)

			expect(result.issues).toHaveLength(0)
		})
	})

	describe('Schema Validator with Registry', () => {
		it('should report error when Link references non-existent doctype', () => {
			const schema = List<SchemaTypes>([
				{
					fieldname: 'user',
					label: 'User',
					fieldtype: 'Link',
				} as any,
			])

			const registry = {
				registry: {},
			} as unknown as Registry

			const result = validateSchema('TestDoctype', schema, registry)

			expect(result.issues.some((i: any) => i.message.includes('missing options'))).toBe(true)
			expect(result.errorCount).toBeGreaterThan(0)
		})

		it('should pass validation for Link with existing doctype in registry', () => {
			const schema = List<SchemaTypes>([
				{
					fieldname: 'user',
					label: 'User',
					fieldtype: 'Link',
					options: 'User',
				} as any,
			])

			const registry = {
				registry: { User: {} },
			} as unknown as Registry

			const result = validateSchema('TestDoctype', schema, registry)

			expect(result.issues).toHaveLength(0)
		})
	})
})
