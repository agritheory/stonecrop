<template>
	<portal to="beam_modal_outlet">
		<div class="beam_modal" v-show="showModal">
			<button class="beam_btn" @click="$emit('closemodal')">Close Modal</button>
			<slot @closemodal="$emit('closemodal')" @confirmmodal="$emit('confirmmodal')"></slot>
		</div>
	</portal>
</template>

<script setup lang="ts">
defineProps<{ showModal: boolean }>()
</script>
