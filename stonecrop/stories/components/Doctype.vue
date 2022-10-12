<template>
	<div>
		<h3>{{ schema.doctype }}</h3>
		<AForm :key="schema" class="aform-main" :schema="schema.schema" :data="data" />
	</div>
</template>

<script setup lang="ts">
import { inject, markRaw, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import { AForm } from '@agritheory/aform'

import Registry from '@/registry'
import { Schema } from 'types/index'
// TODO: pinia for state, later
// const schema = useStonecrop()

const route = useRoute()
// change this to $registry.registry[$route.currentRoute???]
const doctypeSlug = route.params.records.toString()
const data = route.params.recordData

let schema = ref<Schema>({ doctype: doctypeSlug, schema: [] })
onBeforeMount(async () => {
	// get schema
	const registry = inject<Registry>('$registry')
	const schemaDetails = await registry.schemaLoader(doctypeSlug)
	schema.value = markRaw(schemaDetails)
})
</script>
