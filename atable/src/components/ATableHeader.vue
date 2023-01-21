<template>
	<thead v-if="columns.length">
		<tr class="atable-header-row" tabindex="-1">
			<th v-if="tableData.zeroColumn" class="header-index" />
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

<style scoped>
@import url('@agritheory/themes/default/default.css');
thead {
	background-color: var(--gray-5);
}

.header-index {
	width: v-bind(numberedRowWidth);
	max-width: v-bind(numberedRowWidth);
}

th {
	border-width: 0px;
	border-style: solid;
	border-radius: 0px;
	padding-left: 0.5ch;
	padding-right: 0.5ch;
	padding-top: var(--atable-row-padding);
	padding-bottom: var(--atable-row-padding);
	color: var(--gray-60);
	height: var(--atable-row-height);
}

th:focus {
	outline: none;
}
</style>
