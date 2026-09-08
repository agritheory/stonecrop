<template>
	<div class="rail-panel">
		<p class="rail-panel__hint">Collaboration (specimen — discussion timeline deferred)</p>
		<ul class="rail-panel__list">
			<li v-for="entry in entries" :key="entry.id">{{ entry.summary }}</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
const entries = [{ id: 'c-1', summary: 'No comments yet.' }]
</script>

<style scoped>
.rail-panel {
	padding: 1rem;
	font-family: var(--sc-font-family);
}

.rail-panel__hint {
	margin: 0 0 0.75rem;
	color: var(--sc-gray-60);
	font-size: 0.875rem;
}

.rail-panel__list {
	list-style: none;
	margin: 0;
	padding: 0;
	color: var(--sc-gray-80);
}

.rail-panel__list li + li {
	margin-top: 0.5rem;
}
</style>
