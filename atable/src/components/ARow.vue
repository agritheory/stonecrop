<template>
	<tr v-show="rowVisible()" :style="rowStyle">
		<td v-if="tableData.config.numberedRows" id="row-index" :tabIndex="-1" :style="numberedRowStyle">
			{{ rowIndex + 1 }}
		</td>
		<td
			v-if="tableData.config.treeView"
			id="row-index"
			:tabIndex="-1"
			:style="treeRowStyle"
			@click="toggleRowExpand(rowIndex)">
			{{ getRowExpandSymbol() }}
		</td>
		<slot v-if="!tableData.config.numberedRows && !tableData.config.treeView" name="indexCell" />
		<slot />
	</tr>
</template>

<script setup lang="ts">
import { TableRow } from 'types'
import { CSSProperties, inject } from 'vue'

import TableDataStore from '.'

const props = defineProps<{
	row: TableRow
	rowIndex: number
	tableid: string
}>()

const tableData = inject<TableDataStore>(props.tableid)

const numberedRowStyle: CSSProperties = {
	color: 'var(--header-text-color)',
	fontWeight: 'bold',
	textAlign: 'center',
	userSelect: 'none',
	width: tableData.numberedRowWidth.value,
	paddingLeft: 'var(--atable-row-padding)',
	paddingRight: 'var(--atable-row-padding)',
}

const treeRowStyle: CSSProperties = {
	color: 'var(--header-text-color)',
	fontWeight: 'bold',
	textAlign: 'center',
	userSelect: 'none',
	width: '2ch',
}

const rowStyle: CSSProperties = {
	borderTop: '1px solid var(--row-border-color)',
}

const getRowExpandSymbol = () => {
	if (!tableData.config.treeView) {
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

const rowVisible = () => {
	if (!tableData.config.treeView) {
		return true
	}

	return tableData.display[props.rowIndex].isRoot || tableData.display[props.rowIndex].open
}

const toggleRowExpand = (rowIndex: number) => {
	tableData.toggleRowExpand(rowIndex)
}
</script>
