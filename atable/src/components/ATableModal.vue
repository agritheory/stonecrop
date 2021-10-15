<template>
  <div
    ref="amodal"
    class="amodal"
    :style="{
      left: modal.left, top: modal.top, width: modal.width
    }"
    tabindex="-1"
    @click="handleInput"
    @input="handleInput"
		v-show="TableData.modal.visible"
  >
    <slot />
  </div>
</template>
<script>
import { ref, defineComponent, inject, watch } from 'vue'
import { v4 } from "uuid"

export default defineComponent({
	name: "ATableModal",
	props: {
		"event": {
			type: String,
			required: false,
		},
		"colIndex": {
			type: Number,
			required: false,
			default: 0
		},
		"rowIndex": {
			type: Number,
			required: false,
			default: 0
		},
		"tableid": {
			type: String,
			required: false,
			default: () => {return undefined}
		}
	},
	setup(props, context){
		const TableData = inject(props.tableid)

		let modal = ref({left: 0, top: 0, width: 0})

		function handleInput(event){
			event.stopPropagation()
		}

		function clickOutside(event){
			if(TableData.modal.parent.contains(event.target)){
				console.log('click outside')
				TableData.modal.visible = false
			} else {
				event.stopPropagation()
			}
			event.target.blur()
		}

		watch(TableData.modal, () => {
			console.log(TableData.modal)
			window.addEventListener('click', clickOutside)
		})

		return { TableData, handleInput, modal}
	}
})
</script>
<style scoped>
.amodal {
	z-index: 100;
	position: absolute;
}
</style>
