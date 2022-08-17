<template>
	<Story title="default">
		<nav>
			<button class="aform-primary-action">SWITCH COLOR</button>
			<button @click="changeSchema" class="aform-primary-action">SWITCH SCHEMA</button>
		</nav>
		<AForm class="aform-main" :schema="schema" :data="data" :formId="id" />
	</Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { FieldsetSchema, FormSchema, SchemaTypes, TableSchema } from 'types'
import basic_form_schema from '@/assets/basic_form_schema.json'
import basic_fieldset_schema from '@/assets/basic_fieldset_schema.json'
import basic_table_schema from '@/assets/basic_table_schema.json'
import fieldset_table_schema from '@/assets/fieldset_table_schema.json'

const id = ref(0)
const schemaIndex = ref(0)
const schemas: SchemaTypes[][] = [
	basic_form_schema as FormSchema[],
	basic_fieldset_schema as FieldsetSchema[],
	basic_table_schema as TableSchema[],
	fieldset_table_schema as FieldsetSchema[],
]

// setup defaults
const data = ref([])
const schema = ref<SchemaTypes[]>(basic_form_schema as FormSchema[])
// TODO: const color = ref('')

const changeSchema = () => {
	schemaIndex.value++
	if (schemaIndex.value >= schemas.length) {
		schemaIndex.value = 0
	}

	id.value = schemaIndex.value
	schema.value = schemas[schemaIndex.value]
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('../src/theme/aform.css');
html {
	font-family: Arimo, sans-serif;
	font-size: 11pt;
}
nav {
	min-height: 60px;
	display: flex;
	/* flex-direction: row; */
	flex-direction: row-reverse;
	align-items: center;
	border-bottom: 2px solid var(--primary-color);
	margin: 0px;
	padding-left: 1ch;
	padding-right: 1ch;
}
.aform-main {
	margin-left: 2ch;
	margin-top: 1.15rem;
}
</style>
