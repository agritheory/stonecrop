<script setup lang="ts">
import { ref } from 'vue'
import { ATable, type TableColumn, type TableRow } from '@stonecrop/atable'

const rows = ref<TableRow[]>([
	{ id: '1', item: 'Widget A', quantity: 12, unit_price: 4.5, status: 'In Stock' },
	{ id: '2', item: 'Widget B', quantity: 0, unit_price: 9.25, status: 'Backordered' },
	{ id: '3', item: 'Widget C', quantity: 34, unit_price: 2.1, status: 'In Stock' },
])

const columns = ref<TableColumn[]>([
	{ label: 'Item', name: 'item', align: 'left', edit: false, width: '20ch' },
	{ label: 'Quantity', name: 'quantity', align: 'right', edit: true, width: '12ch' },
	{ label: 'Unit Price', name: 'unit_price', align: 'right', edit: true, width: '12ch' },
	{ label: 'Status', name: 'status', align: 'left', edit: false, width: '16ch' },
])
</script>

<template>
	<div class="stonecrop-demo">
		<ATable v-model:rows="rows" v-model:columns="columns" :config="{ view: 'list' }" />
	</div>
</template>
