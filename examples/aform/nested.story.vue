<template>
	<Story title="nested schema" group="aform">
		<Variant title="1:1" :setup-app="setupApp">
			<div>
				<h3>Customer with Address</h3>
				<CustomerForm />
			</div>
		</Variant>

		<Variant title="1:many" :setup-app="setupApp">
			<div>
				<h3>Order with Line Items</h3>
				<OrderForm />
			</div>
		</Variant>

		<Variant title="Interactive" :setup-app="setupApp">
			<div>
				<ComposableDemo />
			</div>
		</Variant>

		<Variant title="HST Integration" :setup-app="setupApp">
			<div>
				<h3>Hierarchical State Tree with Nested Forms</h3>
				<HSTDemo />
			</div>
		</Variant>

		<Variant title="HST (1:many)" :setup-app="setupApp">
			<div>
				<h3>HST with Array of Nested Forms</h3>
				<HSTArrayDemo />
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { AForm } from '@stonecrop/aform'
import { Registry, DoctypeMeta, useNestedSchema, Stonecrop } from '@stonecrop/stonecrop'
import { List } from 'immutable'
import { type App, defineComponent, ref, h, watch, computed, onMounted } from 'vue'

import addressSchemaJson from './assets/address_schema.json'
import customerSchemaJson from './assets/customer_schema.json'
import lineItemSchemaJson from './assets/line_item_schema.json'
import orderSchemaJson from './assets/order_schema.json'

let registryInstance: Registry | undefined

const setupApp = ({ app }: { app: App }) => {
	// Create Registry
	registryInstance = new Registry()

	// Register Address doctype
	const addressDoctype = new DoctypeMeta('Address', List(addressSchemaJson), undefined, undefined)
	registryInstance.addDoctype(addressDoctype)

	// Register Customer doctype
	const customerDoctype = new DoctypeMeta('Customer', List(customerSchemaJson), undefined, undefined)
	registryInstance.addDoctype(customerDoctype)

	// Register Line Item doctype
	const lineItemDoctype = new DoctypeMeta('LineItem', List(lineItemSchemaJson), undefined, undefined)
	registryInstance.addDoctype(lineItemDoctype)

	// Register Order doctype
	const orderDoctype = new DoctypeMeta('Order', List(orderSchemaJson), undefined, undefined)
	registryInstance.addDoctype(orderDoctype)

	// Provide to app
	app.provide('$registry', registryInstance)
}

// Custom component demonstrating 1:1 nested form
const CustomerForm = defineComponent({
	name: 'CustomerForm',
	setup() {
		const customerData = ref({
			customer_name: 'John Doe',
			email: 'john@example.com',
			phone: '555-0123',
			address: {
				street: '123 Main St',
				city: 'Springfield',
				state: 'IL',
				zip_code: '62701',
			},
		})

		const customerSchemaRef = ref(customerSchemaJson.filter(f => f.fieldtype !== 'Doctype'))

		// Use nested schema composable for the address field
		const { schema: addressSchema, initializeRecord } = useNestedSchema({
			doctype: 'address',
			registry: registryInstance,
		})

		return { customerSchemaRef, customerData, addressSchema, initializeRecord }
	},
	render() {
		return h('div', { class: 'nested-form-example' }, [
			h('h4', 'Customer Information'),
			h(AForm, {
				modelValue: this.customerSchemaRef,
				data: this.customerData,
			}),
			this.addressSchema
				? h('div', { class: 'nested-section' }, [
						h('h4', 'Address (Nested Schema)'),
						h(AForm, {
							modelValue: this.addressSchema,
							data: this.customerData.address,
						}),
				  ])
				: null,
			h('div', { class: 'data-preview' }, [
				h('h4', 'Data Structure:'),
				h('pre', JSON.stringify(this.customerData, null, 2)),
			]),
		])
	},
})

// Custom component demonstrating 1:many nested forms
const OrderForm = defineComponent({
	name: 'OrderForm',
	setup() {
		const orderData = ref({
			order_number: 'ORD-001',
			order_date: '2026-02-09',
			customer_name: 'Jane Smith',
			line_items: [
				{ _id: '1', product: 'Widget A', quantity: 2, price: 19.99 },
				{ _id: '2', product: 'Widget B', quantity: 1, price: 29.99 },
			],
		})

		const orderSchemaRef = ref(orderSchemaJson.filter(f => f.fieldtype !== 'Doctype'))

		// Use nested schema composable for line items
		const { schema: lineItemSchema, initializeRecord } = useNestedSchema({
			doctype: 'line-item',
			registry: registryInstance,
			isArray: true,
		})

		const addLineItem = () => {
			const newItem = { ...initializeRecord(), _id: Date.now().toString() } as any
			orderData.value.line_items.push(newItem)
		}

		const removeLineItem = (index: number) => {
			orderData.value.line_items.splice(index, 1)
		}

		return { orderSchemaRef, orderData, lineItemSchema, addLineItem, removeLineItem }
	},
	render() {
		return h('div', { class: 'nested-form-example' }, [
			h('h4', 'Order Information'),
			h(AForm, {
				modelValue: this.orderSchemaRef,
				data: this.orderData,
			}),
			this.lineItemSchema
				? h('div', { class: 'nested-array-section' }, [
						h('h4', 'Line Items (Array of Nested Schemas)'),
						...this.orderData.line_items.map((item, index) =>
							h('div', { key: item._id, class: 'array-item' }, [
								h('div', { class: 'array-item-header' }, [
									h('span', `Item ${index + 1}`),
									h(
										'button',
										{
											class: 'remove-btn',
											onClick: () => this.removeLineItem(index),
										},
										'Remove'
									),
								]),
								h(AForm, {
									modelValue: JSON.parse(JSON.stringify(this.lineItemSchema)),
									data: item,
									'onUpdate:data': (val: any) => {
										const newItems = [...this.orderData.line_items]
										newItems[index] = val
										this.orderData.line_items = newItems
									},
								}),
							])
						),
						h(
							'button',
							{
								class: 'add-btn',
								onClick: this.addLineItem,
							},
							'+ Add Line Item'
						),
				  ])
				: null,
			h('div', { class: 'data-preview' }, [
				h('h4', 'Data Structure:'),
				h('pre', JSON.stringify(this.orderData, null, 2)),
			]),
		])
	},
})

