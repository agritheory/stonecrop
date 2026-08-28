<script setup lang="ts">
import { ref } from 'vue'
import { ActionSet } from '@stonecrop/desktop'
import type { ActionElements } from '@stonecrop/desktop'

const lastAction = ref('')

const elements: ActionElements[] = [
	{ type: 'button', label: 'Save', action: () => (lastAction.value = 'Save') },
	{
		type: 'dropdown',
		label: 'More',
		actions: [
			{ label: 'Duplicate', action: () => (lastAction.value = 'Duplicate') },
			{ label: 'Delete', action: () => (lastAction.value = 'Delete') },
		],
	},
]
</script>

<template>
	<!--
		ActionSet positions itself with `position: fixed`, anchored to the viewport by design (it's
		meant to float over a real page, not sit inside document flow). `transform` on this wrapper
		establishes a new containing block per the CSS spec, so the fixed-positioned ActionSet is
		contained within this preview box instead of the whole browser viewport. ActionSet's own
		`top: 300px` then still assumes a full-page host, overflowing well below this small preview
		box's height — overridden below to a small offset that actually fits inside the frame.
	-->
	<div class="stonecrop-demo action-set-demo-frame">
		<ActionSet :elements="elements" @action-click="label => (lastAction = label)" />
		<p v-if="lastAction" class="action-set-demo-result">
			Last action: <strong>{{ lastAction }}</strong>
		</p>
	</div>
</template>

<style scoped>
.action-set-demo-frame {
	position: relative;
	transform: translateZ(0);
	min-height: 9.5rem;
	padding-right: 3.5rem;
}

.action-set-demo-frame :deep(.action-set) {
	top: 0.75rem;
	right: 0.75rem;
}

.action-set-demo-result {
	margin: 0;
	font-size: 0.85em;
}
</style>
