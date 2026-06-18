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
		return statesToFlowElements(workflow.value, layout.value)
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
