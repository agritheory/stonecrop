<template>
	<ATable :key="stonecropKey" :columns="records.columns" :rows="records.rows" :config="records.config" />
</template>

<script setup lang="ts">
import { reactive, inject, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { SchemaTypes } from '@agritheory/aform/types'
import { ATable } from '@agritheory/atable'
import { Registry, useStonecrop } from '@agritheory/stonecrop'

// TODO: use component if provided else call to Records Schema endpoint/ table  / lookup
// alteratively: a view: component map, eg records: Records, gantt: GanttView
// default_view key in schema
// last_used_view_type in application state

const route = useRoute()
const registry = inject<Registry>('$registry')
const { stonecrop } = useStonecrop(route, registry)
let stonecropKey = 0

// get data
const records = reactive({
	rows: [] as any[], // Pinia
	columns: [] as SchemaTypes[],
	config: { view: 'list' },
})

watch(stonecrop, (newVal, oldVal) => {
	if (newVal !== oldVal) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		records.columns = newVal.schema.schema.toArray()
		records.rows = newVal.data
		stonecropKey++
	}
})
</script>
