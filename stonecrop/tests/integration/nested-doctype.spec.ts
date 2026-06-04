import { List } from 'immutable'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { Stonecrop, Registry, Doctype } from '../../src'
import { schemaToColumns } from '@stonecrop/atable'

describe('Nested Doctype Support', { tags: ['unit'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let customerDoctype: Doctype
	let addressDoctype: Doctype

	beforeEach(() => {
		registry = new Registry()

		// Address doctype
		const addressSchema = List([
			{ kind: 'field' as const, fieldname: 'street', fieldtype: 'Data', component: 'ATextInput' },
			{ kind: 'field' as const, fieldname: 'city', fieldtype: 'Data', component: 'ATextInput' },
			{ kind: 'field' as const, fieldname: 'state', fieldtype: 'Data', component: 'ATextInput' },
			{ kind: 'field' as const, fieldname: 'zip_code', fieldtype: 'Data', component: 'ATextInput' },
		])
		addressDoctype = new Doctype('address', addressSchema as any, undefined, undefined)
		registry.addDoctype(addressDoctype)

		// Customer doctype with nested Address (1:1) declared via links
		const customerSchema = List([
			{ kind: 'field' as const, fieldname: 'customer_name', fieldtype: 'Data', component: 'ATextInput' },
			{ kind: 'field' as const, fieldname: 'email', fieldtype: 'Data', component: 'ATextInput' },
			{ kind: 'field' as const, fieldname: 'address', fieldtype: 'Link', component: 'AForm', options: 'address' },
		])
		customerDoctype = new Doctype('customer', customerSchema as any, undefined, undefined, undefined, {
			address: { target: 'address', cardinality: 'one', fieldname: 'address' },
		})
		registry.addDoctype(customerDoctype)

		stonecrop = new Stonecrop(registry)
	})

	describe('Registry.resolveSchema()', () => {
		it('resolves a Doctype field by embedding child schema', () => {
			const resolved = registry.resolveSchema(customerDoctype)

			// Non-Doctype fields are unchanged
			expect(resolved[0]).toEqual(expect.objectContaining({ fieldname: 'customer_name', fieldtype: 'Data' }))
			expect(resolved[1]).toEqual(expect.objectContaining({ fieldname: 'email', fieldtype: 'Data' }))

			// Doctype field has embedded schema
			const addressField = resolved[2]
			expect(addressField.fieldname).toBe('address')
			expect('schema' in addressField).toBe(true)
			expect((addressField as any).schema).toHaveLength(4)
			expect((addressField as any).schema[0].fieldname).toBe('street')
		})

		it('does not mutate the original schema', () => {
			const addressSchemaBeforeResolve = Array.from(addressDoctype.schema || [])
			registry.resolveSchema(customerDoctype)

			// The address doctype's own schema should not be mutated
			expect(Array.from(addressDoctype.schema || [])).toHaveLength(addressSchemaBeforeResolve.length)
			expect(customerDoctype.links).toBeDefined()
			// links object itself should not have a 'schema' property added to it
			expect('schema' in (customerDoctype.links?.address ?? {})).toBe(false)
		})

		it('handles deeply nested doctypes', () => {
			// Create a "company" doctype that nests "customer" which nests "address"
			const companySchema = List([
				{ kind: 'field' as const, fieldname: 'company_name', fieldtype: 'Data', component: 'ATextInput' },
				{
					kind: 'field' as const,
					fieldname: 'primary_contact',
					fieldtype: 'Link',
					component: 'AForm',
					options: 'customer',
				},
			])
			const companyDoctype = new Doctype('company', companySchema as any, undefined, undefined, undefined, {
				primary_contact: { target: 'customer', cardinality: 'one', fieldname: 'primary_contact' },
			})
			registry.addDoctype(companyDoctype)

			const resolved = registry.resolveSchema(companyDoctype)
			const contactField = resolved[1] as any

			// customer has 2 scalar fields + address link = 3 total entries
			expect(contactField.schema).toHaveLength(3)
			// The nested customer's address link entry should also be resolved
			const nestedAddress = contactField.schema[2]
			expect(nestedAddress.fieldname).toBe('address')
			expect(nestedAddress.schema).toHaveLength(4)
			expect(nestedAddress.schema[0].fieldname).toBe('street')
		})

		it('prevents circular references', () => {
			// Create a self-referencing doctype via links
			// The parent field points to the same doctype - when resolved, it should
			// return the circular-blocked schema (without further parent resolution)
			const selfRefSchema = List([
				{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
				{ kind: 'field' as const, fieldname: 'parent', fieldtype: 'Link', component: 'AForm', options: 'self-ref' },
			])
			const selfRefDoctype = new Doctype('self-ref', selfRefSchema as any, undefined, undefined, undefined, {
				parent: { target: 'self-ref', cardinality: 'one', fieldname: 'parent' },
			})
			registry.addDoctype(selfRefDoctype)

			const resolved = registry.resolveSchema(selfRefDoctype)
			const parentField = resolved[1] as any

			// First level resolves parent link — gets the circular-blocked schema
			// The circular schema is the original schema which now has 2 fields (name + parent)
			// but parent Link field is copied as-is when circular blocks resolution
			expect(parentField.schema).toHaveLength(2)
			// Both fields present in circular-blocked schema
			expect(parentField.schema[0].fieldname).toBe('name')
			expect(parentField.schema[1].fieldname).toBe('parent')
		})

		it('gracefully handles missing doctype references', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
					{
						kind: 'field' as const,
						fieldname: 'missing',
						fieldtype: 'Link',
						component: 'AForm',
						options: 'nonexistent',
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{ missing: { target: 'nonexistent', cardinality: 'one', fieldname: 'missing' } }
			)
			const resolved = registry.resolveSchema(testDoctype)

			// Missing link target: the link field is copied as-is (target not found)
			expect(resolved).toHaveLength(2)
			expect(resolved[0].fieldname).toBe('name')
			expect(resolved[1].fieldname).toBe('missing')
		})

		it('returns fields as-is when not Doctype type', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
					{ kind: 'field' as const, fieldname: 'active', fieldtype: 'Check', component: 'ACheckbox' },
				]) as any,
				undefined,
				undefined
			)
			const resolved = registry.resolveSchema(testDoctype)

			expect(resolved).toHaveLength(2)
			expect(resolved[0]).toEqual(expect.objectContaining({ fieldname: 'name', fieldtype: 'Data' }))
			expect(resolved[1]).toEqual(expect.objectContaining({ fieldname: 'active', fieldtype: 'Check' }))
		})

		it('resolves a link with cardinality:noneOrMany by auto-deriving columns from child doctype', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{ kind: 'field' as const, fieldname: 'customer_name', fieldtype: 'Data', component: 'ATextInput' },
					{
						kind: 'field' as const,
						fieldname: 'addresses',
						fieldtype: 'Link',
						component: 'ATable',
						options: 'address',
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{ addresses: { target: 'address', cardinality: 'noneOrMany', fieldname: 'addresses' } }
			)
			const resolved = registry.resolveSchema(testDoctype)

			// Scalar fields are unchanged
			expect(resolved[0]).toEqual(expect.objectContaining({ fieldname: 'customer_name', fieldtype: 'Data' }))

			// Link with cardinality:noneOrMany has kind discriminant, delegated schema, and config
			const tableField = resolved[1] as any
			expect(tableField.fieldname).toBe('addresses')
			expect(tableField.component).toBe('ATable')
			expect(tableField.kind).toBe('table')
			expect(tableField.config).toEqual({ view: 'list' })
			// rows are NOT in the resolved schema — they come from formData at render time

			// Schema delegated to ATable — child fields are preserved, columns are not pre-built
			expect(Array.isArray(tableField.schema)).toBe(true)
			expect(tableField.schema).toHaveLength(4)
			expect(tableField.schema[0]).toEqual(expect.objectContaining({ fieldname: 'street', fieldtype: 'Data' }))
			expect(tableField.schema[1]).toEqual(expect.objectContaining({ fieldname: 'city' }))
			expect(tableField.schema[2]).toEqual(expect.objectContaining({ fieldname: 'state' }))
			expect(tableField.schema[3]).toEqual(expect.objectContaining({ fieldname: 'zip_code' }))
			expect('columns' in tableField).toBe(false)
		})

		it('auto-derives columns from child doctype schema for noneOrMany links', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{
						kind: 'field' as const,
						fieldname: 'addresses',
						fieldtype: 'Link',
						component: 'ATable',
						options: 'address',
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{ addresses: { target: 'address', cardinality: 'noneOrMany', fieldname: 'addresses' } }
			)
			const resolved = registry.resolveSchema(testDoctype)
			const tableField = resolved[0] as any

			// Schema delegated to ATable (street, city, state, zip_code)
			expect(tableField.kind).toBe('table')
			expect(Array.isArray(tableField.schema)).toBe(true)
			expect(tableField.schema).toHaveLength(4)
			expect('columns' in tableField).toBe(false)
		})

		it('uses custom component from link declaration', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{
						kind: 'field' as const,
						fieldname: 'addresses',
						fieldtype: 'Link',
						component: 'ATable',
						options: 'address',
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{
					addresses: {
						target: 'address',
						cardinality: 'noneOrMany',
						component: 'MyCustomTable',
						fieldname: 'addresses',
					},
				}
			)
			const resolved = registry.resolveSchema(testDoctype)
			const tableField = resolved[0] as any

			expect(tableField.component).toBe('MyCustomTable')
		})

		it('does not mutate addressDoctype schema when resolving noneOrMany link', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{
						kind: 'field' as const,
						fieldname: 'addresses',
						fieldtype: 'Link',
						component: 'ATable',
						options: 'address',
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{ addresses: { target: 'address', cardinality: 'noneOrMany', fieldname: 'addresses' } }
			)
			const originalFields = Array.from(addressDoctype.schema || [])
			registry.resolveSchema(testDoctype)

			// Address schema fields are not mutated (no ATable-specific keys added to source fields)
			expect('columns' in originalFields[0]).toBe(false)
			expect('rows' in originalFields[0]).toBe(false)
		})

		it('gracefully handles missing doctype for noneOrMany link', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{
						kind: 'field' as const,
						fieldname: 'items',
						fieldtype: 'Link',
						component: 'ATable',
						options: 'nonexistent',
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{ items: { target: 'nonexistent', cardinality: 'noneOrMany', fieldname: 'items' } }
			)
			const resolved = registry.resolveSchema(testDoctype)

			// Missing link target: link field copied as-is
			expect(resolved).toHaveLength(1)
			expect(resolved[0].fieldname).toBe('items')
		})

		it('resolves a link with cardinality:atLeastOne the same way as noneOrMany', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{
						kind: 'field' as const,
						fieldname: 'addresses',
						fieldtype: 'Link',
						component: 'ATable',
						options: 'address',
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{ addresses: { target: 'address', cardinality: 'atLeastOne', fieldname: 'addresses' } }
			)
			const resolved = registry.resolveSchema(testDoctype)
			const tableField = resolved[0] as any

			expect(tableField.fieldname).toBe('addresses')
			expect(tableField.component).toBe('ATable')
			expect(tableField.kind).toBe('table')
			expect(tableField.config).toEqual({ view: 'list' })
			// rows are NOT in the resolved schema — they come from formData at render time
			expect(Array.isArray(tableField.schema)).toBe(true)
			expect(tableField.schema).toHaveLength(4)
			expect('columns' in tableField).toBe(false)
		})

		it('resolves a link with cardinality:atMostOne by embedding child schema like one', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{
						kind: 'field' as const,
						fieldname: 'shippingAddress',
						fieldtype: 'Link',
						component: 'AForm',
						options: 'address',
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{ shippingAddress: { target: 'address', cardinality: 'atMostOne', fieldname: 'shippingAddress' } }
			)
			const resolved = registry.resolveSchema(testDoctype)
			const formField = resolved[0] as any

			expect(formField.fieldname).toBe('shippingAddress')
			expect(formField.component).toBe('AForm')
			expect(formField.schema).toHaveLength(4)
			expect(formField.schema[0].fieldname).toBe('street')
		})

		it('preserves required and readOnly on resolved one-to-one link fields', () => {
			const testDoctype = new Doctype(
				'link-with-meta',
				List([
					{
						kind: 'field' as const,
						fieldname: 'address',
						fieldtype: 'Link',
						options: 'address',
						required: true,
						readOnly: false,
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{ address: { target: 'address', cardinality: 'one', fieldname: 'address' } }
			)

			const resolved = registry.resolveSchema(testDoctype)
			const addressField = resolved[0] as any

			expect(addressField.fieldname).toBe('address')
			expect(addressField.required).toBe(true)
			expect(addressField.readOnly).toBe(false)
		})

		it('preserves required on resolved noneOrMany table fields', () => {
			const testDoctype = new Doctype(
				'table-with-meta',
				List([
					{ kind: 'field' as const, fieldname: 'addresses', fieldtype: 'Link', options: 'address', required: true },
				]) as any,
				undefined,
				undefined,
				undefined,
				{ addresses: { target: 'address', cardinality: 'noneOrMany', fieldname: 'addresses' } }
			)

			const resolved = registry.resolveSchema(testDoctype)
			const tableField = resolved[0] as any

			expect(tableField.fieldname).toBe('addresses')
			expect(tableField.required).toBe(true)
		})

		it('recursively resolves Link fields nested inside a fieldset', () => {
			const testDoctype = new Doctype(
				'fieldset-links',
				List([
					{
						kind: 'fieldset' as const,
						fieldname: 'address_section',
						component: 'AFieldset',
						schema: [{ kind: 'field' as const, fieldname: 'address', fieldtype: 'Link', options: 'address' }],
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{ address: { target: 'address', cardinality: 'one', fieldname: 'address' } }
			)

			const resolved = registry.resolveSchema(testDoctype)
			expect(resolved).toHaveLength(1)

			const fieldsetField = resolved[0] as any
			expect(fieldsetField.fieldname).toBe('address_section')
			expect('schema' in fieldsetField).toBe(true)

			// The link inside the fieldset must be resolved — not copied as a raw Link field
			const nestedLink = fieldsetField.schema[0]
			expect(nestedLink.fieldname).toBe('address')
			expect('schema' in nestedLink).toBe(true)
			expect(nestedLink.schema).toHaveLength(4)
		})

		it('copies a Link field as-is when no link declaration exists for its fieldname', () => {
			// Schema has a Link field but the doctype declares no links at all.
			// resolveSchema must not throw — it copies the field unchanged.
			const testDoctype = new Doctype(
				'undeclared-link',
				List([
					{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
					{ kind: 'field' as const, fieldname: 'orphan', fieldtype: 'Link', component: 'ALink' },
				]) as any,
				undefined,
				undefined
				// no links declared
			)
			const resolved = registry.resolveSchema(testDoctype)

			expect(resolved).toHaveLength(2)
			expect(resolved[1].fieldname).toBe('orphan')
			expect((resolved[1] as any).fieldtype).toBe('Link')
		})

		it('copies scalar fields inside a fieldset as-is', () => {
			const testDoctype = new Doctype(
				'fieldset-scalars',
				List([
					{
						kind: 'fieldset' as const,
						fieldname: 'contact_section',
						component: 'AFieldset',
						schema: [
							{ kind: 'field' as const, fieldname: 'phone', fieldtype: 'Data', component: 'ATextInput' },
							{ kind: 'field' as const, fieldname: 'email', fieldtype: 'Data', component: 'ATextInput' },
						],
					},
				]) as any,
				undefined,
				undefined
			)
			const resolved = registry.resolveSchema(testDoctype)
			const fieldset = resolved[0] as any

			expect(fieldset.schema).toHaveLength(2)
			expect(fieldset.schema[0].fieldname).toBe('phone')
			expect(fieldset.schema[0].fieldtype).toBe('Data')
			expect(fieldset.schema[1].fieldname).toBe('email')
		})

		it('copies a Link field inside a fieldset as-is when no link declaration exists', () => {
			const testDoctype = new Doctype(
				'fieldset-undeclared-link',
				List([
					{
						kind: 'fieldset' as const,
						fieldname: 'section',
						component: 'AFieldset',
						schema: [{ kind: 'field' as const, fieldname: 'orphan', fieldtype: 'Link', component: 'ALink' }],
					},
				]) as any,
				undefined,
				undefined
				// no links declared — orphan has no declaration
			)
			const resolved = registry.resolveSchema(testDoctype)
			const fieldset = resolved[0] as any

			expect(fieldset.schema).toHaveLength(1)
			expect(fieldset.schema[0].fieldname).toBe('orphan')
			expect(fieldset.schema[0].fieldtype).toBe('Link')
		})

		it('copies a Link field inside a fieldset as-is when the target doctype is not registered', () => {
			const testDoctype = new Doctype(
				'fieldset-missing-target',
				List([
					{
						kind: 'fieldset' as const,
						fieldname: 'section',
						component: 'AFieldset',
						schema: [{ kind: 'field' as const, fieldname: 'missing_link', fieldtype: 'Link', options: 'nonexistent' }],
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{ missing_link: { target: 'nonexistent', cardinality: 'one', fieldname: 'missing_link' } }
			)
			const resolved = registry.resolveSchema(testDoctype)
			const fieldset = resolved[0] as any

			expect(fieldset.schema).toHaveLength(1)
			expect(fieldset.schema[0].fieldname).toBe('missing_link')
			expect(fieldset.schema[0].fieldtype).toBe('Link')
		})

		it('resolves a noneOrMany Link inside a fieldset into a table config', () => {
			const testDoctype = new Doctype(
				'fieldset-table',
				List([
					{
						kind: 'fieldset' as const,
						fieldname: 'address_section',
						component: 'AFieldset',
						schema: [
							{ kind: 'field' as const, fieldname: 'label', fieldtype: 'Data', component: 'ATextInput' },
							{
								kind: 'field' as const,
								fieldname: 'addresses',
								fieldtype: 'Link',
								component: 'ATable',
								options: 'address',
							},
						],
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{ addresses: { target: 'address', cardinality: 'noneOrMany', fieldname: 'addresses' } }
			)
			const resolved = registry.resolveSchema(testDoctype)
			const fieldset = resolved[0] as any

			// scalar field inside fieldset is copied as-is
			expect(fieldset.schema[0].fieldname).toBe('label')
			expect(fieldset.schema[0].fieldtype).toBe('Data')

			// noneOrMany link inside fieldset is resolved to a table config
			const tableField = fieldset.schema[1]
			expect(tableField.fieldname).toBe('addresses')
			expect(tableField.component).toBe('ATable')
			expect(tableField.kind).toBe('table')
			expect(Array.isArray(tableField.schema)).toBe(true)
			expect(tableField.schema).toHaveLength(4)
			expect('columns' in tableField).toBe(false)
		})

		it('recursively resolves a fieldset nested inside another fieldset', () => {
			const testDoctype = new Doctype(
				'nested-fieldsets',
				List([
					{
						kind: 'fieldset' as const,
						fieldname: 'outer_section',
						component: 'AFieldset',
						schema: [
							{
								kind: 'fieldset' as const,
								fieldname: 'inner_section',
								component: 'AFieldset',
								schema: [{ kind: 'field' as const, fieldname: 'address', fieldtype: 'Link', options: 'address' }],
							},
						],
					},
				]) as any,
				undefined,
				undefined,
				undefined,
				{ address: { target: 'address', cardinality: 'one', fieldname: 'address' } }
			)
			const resolved = registry.resolveSchema(testDoctype)
			const outerFieldset = resolved[0] as any
			const innerFieldset = outerFieldset.schema[0]
			const addressField = innerFieldset.schema[0]

			expect(innerFieldset.fieldname).toBe('inner_section')
			expect(addressField.fieldname).toBe('address')
			// The link inside the inner fieldset must be resolved — not a raw Link field
			expect('schema' in addressField).toBe(true)
			expect(addressField.schema).toHaveLength(4)
		})

		it('renders link fields in the order they appear in the fields array', () => {
			// Link field is in the middle of scalar fields - order is determined by fields array
			const orderedSchema = List([
				{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
				{ kind: 'field' as const, fieldname: 'tasks', fieldtype: 'Link', component: 'ATable', options: 'address' },
				{ kind: 'field' as const, fieldname: 'status', fieldtype: 'Data', component: 'ATextInput' },
			])
			const docWithOrderedLinks = new Doctype('recipe', orderedSchema as any, undefined, undefined, undefined, {
				tasks: { target: 'address', cardinality: 'noneOrMany', fieldname: 'tasks' },
			})
			const resolved = registry.resolveSchema(docWithOrderedLinks)

			// Fields are in schema order: name, tasks, status
			expect(resolved[0].fieldname).toBe('name')
			expect(resolved[1].fieldname).toBe('tasks')
			expect(resolved[2].fieldname).toBe('status')
		})

		it('undeclared Link field gets component AFormLink', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
					{ kind: 'field' as const, fieldname: 'territory', fieldtype: 'Link', options: 'territory' },
				]) as any,
				undefined,
				undefined
			)
			const resolved = registry.resolveSchema(testDoctype)

			expect(resolved[1].fieldname).toBe('territory')
			expect((resolved[1] as any).component).toBe('AFormLink')
		})

		it('undeclared Link field with custom component preserves that component', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
					{
						kind: 'field' as const,
						fieldname: 'territory',
						fieldtype: 'Link',
						options: 'territory',
						component: 'MyCustomLink',
					},
				]) as any,
				undefined,
				undefined
			)
			const resolved = registry.resolveSchema(testDoctype)

			expect(resolved[1].fieldname).toBe('territory')
			expect((resolved[1] as any).component).toBe('MyCustomLink')
		})

		it('ignores raw doctype in JSON and derives from options only', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{
						kind: 'field' as const,
						fieldname: 'territory',
						fieldtype: 'Link',
						options: 'territory',
						doctype: 'ignored-value',
					},
				]) as any,
				undefined,
				undefined
			)
			const resolved = registry.resolveSchema(testDoctype)

			expect((resolved[0] as any).doctype).toBe('territory')
		})

		it('undeclared Link field with string options gets doctype from options', () => {
			const testDoctype = new Doctype(
				'test',
				List([{ kind: 'field' as const, fieldname: 'territory', fieldtype: 'Link', options: 'territory' }]) as any,
				undefined,
				undefined
			)
			const resolved = registry.resolveSchema(testDoctype)

			expect((resolved[0] as any).doctype).toBe('territory')
		})

		it('undeclared Link field without options gets no doctype prop and emits a console warning', () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const testDoctype = new Doctype(
				'test',
				List([{ kind: 'field' as const, fieldname: 'territory', fieldtype: 'Link' }]) as any,
				undefined,
				undefined
			)
			const resolved = registry.resolveSchema(testDoctype)

			expect((resolved[0] as any).component).toBe('AFormLink')
			expect('doctype' in resolved[0]).toBe(false)
			expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('territory'))
			warnSpy.mockRestore()
		})

		it('undeclared Link field preserves other field properties', () => {
			const testDoctype = new Doctype(
				'test',
				List([
					{
						kind: 'field' as const,
						fieldname: 'territory',
						fieldtype: 'Link',
						label: 'Sales Territory',
						options: 'territory',
					},
				]) as any,
				undefined,
				undefined
			)
			const resolved = registry.resolveSchema(testDoctype)

			expect(resolved[0].fieldname).toBe('territory')
			expect((resolved[0] as any).fieldtype).toBe('Link')
			expect((resolved[0] as any).label).toBe('Sales Territory')
		})

		it('declared Link fields are unaffected by undeclared-Link logic', () => {
			const resolved = registry.resolveSchema(customerDoctype)

			// The address field is a declared Link — it should be resolved as an embedded AForm schema
			const addressField = resolved[2] as any
			expect(addressField.fieldname).toBe('address')
			expect('schema' in addressField).toBe(true)
			expect(addressField.component).not.toBe('AFormLink')
		})
	})

	describe('mode propagation through resolveSchema()', () => {
		it('mode on a ValueField with fieldtype: Link + noneOrMany is preserved in ResolvedTable.mode', () => {
			const resolved = registry.resolveSchema(
				new Doctype(
					'order',
					List([
						{
							kind: 'field' as const,
							fieldname: 'items',
							fieldtype: 'Link',
							options: 'address',
							mode: 'read' as const,
						},
					]) as any,
					undefined,
					undefined,
					undefined,
					{ items: { target: 'address', cardinality: 'noneOrMany', fieldname: 'items' } }
				)
			)
			const tableField = resolved.find(f => f.fieldname === 'items') as any
			expect(tableField?.kind).toBe('table')
			expect(tableField?.mode).toBe('read')
		})

		it('mode on a FieldsetField is preserved in ResolvedFieldset.mode', () => {
			const resolved = registry.resolveSchema(
				new Doctype(
					'doc',
					List([
						{
							kind: 'fieldset' as const,
							fieldname: 'billing',
							mode: 'read' as const,
							schema: [{ kind: 'field' as const, fieldname: 'card', fieldtype: 'Data', component: 'ATextInput' }],
						},
					]) as any,
					undefined,
					undefined
				)
			)
			const fieldset = resolved.find(f => f.fieldname === 'billing') as any
			expect(fieldset?.kind).toBe('fieldset')
			expect(fieldset?.mode).toBe('read')
		})

		it('TableField with no config produces ResolvedTable with config: { view: "list" }', () => {
			const resolved = registry.resolveSchema(
				new Doctype(
					'doc',
					List([
						{
							kind: 'table' as const,
							fieldname: 'items',
							columns: [{ fieldname: 'qty', fieldtype: 'Int' }],
							// no config — should default to { view: 'list' }
						},
					]) as any,
					undefined,
					undefined
				)
			)
			const tableField = resolved.find(f => f.fieldname === 'items') as any
			expect(tableField?.kind).toBe('table')
			expect(tableField?.config).toEqual({ view: 'list' })
		})

		it('LinkDeclaration.cardinality is authoritative when ValueField.cardinality also set', () => {
			// ValueField has cardinality: 'one' but LinkDeclaration has cardinality: 'noneOrMany'
			// LinkDeclaration wins — result should be a table, not a link
			const resolved = registry.resolveSchema(
				new Doctype(
					'order',
					List([
						{
							kind: 'field' as const,
							fieldname: 'items',
							fieldtype: 'Link',
							options: 'address',
							cardinality: 'one', // advisory only
						},
					]) as any,
					undefined,
					undefined,
					undefined,
					{ items: { target: 'address', cardinality: 'noneOrMany', fieldname: 'items' } }
				)
			)
			const field = resolved.find(f => f.fieldname === 'items') as any
			// LinkDeclaration.cardinality (noneOrMany) wins → ResolvedTable
			expect(field?.kind).toBe('table')
		})
	})

	describe('Registry.initializeRecord()', () => {
		it('initializes default values based on fieldtype', () => {
			const schema = [
				{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
				{ kind: 'field' as const, fieldname: 'bio', fieldtype: 'Text', component: 'ATextInput' },
				{ kind: 'field' as const, fieldname: 'active', fieldtype: 'Check', component: 'ACheckbox' },
				{ kind: 'field' as const, fieldname: 'count', fieldtype: 'Int', component: 'ANumericInput' },
				{ kind: 'field' as const, fieldname: 'price', fieldtype: 'Float', component: 'ANumericInput' },
				{ kind: 'field' as const, fieldname: 'amount', fieldtype: 'Decimal', component: 'ANumericInput' },
				{ kind: 'field' as const, fieldname: 'cost', fieldtype: 'Currency', component: 'ANumericInput' },
				{ kind: 'field' as const, fieldname: 'qty', fieldtype: 'Quantity', component: 'ANumericInput' },
				{
					kind: 'table' as const,
					fieldname: 'items',
					component: 'ATable',
					schema: [],
					config: { view: 'list' as const },
				},
				{ kind: 'field' as const, fieldname: 'meta', fieldtype: 'JSON', component: 'ACodeEditor' },
				{ kind: 'field' as const, fieldname: 'birthday', fieldtype: 'Date', component: 'ADatePicker' },
			]
			const record = registry.initializeRecord(schema)

			expect(record.name).toBe('')
			expect(record.bio).toBe('')
			expect(record.active).toBe(false)
			expect(record.count).toBe(0)
			expect(record.price).toBe(0)
			expect(record.amount).toBe(0)
			expect(record.cost).toBe(0)
			expect(record.qty).toBe(0)
			expect(record.items).toEqual([])
			expect(record.meta).toEqual({})
			expect(record.birthday).toBe(null)
		})

		it('recursively initializes nested Doctype fields with resolved schemas', () => {
			const resolved = registry.resolveSchema(customerDoctype)
			const record = registry.initializeRecord(resolved)

			expect(record.customer_name).toBe('')
			expect(record.email).toBe('')
			expect(record.address).toEqual({
				street: '',
				city: '',
				state: '',
				zip_code: '',
			})
		})

		it('initializes link entries as empty string when schema not resolved', () => {
			// Resolved scalar field (no kind) — fieldtype defaults to null
			const schema = [{ kind: 'field' as const, fieldname: 'address', fieldtype: 'Data', component: 'AForm' }]
			const record = registry.initializeRecord(schema as any)

			// kind: 'field' with fieldtype 'Data' → empty string
			expect(record.address).toBe('')
		})

		it('initializes atLeastOne link entry to empty array', () => {
			const schema = [
				{
					kind: 'table' as const,
					fieldname: 'items',
					component: 'ATable',
					schema: [],
					config: { view: 'list' as const },
				},
			]
			const record = registry.initializeRecord(schema)

			expect(record.items).toEqual([])
		})

		it('initializes atMostOne link entry recursively when schema is provided', () => {
			const resolved = registry.resolveSchema(
				new Doctype(
					'parent',
					List([
						{ kind: 'field' as const, fieldname: 'address', fieldtype: 'Link', component: 'AForm', options: 'address' },
					]) as any,
					undefined,
					undefined,
					undefined,
					{ address: { target: 'address', cardinality: 'atMostOne', fieldname: 'address' } }
				)
			)
			const record = registry.initializeRecord(resolved)

			expect(record.address).toEqual({ street: '', city: '', state: '', zip_code: '' })
		})
	})

	describe('Embedded nested data (1:1)', () => {
		it('stores nested doctype data in parent path', () => {
			const store = stonecrop.getStore()

			stonecrop.addRecord(customerDoctype, 'c1', {
				customer_name: 'John Doe',
				email: 'john@example.com',
				address: {
					street: '123 Main St',
					city: 'Springfield',
					state: 'IL',
					zip_code: '62701',
				},
			})

			// Verify nested data is embedded in parent
			const street = store.get('customer.c1.address.street')
			expect(street).toBe('123 Main St')

			const city = store.get('customer.c1.address.city')
			expect(city).toBe('Springfield')
		})

		it('updates nested fields independently', () => {
			const store = stonecrop.getStore()

			stonecrop.addRecord(customerDoctype, 'c2', {
				customer_name: 'Jane Smith',
				address: {
					street: '456 Oak Ave',
					city: 'Portland',
				},
			})

			// Update just the street
			store.set('customer.c2.address.street', '789 Elm St')

			// Verify street changed but city remained
			expect(store.get('customer.c2.address.street')).toBe('789 Elm St')
			expect(store.get('customer.c2.address.city')).toBe('Portland')
		})
	})

	describe('Tree navigation with nested doctypes', () => {
		it('provides correct breadcrumbs for nested paths', () => {
			const store = stonecrop.getStore()

			stonecrop.addRecord(customerDoctype, 'c3', {
				customer_name: 'Bob Wilson',
				address: {
					street: '321 Pine Rd',
					city: 'Seattle',
				},
			})

			const streetNode = store.getNode('customer.c3.address.street')
			const breadcrumbs = streetNode.getBreadcrumbs()

			expect(breadcrumbs).toEqual(['customer', 'c3', 'address', 'street'])
		})

		it('calculates correct depth for nested nodes', () => {
			const store = stonecrop.getStore()

			stonecrop.addRecord(customerDoctype, 'c4', {
				customer_name: 'Alice Brown',
				address: { street: '999 Main St', city: 'Austin' },
			})

			const rootNode = store.getNode('customer')
			expect(rootNode.getDepth()).toBe(1)

			const recordNode = store.getNode('customer.c4')
			expect(recordNode.getDepth()).toBe(2)

			const addressNode = store.getNode('customer.c4.address')
			expect(addressNode.getDepth()).toBe(3)

			const streetNode = store.getNode('customer.c4.address.street')
			expect(streetNode.getDepth()).toBe(4)
		})

		it('navigates to parent from nested node', () => {
			const store = stonecrop.getStore()

			stonecrop.addRecord(customerDoctype, 'c5', {
				customer_name: 'Charlie Davis',
				address: { street: '111 First St', city: 'Boston' },
			})

			const streetNode = store.getNode('customer.c5.address.street')
			const addressNode = streetNode.getAncestor()

			expect(addressNode).toBeDefined()
			expect(addressNode?.getPath()).toBe('customer.c5.address')

			const customerNode = addressNode?.getAncestor()
			expect(customerNode?.getPath()).toBe('customer.c5')
		})
	})
})

