<template>
	<Story title="nested schema" group="aform">
		<Variant title="resolved schema" :setup-app="setupApp">
			<div>
				<h3>Registry.resolveSchema() — Automatic Nested Forms</h3>
				<ResolvedSchemaDemo />
			</div>
		</Variant>

		<Variant title="standalone (no framework)" :setup-app="setupApp">
			<div>
				<h3>Standalone — Manual Schema Embedding</h3>
				<StandaloneDemo />
			</div>
		</Variant>

		<Variant title="HST integration" :setup-app="setupApp">
			<div>
				<h3>HST + Resolved Schema</h3>
				<HSTDemo />
			</div>
		</Variant>

		<Variant title="1:many (address list)" :setup-app="setupApp">
			<div>
				<h3>1:Many — Parent Form with Child Table</h3>
				<AddressListDemo />
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { AForm } from '@stonecrop/aform'
import type { ResolvedField } from '@stonecrop/aform'
import { Doctype, type DoctypeConfig, Registry, Stonecrop } from '@stonecrop/stonecrop'
import { type App, defineComponent, ref, h, computed } from 'vue'

import addressSchemaJson from './assets/address_schema.json'
import customerSchemaJson from './assets/customer_schema.json'
import customerWithAddressesSchemaJson from './assets/customer_with_addresses_schema.json'

let registryInstance: Registry | undefined

const setupApp = ({ app }: { app: App }) => {
	registryInstance = new Registry()

	registryInstance.addDoctype(Doctype.fromObject(addressSchemaJson as DoctypeConfig))
	registryInstance.addDoctype(Doctype.fromObject(customerSchemaJson as DoctypeConfig))
	registryInstance.addDoctype(Doctype.fromObject(customerWithAddressesSchemaJson as DoctypeConfig))

	app.provide('$registry', registryInstance)
}

/**
 * Variant 1 — resolveSchema()
 *
 * The Registry walks the doctype's `links` declarations, resolves each target doctype,
 * and embeds a `schema` array on each entry. AForm just checks `'schema' in field`
 * and recurses — zero knowledge of the Registry.
 */
const ResolvedSchemaDemo = defineComponent({
	name: 'ResolvedSchemaDemo',
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

		// One call resolves the full tree — link entries get `schema` embedded
		const resolvedSchema = ref<ResolvedField[]>(registryInstance!.resolveSchema(registryInstance!.registry['customer']))

		return { resolvedSchema, customerData }
	},
	render() {
		return h('div', { class: 'nested-form-example' }, [
			h('h4', 'Customer Information'),
			h(
				'p',
				{ class: 'info-text' },
				'registry.resolveSchema() embeds the Address schema inside the resolved link entry. AForm renders it automatically.'
			),
			h(AForm, {
				schema: this.resolvedSchema,
				data: this.customerData,
			}),
			h('div', { class: 'data-preview' }, [
				h('h4', 'Resolved Schema (abbreviated):'),
				h(
					'pre',
					JSON.stringify(
						this.resolvedSchema.map((f: any) => ({
							fieldname: f.fieldname,
							component: f.component,
							...(f.schema ? { schema: `[${f.schema.length} fields]` } : {}),
						})),
						null,
						2
					)
				),
			]),
			h('div', { class: 'data-preview' }, [
				h('h4', 'Form Data:'),
				h('pre', JSON.stringify(this.customerData, null, 2)),
			]),
		])
	},
})

/**
 * Variant 2 — Standalone (no Registry)
 *
 * AForm doesn't care where the `schema` property comes from. Here we manually attach it to
 * demonstrate standalone usage without the Stonecrop framework.
 */
const StandaloneDemo = defineComponent({
	name: 'StandaloneDemo',
	setup() {
		const data = ref({
			invoice_number: 'INV-001',
			billing: {
				street: '99 Commerce Blvd',
				city: 'Austin',
				state: 'TX',
				zip_code: '73301',
			},
		})

		// Build schema by hand — no Registry required.
		// Use ResolvedField shapes directly: kind discriminates scalar ('field'), nested form ('link'), and table ('table').
		const schema = ref<ResolvedField[]>([
			{
				kind: 'field',
				fieldname: 'invoice_number',
				component: 'ATextInput',
				label: 'Invoice Number',
			},
			{
				kind: 'link',
				fieldname: 'billing',
				component: 'AForm',
				label: 'Billing Address',
				schema: [
					{ kind: 'field', fieldname: 'street', component: 'ATextInput', label: 'Street' },
					{ kind: 'field', fieldname: 'city', component: 'ATextInput', label: 'City' },
					{ kind: 'field', fieldname: 'state', component: 'ATextInput', label: 'State' },
					{ kind: 'field', fieldname: 'zip_code', component: 'ATextInput', label: 'Zip Code' },
				],
			},
		])

		return { schema, data }
	},
	render() {
		return h('div', { class: 'nested-form-example' }, [
			h('h4', 'Invoice with Billing Address'),
			h(
				'p',
				{ class: 'info-text' },
				'No Registry involved — the schema property is set manually. AForm just checks for its presence.'
			),
			h(AForm, {
				schema: this.schema,
				data: this.data,
			}),
			h('div', { class: 'data-preview' }, [h('h4', 'Form Data:'), h('pre', JSON.stringify(this.data, null, 2))]),
		])
	},
})

