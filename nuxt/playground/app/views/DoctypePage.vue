<!-- eslint-disable vue/multi-word-component-names -->
<!--
	Generic list/detail page for every doctype, mounted by the module's
	routeStrategy at /:doctype and /:doctype/:id. Lives outside pages/ so
	Nuxt's file-based routing doesn't also register it as its own route.
-->
<template>
	<ClientOnly>
		<Desktop
			:available-doctypes="availableDoctypes"
			:route-adapter="routeAdapter"
			@load-records="handleLoadRecords"
			@load-record="handleLoadRecord"
			@action="handleAction" />
		<template #fallback>
			<div class="loading"><p>Loading…</p></div>
		</template>
	</ClientOnly>
</template>

<script setup lang="ts">
import {
	Desktop,
	type LoadRecordsEventPayload,
	type LoadRecordEventPayload,
	type ActionEventPayload,
} from '@stonecrop/desktop'
import { useStonecrop } from '@stonecrop/stonecrop'
import { useDoctypeRouteAdapter } from '~/composables/useDoctypeRouteAdapter'
import { doctypeMap } from '~/composables/useDoctypes'

const routeAdapter = useDoctypeRouteAdapter()
const { stonecrop } = useStonecrop()
const availableDoctypes = computed(() => Array.from(doctypeMap.keys()))

// Use $fetch against nuxt-graphql-middleware server routes
// These are safe to call anywhere — not restricted to <script setup>
const BASE = '/api/graphql_middleware/query'

// Doctypes backed by a GraphQL operation. Anything else in doctypes/ is a
// docbuilder sample fixture (issue, assignment, user) with no data source —
// the handlers below render those as an empty list instead of a failed fetch.
const LIST_QUERIES: Record<string, { operation: string; key: string }> = {
	country: { operation: 'Countries', key: 'countries' },
	continent: { operation: 'Continents', key: 'continents' },
	language: { operation: 'Languages', key: 'languages' },
}

const DETAIL_QUERIES: Record<string, { operation: string; key: string }> = {
	country: { operation: 'Country', key: 'country' },
	continent: { operation: 'Continent', key: 'continent' },
}

async function handleLoadRecords(payload: LoadRecordsEventPayload) {
	if (!stonecrop.value) return
	const slug = payload.doctype

	const source = LIST_QUERIES[slug]
	if (!source) {
		console.info(`[playground] "${slug}" has no GraphQL data source — it is a docbuilder sample doctype`)
		return
	}

	try {
		const res = await $fetch<{ data: Record<string, any[]> }>(`${BASE}/${source.operation}`)
		const records = res.data?.[source.key] ?? []

		for (const record of records) {
			const id = record.code as string
			if (id) stonecrop.value.addRecord(slug, id, record)
		}
	} catch (e) {
		console.error('Failed to load records:', e)
	}
}

async function handleLoadRecord(payload: LoadRecordEventPayload) {
	if (!stonecrop.value || payload.recordId.startsWith('new-')) return
	const { doctype: slug, recordId } = payload

	const source = DETAIL_QUERIES[slug]
	if (!source) return

	try {
		const res = await $fetch<{ data: Record<string, any> }>(
			`${BASE}/${source.operation}?variables=${encodeURIComponent(JSON.stringify({ code: recordId }))}`
		)
		const record = res.data?.[source.key]

		if (record) stonecrop.value.addRecord(slug, recordId, record)
	} catch (e) {
		console.error('Failed to load record:', e)
	}
}

async function handleAction(_payload: ActionEventPayload) {
	// The countries API is read-only — no mutations to dispatch
}
</script>

<style scoped>
.loading {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 50vh;
}
</style>
