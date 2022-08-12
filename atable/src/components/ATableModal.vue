<template>
	<div ref="amodal" class="amodal" tabindex="-1" @click="handleInput" @input="handleInput">
		<slot />
	</div>
</template>
<script>
import { defineComponent, inject, computed } from 'vue'

export default defineComponent({
	name: 'ATableModal',
	props: {
		colIndex: {
			type: Number,
			required: false,
			default: 0,
		},
		rowIndex: {
			type: Number,
			required: false,
			default: 0,
		},
		tableid: {
			type: String,
			required: false,
		},
	},
	setup(props) {
		const TableData = inject(props.tableid)

		function handleInput(event) {
			event.stopPropagation()
		}

		// const cellBackgroundColor = computed(() => {
		// 	console.log('cellBGColor')
		// 	if(TableData.modal.parent){
		// 		let computedstyle = window.getComputedStyle(TableData.modal.parent)
		// 		console.log('computedstyle.backgroundColor', computedstyle.backgroundColor)
		// 		return 'blue'
		// 	} else {
		// 		return 'inherit'
		// 	}
		// })

		return { TableData, handleInput }
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
