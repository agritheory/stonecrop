<template>
	<thead v-if="columns.length">
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

			<!-- a condition isn't required for the directive since it only works for resizable elements -->
			<th
				v-for="(column, colIndex) in columns"
				v-resize-observer="onResize"
				:data-colindex="colIndex"
				:key="column.name"
				tabindex="-1"
				:style="getHeaderCellStyle(column)"
				:class="column.pinned ? 'sticky-column' : ''">
				<slot>{{ column.label || String.fromCharCode(colIndex + 97).toUpperCase() }}</slot>
			</th>
		</tr>
	</thead>
</template>

<script setup lang="ts">
import { vResizeObserver } from '@vueuse/components'
import { CSSProperties, inject, computed } from 'vue'

import TableDataStore from '.'
import type { TableColumn } from '@/types'

const { columns, tableid } = defineProps<{ columns: TableColumn[]; tableid?: string }>()
const tableData = inject<TableDataStore>(tableid)

const hasPinnedColumns = computed(() => tableData.columns.some(col => col.pinned))

const onResize = (entries: ReadonlyArray<ResizeObserverEntry>) => {
	for (const entry of entries) {
		if (entry.borderBoxSize.length === 0) continue

		const observedCell = entry.borderBoxSize[0]
		const observedWidth = `${observedCell.inlineSize}px`
		const colIndex = Number((entry.target as HTMLElement).dataset.colindex)
		const colWidth = tableData.columns[colIndex].width
		if (colWidth !== observedWidth) {
			tableData.columns[colIndex].width = `${entry.contentRect.right}px`
		}
	}
}

const getHeaderCellStyle = (column: TableColumn): CSSProperties => {
	const isLastCol = columns.indexOf(column) === columns.length - 1

	// if the table is full width, the last column should not be resizable;
	// ref: https://github.com/agritheory/stonecrop/pull/196#issuecomment-2503762641
	const isResizable = tableData.config.fullWidth ? column.resizable && !isLastCol : column.resizable

	return {
		width: column.width || '40ch',
		textAlign: column.align || 'center',
		...(isResizable && {
			resize: 'horizontal',
			overflow: 'auto',
			whiteSpace: 'nowrap',
		}),
	}
}
</script>

<style>
@import url('@stonecrop/themes/default.css');

th {
	order: 1;
}

#header-index {
	padding-left: var(--sc-atable-row-padding);
	box-sizing: border-box;
}

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

.list-expansion-index {
	width: 2ch;
	margin-left: 5px;
}

.tree-index {
	padding-right: 0;
}
</style>
