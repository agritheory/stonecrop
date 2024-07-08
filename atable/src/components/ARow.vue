<template>
	<tr ref="rowEl" :tabindex="tabIndex" v-show="isRowVisible" class="table-row">
		<!-- render numbered/tree view index -->
		<slot name="index">
			<td v-if="tableData.config.view === 'list'" :tabIndex="-1" class="list-index">
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
import { TableRow } from 'types'
import { computed, inject, ref } from 'vue'
import { type KeypressHandlers, useKeyboardNav, defaultKeypressHandlers } from '@stonecrop/utilities'

import TableDataStore from '.'

const props = withDefaults(
	defineProps<{
		row: TableRow
		rowIndex: number
		tableid: string
		tabIndex?: number
		addNavigation?: boolean | KeypressHandlers
	}>(),
	{
		tabIndex: -1,
		addNavigation: false, // default to allowing cell navigation
	}
)

const tableData = inject<TableDataStore>(props.tableid)
const rowEl = ref<HTMLTableRowElement>(null)
const numberedRowWidth = tableData.numberedRowWidth.value

const isRowVisible = computed(() => {
	return (
		tableData.config.view !== 'tree' ||
		tableData.display[props.rowIndex].isRoot ||
		tableData.display[props.rowIndex].open
	)
})

const rowExpandSymbol = computed(() => {
	if (tableData.config.view !== 'tree') {
		return ''
	}

	if (tableData.display[props.rowIndex].isRoot || tableData.display[props.rowIndex].isParent) {
		return tableData.display[props.rowIndex].childrenOpen ? '-' : '+'
	}

	return ''
})

const toggleRowExpand = (rowIndex: number) => {
	tableData.toggleRowExpand(rowIndex)
}

if (props.addNavigation) {
	let handlers = defaultKeypressHandlers

	if (typeof props.addNavigation === 'object') {
		handlers = {
			...handlers,
			...props.addNavigation,
		}
	}

	useKeyboardNav([
		{
			selectors: rowEl,
			handlers: handlers,
		},
	])
}
</script>

<style>
@import url('@stonecrop/themes/default/default.css');
</style>
