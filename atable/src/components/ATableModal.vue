<template>
	<div class="amodal" tabindex="-1" @click="handleInput" @input="handleInput">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { createTableStore } from '../stores/table'

/* const { colIndex, rowIndex, store } = */ defineProps<{
	colIndex?: number
	rowIndex?: number
	store?: ReturnType<typeof createTableStore>
}>()

// const cellBackgroundColor = computed(() => {
// 	if (store.modal.parent) {
// 		let computedstyle = window.getComputedStyle(store.modal.parent)
// 		return 'blue'
// 	} else {
// 		return 'inherit'
// 	}
// })

const handleInput = (event: Event) => {
	event.stopPropagation()
}
</script>

<style>
@import url('@stonecrop/themes/default.css');

.amodal {
	position: fixed;
	background-color: var(--sc-row-color-zebra-dark);
	z-index: 100;
}
</style>
