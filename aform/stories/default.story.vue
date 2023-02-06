<template>
	<Story title="default">
		<Variant title="Form" :setup-app="formSetup">
			<AForm class="aform-main" v-model="basic_form_schema" :schema="basic_form_schema" :data="data" :key="formKey" />

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
		<Variant title="Table">
			<AForm class="aform-main" :schema="basic_table_schema" :data="data" />
		</Variant>
		<Variant title="Fieldset">
			<AForm class="aform-main" :schema="basic_fieldset_schema" :data="data" />
		</Variant>
		<Variant title="Fieldset with Table">
			<AForm class="aform-main" :schema="fieldset_table_schema" :data="data" />
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { App, ref, watch } from 'vue'

import basic_form_schema from '@/assets/basic_form_schema.json'
import basic_fieldset_schema from '@/assets/basic_fieldset_schema.json'
import basic_table_schema from '@/assets/basic_table_schema.json'
import fieldset_table_schema from '@/assets/fieldset_table_schema.json'

const data = ref([])
const locale = ref('en-US')
// TODO: (histoire) const color = ref('')

// TODO: (state) replace with state management
const formKey = ref(0)
watch(locale, () => {
	// re-render form when locale is changed
	formKey.value++
})

const formSetup = ({ app }: { app: App }) => {
	app.provide('locale', locale)
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('@/theme/aform.css');

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
