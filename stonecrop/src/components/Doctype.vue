<template>
	<div>
		<h3>{{ schema.doctype }}</h3>
		<pre>{{ route }}</pre>
		<AForm class="aform-main" :schema="schema.schema" :data="data" :formId="id" :key="formKey" />
	</div>
</template>
<script>
import { reactive, ref, defineComponent, inject } from 'vue'
import { AForm, ATextInput } from '@agritheory/aform'
import { useRouter, useRoute } from 'vue-router'
// pinia for state, later
//

export default defineComponent({
	name: 'Doctype',
	components: {
		AForm,
	},
	setup(props, context) {
		// const schema = useStonecrop()

		const router = useRouter()
		const doctypeSlug = router.currentRoute._value.params.records
		const schema = inject('$registry').schemaLoader(doctypeSlug)
		console.log(schema)
		// change this to $registry.registry[$route.currentRoute???]
		let data = reactive([
			{
				first_name: 'John',
				last_name: 'Doe',
				date: 1662506721254,
				phone: '18005551234',
			},
		])

		let id = ref(123456)
		const formKey = ref(0)
		return { schema, data, id, formKey }
	},
})
</script>
