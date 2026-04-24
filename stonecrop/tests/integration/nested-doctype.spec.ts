import { List } from 'immutable'
import { describe, it, expect, beforeEach } from 'vitest'

import { Stonecrop, Registry, Doctype } from '../../src'

describe('Nested Doctype Support', () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let customerDoctype: Doctype
	let addressDoctype: Doctype

	beforeEach(() => {
		registry = new Registry()

		// Address doctype
		const addressSchema = List([
			{ fieldname: 'street', fieldtype: 'Data', component: 'ATextInput' },
			{ fieldname: 'city', fieldtype: 'Data', component: 'ATextInput' },
			{ fieldname: 'state', fieldtype: 'Data', component: 'ATextInput' },
			{ fieldname: 'zip_code', fieldtype: 'Data', component: 'ATextInput' },
		])
		addressDoctype = new Doctype('address', addressSchema as any, undefined, undefined)
		registry.addDoctype(addressDoctype)

		// Customer doctype with nested Address (1:1) declared via links
		const customerSchema = List([
			{ fieldname: 'customer_name', fieldtype: 'Data', component: 'ATextInput' },
			{ fieldname: 'email', fieldtype: 'Data', component: 'ATextInput' },
			{ fieldname: 'address', fieldtype: 'Link', component: 'AForm', options: 'address' },
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
				{ fieldname: 'company_name', fieldtype: 'Data', component: 'ATextInput' },
				{ fieldname: 'primary_contact', fieldtype: 'Link', component: 'AForm', options: 'customer' },
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
				{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
				{ fieldname: 'parent', fieldtype: 'Link', component: 'AForm', options: 'self-ref' },
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
					{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
					{ fieldname: 'missing', fieldtype: 'Link', component: 'AForm', options: 'nonexistent' },
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
					{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
					{ fieldname: 'active', fieldtype: 'Check', component: 'ACheckbox' },
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
					{ fieldname: 'customer_name', fieldtype: 'Data', component: 'ATextInput' },
					{ fieldname: 'addresses', fieldtype: 'Link', component: 'ATable', options: 'address' },
				]) as any,
				undefined,
				undefined,
				undefined,
				{ addresses: { target: 'address', cardinality: 'noneOrMany', fieldname: 'addresses' } }
			)
			const resolved = registry.resolveSchema(testDoctype)

			// Scalar fields are unchanged
			expect(resolved[0]).toEqual(expect.objectContaining({ fieldname: 'customer_name', fieldtype: 'Data' }))

			// Link with cardinality:noneOrMany has auto-derived columns, component, config, and rows
			const tableField = resolved[1] as any
			expect(tableField.fieldname).toBe('addresses')
			expect(tableField.component).toBe('ATable')
			expect(tableField.config).toEqual({ view: 'list' })
			expect(tableField.rows).toEqual([])

			// Columns derived from address schema
			expect(tableField.columns).toHaveLength(4)
			expect(tableField.columns[0]).toEqual(
				expect.objectContaining({ name: 'street', label: 'street', fieldtype: 'Data', edit: true })
			)
			expect(tableField.columns[1]).toEqual(expect.objectContaining({ name: 'city' }))
			expect(tableField.columns[2]).toEqual(expect.objectContaining({ name: 'state' }))
			expect(tableField.columns[3]).toEqual(expect.objectContaining({ name: 'zip_code' }))
		})

		it('auto-derives columns from child doctype schema for noneOrMany links', () => {
			const testDoctype = new Doctype(
				'test',
				List([{ fieldname: 'addresses', fieldtype: 'Link', component: 'ATable', options: 'address' }]) as any,
				undefined,
				undefined,
				undefined,
				{ addresses: { target: 'address', cardinality: 'noneOrMany', fieldname: 'addresses' } }
			)
			const resolved = registry.resolveSchema(testDoctype)
			const tableField = resolved[0] as any

			// Columns are auto-derived from address schema (street, city, state, zip_code)
			expect(tableField.columns).toHaveLength(4)
		})

		it('uses custom component from link declaration', () => {
			const testDoctype = new Doctype(
				'test',
				List([{ fieldname: 'addresses', fieldtype: 'Link', component: 'ATable', options: 'address' }]) as any,
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
				List([{ fieldname: 'addresses', fieldtype: 'Link', component: 'ATable', options: 'address' }]) as any,
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
				List([{ fieldname: 'items', fieldtype: 'Link', component: 'ATable', options: 'nonexistent' }]) as any,
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
				List([{ fieldname: 'addresses', fieldtype: 'Link', component: 'ATable', options: 'address' }]) as any,
				undefined,
				undefined,
				undefined,
				{ addresses: { target: 'address', cardinality: 'atLeastOne', fieldname: 'addresses' } }
			)
			const resolved = registry.resolveSchema(testDoctype)
			const tableField = resolved[0] as any

			expect(tableField.fieldname).toBe('addresses')
			expect(tableField.component).toBe('ATable')
			expect(tableField.config).toEqual({ view: 'list' })
			expect(tableField.rows).toEqual([])
			expect(tableField.columns).toHaveLength(4)
		})

		it('resolves a link with cardinality:atMostOne by embedding child schema like one', () => {
			const testDoctype = new Doctype(
				'test',
				List([{ fieldname: 'shippingAddress', fieldtype: 'Link', component: 'AForm', options: 'address' }]) as any,
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

		it('renders link fields in the order they appear in the fields array', () => {
			// Link field is in the middle of scalar fields - order is determined by fields array
			const orderedSchema = List([
				{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
				{ fieldname: 'tasks', fieldtype: 'Link', component: 'ATable', options: 'address' },
				{ fieldname: 'status', fieldtype: 'Data', component: 'ATextInput' },
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
					{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
					{ fieldname: 'territory', fieldtype: 'Link', options: 'territory' },
				]) as any,
				undefined,
				undefined
			)
			const resolved = registry.resolveSchema(testDoctype)

			expect(resolved[1].fieldname).toBe('territory')
			expect((resolved[1] as any).component).toBe('AFormLink')
		})

		it('undeclared Link field with string options gets doctype from options', () => {
			const testDoctype = new Doctype(
				'test',
				List([{ fieldname: 'territory', fieldtype: 'Link', options: 'territory' }]) as any,
				undefined,
				undefined
			)
			const resolved = registry.resolveSchema(testDoctype)

			expect((resolved[0] as any).doctype).toBe('territory')
		})

		it('undeclared Link field without options gets no doctype prop', () => {
			const testDoctype = new Doctype(
				'test',
				List([{ fieldname: 'territory', fieldtype: 'Link' }]) as any,
				undefined,
				undefined
			)
			const resolved = registry.resolveSchema(testDoctype)

			expect((resolved[0] as any).component).toBe('AFormLink')
			expect('doctype' in resolved[0]).toBe(false)
		})

		it('undeclared Link field preserves other field properties', () => {
			const testDoctype = new Doctype(
				'test',
				List([{ fieldname: 'territory', fieldtype: 'Link', label: 'Sales Territory', options: 'territory' }]) as any,
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
				{ fieldname: 'items', cardinality: 'noneOrMany', component: 'ATable' },
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
			// Resolved 1:1 link entry with no schema (target not found)
			const schema = [{ fieldname: 'address', options: 'address', component: 'AForm' }]
			const record = registry.initializeRecord(schema as any)

			// No 'schema' property and no cardinality — fieldtype defaults to 'Data' → empty string
			expect(record.address).toBe('')
		})

		it('initializes atLeastOne link entry to empty array', () => {
			const schema = [{ fieldname: 'items', cardinality: 'atLeastOne', component: 'ATable' }]
			const record = registry.initializeRecord(schema as any)

			expect(record.items).toEqual([])
		})

		it('initializes atMostOne link entry recursively when schema is provided', () => {
			const resolved = registry.resolveSchema(
				new Doctype(
					'parent',
					List([{ fieldname: 'address', fieldtype: 'Link', component: 'AForm', options: 'address' }]) as any,
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
