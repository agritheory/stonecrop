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
			<AForm class="aform-main" :schema="table_schema" v-model:data="data" />
		</Variant>
		<Variant title="Fieldset">
			<AForm class="aform-main" :schema="fieldset_schema" v-model:data="data" />
		</Variant>
		<Variant title="Fieldset with Table">
			<AForm class="aform-main" :schema="fieldset_table_schema_ref" v-model:data="data" />
		</Variant>
		<Variant title="Hidden Fields">
			<p class="info-text">
				The <code>id</code> and <code>rowId</code> fields have <code>hidden: true</code> in the schema. AForm skips
				rendering them entirely — they never appear in the UI — but their values remain in the data model, as shown
				below.
			</p>
			<AForm class="aform-main" :schema="hidden_field_schema" v-model:data="hidden_data" />
			<div class="data-preview">
				<h4>Form data (hidden fields are still present)</h4>
				<pre>{{ JSON.stringify(hidden_data, null, 2) }}</pre>
			</div>
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

const form_schema = ref(basic_form_schema)
const fieldset_schema = ref(basic_fieldset_schema)
const table_schema = ref(basic_table_schema)
const fieldset_table_schema_ref = ref(fieldset_table_schema)
const hidden_field_schema = ref(hidden_field_schema_json)

const data = ref({})
const hidden_data = ref({
	id: 'V2VyZTphcnRpY2xlOjE=',
	rowId: '018e4c3a-7b2f-7000-8d1e-3f4a5b6c7d8e',
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
