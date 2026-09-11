<script setup lang="ts">
import { ref } from 'vue'
import { ATable, type TableColumn, type TableRow } from '@stonecrop/atable'

const rows = ref<TableRow[]>([
	{ id: '1', item: 'Widget A', status: 'In Stock' },
	{ id: '2', item: 'Widget B', status: 'Backordered' },
	{ id: '3', item: 'Widget C', status: 'In Stock' },
	{ id: '4', item: 'Widget D', status: 'Discontinued' },
])

const columns = ref<TableColumn[]>([
	{
		label: 'Item',
		name: 'item',
		align: 'left',
		edit: false,
		width: '20ch',
		sortable: true,
		filterable: true,
		filterType: 'text',
	},
	{
		label: 'Status',
		name: 'status',
		align: 'left',
		edit: false,
		width: '18ch',
		sortable: true,
		filterable: true,
		filterType: 'select',
		filterOptions: [
			{ label: 'In Stock', value: 'In Stock' },
			{ label: 'Backordered', value: 'Backordered' },
			{ label: 'Discontinued', value: 'Discontinued' },
		],
	},
])
</script>

<template>
	<div class="stonecrop-demo">
		<ATable v-model:rows="rows" v-model:columns="columns" :config="{ view: 'list' }" />
	</div>
</template>
