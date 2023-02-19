<template>
	<slot name="actionset">
		<ActionSet />
	</slot>
	<slot>
		<AForm :key="data" class="aform-main" :schema="schema.schema.toArray()" :data="data" />
	</slot>
</template>

<script setup lang="ts">
import { List } from 'immutable'
import { inject, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import { AForm } from '@agritheory/aform'

import Registry from '@/registry'
import { ImmutableDoctype, Schema } from 'types/index'
// TODO: pinia for state, later
// const schema = useStonecrop()

const route = useRoute()
const doctypeSlug = route.params.records.toString()
const recordId = route.params.record.toString()

const registry = inject<Registry>('$registry')

let schema = ref<Schema>({ doctype: doctypeSlug, schema: List() })
let data = ref<Record<string, any>>({})
let stateMachine = ref<ImmutableDoctype['events']>()
let hooks = ref<ImmutableDoctype['hooks']>()

onBeforeMount(async () => {
	// TODO: refactor to stonecrop.useDoctype() composable
	// TODO: refactor to call stonecrop.getMeta(doctype) => fetch and/or load schema from registry, load actions into ActionSet
	// TODO: refactor to call stonecrop.getRecord(doctype, id) => loads mutable data into Pinia
	// TODO: refactor call stonecrop.runAction(doctype, id, 'load')
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
			const hookFn = eval(hook) as () => void
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
			const hookFn = eval(hook) as () => void
			hookFn()
		})
	}
}
</script>
