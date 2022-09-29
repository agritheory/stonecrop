<template>
	<ATable :columns="records.columns" :rows="records.rows" :config="records.config" />
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ATable } from '@agritheory/atable'

// use component if provided else call to Records Schema endpoint/ table  / lookup
// alteratively: a view: component map, eg records: Records, gantt: GanttView
// default_view key in schema
// last_used_view_type in application state

const data = [
	{ subject: 'First To Do' },
	{ subject: 'Second To Do' },
	{ subject: 'Third To Do' },
	{ subject: 'Fourth To Do' },
]
const records = reactive({
	rows: data,
	columns: [
		{
			label: 'Subject',
			name: 'subject',
			type: 'Data',
			align: 'left',
			edit: false,
			width: '35ch',
			// component: 'router-link'
		},
	],
	config: { numberedRows: true, treeView: false },
})
</script>
