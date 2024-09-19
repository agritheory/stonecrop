<template>
	<tr ref="rowEl" :tabindex="tabIndex" v-show="isRowVisible" class="table-row">
		<!-- render numbered/tree view index -->
		<slot name="index">
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
import type { TableRow } from '@/types'

const {
	row,
	rowIndex,
	tableid,
	tabIndex = -1,
	addNavigation = false, // default to allowing cell navigation
} = defineProps<{
	row: TableRow
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
@import url('@stonecrop/themes/default/default.css');
</style>
