<template>
	<ATable :key="records.rows" :columns="records.columns" :rows="records.rows" :config="records.config" />
</template>

<script setup lang="ts">
import { reactive, inject } from 'vue'
import { useRoute } from 'vue-router'

import { ATable } from '@agritheory/atable'

import Registry from '@/registry'

// TODO: use component if provided else call to Records Schema endpoint/ table  / lookup
// alteratively: a view: component map, eg records: Records, gantt: GanttView
// default_view key in schema
// last_used_view_type in application state

const route = useRoute()

// get schema
const registry = inject<Registry>('$registry')
const doctypeSlug = route.params.records
const schemaDetails = registry.schemaLoader(doctypeSlug.toString())
const schema = schemaDetails.schema

// get data
const records = reactive({
	rows: route.params.recordsData,
	columns: schema,
	config: { numberedRows: true, treeView: false },
})
</script>
