<template>
	<Story title="nested schema" group="aform">
		<Variant title="standard" :setup-app="setupApp">
			<div>
				<h3>Customer with Address</h3>
				<CustomerForm />
			</div>
		</Variant>

		<Variant title="HST integration" :setup-app="setupApp">
			<div>
				<h3>Hierarchical State Tree with Nested Forms</h3>
				<HSTDemo />
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { AForm } from '@stonecrop/aform'
import { Registry, DoctypeMeta, useNestedSchema, Stonecrop } from '@stonecrop/stonecrop'
import { List } from 'immutable'
import { type App, defineComponent, ref, h, computed } from 'vue'

import addressSchemaJson from './assets/address_schema.json'
import customerSchemaJson from './assets/customer_schema.json'

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

**Note:** This implementation supports **1:1 nested schemas only**. For managing collections of records (1:many relationships), use nested table schemas which provide proper doctype mapping and state management.

## Variants

### Manual (1:1) - Single Nested Form

Demonstrates a **one-to-one** relationship where a Customer doctype has a single embedded Address doctype.

**Key Features:**

- Pre-populated with sample customer and address data
- Uses `useNestedSchema({ doctype: 'address', registry })` to load the address schema
- Renders parent fields and nested fields separately using `AForm`
- Shows how to structure data with an embedded object (`customer.address`)

**Use Case:** When you have a parent record that contains exactly one nested record (e.g., Customer → Address, User → Profile, Invoice → Billing Info)

### Composable - Interactive API Demo

An **interactive educational demo** showing how `useNestedSchema` works under the hood.

**Key Features:**

- Demonstrates loading states and error handling
- Interactive buttons to trigger `initializeRecord()` and `initializeArray()`
- Shows single record (1:1) initialization
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

## API Reference

### useNestedSchema Options

```typescript
const {
	schema, // Ref<SchemaTypes[]> - The loaded schema
	loading, // Ref<boolean> - Loading state
	error, // Ref<string> - Error message if loading fails
	initializeRecord, // () => Record<string, any> - Create empty record
	initializeArray, // (count: number) => Record<string, any>[] - Create array (utility only)
	loadSchema, // () => Promise<void> - Manually reload schema
} = useNestedSchema({
	doctype: 'address', // Required: doctype slug to load
	registry: registryInstance, // Optional: registry for schema lookup
	schema: schemaArray, // Optional: provide schema directly
})
```

## Implementation Notes

- The composable automatically loads the schema from the registry on initialization
- `initializeRecord()` creates an empty record with default values based on the schema
- Only 1:1 nested relationships are supported for forms
- For 1:many relationships, use nested table schemas instead
- All examples use render functions (`h()`) instead of templates to avoid runtime template compilation requirements
</docs>
