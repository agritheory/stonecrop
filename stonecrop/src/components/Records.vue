<template>
	<ATable :key="rows" :columns="records.columns" :rows="rows" :config="records.config" />
</template>

<script setup lang="ts">
import { reactive, inject, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import { ATable } from '@agritheory/atable'

import Registry from '@/registry.js'

// use component if provided else call to Records Schema endpoint/ table  / lookup
// alteratively: a view: component map, eg records: Records, gantt: GanttView
// default_view key in schema
// last_used_view_type in application state

const route = useRoute()
const doctypeSlug = route.params.records.toString()

const rows = ref([])
onBeforeMount(async () => {
	const response = await fetch(`/${doctypeSlug}`)
	rows.value = await response.json()
})

const registry = inject<Registry>('$registry')
const schema = registry.loadDoctypeSchema({
	schemaLoader: () => {
		return [
			{
				label: 'Subject',
				name: 'subject',
				type: 'Data',
				align: 'left',
				edit: false,
				width: '35ch',
				// component: 'router-link'
			},
		]
	},
})

const records = reactive({
	columns: schema,
	config: { numberedRows: true, treeView: false },
})
</script>
