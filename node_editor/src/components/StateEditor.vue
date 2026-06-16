<template>
	<div>
		<NodeEditor v-model="elements" :node-container-class="nodeContainerClass" />
	</div>
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed, onMounted } from 'vue'

import NodeEditor from './NodeEditor.vue'
import type { EditorStates, FlowElements, Layout } from '../types'
import { statesToFlowElements, flowElementsToStates } from '../utils/stateTransforms'

const states = defineModel<EditorStates>()
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
		if (!states.value) return []
		return statesToFlowElements(states.value, layout.value)
	},
	set: newValue => {
		const { states: nextStates, layout: nextLayout } = flowElementsToStates(newValue)
		states.value = nextStates
		if (layout.value !== undefined) {
			layout.value = nextLayout
		}
	},
})
</script>
