<template>
	<ClientOnly>
		<Desktop
			:available-doctypes="availableDoctypes"
			:route-adapter="routeAdapter"
			@action="run"
			@load-records="handleLoadRecords"
			@load-record="handleLoadRecord" />
		<template #fallback>
			<div class="sc-loading">
				<p>Loading...</p>
			</div>
		</template>
	</ClientOnly>
</template>

<script setup lang="ts">
import { Desktop, type LoadRecordEventPayload, type LoadRecordsEventPayload } from '@stonecrop/desktop'
import { useStonecrop } from '@stonecrop/stonecrop'

import { useRouteAdapter } from '~/composables/useRouteAdapter'
import { doctypeMap, useDoctypeConfig, fetchDoctypeRecords, fetchDoctypeRecord } from '~/composables/useDoctypes'

const routeAdapter = useRouteAdapter()
const { stonecrop } = useStonecrop()
// Shared action executor, auto-imported from @stonecrop/nuxt: it runs an action's clientHandler
// when the doctype declares one, otherwise dispatches to the server, and writes the result back
// into the store under the identity the server settled on — a Save against a record that does not
// exist creates it, so that identity is not always the one the form dispatched. Bound straight to
// Desktop's @action; a host-written wrapper would have to restate all of that.
const { run } = useClientAction()

const availableDoctypes = computed(() => Array.from(doctypeMap.keys()))

async function handleLoadRecords(payload: LoadRecordsEventPayload) {
	const doctypeConfig = useDoctypeConfig(payload.doctype)
	if (!doctypeConfig || !stonecrop.value) return

	// Key rows by whatever the doctype declares identifies a record, not a hardcoded `id`. A
	// natural-keyed doctype has no `id` column at all, so reading one drops every row and the list
	// renders empty. This is the same rule the server looks records up by, so a row is stored under
	// the key its Edit link will ask for.
	const doctype = stonecrop.value.registry.getDoctype(payload.doctype)

	try {
		const { data } = await fetchDoctypeRecords({ name: doctypeConfig.name })
		for (const record of data) {
			const recordId = doctype?.getRecordId(record)
			if (recordId === undefined) {
				console.warn(`Skipping a ${payload.doctype} record with no resolvable identity:`, record)
				continue
			}
			stonecrop.value.addRecord(payload.doctype, recordId, record)
		}
	} catch (error) {
		console.error('Failed to load records:', error)
	}
}

async function handleLoadRecord(payload: LoadRecordEventPayload) {
	// Desktop does not emit this for an unsaved draft, so there is no draft id to screen out here.
	if (!stonecrop.value) return

	const doctypeConfig = useDoctypeConfig(payload.doctype)
	if (!doctypeConfig) return

	try {
		const record = await fetchDoctypeRecord({ name: doctypeConfig.name }, payload.recordId)
		if (record) stonecrop.value.addRecord(payload.doctype, payload.recordId, record)
	} catch (error) {
		console.error('Failed to load record:', error)
	}
}
</script>

<style>
.sc-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 50vh;
	color: #666;
}
</style>
