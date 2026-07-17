<template>
	<ClientOnly>
		<Desktop
			:available-doctypes="availableDoctypes"
			:route-adapter="routeAdapter"
			@action="run"
			@load-records="handleLoadRecords"
			@load-record="handleLoadRecord" />
		<template #fallback>
			<div class="loading">
				<p>Loading...</p>
			</div>
		</template>
	</ClientOnly>
</template>

<script setup lang="ts">
import { Desktop, type LoadRecordEventPayload, type LoadRecordsEventPayload } from '@stonecrop/desktop'
import { useStonecrop } from '@stonecrop/stonecrop'

import { useFullstackRouteAdapter } from '~/composables/useFullstackRouteAdapter'
import { doctypeMap, useDoctypeConfig, fetchDoctypeRecords, fetchDoctypeRecord } from '~/composables/useDoctypes'

const routeAdapter = useFullstackRouteAdapter()
const { stonecrop } = useStonecrop()
// Shared action executor (auto-imported from @stonecrop/nuxt): runs an action's
// clientHandler if present, else dispatches to the server handler + writes HST.
// Bound directly to Desktop's @action — no host-specific wrapper needed.
const { run } = useClientAction()

const availableDoctypes = computed(() => Array.from(doctypeMap.keys()))

async function handleLoadRecords(payload: LoadRecordsEventPayload) {
	const doctypeConfig = useDoctypeConfig(payload.doctype)
	if (!doctypeConfig || !stonecrop.value) {
		return
	}

	try {
		const { data } = await fetchDoctypeRecords({ name: doctypeConfig.name })
		for (const record of data) {
			const recordId = record.id as string
			if (recordId) {
				stonecrop.value.addRecord(payload.doctype, recordId, record)
			}
		}
	} catch (error) {
		console.error('Failed to load records:', error)
	}
}

async function handleLoadRecord(payload: LoadRecordEventPayload) {
	if (!stonecrop.value || payload.recordId.startsWith('new-')) return

	const doctypeConfig = useDoctypeConfig(payload.doctype)
	if (!doctypeConfig) return

	try {
		const record = await fetchDoctypeRecord({ name: doctypeConfig.name }, payload.recordId)
		if (record) {
			stonecrop.value.addRecord(payload.doctype, payload.recordId, record)
		}
	} catch (error) {
		console.error('Failed to load record:', error)
	}
}
</script>

<style>
.loading {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 50vh;
	color: #666;
}
</style>
