<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => queryCollection('docs').path(route.path).first())

if (!page.value) {
	throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// Every content file already carries `title` and `description`; without this nothing reads them
// and each page ships with no <title> and no meta description at all.
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