// Composable API demonstration with working example
const ComposableDemo = defineComponent({
	name: 'ComposableDemo',
	setup() {
		// Load address schema using the composable
		const {
			schema: addressSchema,
			loading: addressLoading,
			error: addressError,
			initializeRecord,
			initializeArray,
		} = useNestedSchema({
			doctype: 'address',
			registry: registryInstance,
		})

		// Initialize a single address
		const singleAddress = ref<Record<string, any>>({})
		const addressArray = ref<Record<string, any>[]>([])

		// Watch for schema to load, then initialize data
		const schemaLoaded = ref(false)
		const initializeSingleAddress = () => {
			singleAddress.value = initializeRecord()
			schemaLoaded.value = true
		}

		const initializeAddresses = () => {
			addressArray.value = initializeArray(2)
		}

		const addAddress = () => {
			addressArray.value.push(initializeRecord())
		}

		const removeAddress = (index: number) => {
			addressArray.value.splice(index, 1)
		}

		return {
			addressSchema,
			addressLoading,
			addressError,
			singleAddress,
			addressArray,
			schemaLoaded,
			initializeSingleAddress,
			initializeAddresses,
			addAddress,
			removeAddress,
		}
	},
	render() {
		return h('div', { class: 'composable-demo' }, [
			h('h4', 'Interactive Composable Demo'),
			h('p', 'This demonstrates useNestedSchema loading and initializing data in real-time.'),

			// Loading state
			this.addressLoading ? h('div', { class: 'loading' }, 'Loading schema...') : null,

			// Error state
			this.addressError ? h('div', { class: 'error' }, `Error: ${this.addressError}`) : null,

			// Schema loaded - show examples
			this.addressSchema
				? h('div', { class: 'demo-sections' }, [
						// Single record example
						h('div', { class: 'demo-section' }, [
							h('h5', 'Single Record (1:1)'),
							h('p', { class: 'demo-description' }, 'Click to initialize an empty address:'),
							!this.schemaLoaded
								? h(
										'button',
										{
											class: 'demo-btn',
											onClick: this.initializeSingleAddress,
										},
										'Initialize Single Address'
								  )
								: h('div', [
										h('div', { class: 'schema-form' }, [
											h(AForm, {
												modelValue: this.addressSchema,
												data: this.singleAddress,
											}),
										]),
										h('div', { class: 'data-preview small' }, [
											h('strong', 'Data:'),
											h('pre', JSON.stringify(this.singleAddress, null, 2)),
										]),
								  ]),
						]),

						// Array example
						h('div', { class: 'demo-section' }, [
							h('h5', 'Array of Records (1:many)'),
							h('p', { class: 'demo-description' }, 'Click to initialize multiple addresses:'),
							this.addressArray.length === 0
								? h(
										'button',
										{
											class: 'demo-btn',
											onClick: this.initializeAddresses,
										},
										'Initialize Array (2 addresses)'
								  )
								: h('div', [
										...this.addressArray.map((addr, index) =>
											h('div', { key: index, class: 'array-item-demo' }, [
												h('div', { class: 'array-item-header' }, [
													h('strong', `Address ${index + 1}`),
													h(
														'button',
														{
															class: 'remove-btn-small',
															onClick: () => this.removeAddress(index),
														},
														'×'
													),
												]),
												h(AForm, {
													modelValue: this.addressSchema,
													data: addr,
												}),
											])
										),
										h(
											'button',
											{
												class: 'add-btn-small',
												onClick: this.addAddress,
											},
											'+ Add Another Address'
										),
										h('div', { class: 'data-preview small' }, [
											h('strong', 'Array Data:'),
											h('pre', JSON.stringify(this.addressArray, null, 2)),
										]),
								  ]),
						]),

						// Code reference
						h('div', { class: 'demo-section code-reference' }, [
							h('h5', 'Code Used:'),
							h('div', { class: 'code-example' }, [
								h('pre', 'const { schema, initializeRecord, initializeArray } = useNestedSchema({'),
								h('pre', '  doctype: "address",'),
								h('pre', '  registry: registryInstance'),
								h('pre', '})'),
								h('pre', ''),
								h('pre', 'const singleAddress = initializeRecord()'),
								h('pre', 'const multipleAddresses = initializeArray(2)'),
							]),
						]),
				  ])
				: null,
		])
	},
})

