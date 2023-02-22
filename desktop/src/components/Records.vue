<template>
	<ATable :key="records.rows" :columns="records.columns" :rows="records.rows" :config="records.config" />
</template>

<script setup lang="ts">
import { reactive, inject, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import type { SchemaTypes } from '@agritheory/aform/types'
import { ATable } from '@agritheory/atable'
import { Registry } from '@agritheory/stonecrop'
import type { ImmutableDoctype } from '@agritheory/stonecrop/types'

// TODO: use component if provided else call to Records Schema endpoint/ table  / lookup
// alteratively: a view: component map, eg records: Records, gantt: GanttView
// default_view key in schema
// last_used_view_type in application state

const route = useRoute()
const doctypeSlug = route.params.records.toString().toLowerCase()
const registry = inject<Registry>('$registry')

// get data
const records = reactive({
	rows: [] as any[], // Pinia
	columns: [] as SchemaTypes[],
	config: { view: 'list' },
})

let stateMachine = ref<ImmutableDoctype['events']>()
let hooks = ref<ImmutableDoctype['hooks']>()

onBeforeMount(async () => {
	// register doctype in registry
	const doctype = await registry.doctypeLoader(doctypeSlug)
	registry.addDoctype(doctype)

	// get schema
	records.columns = doctype.schema?.toArray()

	// get data
	const doctypeRecords = await fetch(`/${doctypeSlug}`)
	const data = await doctypeRecords.json()
	records.rows = data

	// setup local state for events and hooks
	const doctypeRegistry = registry.registry[doctype.slug]
	stateMachine.value = doctypeRegistry.events
	hooks.value = doctypeRegistry.hooks

	// trigger the 'LOAD' action on the state machine
	const { initialState } = stateMachine.value
	stateMachine.value.transition(initialState, { type: 'LOAD' })

	// run 'LOAD' hooks after state machine transition
	const hookEvents: string[] = hooks.value.get('LOAD')
	if (hookEvents.length > 0) {
		hookEvents.forEach(hook => {
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const hookFn = new Function(hook)
			hookFn()
		})
	}
})
</script>
