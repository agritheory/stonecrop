<script setup lang="ts">
import { ref } from 'vue'
import { ATable, type TableColumn, type TableRow } from '@stonecrop/atable'

const rows = ref<TableRow[]>([
	{ id: '1', item: 'Widget A', quantity: 12 },
	{ id: '2', item: 'Widget B', quantity: 0 },
	{ id: '3', item: 'Widget C', quantity: 34 },
])

const columns = ref<TableColumn[]>([
	{ label: 'Item', name: 'item', align: 'left', edit: true, width: '20ch' },
	{ label: 'Quantity', name: 'quantity', align: 'right', edit: true, width: '12ch' },
])
</script>

<template>
	<div class="stonecrop-demo">
		<ATable v-model:rows="rows" v-model:columns="columns" :config="{ view: 'list', rowActions: { enabled: true } }" />
	</div>
</template>
