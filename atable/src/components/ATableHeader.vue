<template>
	<thead id="resizable" v-if="columns.length">
		<tr class="atable-header-row" tabindex="-1">
			<th
				v-if="tableData.zeroColumn"
				id="header-index"
				:class="[
					hasPinnedColumns ? 'sticky-index' : '',
					tableData.config.view === 'tree' ? 'tree-index' : '',
					tableData.config.view === 'list-expansion' ? 'list-expansion-index' : '',
				]"
				class="list-index" />
			<th
				v-for="(column, colKey) in columns"
				:key="column.name"
				tabindex="-1"
				:style="getHeaderCellStyle(column)"
				:class="column.pinned ? 'sticky-column' : ''">
				<slot>{{ column.label || String.fromCharCode(colKey + 97).toUpperCase() }}</slot>
			</th>
		</tr>
	</thead>
</template>

<script setup lang="ts">
import { CSSProperties, inject, computed } from 'vue'

import TableDataStore from '.'
import type { TableColumn } from '@/types'

const { columns, tableid } = defineProps<{ columns: TableColumn[]; tableid?: string }>()

const tableData = inject<TableDataStore>(tableid)

const hasPinnedColumns = computed(() => tableData.columns.some(col => col.pinned))

const getHeaderCellStyle = (column: TableColumn): CSSProperties => ({
	minWidth: column.width || '40ch',
	textAlign: column.align || 'center',
	width: tableData.config.fullWidth ? 'auto' : null,
})
</script>

<style>
@import url('@stonecrop/themes/default.css');

.atable-header-row {
	display: flex;
}
.atable-header-row th {
	padding-left: 0.5ch !important;
	font-weight: 700;
	padding-top: var(--sc-atable-row-padding);
	padding-bottom: var(--sc-atable-row-padding);
	box-sizing: border-box;
	color: var(--sc-header-text-color);
}
#header-index {
	padding-left: var(--sc-atable-row-padding);
	box-sizing: border-box;
}
.tree-index {
	padding-right: 0;
}
th {
	order: 1;
}
.list-expansion-index {
	width: 2ch;
	margin-left: 5px;
}
</style>
