<template>
	<div>
		<AFieldset label="Workflow" :collapsible="true">
			<div class="builder-workflow">
				<StateEditor
					v-if="workflowConfig && Object.keys(workflowConfig).length > 0"
					v-model="workflowConfig"
					node-container-class="node-editor"
					:layout="layout" />
			</div>
		</AFieldset>
		<AForm class="aform-main" v-model="doctypeSchema" :data="formData" :key="formKey" />
		<ActionSet :elements="actionElements" />
	</div>
</template>

<script setup lang="ts">
import type { ActionElements } from '@stonecrop/desktop'
import type { Layout } from '@stonecrop/node-editor'
import { useStonecrop } from '@stonecrop/stonecrop'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { type AnyStateNodeConfig, createMachine } from 'xstate'

import doctypeSchema from '../assets/doctype_schema.json'

const route = useRoute()
const formKey = ref(0)

const { stonecrop } = useStonecrop()

// Reactive data for the components
const formData = ref({})
const layout = ref<Layout>({})
const workflowConfig = ref<AnyStateNodeConfig['states']>({})

// Simple direct approach to test API calls
onMounted(async () => {
	const doctype = route.params.id.toString()
	if (!stonecrop.value) {
		console.error('Stonecrop instance is not available')
		return
	}

	if (!stonecrop.value.registry.getMeta) {
		console.error(`getMeta function is not available in the registry for ${doctype}`)
		return
	}

	try {
		// Use our getMeta function to fetch all required data
		const doctypeMeta = await stonecrop.value.registry.getMeta(doctype)
		if (!doctypeMeta) {
			throw new Error(`No metadata found for doctype: ${doctype}`)
		}

		// Load the layout
		const searchParams = new URLSearchParams({ doctype })
		const layoutResponse = await fetch('/api/load_layout?' + searchParams.toString())
		const layoutResponseData = await layoutResponse.json()
		layout.value = layoutResponseData || {}

		// Set up data directly
		formData.value = {
			...formData.value,
			schema_fieldset: {
				schema: doctypeMeta.schema?.toArray() || [],
			},
			actions_fieldset: {
				actions: doctypeMeta.actions?.get('default') || [],
			},
		}

		if (doctypeMeta.workflow) {
			const stateMachine = createMachine(doctypeMeta.workflow)
			workflowConfig.value = stateMachine.config.states
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
