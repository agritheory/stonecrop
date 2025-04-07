<template>
	<thead v-if="columns.length">
		<tr class="atable-header-row" tabindex="-1">
			<th
				v-if="store.zeroColumn"
				id="header-index"
				:class="[
					store.hasPinnedColumns ? 'sticky-index' : '',
					store.config.view === 'tree' ? 'tree-index' : '',
					store.config.view === 'list-expansion' ? 'list-expansion-index' : '',
				]"
				class="list-index" />
			<th
				v-for="(column, colKey) in columns"
				:key="column.name"
				tabindex="-1"
				:style="store.getHeaderCellStyle(column)"
				:class="column.pinned ? 'sticky-column' : ''">
				<slot>{{ column.label || String.fromCharCode(colKey + 97).toUpperCase() }}</slot>
				<div class="resize-handle" @mousedown="startResize($event, colKey)"></div>
			</th>
		</tr>
	</thead>
</template>

<script setup lang="ts">
import { createTableStore } from '../stores/table'
import type { TableColumn } from '../types'
import { ref } from 'vue'

const resizingColumn = ref<number | null>(null)
const startX = ref(0)
const startWidth = ref(0)
const { columns, store } = defineProps<{
	columns: TableColumn[]
	store: ReturnType<typeof createTableStore>
}>()

const startResize = (event: MouseEvent, colIndex: number) => {
	resizingColumn.value = colIndex
	startX.value = event.pageX

	const thElement = (event.target as HTMLElement).parentElement
	startWidth.value = thElement ? thElement.offsetWidth : parseInt(store.columns[colIndex].width || '40', 10)

	document.addEventListener('mousemove', handleResize)
	document.addEventListener('mouseup', stopResize)
}

const handleResize = (event: MouseEvent) => {
	if (resizingColumn.value !== null) {
		const delta = event.pageX - startX.value
		const newWidth = startWidth.value + delta
		store.resizeColumn(resizingColumn.value, newWidth)
	}
}

const stopResize = () => {
	resizingColumn.value = null
	document.removeEventListener('mousemove', handleResize)
	document.removeEventListener('mouseup', stopResize)
}
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
.resize-handle {
	position: absolute;
	right: 0;
	top: 0;
	width: 3px;
	height: 100%;
	cursor: ew-resize;
	background-color: rgba(135, 135, 135, 0.259);
	border-right: 1px solid transparent;
	transition: background-color 0.2s, border-color 0.2s;
}
.resize-handle:hover {
	background-color: rgba(255, 255, 255, 0.5);
	border-color: rgba(0, 0, 0, 0.5);
}
</style>
