<template>
	<Story title="NodeEditor">
		<NodeEditor :state-machine="fetchMachine" />
	</Story>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import NodeEditor from '@/components/NodeEditor.vue'

import { createMachine } from 'xstate'

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
