import { List } from 'immutable'
import { describe, it, expect, beforeEach } from 'vitest'

import { Stonecrop, Registry, DoctypeMeta } from '../src'

describe('Nested Doctype Support', () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let customerDoctype: DoctypeMeta
	let addressDoctype: DoctypeMeta
	let orderDoctype: DoctypeMeta
	let lineItemDoctype: DoctypeMeta

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
				isArray: false,
			},
		])
		customerDoctype = new DoctypeMeta('customer', customerSchema as any, undefined, undefined)
		registry.addDoctype(customerDoctype)

		// LineItem doctype
		const lineItemSchema = List([
			{ fieldname: 'product', fieldtype: 'Data', component: 'ATextInput' },
			{ fieldname: 'quantity', fieldtype: 'Int', component: 'ANumericInput' },
			{ fieldname: 'price', fieldtype: 'Float', component: 'ANumericInput' },
		])
		lineItemDoctype = new DoctypeMeta('line-item', lineItemSchema as any, undefined, undefined)
		registry.addDoctype(lineItemDoctype)

		// Order doctype with nested LineItems (1:many)
		const orderSchema = List([
			{ fieldname: 'order_number', fieldtype: 'Data', component: 'ATextInput' },
			{ fieldname: 'order_date', fieldtype: 'Date', component: 'ADatePicker' },
			{
				fieldname: 'line_items',
				fieldtype: 'Doctype',
				options: 'line-item',
				isArray: true,
			},
		])
		orderDoctype = new DoctypeMeta('order', orderSchema as any, undefined, undefined)
		registry.addDoctype(orderDoctype)

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
					isArray: false,
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
					isArray: false,
				},
			])
			const doctype1 = new DoctypeMeta('doctype1', doctype1Schema as any, undefined, undefined)

			const doctype2Schema = List([
				{
					fieldname: 'ref',
					fieldtype: 'Doctype',
					options: 'doctype1',
					isArray: false,
				},
			])
			const doctype2 = new DoctypeMeta('doctype2', doctype2Schema as any, undefined, undefined)

			registry.addDoctype(doctype1)
			registry.addDoctype(doctype2)

			// Should handle circular reference without infinite loop
			await expect(registry.preloadNestedSchemas('doctype1')).resolves.not.toThrow()
		})
	})

	describe('HST array path support', () => {
		it('supports array bracket notation in paths', () => {
			const store = stonecrop.getStore()

			// Set up order with line items array
			stonecrop.addRecord(orderDoctype, 'o1', {
				order_number: 'ORD-001',
				line_items: [
					{ product: 'Widget A', quantity: 2, price: 19.99 },
					{ product: 'Widget B', quantity: 1, price: 29.99 },
				],
			})

			// Test bracket notation access
			const product1 = store.get('order.o1.line_items[0].product')
			expect(product1).toBe('Widget A')

			const quantity2 = store.get('order.o1.line_items[1].quantity')
			expect(quantity2).toBe(1)
		})

		it('supports dot notation with array indices', () => {
			const store = stonecrop.getStore()

			stonecrop.addRecord(orderDoctype, 'o2', {
				order_number: 'ORD-002',
				line_items: [{ product: 'Gadget X', quantity: 5, price: 9.99 }],
			})

			// Test dot notation access (alternative to bracket notation)
			const product = store.get('order.o2.line_items.0.product')
			expect(product).toBe('Gadget X')
		})

		it('sets values in array using bracket notation', () => {
			const store = stonecrop.getStore()

			stonecrop.addRecord(orderDoctype, 'o3', {
				order_number: 'ORD-003',
				line_items: [{ product: 'Item 1', quantity: 1, price: 10 }],
			})

			// Update using bracket notation
			store.set('order.o3.line_items[0].quantity', 5)

			// Verify change
			const updatedQuantity = store.get('order.o3.line_items[0].quantity')
			expect(updatedQuantity).toBe(5)
		})

		it('checks existence of nested array paths', () => {
			const store = stonecrop.getStore()

			stonecrop.addRecord(orderDoctype, 'o4', {
				order_number: 'ORD-004',
				line_items: [{ product: 'Test Product', quantity: 1, price: 5 }],
			})

			expect(store.has('order.o4.line_items[0]')).toBe(true)
			expect(store.has('order.o4.line_items[0].product')).toBe(true)
			expect(store.has('order.o4.line_items[999]')).toBe(false)
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

	describe('Embedded nested arrays (1:many)', () => {
		it('stores array of nested doctype data in parent path', () => {
			const store = stonecrop.getStore()

			stonecrop.addRecord(orderDoctype, 'o5', {
				order_number: 'ORD-005',
				line_items: [
					{ product: 'Product A', quantity: 2, price: 15 },
					{ product: 'Product B', quantity: 3, price: 20 },
				],
			})

			// Verify array is embedded
			const lineItems = store.get('order.o5.line_items')
			expect(Array.isArray(lineItems)).toBe(true)
			expect(lineItems).toHaveLength(2)
		})

		it('navigates tree structure for nested arrays', () => {
			const store = stonecrop.getStore()

			stonecrop.addRecord(orderDoctype, 'o6', {
				order_number: 'ORD-006',
				line_items: [{ product: 'Widget', quantity: 1, price: 100 }],
			})

			// Get node and verify tree navigation
			const orderNode = store.getNode('order.o6')
			expect(orderNode).toBeDefined()

			const lineItemsNode = orderNode.getNode('line_items')
			expect(lineItemsNode).toBeDefined()

			// Verify path
			expect(lineItemsNode.getPath()).toBe('order.o6.line_items')
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
