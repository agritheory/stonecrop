<template>
	<portal to="beam__modal_outlet">
		<div class="beam__modal" v-show="showModal">
			<button class="btn" @click="$emit('closemodal')">Close Modal</button>
			<slot @closemodal="$emit('closemodal')" @confirmmodal="$emit('confirmmodal')"></slot>
		</div>
	</portal>
</template>

<script setup lang="ts">
defineProps<{ showModal: boolean }>()
</script>
