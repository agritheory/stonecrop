<template>
	<div>
		<AFieldset label="Workflow" :collapsible="true">
			<div class="builder-workflow">
				<StateEditor
					v-if="stateConfig && Object.keys(stateConfig).length > 0"
					v-model="stateConfig"
					node-container-class="node-editor"
					:layout="layout" />
			</div>
		</AFieldset>
		<AForm class="aform-main" v-model="doctypeSchema" :data="data" :key="formKey" />
		<ActionSet :elements="actionElements" />
	</div>
</template>

<script setup lang="ts">
import type { ActionElements } from '@stonecrop/desktop'
import type { Layout } from '@stonecrop/node-editor'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { createMachine } from 'xstate'

import doctypeSchema from '../assets/doctype_schema.json'
import { makeServer } from '../server'

const route = useRoute()
const formKey = ref(0)

// create mirage server
makeServer()

// fetch data
const layout = ref<Layout>({})
const data = ref({})
const stateConfig = ref({})

onBeforeMount(async () => {
	const doctype = route.params.id.toString()
	const searchParams = new URLSearchParams({ doctype })

	const schemaResponse = await fetch('/api/load_meta?' + searchParams.toString())
	const schemaResponseData: Record<string, any>[] = await schemaResponse.json()
	data.value['schema_fieldset'] = {}
	data.value['schema_fieldset']['schema'] = schemaResponseData

	const actionsResponse = await fetch('/api/load_side_effects?' + searchParams.toString())
	const actions: Record<string, any>[] = await actionsResponse.json()
	data.value['side_effects_fieldset'] = {}
	data.value['side_effects_fieldset']['side_effects'] = actions

	const stateResponse = await fetch('/api/load_state_machine?' + searchParams.toString())
	const stateResponseData: Record<string, any> = await stateResponse.json()
	const stateMachine = createMachine(stateResponseData.machine)
	stateConfig.value = stateMachine.config.states
	layout.value = stateResponseData.layout

	// increment form key to force form re-render
	formKey.value++
})

// setup page actions
const actionElements = [
	{
		type: 'button',
		label: 'Save',
		action: function () {},
	},
	{
		type: 'dropdown',
		label: 'Actions',
		actions: [
			{
				label: 'Print',
				action: function () {},
			},
			{
				label: 'Email',
				action: function () {},
			},
			{
				label: 'Duplicate',
				action: function () {},
			},
		],
	},
] as ActionElements[]
</script>

<style>
html,
body {
	height: 100%;
	font-family: Arimo, sans-serif;
	font-size: 11pt;
}
.builder-container {
	display: flex;
	flex-direction: column;
	justify-content: start;
	/* height: 40vh; */

	/* margin-top: 90px; */
}

.builder-schema,
.builder-hooks,
.builder-events {
	border: 1px solid var(--sc-gray-20);
	/* border-radius: 10px; */

	padding: 1em;
	margin-bottom: 1em;
}

.builder-workflow {
	padding: 1em;
	margin-bottom: 3em;
}

.node-editor {
	width: 100%;
	height: 40vh;
	/* min-height: 400px; */
	overflow: hidden;
}

footer {
	bottom: 15px !important;
	right: 15px !important;
}
</style>
