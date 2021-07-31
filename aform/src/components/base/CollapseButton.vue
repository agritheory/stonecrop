<template>
	<button
		class="collapse-button"
		:class="collapsed ? 'rotated' : 'unrotated'"
	>×</button>
</template>
<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
	props: ['collapsed'],
	setup(props, context){
	}
})
</script>
<style scoped>
.collapse-button {
	width: 2ch;
	min-width: calc(66px - 4ch);
	background-color: transparent;
	font-size: 150%;
	text-align: center;
	border: none;
	margin-top: -.5rem; 
}
.rotated {
	transform: rotate(45deg);
	-webkit-transform: rotate(45deg);
	-moz-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	-o-transform: rotate(45deg);
	transition: transform 250ms;
	transform-origin: center center;
}
.unrotated {
	transform: rotate(0deg);
	-webkit-transform: rotate(0deg);
	-moz-transform: rotate(0deg);
	-ms-transform: rotate(0deg);
	-o-transform: rotate(0deg);
	transition: transform 250ms;
}
</style>