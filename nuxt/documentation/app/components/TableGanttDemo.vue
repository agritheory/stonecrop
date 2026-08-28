<script setup lang="ts">
import { ref } from 'vue'
import { ATable, type TableColumn, type TableRow } from '@stonecrop/atable'

// For a Gantt view, the first `pinned` column is the row label; every column after it forms the
// timeline backdrop that each row's `gantt` field (startIndex/endIndex, both column-index based)
// draws a bar across.
const columns = ref<TableColumn[]>([
	{ label: 'Task', name: 'task', align: 'left', edit: false, width: '16ch', pinned: true },
	{ label: 'Week 1', name: 'w1', align: 'center', edit: false, width: '10ch' },
	{ label: 'Week 2', name: 'w2', align: 'center', edit: false, width: '10ch' },
	{ label: 'Week 3', name: 'w3', align: 'center', edit: false, width: '10ch' },
	{ label: 'Week 4', name: 'w4', align: 'center', edit: false, width: '10ch' },
])

const rows = ref<TableRow[]>([
	{ id: '1', task: 'Design', gantt: { startIndex: 0, endIndex: 1, color: '#4c9aff' } },
	{ id: '2', task: 'Build', gantt: { startIndex: 1, endIndex: 3, color: '#5a8a5a' } },
	{ id: '3', task: 'Launch', gantt: { startIndex: 3, endIndex: 4, color: '#d97706' } },
])
</script>

<template>
	<div class="stonecrop-demo">
		<ATable v-model:rows="rows" v-model:columns="columns" :config="{ view: 'gantt' }" />
	</div>
</template>
