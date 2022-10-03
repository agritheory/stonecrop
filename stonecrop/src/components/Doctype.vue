<template>
	<div>
		<h3>{{ schema.doctype }}</h3>
		<pre>{{ route }}</pre>
		<AForm class="aform-main" :schema="schema.schema" :data="data" :formId="id" :key="formKey" />
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, inject } from 'vue'
import { useRoute } from 'vue-router'

import { AForm, ATextInput } from '@agritheory/aform'

import Registry from '@/registry.js'
// TODO: pinia for state, later
// const schema = useStonecrop()

const route = useRoute()
const doctypeSlug = route.params.records
const registry = inject<Registry>('$registry')
const schema = registry.schemaLoader(doctypeSlug)

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
</script>
