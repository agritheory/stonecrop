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

// Data loading goes through nuxt-graphql-middleware's generated composables:
// each closure is type-checked against the generated operation types (name,
// variables, and response shape), and the requests hit the same server routes
// the middleware compiles from app/graphql/**. Doctypes without a loader are
// docbuilder sample fixtures (issue, assignment, user) with no data source —
// the handlers render those as an empty list instead of a failed fetch.
// The API's ID scalar generates as `string | number`
type DoctypeRecord = { code: string | number }

const LIST_LOADERS: Record<string, () => Promise<readonly DoctypeRecord[]>> = {
	country: async () => (await useGraphqlQuery('Countries', {})).data?.countries ?? [],
	continent: async () => (await useGraphqlQuery('Continents', {})).data?.continents ?? [],
	language: async () => (await useGraphqlQuery('Languages', {})).data?.languages ?? [],
}

const DETAIL_LOADERS: Record<string, (code: string) => Promise<DoctypeRecord | null>> = {
	country: async code => (await useGraphqlQuery('Country', { code })).data?.country ?? null,
	continent: async code => (await useGraphqlQuery('Continent', { code })).data?.continent ?? null,
	language: async code => (await useGraphqlQuery('Language', { code })).data?.language ?? null,
}

async function handleLoadRecords(payload: LoadRecordsEventPayload) {
	if (!stonecrop.value) return
	const slug = payload.doctype

	const load = LIST_LOADERS[slug]
	if (!load) {
		console.info(`[playground] "${slug}" has no GraphQL data source — it is a docbuilder sample doctype`)
		return
	}

	// Key rows by whatever the doctype declares identifies a record. Every doctype here is
	// natural-keyed — there is no `id` column anywhere in the countries schema — so this is the
	// only thing that works, and it is resolved from the declaration rather than hardcoded to
	// `code`, which is what makes this app live coverage of the natural-key path.
	const doctype = stonecrop.value.registry.getDoctype(slug)

	try {
		for (const record of await load()) {
			const recordId = doctype?.getRecordId(record)
			if (recordId === undefined) {
				console.warn(`Skipping a ${slug} record with no resolvable identity:`, record)
				continue
			}
			stonecrop.value.addRecord(slug, recordId, record)
		}
	} catch (e) {
		console.error('Failed to load records:', e)
	}
}

async function handleLoadRecord(payload: LoadRecordEventPayload) {
	// Desktop does not emit this for an unsaved draft, so there is no draft id to screen out here.
	if (!stonecrop.value) return
	const { doctype: slug, recordId } = payload

	const load = DETAIL_LOADERS[slug]
	if (!load) return

	try {
		const record = await load(recordId)
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
