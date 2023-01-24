<template>
	<Story title="NodeEditor">
		<StateEditor v-model="fetchConfig" :layout="layout" />
	</Story>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import StateEditor from '@/components/StateEditor.vue'

import { createMachine } from 'xstate'

const layout = {
	idle: {
		position: { x: 100, y: 50 },
	},
	loading: {
		position: { x: 400, y: 50 },
	},
	failure: {
		position: { x: 400, y: 250 },
		targetPosition: 'right',
		sourcePosition: 'left',
	},
	success: {
		position: { x: 700, y: 50 },
	},
}

const fetchMachine = createMachine({
	id: 'fetch',
	initial: 'idle',
	context: {
		retries: 0,
	},
	states: {
		idle: {
			on: {
				FETCH: 'loading',
			},
		},
		loading: {
			on: {
				RESOLVE: 'success',
				REJECT: 'failure',
			},
		},
		success: {
			type: 'final',
		},
		failure: {
			on: {
				RETRY: {
					target: 'loading',
					actions: {
						retries: (context, event) => context.retries + 1,
					},
				},
			},
		},
	},
})

const fetchConfig = fetchMachine.config
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
