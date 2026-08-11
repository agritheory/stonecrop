<script setup lang="ts">
withDefaults(
	defineProps<{
		href: string
		title: string
		description: string
		color?: 'blue' | 'purple' | 'teal' | 'amber' | 'rose' | 'indigo'
	}>(),
	{ color: 'blue' }
)
</script>

<template>
	<a :href="href" class="card-grid-item" :class="`card-grid-item--${color}`">
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
		box-shadow 0.2s,
		transform 0.2s;
}

.card-grid-item:hover {
	border-color: var(--card-accent);
	box-shadow: 0 0 0 1px var(--card-accent);
	transform: translateY(-2px);
}

.card-grid-item__icon {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 6rem;
	background: var(--card-accent-soft);
	color: var(--card-accent);
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

/* Per-category palette — distinct hues so the grid reads as a set of categories at a glance,
   not a repeated tile. Dark-mode variants brighten the accent and keep the tint subtle via
   rgba over the page background, mirroring custom.css's own light/dark brand-color pattern. */
.card-grid-item--blue {
	--card-accent: #3b82f6;
	--card-accent-soft: #eff6ff;
}

.card-grid-item--purple {
	--card-accent: #8b5cf6;
	--card-accent-soft: #f5f3ff;
}

.card-grid-item--teal {
	--card-accent: #0d9488;
	--card-accent-soft: #f0fdfa;
}

.card-grid-item--amber {
	--card-accent: #d97706;
	--card-accent-soft: #fffbeb;
}

.card-grid-item--rose {
	--card-accent: #e11d48;
	--card-accent-soft: #fff1f2;
}

.card-grid-item--indigo {
	--card-accent: #4f46e5;
	--card-accent-soft: #eef2ff;
}

.dark .card-grid-item--blue {
	--card-accent: #60a5fa;
	--card-accent-soft: rgba(59, 130, 246, 0.14);
}

.dark .card-grid-item--purple {
	--card-accent: #a78bfa;
	--card-accent-soft: rgba(139, 92, 246, 0.14);
}

.dark .card-grid-item--teal {
	--card-accent: #2dd4bf;
	--card-accent-soft: rgba(13, 148, 136, 0.16);
}

.dark .card-grid-item--amber {
	--card-accent: #fbbf24;
	--card-accent-soft: rgba(217, 119, 6, 0.16);
}

.dark .card-grid-item--rose {
	--card-accent: #fb7185;
	--card-accent-soft: rgba(225, 29, 72, 0.14);
}

.dark .card-grid-item--indigo {
	--card-accent: #818cf8;
	--card-accent-soft: rgba(79, 70, 229, 0.16);
}
</style>