// HST Integration demonstration
const HSTDemo = defineComponent({
	name: 'HSTDemo',
	setup() {
		// Create Stonecrop instance with HST
		const stonecrop = new Stonecrop(registryInstance!)
		const store = stonecrop.getStore()

		// Initialize a customer record with nested address
		const customerId = 'cust-001'
		const customerData = {
			customer_name: 'Alice Johnson',
			email: 'alice@example.com',
			phone: '555-9876',
			address: {
				street: '456 Oak Ave',
				city: 'Portland',
				state: 'OR',
				zip_code: '97205',
			},
		}

		// Add to HST
		stonecrop.addRecord('customer', customerId, customerData)

		// Load schemas
		const { schema: customerSchema } = useNestedSchema({
			doctype: 'customer',
			registry: registryInstance,
		})
		const { schema: addressSchema } = useNestedSchema({
			doctype: 'address',
			registry: registryInstance,
		})

		// HST paths
		const customerPath = `customer.${customerId}`
		const addressPath = `${customerPath}.address`

		// Computed properties with getter/setter for HST synchronization
		const customerFormData = computed({
			get: () => {
				const data = store.get(customerPath)
				return {
					customer_name: data?.customer_name || '',
					email: data?.email || '',
					phone: data?.phone || '',
				}
			},
			set: newData => {
				Object.keys(newData).forEach(key => {
					if (key !== 'address') {
						store.set(`${customerPath}.${key}`, newData[key])
					}
				})
			},
		})

		const addressFormData = computed({
			get: () => {
				const data = store.get(addressPath)
				// Return null if address doesn't exist (deleted)
				if (!data || !store.has(addressPath)) {
					return null
				}
				return {
					street: data?.street || '',
					city: data?.city || '',
					state: data?.state || '',
					zip_code: data?.zip_code || '',
				}
			},
			set: newData => {
				// Set the entire address object first
				store.set(addressPath, newData)
				// Also update the parent customer's address field
				const customerData = store.get(customerPath)
				if (customerData) {
					store.set(customerPath, { ...customerData, address: newData })
				}
			},
		})

		// Computed HST data that automatically updates when store changes
		const hstData = computed(() => ({
			customer: store.get(customerPath),
			customerNode: {
				path: customerPath,
				exists: store.has(customerPath),
				parent: store.getNode(customerPath)?.getParent()?.getPath() || 'root',
				breadcrumbs: store
					.getNode(customerPath)
					?.getBreadcrumbs()
					.map(n => store.getNode(n).getPath()),
			},
			address: store.get(addressPath),
			addressNode: {
				path: addressPath,
				exists: store.has(addressPath),
				parent: store.getNode(addressPath)?.getParent()?.getPath() || 'root',
				breadcrumbs: store
					.getNode(addressPath)
					?.getBreadcrumbs()
					.map(n => store.getNode(n).getPath()),
			},
		}))

		// HST operations
		const resetData = () => {
			const newCustomerData = {
				customer_name: 'Alice Johnson',
				email: 'alice@example.com',
				phone: '555-9876',
				address: {
					street: '456 Oak Ave',
					city: 'Portland',
					state: 'OR',
					zip_code: '97205',
				},
			}
			stonecrop.addRecord('customer', customerId, newCustomerData)
		}

		const deleteAddress = () => {
			// Get the current customer data and remove the address property
			const customerData = store.get(customerPath)
			if (customerData) {
				const { address, ...rest } = customerData
				// Set the customer without the address property in a single operation
				store.set(customerPath, rest)
			}
		}

		const restoreAddress = () => {
			const newAddress = {
				street: '456 Oak Ave',
				city: 'Portland',
				state: 'OR',
				zip_code: '97205',
			}
			store.set(addressPath, newAddress)
			// Also update the parent customer to include address
			const customerData = store.get(customerPath)
			if (customerData) {
				store.set(customerPath, { ...customerData, address: newAddress })
			}
		}

		return {
			customerSchema,
			addressSchema,
			customerFormData,
			addressFormData,
			hstData,
			customerPath,
			addressPath,
			resetData,
			deleteAddress,
			restoreAddress,
			store,
		}
	},
	render() {
		return h('div', { class: 'hst-demo' }, [
			h('p', { class: 'hst-description' }, [
				'This demonstrates how the ',
				h('strong', 'Hierarchical State Tree (HST)'),
				' manages nested data. Edit the forms below and watch the HST state update in real-time.',
			]),

			h('div', { class: 'hst-layout' }, [
				// Left: Forms
				h('div', { class: 'hst-forms' }, [
					h('div', { class: 'hst-form-section' }, [
						h('h4', 'Customer Form'),
						h('div', { class: 'path-indicator' }, `HST Path: ${this.customerPath}`),
						this.customerSchema
							? h(AForm, {
									modelValue: this.customerSchema.filter((f: any) => f.fieldtype !== 'Doctype'),
									'onUpdate:modelValue': (val: any) => {
										this.customerSchema = val
									},
									data: this.customerFormData,
									'onUpdate:data': (val: any) => {
										this.customerFormData = val
									},
							  })
							: null,
					]),

					h('div', { class: 'hst-form-section' }, [
						h('div', { class: 'section-header' }, [
							h('h4', 'Address Form (Nested)'),
							h('div', { class: 'action-buttons' }, [
								h(
									'button',
									{
										class: 'btn-danger-small',
										onClick: this.deleteAddress,
									},
									'Delete'
								),
								h(
									'button',
									{
										class: 'btn-success-small',
										onClick: this.restoreAddress,
									},
									'Restore'
								),
							]),
						]),
						h('div', { class: 'path-indicator' }, `HST Path: ${this.addressPath}`),
						this.addressSchema && this.addressFormData
							? h(AForm, {
									modelValue: this.addressSchema,
									'onUpdate:modelValue': (val: any) => {
										this.addressSchema = val
									},
									data: this.addressFormData,
									'onUpdate:data': (val: any) => {
										this.addressFormData = val
									},
							  })
							: null,
					]),

					h(
						'button',
						{
							class: 'reset-button',
							onClick: this.resetData,
						},
						'🔄 Reset All Data'
					),
				]),

				// Right: HST State Visualization
				h('div', { class: 'hst-state' }, [
					h('h4', 'HST State Tree'),

					// Customer node info
					h('div', { class: 'hst-node-card' }, [
						h('div', { class: 'node-header' }, [
							h('span', { class: 'node-type' }, '📦 Customer'),
							h('span', { class: 'node-status exists' }, '✓ Exists'),
						]),
						h('div', { class: 'node-details' }, [
							h('div', { class: 'detail-row' }, [
								h('strong', 'Path:'),
								h('code', this.hstData.customerNode?.path || ''),
							]),
							h('div', { class: 'detail-row' }, [
								h('strong', 'Parent:'),
								h('code', this.hstData.customerNode?.parent || ''),
							]),
							h('div', { class: 'detail-row' }, [
								h('strong', 'Breadcrumbs:'),
								h('code', (this.hstData.customerNode?.breadcrumbs || []).join(' → ') || 'None'),
							]),
						]),
						h('div', { class: 'node-data' }, [
							h('strong', 'Data:'),
							h('pre', JSON.stringify(this.hstData.customer, null, 2)),
						]),
					]),

					// Address node info
					h('div', { class: 'hst-node-card nested' }, [
						h('div', { class: 'node-header' }, [
							h('span', { class: 'node-type' }, '📍 Address (Nested)'),
							h(
								'span',
								{
									class: this.hstData.addressNode?.exists ? 'node-status exists' : 'node-status deleted',
								},
								this.hstData.addressNode?.exists ? '✓ Exists' : '✗ Deleted'
							),
						]),
						h('div', { class: 'node-details' }, [
							h('div', { class: 'detail-row' }, [
								h('strong', 'Path:'),
								h('code', this.hstData.addressNode?.path || ''),
							]),
							h('div', { class: 'detail-row' }, [
								h('strong', 'Parent:'),
								h('code', this.hstData.addressNode?.parent || ''),
							]),
							h('div', { class: 'detail-row' }, [
								h('strong', 'Breadcrumbs:'),
								h('code', (this.hstData.addressNode?.breadcrumbs || []).join(' → ') || 'None'),
							]),
						]),
						h('div', { class: 'node-data' }, [
							h('strong', 'Data:'),
							h('pre', this.hstData.address ? JSON.stringify(this.hstData.address, null, 2) : '(deleted)'),
						]),
					]),

					// HST Methods demo
					h('div', { class: 'hst-methods-info' }, [
						h('h5', '🔧 HST Methods Used:'),
						h('ul', [
							h('li', [h('code', 'store.get(path)'), ' - Get data at path']),
							h('li', [h('code', 'store.set(path, value)'), ' - Set data at path']),
							h('li', [h('code', 'store.has(path)'), ' - Check if path exists']),
							h('li', [h('code', 'store.delete(path)'), ' - Delete node at path']),
							h('li', [h('code', 'store.getNode(path)'), ' - Get HST node object']),
							h('li', [h('code', 'node.getParent()'), ' - Get parent node']),
							h('li', [h('code', 'node.getBreadcrumbs()'), ' - Get path ancestry']),
						]),
					]),
				]),
			]),
		])
	},
})

