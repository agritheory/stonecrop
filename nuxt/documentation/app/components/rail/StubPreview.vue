<template>
	<div class="stub-preview">
		<h3 class="stub-preview__title">{{ title }}</h3>
		<p class="stub-preview__body">{{ body }}</p>
	</div>
</template>

<script setup lang="ts">
const { title = 'Preview', body = 'Host-owned preview view. Desktop only splits the workspace.' } = defineProps<{
	title?: string
	body?: string
}>()
</script>

<style scoped>
.stub-preview {
	padding: 1.25rem;
	font-family: var(--sc-font-family);
	color: var(--sc-gray-80);
}

.stub-preview__title {
	margin: 0 0 0.5rem;
	font-size: 1rem;
}

.stub-preview__body {
	margin: 0;
	color: var(--sc-gray-60);
	line-height: 1.5;
}
</style>
