<template>
	<portal to="beam__modal_outlet">
		<div class="beam__modal" v-show="showModal">
			<button @click="$emit('closemodal')">Close Modal</button>
			<slot @closemodal="$emit('closemodal')" @confirmmodal="$emit('confirmmodal')"></slot>
		</div>
	</portal>
</template>
<script>
export default {
	name: 'BeamModal',
	props: ['showModal'],
}
</script>
<style scoped>
.beam__modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: white;
	z-index: 1000;
}
</style>
