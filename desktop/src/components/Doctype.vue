<template>
	<div>
		<AForm :key="data" class="aform-main" :schema="schema.schema.toArray()" :data="data" />
	</div>
</template>

<script setup lang="ts">
import { List } from 'immutable'
import { inject, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import { AForm } from '@agritheory/aform'
import { Registry } from '@agritheory/stonecrop'
import { ImmutableDoctype, Schema } from '@agritheory/stonecrop/types'

// TODO: pinia for state, later
// const schema = useStonecrop()

const route = useRoute()
const doctypeSlug = route.params.records.toString().toLowerCase()
const recordId = route.params.record.toString().toLowerCase()

const registry = inject<Registry>('$registry')

let schema = ref<Schema>({ doctype: doctypeSlug, schema: List() })
let data = ref<Record<string, any>>({})
let stateMachine = ref<ImmutableDoctype['events']>()
let hooks = ref<ImmutableDoctype['hooks']>()

onBeforeMount(async () => {
	// register doctype in registry
	const doctype = await registry.doctypeLoader(doctypeSlug)
	registry.addDoctype(doctype)

	// get schema
	schema.value = { doctype: doctype.doctype, schema: doctype.schema }

	// get data
	const doctypeRecord = await fetch(`/${doctypeSlug}/${recordId}`)
	const recordData: Record<string, any> = await doctypeRecord.json()
	data.value = recordData

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

const saveRecord = () => {
	// handle the save action

	// run 'SAVE' hooks after handling the save action
	const hookEvents: string[] = hooks.value.get('SAVE')
	if (hookEvents.length > 0) {
		hookEvents.forEach(hook => {
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const hookFn = new Function(hook)
			hookFn()
		})
	}
}
</script>
