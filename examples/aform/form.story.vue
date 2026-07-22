<template>
	<Story>
		<Variant title="Form" :setup-app="formSetup">
			<AForm class="aform-main" :schema="form_schema" v-model:data="data" :key="formKey" />

			<template #controls>
				<HstRadio
					v-model="locale"
					title="Locale"
					:options="[
						{
							label: 'United States',
							value: 'en-US',
						},
						{
							label: 'India',
							value: 'en-IN',
						},
					]" />
			</template>
		</Variant>
		<Variant title="Form (Read-Only)">
			<AForm class="aform-main" :schema="basic_form_schema" v-model:data="data" :mode="'read'" />
		</Variant>
		<Variant title="Table">
			<AForm class="aform-main" :schema="table_schema" v-model:data="table_data" />
		</Variant>
		<Variant title="Fieldset">
			<AForm class="aform-main" :schema="fieldset_schema" v-model:data="fieldset_data" />
		</Variant>
		<Variant title="Fieldset with Table">
			<AForm class="aform-main" :schema="fieldset_table_schema_ref" v-model:data="fieldset_table_data" />
		</Variant>
		<Variant title="Hidden Fields">
			<p class="info-text">
				The <code>id</code> field has <code>hidden: true</code> in the schema. AForm skips rendering it entirely but its
				value remains in the data model.
			</p>
			<AForm class="aform-main" :schema="hidden_field_schema" v-model:data="hidden_data" />
			<div class="data-preview">
				<h4>Form data (hidden fields are still present)</h4>
				<pre>{{ JSON.stringify(hidden_data, null, 2) }}</pre>
			</div>
		</Variant>
		<Variant title="TextBox">
			<AForm class="aform-main" :schema="textbox_schema" v-model:data="data" />
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { App, ref, watch } from 'vue'

import basic_form_schema from './assets/basic_form_schema.json'
import basic_fieldset_schema from './assets/basic_fieldset_schema.json'
import basic_table_schema from './assets/basic_table_schema.json'
import fieldset_table_schema from './assets/fieldset_table_schema.json'
import hidden_field_schema_json from './assets/hidden_field_schema.json'
import basic_textbox_schema from './assets/basic_textbox_schema.json'
import HTTP_LOGS from './assets/http_logs_data.json'

const form_schema = ref(basic_form_schema)
const fieldset_schema = ref(basic_fieldset_schema)
const table_schema = ref(basic_table_schema)
const fieldset_table_schema_ref = ref(fieldset_table_schema)
const hidden_field_schema = ref(hidden_field_schema_json)
const textbox_schema = ref(basic_textbox_schema)

// Table rows live in formData — not in the schema.
// In a real app these would come from a registry.initializeRecord() call or an API fetch.
const ORDER_LINE_ITEMS = [
	{
		item_code: 'LAPTOP-PRO-15',
		item_name: 'Laptop Pro 15"',
		quantity: 2,
		unit_price: 1299.99,
		total: 2599.98,
		ship_date: '2025-08-01',
		status: 'Confirmed',
	},
	{
		item_code: 'DOCK-USB4-4K',
		item_name: 'USB4 Docking Station',
		quantity: 2,
		unit_price: 189.0,
		total: 378.0,
		ship_date: '2025-08-01',
		status: 'Confirmed',
	},
	{
		item_code: 'MOUSE-ERGO-BT',
		item_name: 'Ergonomic Bluetooth Mouse',
		quantity: 5,
		unit_price: 49.99,
		total: 249.95,
		ship_date: '2025-07-28',
		status: 'Pending',
	},
	{
		item_code: 'KBRD-MECH-TKL',
		item_name: 'Mechanical TKL Keyboard',
		quantity: 5,
		unit_price: 89.0,
		total: 445.0,
		ship_date: '2025-07-28',
		status: 'Pending',
	},
	{
		item_code: 'MON-27-4K-IPS',
		item_name: '27" 4K IPS Monitor',
		quantity: 3,
		unit_price: 599.0,
		total: 1797.0,
		ship_date: '2025-08-15',
		status: 'Backordered',
	},
	{
		item_code: 'WEBCAM-HD-AUTO',
		item_name: 'HD Webcam with Autofocus',
		quantity: 10,
		unit_price: 79.99,
		total: 799.9,
		ship_date: '2025-07-25',
		status: 'Confirmed',
	},
	{
		item_code: 'HDST-NC-WL-PRO',
		item_name: 'Noise-Cancelling Wireless Headset',
		quantity: 8,
		unit_price: 159.0,
		total: 1272.0,
		ship_date: '2025-08-05',
		status: 'Pending',
	},
]

// Scalar form data — pre-filled to demonstrate read and edit modes
const data = ref({
	first_name: 'Jane',
	last_name: 'Smith',
	enabled: true,
	age: 34,
	date: '1990-04-15',
	card: '4111111111111111',
	phone: '',
})

// Table variants: rows keyed by fieldname at each nesting level.
// The simple Table variant has line_items at the top level.
// The Fieldset with Table variant nests http_logs under the fieldset's fieldname —
// these keys must match the schema's fieldnames exactly or AForm resolves the rows to [].
const table_data = ref({ line_items: ORDER_LINE_ITEMS })
const fieldset_table_data = ref({ table_fieldset: { http_logs: HTTP_LOGS } })

// Fieldset variant: scalar data nested under the fieldset fieldname
const fieldset_data = ref({
	basic_fieldset: { first_name: 'Jane', middle_name: 'A.', last_name: 'Smith', age: 34 },
})
const hidden_data = ref({
	id: 'V2VyZTphcnRpY2xlOjE=',
	first_name: '',
	last_name: '',
	email: '',
})
const locale = ref('en-US')
const formKey = ref(0)
watch(locale, () => {
	// re-render form when locale is changed
	formKey.value++
})

const formSetup = ({ app }: { app: App }) => {
	app.provide('locale', locale)
}
</script>

<style scoped>
.info-text {
	color: #555;
	margin-bottom: 1rem;
	font-size: 0.9rem;
}

.data-preview {
	margin-top: 1.5rem;
	padding: 1rem;
	background: #2c3e50;
	color: #ecf0f1;
	border-radius: 4px;
}

.data-preview h4 {
	margin: 0 0 0.5rem;
	color: #3498db;
	font-size: 0.85rem;
}

.data-preview pre {
	margin: 0;
	font-size: 0.8rem;
	overflow-x: auto;
}
</style>
