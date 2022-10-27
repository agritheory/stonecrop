<template>
	<tr v-bind="$attrs" ref="rowEl" :tabindex="tabIndex" :style="rowStyle">
		<td id="row-index" :tabIndex="-1" :style="listExpansionStyle" @click="toggleRowExpand(rowIndex)">
			{{ getRowExpandSymbol() }}
		</td>
		<slot name="indexCell" />
		<slot />
	</tr>
	<div v-if="tableData.display[props.rowIndex].expanded" class="expand">Hello</div>
</template>

<script setup lang="ts">
import { TableRow } from 'types'
import { CSSProperties, inject, ref } from 'vue'
import { useKeyboardNav } from '@agritheory/utilities'

import TableDataStore from '.'

const props = withDefaults(
	defineProps<{
		row: TableRow
		rowIndex: number
		tableid: string
		tabIndex?: number
		addNavigation?: object
	}>(),
	{
		tabIndex: -1,
	}
)

const tableData = inject<TableDataStore>(props.tableid)
const rowEl = ref<HTMLTableRowElement>(null)

const listExpansionStyle: CSSProperties = {
	color: 'var(--header-text-color)',
	fontWeight: 'bold',
	textAlign: 'center',
	userSelect: 'none',
	width: '2ch',
}

const rowStyle: CSSProperties = {
	borderTop: '1px solid var(--row-border-color)',
	height: 'var(--atable-row-height)',
}

const getRowExpandSymbol = () => {
	return tableData.display[props.rowIndex].expanded ? '▼' : '►'
}

const toggleRowExpand = (rowIndex: number) => {
	tableData.toggleRowExpand(rowIndex)
}

if (props.addNavigation) {
	useKeyboardNav([
		{
			selectors: rowEl,
			handlers: props.addNavigation,
		},
	])
}
</script>
