<template>
	<div>
		<AFieldset label="Workflow" :collapsible="true">
			<div class="builder-workflow">
				<StateEditor
					node-container-class="node-editor"
					v-if="stateConfig && Object.keys(stateConfig).length > 0"
					v-model="stateConfig"
					:layout="layout" />
			</div>
		</AFieldset>
		<AForm class="aform-main" :key="formKey" :schema="doctypeSchema" :data="data" />
		<ActionSet :elements="actionElements" />
		<SheetNav />
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { createMachine } from 'xstate'

import doctypeSchema from '../assets/doctype_schema.json'
import { makeServer } from '../server'

const route = useRoute()
let formKey = ref(0)

// create mirage server
makeServer()

// fetch data
let data = ref({})
let layout: any
let stateConfig = ref({})

onBeforeMount(async () => {
	const doctype = route.params.id.toString()
	const searchParams = new URLSearchParams({ doctype })

	const schemaResponse = await fetch('/api/load_meta?' + searchParams.toString())
	const schemaResponseData: Record<string, any>[] = await schemaResponse.json()
	data.value['schema_fieldset'] = {}
	data.value['schema_fieldset']['schema'] = schemaResponseData

	const hooksResponse = await fetch('/api/load_side_effects?' + searchParams.toString())
	const hooksResponseData: Record<string, any>[] = await hooksResponse.json()
	data.value['side_effects_fieldset'] = {}
	data.value['side_effects_fieldset']['side_effects'] = hooksResponseData

	const stateResponse = await fetch('/api/load_state_machine?' + searchParams.toString())
	const stateResponseData: Record<string, any>[] = await stateResponse.json()
	const stateMachine = createMachine(stateResponseData.machine)
	stateConfig.value = stateMachine.config.states
	layout = stateResponseData.layout

	// increment form key to force form re-render
	formKey.value++
})

// setup page actions
const actionElements = [
	{
		elementType: 'button',
		action: function () {},
		label: 'Save',
	},
	{
		elementType: 'dropdown',
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
]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('@agritheory/themes/default/default.css');
/* @import '../style.css'; */
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
	border: 1px solid var(--gray-20);
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
