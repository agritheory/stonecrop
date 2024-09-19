<template>
	<div class="amodal" tabindex="-1" @click="handleInput" @input="handleInput">
		<slot />
	</div>
</template>

<script setup lang="ts">
// import { inject } from 'vue'

// import TableDataStore from '.'

/* const { colIndex, rowIndex, tableid } = */ defineProps<{
	colIndex?: number
	rowIndex?: number
	tableid?: string
}>()

// const tableData = inject<TableDataStore>(tableid)
// const cellBackgroundColor = computed(() => {
// 	if (tableData.modal.parent) {
// 		let computedstyle = window.getComputedStyle(tableData.modal.parent)
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
@import url('@stonecrop/themes/default/default.css');
</style>