// HST Integration for 1:many (array) - Orders with Line Items
const HSTArrayDemo = defineComponent({
	name: 'HSTArrayDemo',
	setup() {
		// Create Stonecrop instance with HST
		const stonecrop = new Stonecrop(registryInstance!)
		const store = stonecrop.getStore()

		// Initialize an order record with line items
		const orderId = 'ord-001'
		const orderData = {
			order_number: 'ORD-2026-001',
			order_date: '2026-02-09',
			customer_name: 'Bob Smith',
			line_items: [
				{ _id: '1', product: 'Widget A', quantity: 2, price: 19.99 },
				{ _id: '2', product: 'Widget B', quantity: 1, price: 29.99 },
			],
		}

		// Add to HST
		stonecrop.addRecord('order', orderId, orderData)

		// Load schemas
		const { schema: orderSchema } = useNestedSchema({
			doctype: 'order',
			registry: registryInstance,
		})
		const { schema: lineItemSchema, initializeRecord } = useNestedSchema({
			doctype: 'line-item',
			registry: registryInstance,
			isArray: true,
		})

		// HST paths
		const orderPath = `order.${orderId}`
		const lineItemsPath = `${orderPath}.line_items`

		// Computed properties with getter/setter for HST synchronization
		const orderFormData = computed({
			get: () => {
				const data = store.get(orderPath)
				return {
					order_number: data?.order_number || '',
					order_date: data?.order_date || '',
					customer_name: data?.customer_name || '',
				}
			},
			set: newData => {
				Object.keys(newData).forEach(key => {
					if (key !== 'line_items') {
						store.set(`${orderPath}.${key}`, newData[key])
					}
				})
			},
		})

		const lineItemsFormData = computed({
			get: () => {
				const items = store.get(lineItemsPath) || []
				return Array.isArray(items) ? items : []
			},
			set: newData => {
				store.set(lineItemsPath, newData)
			},
		})

		// Computed HST data that automatically updates when store changes
		const hstData = computed(() => {
			const lineItems = store.get(lineItemsPath) || []
			return {
				order: store.get(orderPath),
				orderNode: {
					path: orderPath,
					exists: store.has(orderPath),
					parent: store.getNode(orderPath)?.getParent()?.getPath() || 'root',
					breadcrumbs: store
						.getNode(orderPath)
						?.getBreadcrumbs()
						.map(n => store.getNode(n).getPath()),
				},
				lineItems,
				lineItemNodes: lineItems.map((_: any, index: number) => {
					const itemPath = `${lineItemsPath}[${index}]`
					return {
						path: itemPath,
						exists: store.has(itemPath),
						parent: store.getNode(itemPath)?.getParent()?.getPath() || 'root',
						breadcrumbs: store
							.getNode(itemPath)
							?.getBreadcrumbs()
							.map(n => store.getNode(n).getPath()),
					}
				}),
			}
		})

		// HST operations
		const resetData = () => {
			const newOrderData = {
				order_number: 'ORD-2026-001',
				order_date: '2026-02-09',
				customer_name: 'Bob Smith',
				line_items: [
					{ _id: '1', product: 'Widget A', quantity: 2, price: 19.99 },
					{ _id: '2', product: 'Widget B', quantity: 1, price: 29.99 },
				],
			}
			stonecrop.addRecord('order', orderId, newOrderData)
		}

		const addLineItem = () => {
			const newItem = { ...initializeRecord(), _id: Date.now().toString() } as any
			const currentItems = lineItemsFormData.value
			lineItemsFormData.value = [...currentItems, newItem]
		}

		const removeLineItem = (index: number) => {
			const currentItems = lineItemsFormData.value
			lineItemsFormData.value = currentItems.filter((_, i) => i !== index)
		}

		return {
			orderSchema,
			lineItemSchema,
			orderFormData,
			lineItemsFormData,
			hstData,
			orderPath,
			lineItemsPath,
			resetData,
			addLineItem,
			removeLineItem,
			store,
		}
	},
	render() {
		return h('div', { class: 'hst-demo' }, [
			h('p', { class: 'hst-description' }, [
				'This demonstrates HST managing ',
				h('strong', 'arrays of nested data'),
				'. Add/remove line items and edit forms to see HST array paths update in real-time.',
			]),

			h('div', { class: 'hst-layout' }, [
				// Left: Forms
				h('div', { class: 'hst-forms' }, [
					h('div', { class: 'hst-form-section' }, [
						h('h4', 'Order Form'),
						h('div', { class: 'path-indicator' }, `HST Path: ${this.orderPath}`),
						this.orderSchema
							? h(AForm, {
									modelValue: this.orderSchema.filter((f: any) => f.fieldtype !== 'Doctype'),
									'onUpdate:modelValue': (val: any) => {
										this.orderSchema = val
									},
									data: this.orderFormData,
									'onUpdate:data': (val: any) => {
										this.orderFormData = val
									},
							  })
							: null,
					]),

					h('div', { class: 'hst-form-section' }, [
						h('h4', 'Line Items (Array)'),
						h('div', { class: 'path-indicator' }, `HST Path: ${this.lineItemsPath}`),

						// Render each line item
						...this.lineItemsFormData.map((item: any, index: number) =>
							h('div', { key: item._id || index, class: 'array-item-hst' }, [
								h('div', { class: 'array-item-header' }, [
									h('span', [h('strong', `Item ${index + 1}`), h('code', { class: 'path-badge' }, `[${index}]`)]),
									h(
										'button',
										{
											class: 'btn-danger-small',
											onClick: () => this.removeLineItem(index),
										},
										'Remove'
									),
								]),
								this.lineItemSchema
									? h(AForm, {
											key: `line-item-hst-${item._id || index}-${item.product || ''}-${item.quantity || 0}-${
												item.price || 0
											}`,
											modelValue: JSON.parse(JSON.stringify(this.lineItemSchema)),
											data: { ...this.lineItemsFormData[index] },
											'onUpdate:data': (val: any) => {
												const currentItems = this.lineItemsFormData.map((item: any, i: number) =>
													i === index ? { ...val } : item
												)
												this.lineItemsFormData = currentItems
											},
									  })
									: null,
							])
						),

						h(
							'button',
							{
								class: 'add-btn-small',
								onClick: this.addLineItem,
							},
							'+ Add Line Item'
						),
					]),

					h(
						'button',
						{
							class: 'reset-button',
							onClick: this.resetData,
						},
						'🔄 Reset All Data'
					),
				]),

				// Right: HST State Visualization
				h('div', { class: 'hst-state' }, [
					h('h4', 'HST State Tree'),

					// Order node info
					h('div', { class: 'hst-node-card' }, [
						h('div', { class: 'node-header' }, [
							h('span', { class: 'node-type' }, '📦 Order'),
							h('span', { class: 'node-status exists' }, '✓ Exists'),
						]),
						h('div', { class: 'node-details' }, [
							h('div', { class: 'detail-row' }, [h('strong', 'Path:'), h('code', this.hstData.orderNode?.path || '')]),
							h('div', { class: 'detail-row' }, [
								h('strong', 'Parent:'),
								h('code', this.hstData.orderNode?.parent || ''),
							]),
						]),
						h('div', { class: 'node-data' }, [
							h('strong', 'Data (excluding line_items):'),
							h(
								'pre',
								JSON.stringify(
									{
										order_number: this.hstData.order?.order_number,
										order_date: this.hstData.order?.order_date,
										customer_name: this.hstData.order?.customer_name,
									},
									null,
									2
								)
							),
						]),
					]),

					// Line items array node
					h('div', { class: 'hst-node-card nested' }, [
						h('div', { class: 'node-header' }, [
							h('span', { class: 'node-type' }, '📋 Line Items Array'),
							h('span', { class: 'node-status exists' }, `✓ ${this.hstData.lineItems?.length || 0} items`),
						]),
						h('div', { class: 'node-details' }, [
							h('div', { class: 'detail-row' }, [h('strong', 'Path:'), h('code', this.lineItemsPath)]),
						]),

						// Individual line item nodes
						...(this.hstData.lineItemNodes || []).map((node: any, index: number) =>
							h('div', { key: index, class: 'array-node-item' }, [
								h('div', { class: 'array-node-header' }, [
									h('span', { class: 'node-type-small' }, `Item [${index}]`),
									h('span', { class: 'node-status-small exists' }, '✓'),
								]),
								h('div', { class: 'node-details-compact' }, [
									h('div', { class: 'detail-row' }, [
										h('strong', 'Path:'),
										h('code', { class: 'small-code' }, node.path || ''),
									]),
								]),
								h('div', { class: 'node-data-compact' }, [
									h('pre', JSON.stringify(this.hstData.lineItems[index], null, 2)),
								]),
							])
						),
					]),

					// HST Methods demo
					h('div', { class: 'hst-methods-info' }, [
						h('h5', '🔧 HST Array Methods:'),
						h('ul', [
							h('li', [h('code', 'store.get("path.items")'), ' - Get entire array']),
							h('li', [h('code', 'store.set("path.items", array)'), ' - Replace array']),
							h('li', [h('code', 'store.get("path.items[0]")'), ' - Get array item']),
							h('li', [h('code', 'store.set("path.items[0].field", value)'), ' - Update item field']),
							h('li', [h('code', 'store.getNode("path.items[0]")'), ' - Navigate to array item']),
						]),
					]),
				]),
			]),
		])
	},
})
</script>

