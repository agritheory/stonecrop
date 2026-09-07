<script setup lang="ts">
import { ref } from 'vue'
import { Position, StateEditor, type Layout } from '@stonecrop/node-editor'
import type { WorkflowMeta } from '@stonecrop/schema'

const layout: Layout = {
	idle: { position: { x: 50, y: 50 } },
	loading: { position: { x: 300, y: 50 } },
	failure: { position: { x: 300, y: 200 }, targetPosition: Position.Right, sourcePosition: Position.Left },
	success: { position: { x: 550, y: 50 } },
}

const fetchWorkflow = ref<WorkflowMeta>({
	states: ['idle', 'loading', 'success', 'failure'],
	actions: {
		FETCH: { label: 'FETCH', allowedStates: ['idle'], nextState: 'loading' },
		RESOLVE: { label: 'RESOLVE', allowedStates: ['loading'], nextState: 'success' },
		REJECT: { label: 'REJECT', allowedStates: ['loading'], nextState: 'failure' },
		RETRY: { label: 'RETRY', allowedStates: ['failure'], nextState: 'loading' },
	},
})
</script>

<template>
	<div class="stonecrop-demo node-editor-demo-frame">
		<StateEditor v-model="fetchWorkflow" :layout="layout" />
	</div>
</template>

<style scoped>
.node-editor-demo-frame {
	height: 320px;
}

/* NodeEditor's own `.node-editor-wrapper` (the containing block its `.chart-controls` overlay is
   positioned against) has no height of its own — it relies on an ancestor to size it. Without
   this, `.chart-controls`'s `bottom: 0.5rem` resolves against a near-zero-height box and the
   overlay renders up near the top of this frame instead of pinned to its actual bottom. */
.node-editor-demo-frame :deep(.node-editor-wrapper) {
	height: 320px;
}
</style>
