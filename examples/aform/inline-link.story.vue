<template>
	<Story title="inline link" group="aform">
		<Variant title="modes" :setup-app="navigatorSetup">
			<div class="link-grid">
				<div class="link-section">
					<h4>Edit — with value</h4>
					<AFormLink label="Territory" :modelValue="selectedValue" doctype="territory" />
				</div>
				<div class="link-section">
					<h4>Edit — empty</h4>
					<AFormLink label="Territory" :modelValue="emptyValue" doctype="territory" />
				</div>
				<div class="link-section">
					<h4>Read</h4>
					<AFormLink label="Territory" :modelValue="selectedValue" doctype="territory" mode="read" />
				</div>
				<div class="link-section">
					<h4>Display</h4>
					<AFormLink label="Territory" :modelValue="selectedValue" doctype="territory" mode="display" />
				</div>
				<div class="link-section">
					<h4>Disabled</h4>
					<AFormLink label="Territory" :modelValue="selectedValue" doctype="territory" :disabled="true" />
				</div>
			</div>
		</Variant>

		<Variant title="filter function" :setup-app="navigatorSetup">
			<div class="link-section wide">
				<h4>Sync filter</h4>
				<AFormLink label="Territory" v-model="syncValue" doctype="territory" :filterFunction="syncFilter" />
				<p class="data-note">
					Selected: <code>{{ JSON.stringify(syncValue) }}</code>
				</p>
			</div>
			<div class="link-section wide">
				<h4>Async filter (750ms delay)</h4>
				<AFormLink
					label="Customer"
					v-model="asyncValue"
					doctype="customer"
					:filterFunction="asyncFilter"
					:isAsync="true" />
				<p class="data-note">
					Selected: <code>{{ JSON.stringify(asyncValue) }}</code>
				</p>
			</div>
		</Variant>

		<Variant title="via resolveSchema" :setup-app="navigatorSetup">
			<div class="link-section wide">
				<h4>Sales Order — undeclared Link resolved to AFormLink</h4>
				<p class="info-text">
					The <code>territory</code> field carries a <code>doctype: 'territory'</code> marker but no entry in
					<code>links</code> and no <code>component</code>. <code>resolveSchema()</code> assigns
					<code>component: 'AFormLink'</code> automatically.
				</p>
				<AForm :schema="resolvedSchema" v-model:data="formData" />
				<div class="data-preview">
					<h4>Resolved schema:</h4>
					<pre>{{
						JSON.stringify(
							resolvedSchema.map(f => ({
								fieldname: f.fieldname,
								component: f.component,
								doctype: (f as any).doctype,
							})),
							null,
							2
						)
					}}</pre>
					<h4>Form data:</h4>
					<pre>{{ JSON.stringify(formData, null, 2) }}</pre>
				</div>
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { AForm, AFormLink, type AFormLinkNavigator, type AFormLinkValue } from '@stonecrop/aform'
import { Doctype, Registry, type DoctypeConfig } from '@stonecrop/stonecrop'
import { type App, ref } from 'vue'

// --- Navigator ---

const navigatorSetup = ({ app }: { app: App }) => {
	app.provide('aformLinkNavigator', {
		navigate(doctype: string, id: string | number) {
			alert(`Navigate to ${doctype}/${id}`)
		},
	} satisfies AFormLinkNavigator)
}

// --- Mode variant data ---

const selectedValue = ref<AFormLinkValue>({ id: 'TERR-001', displayText: 'North America' })
const emptyValue = ref<AFormLinkValue>({ id: '' })

// --- Filter function variant ---

const territories: AFormLinkValue[] = [
	{ id: 'TERR-001', displayText: 'North America' },
	{ id: 'TERR-002', displayText: 'Europe' },
	{ id: 'TERR-003', displayText: 'Asia Pacific' },
	{ id: 'TERR-004', displayText: 'Latin America' },
	{ id: 'TERR-005', displayText: 'Middle East & Africa' },
]

const customers: AFormLinkValue[] = [
	{ id: 'CUST-001', displayText: 'Acme Corp' },
	{ id: 'CUST-002', displayText: 'Globex Corp' },
	{ id: 'CUST-003', displayText: 'Initech' },
	{ id: 'CUST-004', displayText: 'Umbrella Corp' },
]

const syncValue = ref<AFormLinkValue>({ id: '' })
const asyncValue = ref<AFormLinkValue>({ id: '' })

function syncFilter(search: string): AFormLinkValue[] {
	return territories.filter(t => t.displayText!.toLowerCase().includes(search.toLowerCase()))
}

async function asyncFilter(search: string): Promise<AFormLinkValue[]> {
	await new Promise(resolve => setTimeout(resolve, 750))
	return customers.filter(c => c.displayText!.toLowerCase().includes(search.toLowerCase()))
}

// --- resolveSchema variant ---

