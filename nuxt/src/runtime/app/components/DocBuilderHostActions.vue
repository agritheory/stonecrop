<template>
	<aside class="docbuilder-host-actions" aria-label="Page actions">
		<button
			v-for="el in elements"
			:key="el.label"
			type="button"
			class="docbuilder-host-actions__button"
			:disabled="el.type === 'button' ? el.disabled : false"
			@click="onClick(el)">
			{{ el.label }}
		</button>
	</aside>
</template>

<script setup lang="ts">
import type { ActionElements } from '@stonecrop/desktop'

const { elements = [] } = defineProps<{ elements?: ActionElements[] }>()

const emit = defineEmits<{
	actionClick: [label: string, action: (() => void | Promise<void>) | undefined]
}>()

function onClick(el: ActionElements) {
	if (el.type !== 'button') return
	emit('actionClick', el.label, el.action)
}
</script>

<style scoped>
.docbuilder-host-actions {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.5rem;
	position: fixed;
	right: 0.625rem;
	top: 35vh;
	z-index: 1001;
}

.docbuilder-host-actions__button {
	background: var(--sc-btn-color);
	border: 1px solid var(--sc-btn-border);
	border-radius: var(--sc-border-radius);
	color: var(--sc-btn-label-color);
	cursor: pointer;
	font-family: var(--sc-font-family);
	font-size: 1rem;
	font-weight: 600;
	padding: 0.35em 0.75em;
	white-space: nowrap;
}

.docbuilder-host-actions__button:hover:not(:disabled) {
	background: var(--sc-btn-hover);
}

.docbuilder-host-actions__button:disabled {
	cursor: not-allowed;
	opacity: 0.5;
}
</style>
