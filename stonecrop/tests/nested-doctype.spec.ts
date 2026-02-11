import { List } from 'immutable'
import { describe, it, expect, beforeEach } from 'vitest'

import { Stonecrop, Registry, DoctypeMeta } from '../src'

describe('Nested Doctype Support', () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let customerDoctype: DoctypeMeta
	let addressDoctype: DoctypeMeta

	beforeEach(() => {
		registry = new Registry()

		// Address doctype
		const addressSchema = List([
			{ fieldname: 'street', fieldtype: 'Data', component: 'ATextInput' },
			{ fieldname: 'city', fieldtype: 'Data', component: 'ATextInput' },
			{ fieldname: 'state', fieldtype: 'Data', component: 'ATextInput' },
			{ fieldname: 'zip_code', fieldtype: 'Data', component: 'ATextInput' },
		])
		addressDoctype = new DoctypeMeta('address', addressSchema as any, undefined, undefined)
		registry.addDoctype(addressDoctype)

		// Customer doctype with nested Address (1:1)
		const customerSchema = List([
			{ fieldname: 'customer_name', fieldtype: 'Data', component: 'ATextInput' },
			{ fieldname: 'email', fieldtype: 'Data', component: 'ATextInput' },
			{
				fieldname: 'address',
				fieldtype: 'Doctype',
				options: 'address',
			},
		])
		customerDoctype = new DoctypeMeta('customer', customerSchema as any, undefined, undefined)
		registry.addDoctype(customerDoctype)

		stonecrop = new Stonecrop(registry)
	})

	describe('Registry.resolveSchema()', () => {
		it('resolves a Doctype field by embedding child schema', () => {
			const schema = Array.from(customerDoctype.schema || [])
			const resolved = registry.resolveSchema(schema)

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
			const schema = Array.from(customerDoctype.schema || [])
			const originalAddress = schema[2]
			registry.resolveSchema(schema)

			expect('schema' in originalAddress).toBe(false)
		})

		it('handles deeply nested doctypes', () => {
			// Create a "company" doctype that nests "customer" which nests "address"
			const companySchema = List([
				{ fieldname: 'company_name', fieldtype: 'Data', component: 'ATextInput' },
				{ fieldname: 'primary_contact', fieldtype: 'Doctype', options: 'customer' },
			])
			const companyDoctype = new DoctypeMeta('company', companySchema as any, undefined, undefined)
			registry.addDoctype(companyDoctype)

			const resolved = registry.resolveSchema(Array.from(companyDoctype.schema || []))
			const contactField = resolved[1] as any

			expect(contactField.schema).toHaveLength(3)
			// The nested customer's address field should also be resolved
			const nestedAddress = contactField.schema[2]
			expect(nestedAddress.fieldname).toBe('address')
			expect(nestedAddress.schema).toHaveLength(4)
			expect(nestedAddress.schema[0].fieldname).toBe('street')
		})

		it('prevents circular references', () => {
			// Create a self-referencing doctype
			const selfRefSchema = List([
				{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
				{ fieldname: 'parent', fieldtype: 'Doctype', options: 'self-ref' },
			])
			const selfRefDoctype = new DoctypeMeta('self-ref', selfRefSchema as any, undefined, undefined)
			registry.addDoctype(selfRefDoctype)

			const resolved = registry.resolveSchema(Array.from(selfRefDoctype.schema || []))
			const parentField = resolved[1] as any

			// First level resolves — gets the child schema
			expect(parentField.schema).toHaveLength(2)
			// But the *nested* parent field does NOT recurse further (circular blocked)
			const nestedParent = parentField.schema[1]
			expect(nestedParent.fieldname).toBe('parent')
			expect(nestedParent.schema).toBeUndefined()
		})

		it('gracefully handles missing doctype references', () => {
			const schema = [
				{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
				{ fieldname: 'missing', fieldtype: 'Doctype', options: 'nonexistent' },
			]
			const resolved = registry.resolveSchema(schema)

			// Missing doctype field is returned without schema
			const missingField = resolved[1] as any
			expect(missingField.fieldname).toBe('missing')
			expect(missingField.schema).toBeUndefined()
		})

		it('returns fields as-is when not Doctype type', () => {
			const schema = [
				{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
				{ fieldname: 'active', fieldtype: 'Check', component: 'ACheckbox' },
			]
			const resolved = registry.resolveSchema(schema)

			expect(resolved).toHaveLength(2)
			expect(resolved[0]).toEqual(expect.objectContaining({ fieldname: 'name', fieldtype: 'Data' }))
			expect(resolved[1]).toEqual(expect.objectContaining({ fieldname: 'active', fieldtype: 'Check' }))
		})
	})

	describe('Registry.initializeRecord()', () => {
		it('initializes default values based on fieldtype', () => {
			const schema = [
				{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
				{ fieldname: 'bio', fieldtype: 'Text', component: 'ATextInput' },
				{ fieldname: 'active', fieldtype: 'Check', component: 'ACheckbox' },
				{ fieldname: 'count', fieldtype: 'Int', component: 'ANumericInput' },
				{ fieldname: 'price', fieldtype: 'Float', component: 'ANumericInput' },
				{ fieldname: 'amount', fieldtype: 'Decimal', component: 'ANumericInput' },
				{ fieldname: 'cost', fieldtype: 'Currency', component: 'ANumericInput' },
				{ fieldname: 'qty', fieldtype: 'Quantity', component: 'ANumericInput' },
				{ fieldname: 'items', fieldtype: 'Table', component: 'ATable' },
				{ fieldname: 'meta', fieldtype: 'JSON', component: 'ACodeEditor' },
				{ fieldname: 'birthday', fieldtype: 'Date', component: 'ADatePicker' },
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
			const resolved = registry.resolveSchema(Array.from(customerDoctype.schema || []))
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

		it('initializes Doctype fields as empty object when schema not resolved', () => {
			const schema = [{ fieldname: 'address', fieldtype: 'Doctype', options: 'address' }]
			const record = registry.initializeRecord(schema)

			expect(record.address).toEqual({})
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
			const addressNode = streetNode.getParent()

			expect(addressNode).toBeDefined()
			expect(addressNode?.getPath()).toBe('customer.c5.address')

			const customerNode = addressNode?.getParent()
			expect(customerNode?.getPath()).toBe('customer.c5')
		})
	})
})
