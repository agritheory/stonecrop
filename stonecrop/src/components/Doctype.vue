<template>
	<div>
		<h3>Doctype</h3>
		<pre>{{}}</pre>
		<AForm class="aform-main" :schema="basic_form_schema" :data="data" :formId="id" :key="formKey" />
	</div>
</template>
<script>
import { reactive, ref, defineComponent } from 'vue'
import { AForm } from '@sedum/aform'
// pinia for state, later
//

export default defineComponent({
	name: 'Doctype',
	setup(props) {
		// change this to $registry.registry[$route.currentRoute???]
		const basic_form_schema = [
			{
				fieldname: 'first_name',
				component: 'ATextInput',
				label: 'First Name',
			},
			{
				fieldname: 'last_name',
				component: 'ATextInput',
				label: 'Last Name',
			},
			{
				fieldname: 'date',
				fieldtype: 'Date',
				component: 'ATextInput',
				label: 'Date',
			},
			{
				fieldname: 'phone',
				fieldtype: 'Phone',
				component: 'ATextInput',
				label: 'Phone',
				mask: "(locale) => { if (locale === 'en-US') { return '(###) ###-####' } else if (locale === 'en-IN') { return '####-######'} }",
			},
		]
		let data = reactive({
			first_name: 'John',
			last_name: 'Doe',
			date: 1662506721254,
			phone: '18005551234',
		})

		let id = ref(123456)
		const formKey = ref(0)
		return { basic_form_schema, data, id, formKey }
	},
})
</script>
