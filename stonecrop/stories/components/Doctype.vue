<template>
	<div>
		<h3>{{ schema.doctype }}</h3>
		<AForm :key="data" class="aform-main" :schema="schema.schema.toArray()" :data="data" />
	</div>
</template>

<script setup lang="ts">
import { List } from 'immutable'
import { inject, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import { AForm } from '@agritheory/aform'

import Registry from '@/registry'
import { ImmutableRegistry, Schema } from 'types/index'
// TODO: pinia for state, later
// const schema = useStonecrop()

const route = useRoute()
const doctypeSlug = route.params.records.toString()
const recordId = route.params.record.toString()

const registry = inject<Registry>('$registry')

let schema = ref<Schema>({ doctype: doctypeSlug, schema: List() })
let data = ref<any[]>([])
let stateMachine = ref<ImmutableRegistry['events']>()
let hooks = ref<ImmutableRegistry['hooks']>()
onBeforeMount(async () => {
	// get schema
	const doctype = await registry.doctypeLoader(doctypeSlug)
	registry.addDoctype(doctype)

	if (List.isList(doctype.schema)) {
		schema.value = { doctype: doctype.doctype, schema: doctype.schema }
	} else {
		const processedSchema = await doctype.schema()
		schema.value = { doctype: doctype.doctype, schema: processedSchema }
	}

	const doctypeRecord = await fetch(`/${doctypeSlug}/${recordId}`)
	const recordData: any[] = await doctypeRecord.json()
	data.value = recordData

	const doctypeRegistry = registry.registry[doctypeSlug]
	stateMachine.value = doctypeRegistry.events
	hooks.value = doctypeRegistry.hooks

	const { initialState } = stateMachine.value
	stateMachine.value.transition(initialState, { type: 'LOAD' })
})
</script>
