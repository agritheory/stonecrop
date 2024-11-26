<template>
	<portal to="beam_modal_outlet">
		<div class="beam_modal" v-show="showModal">
			<BeamBtn @click="$emit('closemodal')">Close Modal</BeamBtn>
			<slot @closemodal="$emit('closemodal')" @confirmmodal="$emit('confirmmodal')"></slot>
		</div>
	</portal>
</template>

<script setup lang="ts">
defineProps<{ showModal: boolean }>()
</script>

<style scoped>
.beam_modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(2px);
	z-index: 1000;
	text-align: center;
	padding: 1.25rem;
}
</style>
