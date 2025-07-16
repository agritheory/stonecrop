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
import { DoctypeMeta, Registry, useStonecrop } from '@stonecrop/stonecrop'
import { List, Map } from 'immutable'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { type AnyStateNodeConfig, createMachine } from 'xstate'

import doctypeSchema from '../assets/doctype_schema.json'

const route = useRoute()
const formKey = ref(0)

// Create a custom getMeta function that fetches data from our API
async function getMeta(doctype: string): Promise<DoctypeMeta> {
	const searchParams = new URLSearchParams({ doctype })

	// Fetch schema data
	const schemaResponse = await fetch('/api/load_meta?' + searchParams.toString())
	const schemaData: Record<string, any>[] = await schemaResponse.json()

	// Fetch actions data
	const actionsResponse = await fetch('/api/load_actions?' + searchParams.toString())
	const actionsData: Record<string, any>[] = await actionsResponse.json()

	// Fetch state machine data
	const stateResponse = await fetch('/api/load_state_machine?' + searchParams.toString())
	const stateResponseData: Record<string, any> = await stateResponse.json()

	// Create DoctypeMeta object with proper typing
	return new DoctypeMeta(
		doctype,
		List(schemaData as any), // Type assertion for the schema data
		stateResponseData.machine,
		Map({
			// Convert actions array to Map format expected by Stonecrop
			default: actionsData?.map((action: any) => action.name || action) || [],
		})
	)
}

// Create registry with our custom getMeta function
const registry = new Registry(undefined, getMeta)

// Use Stonecrop composable
const { stonecrop } = useStonecrop(registry)

// Reactive data for the components
const data = ref({})
const layout = ref<Layout>({})
const stateConfig = ref<AnyStateNodeConfig['states']>({})

// Simple direct approach to test API calls
onBeforeMount(async () => {
	const doctype = route.params.id.toString()

	try {
		// Use our getMeta function to fetch all required data
		const doctypeMeta = await getMeta(doctype)

		// Set up data directly
		data.value['schema_fieldset'] = {}
		data.value['schema_fieldset']['schema'] = doctypeMeta.schema?.toArray() || []

		data.value['actions_fieldset'] = {}
		data.value['actions_fieldset']['actions'] = doctypeMeta.actions?.get('default') || []

		// Get state machine and layout from the already fetched data
		const searchParams = new URLSearchParams({ doctype })
		const stateResponse = await fetch('/api/load_state_machine?' + searchParams.toString())
		const stateResponseData = await stateResponse.json()

		if (stateResponseData.machine) {
			const stateMachine = createMachine(stateResponseData.machine)
			stateConfig.value = stateMachine.config.states
			layout.value = stateResponseData.layout || {}
		}

		// Force re-render
		formKey.value++
	} catch (error) {
		console.error('Error in setup:', error)
	}
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
