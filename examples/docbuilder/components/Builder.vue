<template>
	<div>
		<div class="builder-container">
			<div class="builder-schema">
				<h3>Schema</h3>
				<AForm class="aform-main" :key="formKey" :schema="doctypeSchema" :data="schemaData" />
				<!-- <SheetNav class="sheet-nav-footer" /> -->
			</div>
			<div class="builder-hooks">
				<h3>Side Effects</h3>
				<AForm class="aform-main" :key="formKey" :schema="hooksSchema" :data="hooksData" />
			</div>
			<div class="builder-events">
				<h3>Events</h3>
			</div>
			<div class="builder-workflow">
				<h3>Workflow</h3>
				<StateEditor
					node-container-class="node-editor"
					v-if="stateMachine"
					:state-machine="stateMachine"
					:layout="layout" />
			</div>
		</div>
		<ActionSet :elements="actionElements" />
	</div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { createMachine } from 'xstate'

import doctypeSchema from '../assets/doctype_schema.json'
import hooksSchema from '../assets/hooks_schema.json'
import { makeServer } from '../server'

const route = useRoute()

const key = uuidv4()
let formKey = ref(0)

// create mirage server
makeServer()

// create hooks data
let schemaData = ref({})
let hooksData = ref({})
let stateMachine
let layout
onBeforeMount(async () => {
	const doctype = route.params.id.toString()
	const searchParams = new URLSearchParams({ doctype })

	const schemaResponse = await fetch('/api/load_meta?' + searchParams.toString())
	const schemaResponseData: Record<string, any>[] = await schemaResponse.json()
	schemaData.value['schema_fieldset'] = {}
	schemaData.value['schema_fieldset']['schema'] = schemaResponseData

	const hooksResponse = await fetch('/api/load_side_effects?' + searchParams.toString())
	const hooksResponseData: Record<string, any>[] = await hooksResponse.json()
	hooksData.value['side_effects_fieldset'] = {}
	hooksData.value['side_effects_fieldset']['side_effects'] = hooksResponseData

	const stateResponse = await fetch('/api/load_state_machine?' + searchParams.toString())
	const stateResponseData: Record<string, any>[] = await stateResponse.json()
	stateMachine = createMachine(stateResponseData.machine)
	layout = stateResponseData.layout
	formKey.value++
})

//Setup page actions
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
	height: 60vh;
	margin-top: 90px;
}

.builder-schema,
.builder-hooks,
.builder-events,
.builder-workflow {
	border: 1px solid var(--gray-20);
	border-radius: 10px;

	padding: 1em;
	margin-bottom: 1em;
}
.node-editor {
	width: 100%;
	height: 60vh;
	min-height: 400px;
}
</style>
