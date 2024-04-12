<template>
	<portal-target name="beam__modal_outlet" />
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