describe('resolveSchema → schemaToColumns pipeline', { tags: ['unit'] }, () => {
	let registry: Registry

	beforeEach(() => {
		registry = new Registry()

		const taskSchema = List([
			{ kind: 'field' as const, fieldname: 'title', fieldtype: 'Data', label: 'Title', component: 'ATextInput' },
			{ kind: 'field' as const, fieldname: 'status', fieldtype: 'Select', label: 'Status', component: 'ATextInput' },
			{ kind: 'field' as const, fieldname: 'assignee', fieldtype: 'Link', options: 'user', component: 'AForm' },
		])
		const userSchema = List([
			{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data', label: 'Name', component: 'ATextInput' },
			{ kind: 'field' as const, fieldname: 'email', fieldtype: 'Data', label: 'Email', component: 'ATextInput' },
		])
		const userDoctype = new Doctype('user', userSchema as any, undefined, undefined)
		const taskDoctype = new Doctype('task', taskSchema as any, undefined, undefined, undefined, {
			assignee: { target: 'user', cardinality: 'noneOrMany', fieldname: 'assignee' },
		})
		registry.addDoctype(userDoctype)
		registry.addDoctype(taskDoctype)
	})

	it('scalar task fields appear as ResolvedScalar entries; table columns come from the linked doctype', () => {
		const resolved = registry.resolveSchema(registry.getDoctype('task')!)

		// Scalar fields on the task doctype itself
		const scalarNames = resolved.filter((f: any) => f.kind === 'field').map((f: any) => f.fieldname)
		expect(scalarNames).toContain('title')
		expect(scalarNames).toContain('status')

		// The assignee link (noneOrMany) resolves to a table whose columns are user doctype fields
		const tableEntry = resolved.find((f: any) => f.kind === 'table') as any
		expect(tableEntry).toBeDefined()
		const columns = schemaToColumns(tableEntry.schema)
		const colNames = columns.map(c => c.name)
		expect(colNames).toContain('name')
		expect(colNames).toContain('email')
	})

	it('ResolvedTable entry has schema but no fieldtype', () => {
		const resolved = registry.resolveSchema(registry.getDoctype('task')!)
		const tableEntry = resolved.find((f: any) => f.kind === 'table')
		expect(tableEntry).toBeDefined()
		expect((tableEntry as any).fieldtype).toBeUndefined()

		// assignee is the table entry; it does not appear as a scalar column
		const tableColumns = schemaToColumns((tableEntry as any).schema)
		const names = tableColumns.map(c => c.name)
		// assignee is the table itself, not a column inside it
		expect(names).not.toContain('assignee')
	})

	it('column objects do not carry kind, schema, or config', () => {
		// In the new design, schemaToColumns receives ResolvedTable.schema (ColumnSchema[]),
		// not the full ResolvedField[]. The table entry's columns are pre-extracted without discriminants.
		const resolved = registry.resolveSchema(registry.getDoctype('task')!)
		const tableEntry = resolved.find((f: any) => f.kind === 'table') as any
		expect(tableEntry).toBeDefined()
		const columns = schemaToColumns(tableEntry.schema)

		for (const col of columns) {
			expect((col as any).kind).toBeUndefined()
			expect((col as any).schema).toBeUndefined()
			expect((col as any).config).toBeUndefined()
		}
	})

	it('label and fieldtype are preserved on ResolvedScalar fields', () => {
		const resolved = registry.resolveSchema(registry.getDoctype('task')!)

		const titleField = resolved.find((f: any) => f.fieldname === 'title') as any
		expect(titleField?.label).toBe('Title')
		expect(titleField?.fieldtype).toBe('Data')

		const statusField = resolved.find((f: any) => f.fieldname === 'status') as any
		expect(statusField?.fieldtype).toBe('Select')
	})
})
