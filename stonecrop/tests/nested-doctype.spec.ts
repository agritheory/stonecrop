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

	describe('Registry nested schema preloading', () => {
		it('preloads nested schemas recursively', async () => {
			// Initially only customer and address are registered
			expect(registry.registry['customer']).toBeDefined()
			expect(registry.registry['address']).toBeDefined()

			// Preload nested schemas
			await registry.preloadNestedSchemas('customer')

			// Address should still be in registry (already there)
			expect(registry.registry['address']).toBeDefined()
		})

		it('handles missing nested doctypes gracefully', async () => {
			// Create a doctype with reference to non-existent nested doctype
			const testSchema = List([
				{
					fieldname: 'test_field',
					fieldtype: 'Doctype',
					options: 'nonexistent-doctype',
				},
			])
			const testDoctype = new DoctypeMeta('test', testSchema as any, undefined, undefined)
			registry.addDoctype(testDoctype)

			// Should not throw error
			await expect(registry.preloadNestedSchemas('test')).resolves.not.toThrow()
		})

		it('prevents circular dependency issues', async () => {
			// Create two doctypes that reference each other
			const doctype1Schema = List([
				{
					fieldname: 'ref',
					fieldtype: 'Doctype',
					options: 'doctype2',
				},
			])
			const doctype1 = new DoctypeMeta('doctype1', doctype1Schema as any, undefined, undefined)

			const doctype2Schema = List([
				{
					fieldname: 'ref',
					fieldtype: 'Doctype',
					options: 'doctype1',
				},
			])
			const doctype2 = new DoctypeMeta('doctype2', doctype2Schema as any, undefined, undefined)

			registry.addDoctype(doctype1)
			registry.addDoctype(doctype2)

			// Should handle circular reference without infinite loop
			await expect(registry.preloadNestedSchemas('doctype1')).resolves.not.toThrow()
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
