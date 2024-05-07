<template>
	<tr ref="rowEl" :tabindex="tabIndex" v-show="rowVisible()" class="table-row" :style="style" style="position: fixed">
		<!-- render numbered/tree view index -->
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
		<slot v-else name="indexCell"></slot>

		<!-- render cell content -->
		<slot></slot>
	</tr>
</template>

<script setup lang="ts">
import { TableRow } from 'types'
import { inject, ref } from 'vue'
import { useDraggable } from '@vueuse/core'
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

const { x, y, style } = useDraggable(rowEl, {
	initialValue: { x: 5, y: (props.rowIndex + 1) * 21 },
	axis: 'y',
	onEnd(position) {
		let newPosition = Math.round(position.y / 21)
		let movedRow = tableData.rows[props.rowIndex]
		for (let index = props.rowIndex; index < newPosition; index++) {
			tableData.rows[index] = tableData.rows[index + 1]
		}
		tableData.rows[newPosition] = movedRow
		console.log(tableData.rows)
	},
})

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

const rowVisible = () => {
	return (
		tableData.config.view !== 'tree' ||
		tableData.display[props.rowIndex].isRoot ||
		tableData.display[props.rowIndex].open
	)
}

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
