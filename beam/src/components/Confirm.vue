<template>
	<div>
		Would you like to continue?<br />
		<button @click="confirmModal">Yes</button>
		<br />
		<button @click="closeModal">No</button>
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
