<template>
	<nav class="beam__navbar">
		<slot name="title">
			<h1 class="nav-title">TITLE</h1>
		</slot>
		<div class="navbar-action-wrapper">
			<button class="navbar-action btn" @click="handlePrimaryAction">
				<slot name="navbaraction">Action</slot>
			</button>
		</div>
	</nav>
</template>

<script setup lang="ts">
const emit = defineEmits<{ click: [] }>()

const handlePrimaryAction = () => {
	emit('click')
}
</script>
