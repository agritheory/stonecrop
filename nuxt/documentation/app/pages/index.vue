<script setup lang="ts">
definePageMeta({
	layout: 'default',
})

const { data: page } = await useAsyncData('docs-index', () => queryCollection('docs').path('/').first())

if (!page.value) {
	throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
	title: () => page.value?.title,
	description: () => page.value?.description,
	ogTitle: () => page.value?.title,
	ogDescription: () => page.value?.description,
})
</script>

<template>
	<ContentRenderer v-if="page" :value="page" />
</template>
