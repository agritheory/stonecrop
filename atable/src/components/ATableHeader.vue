<template>
	<thead v-if="columns.length">
		<!-- Header row -->
		<tr class="atable-header-row" tabindex="-1">
			<th
				v-if="store.zeroColumn"
				id="header-index"
				:class="[
					store.hasPinnedColumns ? 'sticky-index' : '',
					store.isTreeView ? 'tree-index' : '',
					store.config.view === 'list-expansion' ? 'list-expansion-index' : '',
				]"
				class="list-index" />
			<th
				v-for="(column, colKey) in columns"
				:key="column.name"
				v-resize-observer="onResize"
				:data-colindex="colKey"
				tabindex="-1"
				:style="store.getHeaderCellStyle(column)"
				:class="`${column.pinned ? 'sticky-column' : ''} ${column.sortable === false ? '' : 'cursor-pointer'}`"
				@click="column.sortable !== false ? handleSort(colKey) : undefined">
				<slot>{{ column.label || String.fromCharCode(colKey + 97).toUpperCase() }}</slot>
			</th>
		</tr>
		<!-- Filters row -->
		<tr v-if="filterableColumns.length > 0" class="atable-filters-row">
			<th
				v-if="store.zeroColumn"
				:class="[
					store.hasPinnedColumns ? 'sticky-index' : '',
					store.isTreeView ? 'tree-index' : '',
					store.config.view === 'list-expansion' ? 'list-expansion-index' : '',
				]"
				class="list-index" />
			<th
				v-for="(column, colKey) in columns"
				:key="`filter-${column.name}`"
				:class="`${column.pinned ? 'sticky-column' : ''}`"
				:style="store.getHeaderCellStyle(column)">
				<ATableColumnFilter v-if="column.filterable" :column="column" :col-index="colKey" :store="store" />
			</th>
		</tr>
	</thead>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { vResizeObserver } from '@vueuse/components'
import ATableColumnFilter from './ATableColumnFilter.vue'
import { createTableStore } from '../stores/table'
import type { TableColumn } from '../types'

const { columns, store } = defineProps<{
	columns: TableColumn[]
	store: ReturnType<typeof createTableStore>
}>()

const filterableColumns = computed(() => columns.filter(column => column.filterable))

const handleSort = (colIndex: number) => store.sortByColumn(colIndex)

const onResize = (entries: ReadonlyArray<ResizeObserverEntry>) => {
	for (const entry of entries) {
		if (entry.borderBoxSize.length === 0) continue
		const observedCell = entry.borderBoxSize[0]
		const observedWidth = observedCell.inlineSize
		const colIndex = Number((entry.target as HTMLElement).dataset.colindex)
		const currentWidth = store.columns[colIndex]?.width

		if (typeof currentWidth === 'number' && currentWidth !== observedWidth) {
			store.resizeColumn(colIndex, observedWidth)
		}
	}
}
</script>

<style>
@import url('@stonecrop/themes/default.css');

.atable-header-row th {
	padding-left: 0.5ch !important;
	font-weight: 700;
	padding-top: var(--sc-atable-row-padding);
	padding-bottom: var(--sc-atable-row-padding);
	box-sizing: border-box;
	color: var(--sc-header-text-color);
	position: relative;
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

.cursor-pointer {
	cursor: pointer;
}

.atable-filters-row th {
	padding: 0.25rem 0.5ch;
	vertical-align: top;
}
</style>
