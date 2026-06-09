<!-- eslint-disable vue/multi-word-component-names -->
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
import { useCountriesRouteAdapter } from '~/composables/useCountriesRouteAdapter'
import { doctypeMap } from '~/composables/useDoctypes'

const routeAdapter = useCountriesRouteAdapter()
const { stonecrop } = useStonecrop()
const availableDoctypes = computed(() => Array.from(doctypeMap.keys()))

// Use $fetch against nuxt-graphql-middleware server routes
// These are safe to call anywhere — not restricted to <script setup>
const BASE = '/api/graphql_middleware/query'

async function handleLoadRecords(payload: LoadRecordsEventPayload) {
	if (!stonecrop.value) return
	const slug = payload.doctype

	try {
		let records: any[] = []

		if (slug === 'country') {
			const res = await $fetch<{ data: { countries: any[] } }>(`${BASE}/Countries`)
			records = res.data?.countries ?? []
		} else if (slug === 'continent') {
			const res = await $fetch<{ data: { continents: any[] } }>(`${BASE}/Continents`)
			records = res.data?.continents ?? []
		} else if (slug === 'language') {
			const res = await $fetch<{ data: { languages: any[] } }>(`${BASE}/Languages`)
			records = res.data?.languages ?? []
		}

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

	try {
		let record: any = null

		if (slug === 'country') {
			const res = await $fetch<{ data: { country: any } }>(
				`${BASE}/Country?variables=${encodeURIComponent(JSON.stringify({ code: recordId }))}`
			)
			record = res.data?.country
		} else if (slug === 'continent') {
			const res = await $fetch<{ data: { continent: any } }>(
				`${BASE}/Continent?variables=${encodeURIComponent(JSON.stringify({ code: recordId }))}`
			)
			record = res.data?.continent
		}

		if (record) stonecrop.value.addRecord(slug, recordId, record)
	} catch (e) {
		console.error('Failed to load record:', e)
	}
}

async function handleAction(_payload: ActionEventPayload) {
	// Countries API is read-only
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
