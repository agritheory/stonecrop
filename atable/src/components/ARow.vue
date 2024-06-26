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
				{{ getRowExpandSymbol() }}
			</td>
		</slot>

		<!-- render cell content -->
		<slot></slot>
	</tr>
</template>

<script setup lang="ts">
import { type KeypressHandlers, useKeyboardNav, defaultKeypressHandlers } from '@stonecrop/utilities'
import { computed, inject, ref } from 'vue'

import TableDataStore from '.'
import type { TableRow } from '@/types'

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

const getRowExpandSymbol = () => {
	if (tableData.config.view !== 'tree') {
		return ''
	}

	if (tableData.display[props.rowIndex].isRoot) {
		if (tableData.display[props.rowIndex].childrenOpen) {
			return '-'
		} else {
			return '+'
		}
	}

	if (tableData.display[props.rowIndex].isParent) {
		if (tableData.display[props.rowIndex].childrenOpen) {
			return '-'
		} else {
			return '+'
		}
	} else {
		return ''
	}
}

const isRowVisible = computed(() => {
	return (
		tableData.config.view !== 'tree' ||
		tableData.display[props.rowIndex].isRoot ||
		tableData.display[props.rowIndex].open
	)
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

<style scoped>
@import url('@stonecrop/themes/default/default.css');
.table-row {
	border-top: 1px solid var(--row-border-color);
	height: var(--atable-row-height);
}

.list-index {
	color: var(--header-text-color);
	font-weight: bold;
	padding-left: var(--atable-row-padding);
	padding-right: 1em;
	text-align: center;
	user-select: none;
	width: v-bind(numberedRowWidth);
	max-width: v-bind(numberedRowWidth);
}

.tree-index {
	color: var(--header-text-color);
	font-weight: bold;
	text-align: center;
	user-select: none;
	width: 2ch;
}
</style>
