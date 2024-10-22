<template>
	<nav class="beam_navbar">
		<slot name="title">
			<BeamHeading>TITLE</BeamHeading>
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
