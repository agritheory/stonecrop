<script setup lang="ts">
const route = useRoute()

// A page reads the same at `/x` and `/x/`. Prerendering saves `/x` as `x/index.html`, which a static
// host such as GitHub Pages serves only by redirecting to `/x/`; keyed on that form, the page missed
// both its prerendered payload and its content, and hydrated empty.
const path = route.path.length > 1 ? route.path.replace(/\/$/, '') : route.path

const { data: page } = await useAsyncData(path, () => queryCollection('docs').path(path).first())

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
