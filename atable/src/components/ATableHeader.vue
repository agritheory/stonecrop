<template>
	<thead v-if="props.columns.length">
		<!-- Header row -->
		<tr class="atable-header-row" tabindex="-1">
			<!-- Row actions header cell (before-index position) -->
			<th
				v-if="showRowActionsHeader && rowActionsPosition === 'before-index'"
				class="row-actions-header"
				:class="{ 'sticky-column': rowActionsPosition === 'before-index' }" />
			<th
				v-if="props.store.zeroColumn"
				id="header-index"
				:class="[
					props.store.hasPinnedColumns ? 'sticky-index' : '',
					props.store.isTreeView ? 'tree-index' : '',
					props.store.config.view === 'list-expansion' ? 'list-expansion-index' : '',
				]"
				class="list-index" />
			<!-- Row actions header cell (after-index position) -->
			<th v-if="showRowActionsHeader && rowActionsPosition === 'after-index'" class="row-actions-header" />
			<th
				v-for="(column, colKey) in props.columns"
				:key="column.name"
				v-resize-observer="onResize"
				:data-colindex="colKey"
				tabindex="-1"
				:style="props.store.getHeaderCellStyle(column)"
				:class="`${column.pinned ? 'sticky-column' : ''} ${column.sortable === false ? '' : 'cursor-pointer'}`"
				@click="column.sortable !== false ? handleSort(colKey) : undefined">
				<slot>{{ column.label || String.fromCharCode(colKey + 97).toUpperCase() }}</slot>
			</th>
			<!-- Row actions header cell (end position) -->
			<th v-if="showRowActionsHeader && rowActionsPosition === 'end'" class="row-actions-header" />
		</tr>
		<!-- Filters row -->
		<tr v-if="filterableColumns.length > 0" class="atable-filters-row">
			<!-- Row actions filter cell (before-index position) -->
			<th
				v-if="showRowActionsHeader && rowActionsPosition === 'before-index'"
				class="row-actions-header"
				:class="{ 'sticky-column': rowActionsPosition === 'before-index' }" />
			<th
				v-if="props.store.zeroColumn"
				:class="[
					props.store.hasPinnedColumns ? 'sticky-index' : '',
					props.store.isTreeView ? 'tree-index' : '',
					props.store.config.view === 'list-expansion' ? 'list-expansion-index' : '',
				]"
				class="list-index" />
			<!-- Row actions filter cell (after-index position) -->
			<th v-if="showRowActionsHeader && rowActionsPosition === 'after-index'" class="row-actions-header" />
			<th
				v-for="(column, colKey) in props.columns"
				:key="`filter-${column.name}`"
				:class="`${column.pinned ? 'sticky-column' : ''}`"
				:style="props.store.getHeaderCellStyle(column)">
				<ATableColumnFilter v-if="column.filterable" :column="column" :col-index="colKey" :store="props.store" />
			</th>
			<!-- Row actions filter cell (end position) -->
			<th v-if="showRowActionsHeader && rowActionsPosition === 'end'" class="row-actions-header" />
		</tr>
	</thead>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { vResizeObserver } from '@vueuse/components'
import ATableColumnFilter from './ATableColumnFilter.vue'
import { createTableStore } from '../stores/table'
import type { TableColumn } from '../types'

const props = defineProps<{
	columns: TableColumn[]
	store: ReturnType<typeof createTableStore>
}>()

const filterableColumns = computed(() => props.columns.filter(column => column.filterable))

// Row actions header support
const showRowActionsHeader = computed(() => props.store.config.value?.rowActions?.enabled ?? false)
const rowActionsPosition = computed(() => props.store.config.value?.rowActions?.position ?? 'before-index')

const handleSort = (colIndex: number) => props.store.sortByColumn(colIndex)

const onResize = (entries: ReadonlyArray<ResizeObserverEntry>) => {
	for (const entry of entries) {
		if (entry.borderBoxSize.length === 0) continue
		const observedCell = entry.borderBoxSize[0]
		const observedWidth = observedCell.inlineSize
		const colIndex = Number((entry.target as HTMLElement).dataset.colindex)
		const currentWidth = props.store.columns[colIndex]?.width

		if (typeof currentWidth === 'number' && currentWidth !== observedWidth) {
			props.store.resizeColumn(colIndex, observedWidth)
		}
	}
}
</script>

<style>
@import url('@stonecrop/themes/default.css');

.atable-header-row th {
	padding-left: 0.5ch !important;
	font-weight: 700;
	min-width: 3ch;
	padding-top: var(--sc-atable-row-padding);
	padding-bottom: var(--sc-atable-row-padding);
	box-sizing: border-box;
	color: var(--sc-header-text-color);
	position: relative;
}
#header-index {
	padding-left: var(--sc-atable-row-padding);
	box-sizing: border-box;
	border-top: none;
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

.row-actions-header {
	width: 2rem;
	min-width: 2rem;
	padding: 0 0.25rem;
}
</style>
