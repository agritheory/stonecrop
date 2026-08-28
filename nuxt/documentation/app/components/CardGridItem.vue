<script setup lang="ts">
withDefaults(
	defineProps<{
		href: string
		title: string
		description: string
		color?: 'blue' | 'purple' | 'teal' | 'amber' | 'rose' | 'indigo' | 'green'
	}>(),
	{ color: 'green' }
)
</script>

<template>
	<NuxtLink :to="href" class="card-grid-item" :class="`card-grid-item--${color}`">
		<h3 class="card-grid-item__title">{{ title }}</h3>
		<p class="card-grid-item__description">{{ description }}</p>
	</NuxtLink>
</template>
