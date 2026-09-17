<script setup lang="ts">
defineProps<{
	href: string
	title: string
	description: string
}>()
</script>

<template>
	<NuxtLink :to="href" class="card-grid-item">
		<h3 class="card-grid-item__title">{{ title }}</h3>
		<p class="card-grid-item__description">{{ description }}</p>
	</NuxtLink>
</template>