/**
 * Variant 3 — HST Integration
 *
 * Resolved schema passed as a single prop to one AForm instance.
 * HST manages the state tree; the form renders the full hierarchy.
 */
const HSTDemo = defineComponent({
	name: 'HSTDemo',
	setup() {
		const stonecrop = new Stonecrop(registryInstance!)
		const store = stonecrop.getStore()

		const customerId = 'cust-001'
		const initialData = {
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

		stonecrop.addRecord('customer', customerId, initialData)

		// Resolve the entire schema tree once
		const resolvedSchema = ref<ResolvedField[]>(registryInstance!.resolveSchema(registryInstance!.registry['customer']))

		const customerPath = `customer.${customerId}`

		// Single computed wrapping the full customer data (including nested address)
		const customerFormData = computed({
			get: () => {
				const data = store.get(customerPath)
				return data || {}
			},
			set: newData => {
				Object.keys(newData).forEach(key => {
					store.set(`${customerPath}.${key}`, newData[key])
				})
			},
		})

		// Computed HST state for visualization
		const hstData = computed(() => ({
			customer: store.get(customerPath),
			customerNode: {
				path: customerPath,
				exists: store.has(customerPath),
				parent: store.getNode(customerPath)?.getAncestor()?.getPath() || 'root',
				breadcrumbs: store
					.getNode(customerPath)
					?.getBreadcrumbs()
					.map((n: string) => store.getNode(n).getPath()),
			},
			address: store.get(`${customerPath}.address`),
			addressNode: {
				path: `${customerPath}.address`,
				exists: store.has(`${customerPath}.address`),
				parent: store.getNode(`${customerPath}.address`)?.getAncestor()?.getPath() || 'root',
				breadcrumbs: store
					.getNode(`${customerPath}.address`)
					?.getBreadcrumbs()
					.map((n: string) => store.getNode(n).getPath()),
			},
		}))

		const resetData = () => {
			stonecrop.addRecord('customer', customerId, initialData)
		}

		return {
			resolvedSchema,
			customerFormData,
			hstData,
			customerPath,
			resetData,
		}
	},
	render() {
		return h('div', { class: 'hst-demo' }, [
			h('p', { class: 'hst-description' }, [
				'One resolved schema, one AForm, one data object. The ',
				h('strong', 'HST'),
				' manages the tree; AForm renders the full hierarchy via the embedded schema property.',
			]),

			h('div', { class: 'hst-layout' }, [
				// Left: Single form with resolved schema
				h('div', { class: 'hst-forms' }, [
					h('div', { class: 'hst-form-section' }, [
						h('h4', 'Customer + Address (single AForm)'),
						h('div', { class: 'path-indicator' }, `HST Path: ${this.customerPath}`),
						h(AForm, {
							schema: this.resolvedSchema,
							data: this.customerFormData,
							'onUpdate:data': (val: any) => {
								this.customerFormData = val
							},
						}),
					]),

					h('button', { class: 'reset-button', onClick: this.resetData }, 'Reset Data'),
				]),

				// Right: HST State Visualization
				h('div', { class: 'hst-state' }, [
					h('h4', 'HST State Tree'),

					h('div', { class: 'hst-node-card' }, [
						h('div', { class: 'node-header' }, [
							h('span', { class: 'node-type' }, 'Customer'),
							h('span', { class: 'node-status exists' }, 'exists'),
						]),
						h('div', { class: 'node-details' }, [
							h('div', { class: 'detail-row' }, [
								h('strong', 'Path:'),
								h('code', this.hstData.customerNode?.path || ''),
							]),
							h('div', { class: 'detail-row' }, [
								h('strong', 'Breadcrumbs:'),
								h('code', (this.hstData.customerNode?.breadcrumbs || []).join(' > ') || 'None'),
							]),
						]),
						h('div', { class: 'node-data' }, [
							h('strong', 'Data:'),
							h('pre', JSON.stringify(this.hstData.customer, null, 2)),
						]),
					]),

					h('div', { class: 'hst-node-card nested' }, [
						h('div', { class: 'node-header' }, [
							h('span', { class: 'node-type' }, 'Address (nested)'),
							h(
								'span',
								{
									class: this.hstData.addressNode?.exists ? 'node-status exists' : 'node-status deleted',
								},
								this.hstData.addressNode?.exists ? 'exists' : 'deleted'
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
						]),
						h('div', { class: 'node-data' }, [
							h('strong', 'Data:'),
							h('pre', this.hstData.address ? JSON.stringify(this.hstData.address, null, 2) : '(not present)'),
						]),
					]),
				]),
			]),
		])
	},
})

/**
 * Variant 4 — 1:Many (Address List)
 *
 * A parent Customer form with scalar fields rendered normally, and a child
 * `addresses` array rendered as an ATable. The schema uses a `links` declaration
 * with `cardinality: 'noneOrMany'` and `target: 'address'` — resolveSchema auto-derives
 * columns from the Address doctype's fields and sets the component to ATable.
 */
const AddressListDemo = defineComponent({
	name: 'AddressListDemo',
	setup() {
		const customerData = ref({
			customer_name: 'Alice Johnson',
			email: 'alice@example.com',
			phone: '555-9876',
			addresses: [
				{ street: '123 Main St', city: 'Springfield', state: 'IL', zip_code: '62701' },
				{ street: '456 Oak Ave', city: 'Portland', state: 'OR', zip_code: '97205' },
				{ street: '789 Pine Rd', city: 'Austin', state: 'TX', zip_code: '73301' },
			],
		})

		// resolveSchema handles both Doctype (1:1) and Table (1:many) fields
		const resolvedSchema = ref<ResolvedField[]>(
			registryInstance!.resolveSchema(registryInstance!.registry['customer-with-addresses'])
		)

		return { resolvedSchema, customerData }
	},
	render() {
		return h('div', { class: 'nested-form-example' }, [
			h('h4', 'Customer with Multiple Addresses'),
			h(
				'p',
				{ class: 'info-text' },
				"The \"addresses\" field is declared via a `links` entry with cardinality: 'noneOrMany' and target: 'address'. " +
					'resolveSchema() auto-derives columns from the Address doctype and sets component to ATable.'
			),
			h(AForm, {
				schema: this.resolvedSchema,
				data: this.customerData,
				'onUpdate:data': (val: any) => {
					this.customerData = val
				},
			}),
			h('div', { class: 'data-preview' }, [
				h('h4', 'Resolved Schema (abbreviated):'),
				h(
					'pre',
					JSON.stringify(
						this.resolvedSchema.map((f: any) => ({
							fieldname: f.fieldname,
							...(f.component ? { component: f.component } : {}),
							...(f.columns
								? {
										columns: f.columns.map((c: any) => ({
											name: c.name,
											label: c.label,
										})),
									}
								: {}),
							...(f.config ? { config: f.config } : {}),
						})),
						null,
						2
					)
				),
			]),
			h('div', { class: 'data-preview' }, [
				h('h4', 'Form Data:'),
				h('pre', JSON.stringify(this.customerData, null, 2)),
			]),
		])
	},
})
</script>

<style scoped>
/* Shared */
.nested-form-example {
	background: #f9f9f9;
	padding: 1.5rem;
	border-radius: 8px;
	margin-bottom: 2rem;
}

.info-text {
	color: #555;
	margin-bottom: 1rem;
}

.data-preview {
	margin-top: 1.5rem;
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
	font-size: 0.85rem;
}

/* HST Demo */
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
	min-height: 400px;
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
</style>

<docs lang="md">
# Nested Schema Support

Demonstrates how `Registry.resolveSchema()` embeds child schemas on `Doctype` fields.
For 1:1 nested forms, it attaches `schema` arrays; for 1:many tables (`cardinality: 'noneOrMany'`),
it auto-derives table columns. AForm renders both patterns without knowing anything about the Registry.

## How It Works

### 1:1 (Doctype fields, default cardinality)

1. Register doctypes in the Registry
2. Call `registry.resolveSchema(schema)` — attaches `schema` arrays to Doctype fields
3. Pass the resolved schema to `<AForm>` — it checks `'schema' in field` and recurses

### 1:Many (Doctype fields with cardinality: 'noneOrMany')

1. Register parent and child doctypes in the Registry
2. Call `registry.resolveSchema(schema)` — for `links` with `cardinality: 'noneOrMany'`, auto-derives
   `columns` from the child doctype's schema, sets `component: 'ATable'` and `config: { view: 'list' }`
3. Pass the resolved schema to `<AForm>` — the child array data at `data[fieldname]`
   flows into ATable's rows via the `componentProps` fallback

AForm is a pure renderer. Resolution lives in the framework (Registry).

## Variants

### Resolved Schema

Shows `registry.resolveSchema()` for 1:1 nesting. One call, one `<AForm>`, automatic nesting.

### Standalone (no framework)

Manually attaches a `schema` array to a field. No Registry, no framework.

### HST Integration

A single resolved schema passed to one `<AForm>`, with HST managing the underlying state tree.

### 1:Many (Address List)

A parent Customer form with scalar fields + an `addresses` array rendered as ATable.
`resolveSchema()` auto-derives columns from the Address doctype. Users can override
columns, config, or component by specifying them explicitly on the schema field.

## Usage

```typescript
// 1:1 nesting (default cardinality)
const resolved = registry.resolveSchema(customerSchema)
// resolved[3].schema === [street, city, state, zip_code]

// 1:many table (cardinality: 'noneOrMany')
const resolved = registry.resolveSchema(customerWithAddressesSchema)
// resolved[3].columns === [{ name: 'street', ... }, { name: 'city', ... }, ...]
// resolved[3].component === 'ATable'

<AForm :schema="resolved" v-model:data="customerData" />
```
</docs>