<style scoped>
.nested-form-example {
	background: #f9f9f9;
	padding: 1.5rem;
	border-radius: 8px;
	margin-bottom: 2rem;
}

.nested-section {
	margin-top: 2rem;
	padding: 1rem;
	background: white;
	border-left: 4px solid #4a90e2;
	border-radius: 4px;
}

.nested-array-section {
	margin-top: 2rem;
}

.array-item {
	background: white;
	padding: 1rem;
	margin-bottom: 1rem;
	border-radius: 4px;
	border: 1px solid #e0e0e0;
}

.array-item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
	padding-bottom: 0.5rem;
	border-bottom: 2px solid #f0f0f0;
	font-weight: 600;
}

.remove-btn {
	background: #e74c3c;
	color: white;
	border: none;
	padding: 0.4rem 0.8rem;
	border-radius: 4px;
	cursor: pointer;
	font-size: 0.9rem;
}

.remove-btn:hover {
	background: #c0392b;
}

.add-btn {
	background: #27ae60;
	color: white;
	border: none;
	padding: 0.6rem 1.2rem;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1rem;
	width: 100%;
	margin-top: 1rem;
}

.add-btn:hover {
	background: #229954;
}

.data-preview {
	margin-top: 2rem;
	padding: 1rem;
	background: #2c3e50;
	color: #ecf0f1;
	border-radius: 4px;
}

