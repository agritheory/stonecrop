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
			required: true
		},
		"colIndex": {
			type: Number,
			required: true,
			default: 0
		},
		"rowIndex": {
			type: Number,
			required: true,
			default: 0
		},
		"tableid": {
			type: String,
			required: true,
			default: () => {return undefined}
		}
	},
	data(){
		return {modal: {left: '', top: '', width: ''}}
	},
	created() {
		const domRect = this.$props.event.target.getBoundingClientRect()
		this.modal.left = (domRect.left - 2) + 'px'
		this.modal.top = (domRect.top + domRect.height - 2) + 'px' 
		this.modal.width = (domRect.width - 4) + 'px' // subtract padding
		window.addEventListener('click', this.clickOutside)
	},
	methods: {
		handleInput(event){
			event.stopPropagation()
		},
		clickOutside(event){
			if(!this.$el.parentElement.contains(event.target)){
				this.destroy()
			} else {
				event.stopPropagation()
			}
			event.target.blur()
		},
		destroy(){
			window.removeEventListener('click', this.clickOutside, false)
			this.$emit('change', this.cellData)
			this.$el.parentElement.removeChild(this.$el)
		},
	}
}
</script>
<style scoped>
.amodal {
	border-width: 0px;
	z-index: 100;
	position: absolute;
}
</style>
