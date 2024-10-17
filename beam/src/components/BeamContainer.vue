<template>
	<div :style="{ padding: padding || '1rem' }" class="beam_container">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
defineProps({
	padding: String,
})
</script>
<style scoped></style>