.data-preview h4 {
	margin-top: 0;
	color: #3498db;
}

.data-preview pre {
	overflow-x: auto;
	margin: 0;
	color: #ecf0f1;
}

.composable-demo {
	padding: 1.5rem;
	background: #f9f9f9;
	border-radius: 8px;
}

.demo-sections {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	margin-top: 1rem;
}

.demo-section {
	background: white;
	padding: 1.5rem;
	border-radius: 8px;
	border: 1px solid #e0e0e0;
}

.demo-section h5 {
	margin-top: 0;
	color: #2c3e50;
	border-bottom: 2px solid #3498db;
	padding-bottom: 0.5rem;
}

.demo-description {
	color: #666;
	margin-bottom: 1rem;
}

.demo-btn {
	background: #3498db;
	color: white;
	border: none;
	padding: 0.75rem 1.5rem;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1rem;
	font-weight: 500;
	transition: background 0.2s;
}

.demo-btn:hover {
	background: #2980b9;
}

.schema-form {
	background: #fafafa;
	padding: 1rem;
	border-radius: 4px;
	margin: 1rem 0;
}

.array-item-demo {
	background: #fafafa;
	padding: 1rem;
	margin-bottom: 1rem;
	border-radius: 4px;
	border: 1px solid #ddd;
}

.array-item-demo .array-item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
	padding-bottom: 0.5rem;
	border-bottom: 2px solid #e0e0e0;
}

.remove-btn-small {
	background: #e74c3c;
	color: white;
	border: none;
	padding: 0.25rem 0.75rem;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1.2rem;
	font-weight: bold;
	line-height: 1;
}

.remove-btn-small:hover {
	background: #c0392b;
}

.add-btn-small {
	background: #27ae60;
	color: white;
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 4px;
	cursor: pointer;
	font-size: 0.9rem;
	margin-top: 0.5rem;
}

.add-btn-small:hover {
	background: #229954;
}

.data-preview.small {
	margin-top: 1rem;
	padding: 0.75rem;
	font-size: 0.85rem;
}

.data-preview.small strong {
	display: block;
	margin-bottom: 0.5rem;
	color: #3498db;
}

.data-preview.small pre {
	font-size: 0.8rem;
	max-height: 200px;
	overflow-y: auto;
}

.code-reference {
	background: #2c3e50;
	color: white;
}

.code-reference h5 {
	color: white;
	border-bottom-color: #3498db;
}

.loading {
	padding: 1rem;
	text-align: center;
	color: #3498db;
	font-weight: 500;
}

.error {
	padding: 1rem;
	background: #ffe6e6;
	color: #c0392b;
	border-radius: 4px;
	margin: 1rem 0;
}

.code-example {
	background: #2c3e50;
	color: #ecf0f1;
	padding: 1rem;
	border-radius: 4px;
	margin: 1rem 0;
	overflow-x: auto;
}

.code-example pre {
	margin: 0;
	font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
	font-size: 0.9rem;
	line-height: 1.5;
}

.composable-demo ul {
	list-style: none;
	padding-left: 0;
}

