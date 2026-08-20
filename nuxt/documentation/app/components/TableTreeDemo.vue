<script setup lang="ts">
import { ref } from 'vue'
import { ATable, type TableColumn, type TableRow } from '@stonecrop/atable'

const rows = ref<TableRow[]>([
	{ id: '1', account: 'Assets', parent: null },
	{ id: '2', account: 'Current Assets', parent: 0 },
	{ id: '3', account: 'Cash', parent: 1 },
	{ id: '4', account: 'Accounts Receivable', parent: 1 },
	{ id: '5', account: 'Liabilities', parent: null },
])

const columns = ref<TableColumn[]>([{ label: 'Account', name: 'account', align: 'left', edit: false, width: '30ch' }])
</script>

<template>
	<div class="stonecrop-demo">
		<ATable v-model:rows="rows" v-model:columns="columns" :config="{ view: 'tree', defaultTreeExpansion: 'leaf' }" />
	</div>
</template>
