<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { Registry, Stonecrop } from '@stonecrop/stonecrop'
import { Desktop, type ActionElements } from '@stonecrop/desktop'

const registry = new Registry()
const stonecrop = new Stonecrop(registry)
provide('$registry', registry)
provide('$stonecrop', stonecrop)

const lastAction = ref('')

const hostActions = computed<ActionElements[]>(() => [
	{ type: 'button', label: 'Save', action: () => (lastAction.value = 'Save') },
	{
		type: 'dropdown',
		label: 'More',
		actions: [
			{ label: 'Duplicate', action: () => (lastAction.value = 'Duplicate') },
			{ label: 'Delete', action: () => (lastAction.value = 'Delete') },
		],
	},
])

const routeAdapter = {
	getCurrentDoctype: () => '',
	getCurrentRecordId: () => '',
	getCurrentView: () => 'doctypes' as const,
	navigate: () => {},
}
</script>

<template>
	<div class="stonecrop-demo action-set-demo-frame">
		<Desktop class="action-set-demo-desktop" :route-adapter="routeAdapter" :host-actions="hostActions">
			<p class="action-set-demo-content">Document content. Expand the tile column and open Actions.</p>
			<p v-if="lastAction" class="action-set-demo-result">
				Last action: <strong>{{ lastAction }}</strong>
			</p>
		</Desktop>
	</div>
</template>

<style scoped>
.action-set-demo-frame {
	position: relative;
	min-height: 14rem;
	overflow: hidden;
	border: 1px solid var(--sc-gray-20, #e5e7eb);
}

.action-set-demo-desktop {
	height: 14rem;
}

.action-set-demo-frame :deep(.action-set) {
	top: 0.75rem;
	right: 0.75rem;
}

.action-set-demo-content {
	margin: 0;
	padding: 1rem;
	max-width: 70%;
}

.action-set-demo-result {
	margin: 0.5rem 0 0;
	padding: 0 1rem;
	font-size: 0.85em;
}
</style>