.composable-demo li {
	padding: 0.5rem 0;
	padding-left: 1.5rem;
	position: relative;
}

.composable-demo li::before {
	content: '✓';
	position: absolute;
	left: 0;
	color: #27ae60;
	font-weight: bold;
}

/* HST Demo Styles */
.hst-demo {
	background: #f9f9f9;
	padding: 1.5rem;
	border-radius: 8px;
}

.hst-description {
	background: #e8f4f8;
	padding: 1rem;
	border-left: 4px solid #3498db;
	border-radius: 4px;
	margin-bottom: 1.5rem;
	color: #2c3e50;
}

.hst-layout {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
	min-height: 600px;
}

.hst-forms {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.hst-form-section {
	background: white;
	padding: 1.5rem;
	border-radius: 8px;
	border: 1px solid #e0e0e0;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.5rem;
}

.section-header h4 {
	margin: 0;
}

.action-buttons {
	display: flex;
	gap: 0.5rem;
}

.btn-danger-small,
.btn-success-small {
	padding: 0.4rem 0.8rem;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 0.85rem;
	font-weight: 500;
	transition: background 0.2s;
}

.btn-danger-small {
	background: #e74c3c;
	color: white;
}

.btn-danger-small:hover {
	background: #c0392b;
}

.btn-success-small {
	background: #27ae60;
	color: white;
}

.btn-success-small:hover {
	background: #229954;
}

.hst-form-section h4 {
	margin-top: 0;
	color: #2c3e50;
	border-bottom: 2px solid #3498db;
	padding-bottom: 0.5rem;
	margin-bottom: 1rem;
}

.path-indicator {
	background: #2c3e50;
	color: #ecf0f1;
	padding: 0.5rem 0.75rem;
	border-radius: 4px;
	font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
	font-size: 0.85rem;
	margin-bottom: 1rem;
}

.reset-button {
	background: #9b59b6;
	color: white;
	border: none;
	padding: 0.75rem 1.5rem;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1rem;
	font-weight: 500;
	width: 100%;
	transition: background 0.2s;
}

.reset-button:hover {
	background: #8e44ad;
}

.hst-state {
	background: white;
	padding: 1.5rem;
	border-radius: 8px;
	border: 2px solid #3498db;
	overflow-y: auto;
	max-height: 800px;
}

.hst-state h4 {
	margin-top: 0;
	color: #2c3e50;
	border-bottom: 2px solid #3498db;
	padding-bottom: 0.5rem;
	margin-bottom: 1rem;
}

.hst-node-card {
	background: #f8f9fa;
	border: 2px solid #3498db;
	border-radius: 8px;
	padding: 1rem;
	margin-bottom: 1.5rem;
}

.hst-node-card.nested {
	border-left: 4px solid #e67e22;
	margin-left: 1rem;
}

.node-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
	padding-bottom: 0.75rem;
	border-bottom: 2px solid #e0e0e0;
}

.node-type {
	font-weight: bold;
	font-size: 1.1rem;
	color: #2c3e50;
}

.node-status {
	padding: 0.25rem 0.75rem;
	border-radius: 12px;
	font-size: 0.85rem;
	font-weight: 600;
}

.node-status.exists {
	background: #d4edda;
	color: #155724;
}

.node-status.deleted {
	background: #f8d7da;
	color: #721c24;
}

.node-details {
	background: white;
	padding: 0.75rem;
	border-radius: 4px;
	margin-bottom: 0.75rem;
}

.detail-row {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 0.5rem;
	align-items: baseline;
}

.detail-row:last-child {
	margin-bottom: 0;
}

.detail-row strong {
	min-width: 100px;
	color: #555;
	font-size: 0.9rem;
}

.detail-row code {
	background: #2c3e50;
	color: #ecf0f1;
	padding: 0.25rem 0.5rem;
	border-radius: 3px;
	font-size: 0.85rem;
	font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
	flex: 1;
	word-break: break-all;
}

.node-data {
	background: #2c3e50;
	color: #ecf0f1;
	padding: 0.75rem;
	border-radius: 4px;
	font-size: 0.85rem;
}

.node-data strong {
	display: block;
	color: #3498db;
	margin-bottom: 0.5rem;
}

.node-data pre {
	margin: 0;
	font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
	font-size: 0.85rem;
	line-height: 1.4;
	white-space: pre-wrap;
	word-break: break-all;
	color: #ecf0f1;
}

.hst-methods-info {
	background: #e8f4f8;
	padding: 1rem;
	border-radius: 4px;
	border-left: 4px solid #3498db;
}

.hst-methods-info h5 {
	margin-top: 0;
	color: #2c3e50;
}

.hst-methods-info ul {
	list-style: none;
	padding-left: 0;
	margin: 0;
}

.hst-methods-info li {
	padding: 0.4rem 0;
	color: #555;
}

.hst-methods-info code {
	background: #2c3e50;
	color: #3498db;
	padding: 0.2rem 0.5rem;
	border-radius: 3px;
	font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
	font-size: 0.85rem;
	font-weight: 600;
}

/* Array item styles for HST demo */
.array-item-hst {
	background: #f8f9fa;
	padding: 1rem;
	margin-bottom: 1rem;
	border-radius: 4px;
	border-left: 3px solid #3498db;
}

.array-item-hst .array-item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
	padding-bottom: 0.5rem;
	border-bottom: 2px solid #e0e0e0;
}

.path-badge {
	display: inline-block;
	background: #3498db;
	color: white;
	padding: 0.15rem 0.5rem;
	border-radius: 3px;
	font-size: 0.85rem;
	margin-left: 0.5rem;
	font-weight: normal;
}

