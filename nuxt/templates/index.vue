<template>
	<ClientOnly>
		<Desktop
			:available-doctypes="availableDoctypes"
			:route-adapter="routeAdapter"
			@action="handleAction"
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
import {
	Desktop,
	type ActionEventPayload,
	type LoadRecordEventPayload,
	type LoadRecordsEventPayload,
} from '@stonecrop/desktop'
import { useStonecrop } from '@stonecrop/stonecrop'

import { useRouteAdapter } from '~/composables/useRouteAdapter'
import {
	doctypeMap,
	useDoctypeConfig,
	fetchDoctypeRecords,
	fetchDoctypeRecord,
	runDoctypeAction,
} from '~/composables/useDoctypes'

const routeAdapter = useRouteAdapter()
const { stonecrop } = useStonecrop()

const availableDoctypes = computed(() => Array.from(doctypeMap.keys()))

async function handleLoadRecords(payload: LoadRecordsEventPayload) {
	const doctypeConfig = useDoctypeConfig(payload.doctype)
	if (!doctypeConfig || !stonecrop.value) return

	try {
		const { data } = await fetchDoctypeRecords({ name: doctypeConfig.name })
		for (const record of data) {
			const recordId = record.id as string
			if (recordId) stonecrop.value.addRecord(payload.doctype, recordId, record)
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
		if (record) stonecrop.value.addRecord(payload.doctype, payload.recordId, record)
	} catch (error) {
		console.error('Failed to load record:', error)
	}
}

async function handleAction(payload: ActionEventPayload) {
	const doctypeConfig = useDoctypeConfig(payload.doctype)
	if (!doctypeConfig) return

	try {
		const result = await runDoctypeAction(doctypeConfig, payload.name, {
			id: payload.recordId,
			data: payload.data,
		})

		if (result.success && result.data && stonecrop.value && payload.recordId) {
			stonecrop.value.addRecord(payload.doctype, payload.recordId, result.data as Record<string, unknown>)
		}

		if (!result.success) console.error('Action failed:', result.error)
	} catch (error) {
		console.error('Action error:', error)
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
