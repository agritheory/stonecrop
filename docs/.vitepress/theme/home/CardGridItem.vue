<script setup lang="ts">
defineProps<{
	href: string
	title: string
	description: string
}>()
</script>

<template>
	<a :href="href" class="card-grid-item">
		<div class="card-grid-item__icon">
			<slot name="icon" />
		</div>
		<div class="card-grid-item__body">
			<h3 class="card-grid-item__title">{{ title }}</h3>
			<p class="card-grid-item__description">{{ description }}</p>
		</div>
	</a>
</template>

<style scoped>
.card-grid-item {
	display: block;
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	overflow: hidden;
	text-decoration: none;
	color: inherit;
	transition:
		border-color 0.2s,
		box-shadow 0.2s;
}

.card-grid-item:hover {
	border-color: var(--vp-c-brand-1);
	box-shadow: 0 0 0 1px var(--vp-c-brand-1);
}

.card-grid-item__icon {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 6rem;
	background: var(--vp-c-bg-soft);
	color: var(--vp-c-brand-1);
}

.card-grid-item__icon :deep(svg) {
	width: 2rem;
	height: 2rem;
}

.card-grid-item__body {
	padding: 1rem 1.25rem;
	background: var(--vp-c-bg);
}

.card-grid-item__title {
	margin: 0 0 0.25rem;
	padding: 0;
	border: none;
	font-size: 1rem;
	font-weight: 600;
}

.card-grid-item__description {
	margin: 0;
	font-size: 0.85rem;
	color: var(--vp-c-text-2);
}
</style>