/* Array node visualization in HST state */
.array-node-item {
	background: #ffffff;
	border: 1px solid #bdc3c7;
	border-radius: 4px;
	padding: 0.75rem;
	margin-top: 0.75rem;
	margin-left: 1rem;
}

.array-node-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 0.5rem;
	border-bottom: 1px solid #e0e0e0;
	margin-bottom: 0.5rem;
}

.node-type-small {
	font-weight: 600;
	font-size: 0.9rem;
	color: #2c3e50;
}

.node-status-small {
	padding: 0.15rem 0.5rem;
	border-radius: 8px;
	font-size: 0.75rem;
	font-weight: 600;
}

.node-status-small.exists {
	background: #d4edda;
	color: #155724;
}

.node-details-compact {
	background: #f8f9fa;
	padding: 0.5rem;
	border-radius: 3px;
	margin-bottom: 0.5rem;
}

.node-details-compact .detail-row {
	margin-bottom: 0;
}

.node-details-compact .small-code {
	font-size: 0.75rem;
	padding: 0.15rem 0.4rem;
}

.node-data-compact {
	background: #2c3e50;
	color: #ecf0f1;
	padding: 0.5rem;
	border-radius: 3px;
	font-size: 0.8rem;
}

.node-data-compact pre {
	margin: 0;
	font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
	font-size: 0.75rem;
	line-height: 1.3;
	white-space: pre-wrap;
	word-break: break-all;
	color: #ecf0f1;
}
</style>

<docs lang="md">
# Nested Schema Support

This story demonstrates how to use the `useNestedSchema` composable from `@stonecrop/stonecrop` to work with nested doctypes in forms.

## Variants

### Manual (1:1) - Single Nested Form

Demonstrates a **one-to-one** relationship where a Customer doctype has a single embedded Address doctype.

**Key Features:**

- Pre-populated with sample customer and address data
- Uses `useNestedSchema({ doctype: 'address', registry })` to load the address schema
- Renders parent fields and nested fields separately using `AForm`
- Shows how to structure data with an embedded object (`customer.address`)

**Use Case:** When you have a parent record that contains exactly one nested record (e.g., Customer → Address, User → Profile, Invoice → Billing Info)

### Manual (1:many) - Array of Nested Forms

Demonstrates a **one-to-many** relationship where an Order doctype contains multiple Line Item doctypes.

**Key Features:**

- Pre-populated with sample order and 2 line items
- Uses `useNestedSchema({ doctype: 'line-item', registry, isArray: true })`
- Implements add/remove functionality for line items
- Shows how to structure data with an array of nested objects (`order.line_items[]`)
- Dynamically creates forms for each array item

**Use Case:** When you have a parent record that can contain multiple nested records (e.g., Order → Line Items, Invoice → Invoice Items, Survey → Questions)

### Composable - Interactive API Demo

An **interactive educational demo** showing how `useNestedSchema` works under the hood.

**Key Features:**

- Demonstrates loading states and error handling
- Interactive buttons to trigger `initializeRecord()` and `initializeArray()`
- Shows both single record (1:1) and array (1:many) initialization
- Live JSON preview of data structure
- Code examples showing API usage

**Use Case:** Reference for developers learning how to use the composable, understanding the API surface, and seeing the composable's reactive behavior

### HST Integration - State Management Demo

Demonstrates how the **Hierarchical State Tree (HST)** manages nested data with **real-time state visualization**.

**Key Features:**

- Creates a Stonecrop instance with HST store
- Two-way binding between forms and HST paths (`customer.cust-001`, `customer.cust-001.address`)
- Real-time visualization of HST node structure
- Interactive HST operations: delete/restore nested nodes
- Shows HST navigation methods: `getNode()`, `getParent()`, `getBreadcrumbs()`
- Path-based data access with dot notation
- Live preview of HST state changes

**Use Case:** Understanding how HST manages hierarchical data, debugging state issues, learning path-based state management patterns, and seeing the relationship between forms and the underlying state tree

### HST (1:many) - Array State Management Demo

Demonstrates how the **Hierarchical State Tree (HST)** manages **arrays of nested data** with **real-time array visualization**.

**Key Features:**

- HST managing one-to-many relationships (Order → Line Items array)
- Array path notation: `order.ord-001.line_items[0]`, `order.ord-001.line_items[1]`
- Add/remove array items and watch HST update in real-time
- Individual HST nodes for each array element
- Shows how arrays are stored and traversed in the HST
- Path-based array operations: `store.set("path.items[0].field", value)`
- Live visualization of array structure in HST

**Use Case:** Understanding HST array management, debugging array state issues, learning how to work with collections in HST, and seeing how add/remove operations affect the state tree

## API Reference

### useNestedSchema Options

```typescript
const {
	schema, // Ref<SchemaTypes[]> - The loaded schema
	loading, // Ref<boolean> - Loading state
	error, // Ref<string> - Error message if loading fails
	initializeRecord, // () => Record<string, any> - Create empty record
	initializeArray, // (count: number) => Record<string, any>[] - Create array
	loadSchema, // () => Promise<void> - Manually reload schema
} = useNestedSchema({
	doctype: 'address', // Required: doctype slug to load
	registry: registryInstance, // Optional: registry for schema lookup
	schema: schemaArray, // Optional: provide schema directly
	isArray: false, // Optional: whether this is 1:many (default: false)
})
```

## Implementation Notes

- The composable automatically loads the schema from the registry on initialization
- `initializeRecord()` creates an empty record with default values based on the schema
- The `isArray` option is primarily for documentation - the composable works the same way for both 1:1 and 1:many
- All examples use render functions (`h()`) instead of templates to avoid runtime template compilation requirements
</docs>
