<template>
	<div ref="amodal" class="amodal" tabindex="-1" @click="handleInput" @input="handleInput">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

import TableDataStore from '.'

const props = defineProps<{
	colIndex?: number
	rowIndex?: number
	tableid?: string
}>()

const tableData = inject<TableDataStore>(props.tableid)

const handleInput = (event: Event) => {
	event.stopPropagation()
}

// const cellBackgroundColor = computed(() => {
// 	if (tableData.modal.parent) {
// 		let computedstyle = window.getComputedStyle(tableData.modal.parent)
// 		return 'blue'
// 	} else {
// 		return 'inherit'
// 	}
// })
</script>

<style scoped>
@import url('@stonecrop/themes/default/default.css');
div {
	z-index: 100;
	position: absolute;
	background-color: var(--row-color-zebra-dark);
	/* margin: 0px;
	outline: none;
	box-shadow: none;
	color: var(--cell-text-color);
	text-overflow: ellipsis;
	overflow: hidden;
	padding-left: 0.5ch;
	padding-right: 0.5ch;
	font-size: var(--table-font-size); */
}
</style>
