<template>
	<ATable :key="records.columns" :columns="records.columns" :rows="records.rows" :config="records.config" />
</template>

<script setup lang="ts">
import { reactive, inject, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

import { SchemaTypes } from '@agritheory/aform/types'
import { ATable } from '@agritheory/atable'

import Registry from '@/registry'

// TODO: use component if provided else call to Records Schema endpoint/ table  / lookup
// alteratively: a view: component map, eg records: Records, gantt: GanttView
// default_view key in schema
// last_used_view_type in application state

const route = useRoute()
const registry = inject<Registry>('$registry')

// get data
const records = reactive({
	rows: route.params.recordsData,
	columns: [] as SchemaTypes[],
	config: { numberedRows: true, treeView: false },
})

onBeforeMount(async () => {
	// get schema
	const doctypeSlug = route.params.records.toString()
	const schemaDetails = await registry.schemaLoader(doctypeSlug)
	records.columns = schemaDetails.schema
})
</script>
