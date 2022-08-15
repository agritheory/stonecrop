<template>
	<div ref="amodal" class="amodal" tabindex="-1" @click="handleInput" @input="handleInput">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

import TableDataStore from '.'

export default defineComponent({
	name: 'ATableModal',
	props: {
		colIndex: {
			type: Number,
			default: 0,
		},
		rowIndex: {
			type: Number,
			default: 0,
		},
		tableid: {
			type: String,
		},
	},
	setup(props) {
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

		return { tableData, handleInput }
	},
})
</script>

<style scoped>
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
