<template>
	<div class="route-key-fixture">
		<div data-route-view>{{ currentView }}</div>
		<div data-doctype-slug>{{ currentSlug }}</div>
		<ul>
			<li v-for="label in fieldLabels" :key="label">{{ label }}</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { resolveDoctypeSlugFromSegments, resolveRouteView } from '@route-utils'

import { doctypeMap, routeToSlugMap } from '~/composables/useDoctypes'

const route = useRoute()

const pathSegments = computed(() => {
	const pathMatch = route.params.pathMatch as string[] | undefined
	return pathMatch ?? []
})

const currentView = computed(() => {
	if (!pathSegments.value.length) return 'doctypes'
	return resolveRouteView(pathSegments.value, routeToSlugMap)
})

watchEffect(() => {
	if (currentView.value === 'notFound') {
		showError({ statusCode: 404, statusMessage: 'Not Found' })
	}
})

const currentSlug = computed(() => {
	if (!pathSegments.value.length || currentView.value === 'notFound') return ''
	try {
		return resolveDoctypeSlugFromSegments(pathSegments.value, routeToSlugMap)
	} catch {
		return ''
	}
})

const fieldLabels = computed(() => {
	const config = doctypeMap.get(currentSlug.value)
	if (!config?.fields) return []
	return config.fields
		.map(field => ('label' in field ? field.label : undefined))
		.filter((label): label is string => Boolean(label))
})
</script>
