<template>
	<tr ref="rowEl" :tabindex="tabIndex" v-show="isRowVisible" class="table-row">
		<!-- render numbered/tree view index; skip render for uncounted lists -->
		<slot name="index" v-if="tableData.config.view !== 'uncounted'">
			<td
				v-if="tableData.config.view === 'list'"
				:tabIndex="-1"
				class="list-index"
				:class="hasPinnedColumns ? 'sticky-index' : ''">
				{{ rowIndex + 1 }}
			</td>
			<td
				v-else-if="tableData.config.view === 'tree'"
				:tabIndex="-1"
				class="tree-index"
				:class="hasPinnedColumns ? 'sticky-index' : ''"
				@click="toggleRowExpand(rowIndex)">
				{{ rowExpandSymbol }}
			</td>
		</slot>

		<!-- render cell content -->
		<slot></slot>
	</tr>
</template>

<script setup lang="ts">
import { type KeypressHandlers, useKeyboardNav, defaultKeypressHandlers } from '@stonecrop/utilities'
import { computed, inject, useTemplateRef } from 'vue'

import TableDataStore from '.'

const {
	rowIndex,
	tableid,
	tabIndex = -1,
	addNavigation = false, // default to allowing cell navigation
} = defineProps<{
	rowIndex: number
	tableid: string
	tabIndex?: number
	addNavigation?: boolean | KeypressHandlers
}>()

const tableData = inject<TableDataStore>(tableid)
const rowRef = useTemplateRef<HTMLTableRowElement>('rowEl')

const hasPinnedColumns = computed(() => tableData.columns.some(col => col.pinned))

const isRowVisible = computed(() => {
	return tableData.config.view !== 'tree' || tableData.display[rowIndex].isRoot || tableData.display[rowIndex].open
})

const rowExpandSymbol = computed(() => {
	if (tableData.config.view !== 'tree') {
		return ''
	}

	if (tableData.display[rowIndex].isRoot || tableData.display[rowIndex].isParent) {
		return tableData.display[rowIndex].childrenOpen ? '-' : '+'
	}

	return ''
})

const toggleRowExpand = (rowIndex: number) => {
	tableData.toggleRowExpand(rowIndex)
}

if (addNavigation) {
	let handlers = defaultKeypressHandlers

	if (typeof addNavigation === 'object') {
		handlers = {
			...handlers,
			...addNavigation,
		}
	}

	useKeyboardNav([
		{
			selectors: rowRef,
			handlers: handlers,
		},
	])
}
</script>

<style>
@import url('@stonecrop/themes/default.css');

.table-row {
	border-top: 1px solid var(--sc-row-border-color);
	display: flex;
	background-color: white;
}
.list-index {
	color: var(--sc-header-text-color);
	font-weight: bold;
	padding-left: var(--sc-atable-row-padding);
	padding-right: 0.5em;
	text-align: left;
	user-select: none;
	width: 7ch;
	text-overflow: ellipsis;
	overflow: hidden;
	box-sizing: border-box;
	padding-top: var(--sc-atable-row-padding);
	padding-bottom: var(--sc-atable-row-padding);
}
.tree-index {
	color: var(--sc-header-text-color);
	font-weight: bold;
	text-align: center;
	user-select: none;
	width: 2ch;
	box-sizing: border-box;
	padding-top: var(--sc-atable-row-padding);
	padding-bottom: var(--sc-atable-row-padding);
}
</style>
