<template>
	<button
		type="button"
		class="expansion-index"
		:aria-expanded="expanded"
		:aria-label="expanded ? 'Collapse' : 'Expand'">
		{{ expanded ? '▼' : '►' }}
	</button>
</template>

<script setup lang="ts">
defineProps<{
	expanded: boolean
}>()
</script>

<style scoped>
.expansion-index {
	color: var(--sc-header-text-color);
	font-weight: bold;
	font-size: 11px;
	line-height: 1;
	text-align: center;
	user-select: none;
	width: 2ch;
	min-width: 1.25rem;
	height: 1.25rem;
	padding: 0;
	border: none;
	background: transparent;
	cursor: pointer;
	box-sizing: border-box;
}
</style>
