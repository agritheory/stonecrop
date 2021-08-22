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
		v-show="isVisible"
  >
    <slot />
  </div>
</template>
<script>
export default {
	name: 'ATableModal',
	props: {
		"event": {
			type: MouseEvent,
			required: false
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
	data(){
		return {
			modal: {
				left: '', top: '', width: '', parent: '', 
			},
			isVisible: false
		}
	},
	methods: {
		handleInput(event){
			event.stopPropagation()
		},
		clickOutside(event){
			console.log('click outside')
			if(!this.modal.parent.contains(event.target)){
				console.log('click outside')
				this.isVisible = false
			} else {
				event.stopPropagation()
			}
			event.target.blur()
		},
	},
	watch: {
		event(){
			console.log('event', this.$props.event)
			if(this.$props.event !== undefined) {
				this.isVisible = true
				const domRect = this.$props.event.target.getBoundingClientRect()
				this.modal.left = (domRect.left) + 'px'
				this.modal.top = (domRect.top + domRect.height) + 'px' 
				this.modal.width = (domRect.width) + 'px' // subtract padding
				this.modal.parent = this.$props.event.target
				window.addEventListener('click', this.clickOutside)
			}
		}
	}
}
</script>
<style scoped>
.amodal {
	z-index: 100;
	position: absolute;
}
</style>
