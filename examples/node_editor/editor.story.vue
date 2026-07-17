<template>
	<Story title="NodeEditor">
		<StateEditor v-model="fetchWorkflow" :layout="layout" />
	</Story>
</template>

<script setup lang="ts">
import { StateEditor, type Layout } from '@stonecrop/node-editor'
import type { WorkflowMeta } from '@stonecrop/schema'
import { Position } from '@vue-flow/core'
import { ref } from 'vue'

const layout: Layout = {
	idle: {
		position: { x: 100, y: 50 },
	},
	loading: {
		position: { x: 400, y: 50 },
	},
	failure: {
		position: { x: 400, y: 250 },
		targetPosition: Position.Right,
		sourcePosition: Position.Left,
	},
	success: {
		position: { x: 700, y: 50 },
	},
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
* {
	margin: 0;
}

html,
body {
	height: 100%;
	font-family: Arimo, sans-serif;
	font-size: 11pt;
}
</style>
