<template>
	<Story title="default">
		<Variant title="Form">
			<AForm class="aform-main" :schema="basic_form_schema" :data="data" :formId="id" />
		</Variant>
		<Variant title="Table">
			<AForm class="aform-main" :schema="basic_table_schema" :data="data" :formId="id" />
		</Variant>
		<Variant title="Fieldset">
			<AForm class="aform-main" :schema="basic_fieldset_schema" :data="data" :formId="id" />
		</Variant>
		<Variant title="Fieldset with Table">
			<AForm class="aform-main" :schema="fieldset_table_schema" :data="data" :formId="id" />
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import basic_form_schema from '@/assets/basic_form_schema.json'
import basic_fieldset_schema from '@/assets/basic_fieldset_schema.json'
import basic_table_schema from '@/assets/basic_table_schema.json'
import fieldset_table_schema from '@/assets/fieldset_table_schema.json'

const id = ref(0)
const data = ref([])
// TODO: const color = ref('')
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
