<script setup lang="ts">
import { ref } from 'vue'
import { ATable, type TableColumn, type TableRow } from '@stonecrop/atable'

// `indent` is what actually shifts a cell: getIndent returns 'inherit' for 0 or undefined, so a
// tree with only `parent` set renders flush at every level.
const rows = ref<TableRow[]>([
	{ id: '1', account: 'Assets', indent: 0 },
	{ id: '2', account: 'Current Assets', parent: 0, indent: 2 },
	{ id: '3', account: 'Cash', parent: 1, indent: 4 },
	{ id: '4', account: 'Accounts Receivable', parent: 1, indent: 4 },
	{ id: '5', account: 'Liabilities', indent: 0 },
])

const columns = ref<TableColumn[]>([{ label: 'Account', name: 'account', align: 'left', edit: false, width: '30ch' }])
</script>

<template>
	<div class="stonecrop-demo">
		<ATable v-model:rows="rows" v-model:columns="columns" :config="{ view: 'tree', defaultTreeExpansion: 'leaf' }" />
	</div>
</template>
