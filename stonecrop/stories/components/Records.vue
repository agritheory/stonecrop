<template>
	<ATable :key="records.rows" :columns="records.columns" :rows="records.rows" :config="records.config" />
</template>

<script setup lang="ts">
import { List } from 'immutable'
import { reactive, inject, onBeforeMount, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { SchemaTypes } from '@agritheory/aform/types'
import { ATable } from '@agritheory/atable'

import Registry from '@/registry'
import { ImmutableRegistry } from 'types/index'

// TODO: use component if provided else call to Records Schema endpoint/ table  / lookup
// alteratively: a view: component map, eg records: Records, gantt: GanttView
// default_view key in schema
// last_used_view_type in application state

const route = useRoute()
const doctypeSlug = route.params.records.toString()
const registry = inject<Registry>('$registry')

// get data
const records = reactive({
	rows: [] as any[],
	columns: [] as SchemaTypes[],
	config: { numberedRows: true, treeView: false },
})

let stateMachine = ref<ImmutableRegistry['events']>()
let hooks = ref<ImmutableRegistry['hooks']>()
onBeforeMount(async () => {
	// get schema
	const doctype = await registry.doctypeLoader(doctypeSlug)
	registry.addDoctype(doctype)

	if (List.isList(doctype.schema)) {
		records.columns = doctype.schema.toArray()
	} else {
		const processedSchema = await doctype.schema()
		records.columns = processedSchema.toArray()
	}

	const doctypeRecords = await fetch(`/${doctypeSlug}`)
	const data = await doctypeRecords.json()
	records.rows = data

	const doctypeRegistry = registry.registry[doctypeSlug]
	stateMachine.value = doctypeRegistry.events
	hooks.value = doctypeRegistry.hooks

	const { initialState } = stateMachine.value
	stateMachine.value.transition(initialState, { type: 'LOAD' })

	const hookEvents: (() => void | undefined)[] = hooks.value.get('LOAD')
	if (hookEvents) {
		hookEvents.forEach(hook => {
			if (hook) hook()
		})
	}
})

onMounted(() => {
	//
})
</script>
