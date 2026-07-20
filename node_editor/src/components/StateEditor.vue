<template>
	<div>
		<NodeEditor v-model="elements" :node-container-class="nodeContainerClass" />
	</div>
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed, onMounted } from 'vue'
import type { WorkflowMeta } from '@stonecrop/schema'

import NodeEditor from './NodeEditor.vue'
import type { FlowElements, Layout } from '../types'
import { autoLayout } from '../utils/autoLayout'
import { statesToFlowElements, flowElementsToStates } from '../utils/stateTransforms'

const workflow = defineModel<WorkflowMeta>()
const layout = defineModel<Layout>('layout')
const { nodeContainerClass = '' } = defineProps<{
	nodeContainerClass?: HTMLAttributes['class']
}>()

onMounted(() => {
	if (layout.value === undefined) {
		console.warn('[StateEditor] v-model:layout is not bound. Node position changes will not be persisted.')
	}
})

const elements = computed<FlowElements>({
	get: () => {
		if (!workflow.value) return []
		const els = statesToFlowElements(workflow.value, layout.value)
		// Seed an un-arranged workflow with an auto-computed dagre layout instead of the naive row.
		// Ephemeral: these positions are persisted only once the author drags a node (which routes
		// through flowElementsToStates → layout). A workflow with any saved layout keeps it as-is.
		const noSavedLayout = !layout.value || Object.keys(layout.value).length === 0
		return noSavedLayout ? autoLayout(els) : els
	},
	set: newValue => {
		const { workflow: nextWorkflow, layout: nextLayout } = flowElementsToStates(newValue, workflow.value)
		workflow.value = nextWorkflow
		if (layout.value !== undefined) {
			layout.value = nextLayout
		}
	},
})
</script>