const salesOrderConfig: DoctypeConfig = {
	name: 'Sales Order',
	slug: 'sales-order',
	fields: [
		{ fieldname: 'order_number', component: 'ATextInput', label: 'Order Number' },
		{ fieldname: 'customer', component: 'ATextInput', label: 'Customer Name' },
		{ fieldname: 'territory', doctype: 'territory', label: 'Territory' },
	],
}

const registry = new Registry()
registry.addDoctype(Doctype.fromObject(salesOrderConfig))

const resolvedSchema = ref(registry.resolveSchema(registry.registry['sales-order']))
const formData = ref<Record<string, any>>({
	order_number: 'SO-00001',
	customer: 'Acme Corp',
	territory: { id: '', displayText: '' },
})
</script>

<style scoped>
.link-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;
	padding: 1rem;
}

.link-section {
	min-width: 220px;
	flex: 1;
}

.link-section.wide {
	min-width: 400px;
	flex: 1;
	padding: 1rem;
}

.link-section h4 {
	margin: 0 0 0.5rem;
	color: var(--sc-input-label-color);
	font-size: 0.85rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.info-text {
	color: var(--sc-input-label-color);
	margin-bottom: 1rem;
	font-size: 0.9rem;
}

.data-note {
	margin-top: 0.5rem;
	font-size: 0.85rem;
	color: var(--sc-input-label-color);
}

.data-preview {
	margin-top: 1.5rem;
	padding: 1rem;
	background: var(--sc-color-brand);
	color: var(--sc-page-background);
}

.data-preview h4 {
	margin-top: 0.75rem;
	margin-bottom: 0.25rem;
	color: var(--sc-primary-color);
	font-size: 0.85rem;
}

.data-preview h4:first-child {
	margin-top: 0;
}

.data-preview pre {
	margin: 0 0 0.5rem;
	font-size: 0.8rem;
	overflow-x: auto;
}
</style>

<docs lang="md">
# AFormLink

A form input for selecting and navigating to linked documents. Handles display, search/selection via a dropdown, and navigation to the linked record.

## Modes

| Mode      | Input    | Arrow               | Dropdown            |
| --------- | -------- | ------------------- | ------------------- |
| `edit`    | Enabled  | Visible (if has id) | Opens on focus/type |
| `read`    | Disabled | Visible (if has id) | Never opens         |
| `display` | Hidden   | Hidden              | —                   |

## Value shape — `AFormLinkValue`

```typescript
interface AFormLinkValue {
	id: string | number // the linked record's ID; id: 0 is valid
	displayText?: string // shown in the input; falls back to String(id)
	[extra: string]: any // extra fields available to formatter
}
```

When `id` is falsy (`''`, `null`, `undefined`), the component shows a `—` placeholder and hides the navigation arrow.

## Props

```typescript
{
  modelValue: AFormLinkValue
  label?: string
  doctype?: string          // target doctype slug for navigation
  filterFunction?: (search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>
  isAsync?: boolean         // show loading state while filterFunction resolves
  formatter?: (value: AFormLinkValue) => string  // custom display text transform
  icon?: 'arrow-right' | 'chevron-right'
  disabled?: boolean
  mode?: 'edit' | 'read' | 'display'
}
```

## Filter function

Provide `filterFunction` to enable the search dropdown. The function receives the current input text and returns matching `AFormLinkValue[]`. For async lookups, set `isAsync: true` to show a loading indicator while the promise resolves.

```typescript
// Sync
const filterFunction = (search: string) =>
	records.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map(r => ({ id: r.id, displayText: r.name }))

// Async
const filterFunction = async (search: string) => {
	const results = await api.search(search)
	return results.map(r => ({ id: r.id, displayText: r.name }))
}
```

## Navigation

AFormLink uses `provide`/`inject` for navigation so it remains decoupled from vue-router. Provide `aformLinkNavigator` once in your app plugin:

```typescript
import type { AFormLinkNavigator } from '@stonecrop/aform'

app.provide('aformLinkNavigator', {
	navigate(doctype: string, id: string | number) {
		router.push(`/${doctype}/${id}`)
	},
} satisfies AFormLinkNavigator)
```

If no navigator is provided, the arrow is still rendered when `hasValidId` is true but clicks are no-ops.

## Via resolveSchema

For fields carrying a `doctype` marker with no matching `links` declaration and no `component`, `resolveSchema()` automatically assigns `component: 'AFormLink'`. No manual wiring needed:

```typescript
const config: DoctypeConfig = {
	slug: 'sales-order',
	fields: [{ fieldname: 'territory', doctype: 'territory', label: 'Territory' }],
	// no 'links' entry for territory — resolveSchema handles it
}

const resolved = registry.resolveSchema(registry.registry['sales-order'])
// resolved[0] === { fieldname: 'territory', component: 'AFormLink', doctype: 'territory', label: 'Territory', ... }
```
</docs>
