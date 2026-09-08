<template>
	<div class="stub-file-preview">
		<h3>{{ name }}</h3>
		<p>Host-owned preview view (50% pane specimen).</p>
	</div>
</template>

<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<style scoped>
.stub-file-preview {
	padding: 1rem;
	font-family: var(--sc-font-family);
}

.stub-file-preview h3 {
	margin: 0 0 0.5rem;
	color: var(--sc-gray-80);
}
</style>
