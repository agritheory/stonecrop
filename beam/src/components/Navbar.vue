<template>
	<nav class="beam_navbar">
		<slot name="title">
			<h1 class="beam_header">TITLE</h1>
		</slot>
		<button class="navbar-action beam_btn" @click="handlePrimaryAction">
			<slot name="navbaraction">Action</slot>
		</button>
	</nav>
</template>

<script setup lang="ts">
const emit = defineEmits<{ click: [] }>()

const handlePrimaryAction = () => {
	emit('click')
}
</script>
