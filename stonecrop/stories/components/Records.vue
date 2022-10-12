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

// get data
const records = reactive({
	rows: route.params.recordsData,
	columns: [] as SchemaTypes[],
	config: { numberedRows: true, treeView: false },
})

onBeforeMount(async () => {
	// get schema
	const registry = inject<Registry>('$registry')
	const doctypeSlug = route.params.records
	const schemaDetails = await registry.schemaLoader(doctypeSlug.toString())
	records.columns = schemaDetails.schema
})
</script>
