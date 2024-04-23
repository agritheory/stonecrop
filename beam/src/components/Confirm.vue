<template>
	<div class="beam__modal-confirm">
		<h2>Would you like to continue?</h2>
		<button class="btn" @click="confirmModal">Yes</button>
		<button class="btn" @click="closeModal">No</button>
	</div>
</template>

<script setup lang="ts">
const emit = defineEmits(['confirmmodal', 'closemodal'])

const confirmModal = () => {
	emit('confirmmodal')
}
const closeModal = () => {
	emit('closemodal')
}
</script>
