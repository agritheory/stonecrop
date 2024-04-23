<template>
	<div id="scan_input"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['scaninput'])
const barcode = ref('')

const handleScanInput = (event: InputEvent | KeyboardEvent) => {
	if (event.target.tagName !== 'INPUT') {
		if (event.key !== 'Enter') {
			barcode.value += `${event.key}`
		} else {
			emit('scaninput', barcode.value)
			barcode.value = ''
		}
	}
}

onMounted(() => {
	document.addEventListener('keypress', event => {
		handleScanInput(event)
	})
})

onUnmounted(() => {
	window.removeEventListener('keypress', event => {
		handleScanInput(event)
	})
})
</script>
