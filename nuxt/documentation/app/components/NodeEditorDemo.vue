<script setup lang="ts">
import { ref } from 'vue'
import { StateEditor, type Layout } from '@stonecrop/node-editor'
import type { WorkflowMeta } from '@stonecrop/schema'

// 'right'/'left' are @vue-flow/core's Position enum values (Position.Right / Position.Left) —
// used as plain strings here since @vue-flow/core is a transitive dependency of
// @stonecrop/node-editor, not resolvable via import from this app.
const layout: Layout = {
	idle: { position: { x: 50, y: 50 } },
	loading: { position: { x: 300, y: 50 } },
	failure: { position: { x: 300, y: 200 }, targetPosition: 'right', sourcePosition: 'left' },
	success: { position: { x: 550, y: 50 } },
}

const fetchWorkflow = ref<WorkflowMeta>({
	states: ['idle', 'loading', 'success', 'failure'],
	actions: {
		FETCH: { label: 'FETCH', handler: '', allowedStates: ['idle'], nextState: 'loading' },
		RESOLVE: { label: 'RESOLVE', handler: '', allowedStates: ['loading'], nextState: 'success' },
		REJECT: { label: 'REJECT', handler: '', allowedStates: ['loading'], nextState: 'failure' },
		RETRY: { label: 'RETRY', handler: '', allowedStates: ['failure'], nextState: 'loading' },
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
