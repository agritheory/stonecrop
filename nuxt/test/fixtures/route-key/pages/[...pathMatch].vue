<template>
	<div class="route-key-fixture">
		<div data-route-view>{{ resolved.view }}</div>
		<div data-doctype-slug>{{ resolved.slug }}</div>
		<div data-record-id>{{ resolved.recordId }}</div>
		<ul>
			<li v-for="label in fieldLabels" :key="label">{{ label }}</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { doctypeMap, doctypeRoutes } from '~/composables/useDoctypes'

const route = useRoute()

const resolved = computed(() => doctypeRoutes.resolve((route.params.pathMatch as string[] | undefined) ?? []))

watchEffect(() => {
	if (resolved.value.view === 'notFound') {
		showError({ statusCode: 404, statusMessage: 'Not Found' })
	}
})

const fieldLabels = computed(() => {
	const config = doctypeMap.get(resolved.value.slug)
	if (!config?.fields) return []
	return config.fields
		.map(field => ('label' in field ? field.label : undefined))
		.filter((label): label is string => Boolean(label))
})
</script>
