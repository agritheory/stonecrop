<template>
	<thead id="resizable" v-if="columns.length">
		<tr class="atable-header-row" tabindex="-1">
			<th v-if="tableData.zeroColumn" id="header-index" />
			<th v-for="(column, colKey) in columns" :key="colKey" tabindex="-1" :style="getHeaderCellStyle(column)">
				<slot>{{ column.label || String.fromCharCode(colKey + 97).toUpperCase() }}</slot>
			</th>
		</tr>
	</thead>
</template>

<script setup lang="ts">
import { CSSProperties, inject } from 'vue'

import { TableColumn, TableConfig } from 'types'
import TableDataStore from '.'

const props = defineProps<{
	columns: TableColumn[]
	config?: TableConfig
	tableid?: string
}>()

const tableData = inject<TableDataStore>(props.tableid)

const numberedRowWidth = tableData.numberedRowWidth.value
const getHeaderCellStyle = (column: TableColumn): CSSProperties => ({
	minWidth: column.width || '40ch',
	textAlign: column.align || 'center',
	width: tableData.config.fullWidth ? 'auto' : null,
})
</script>

<style>
@import url('@stonecrop/themes/default/default.css');
</style>
