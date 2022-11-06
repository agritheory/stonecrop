<template>
	<tr v-bind="$attrs" ref="rowEl" :tabindex="tabIndex" class="expandable-row">
		<td id="row-index" :tabIndex="-1" @click="tableData.toggleRowExpand(rowIndex)">
			{{ getRowExpandSymbol() }}
		</td>
		<slot name="row" />
	</tr>
	<tr v-if="tableData.display[props.rowIndex].expanded" ref="rowExpanded" :tabindex="tabIndex" class="expanded-row">
		<td :tabIndex="-1" :colspan="tableData.columns.length + 1" class="expanded-row-content">
			<slot name="content" />
		</td>
	</tr>
</template>

<script setup lang="ts">
import { TableRow } from 'types'
import { inject, ref } from 'vue'

import { useKeyboardNav } from '@agritheory/utilities'

import TableDataStore from '.'

const props = withDefaults(
	defineProps<{
		row: TableRow
		rowIndex: number
		tableid: string
		tabIndex?: number
		addNavigation?: {
			[key: string]: (ev: KeyboardEvent) => any
		}
	}>(),
	{
		tabIndex: -1,
	}
)

const tableData = inject<TableDataStore>(props.tableid)
const rowEl = ref<HTMLTableRowElement>(null)
const rowExpanded = ref<HTMLDivElement>(null)

const getRowExpandSymbol = () => {
	return tableData.display[props.rowIndex].expanded ? '▼' : '►'
}

if (props.addNavigation !== undefined) {
	const keyboardNav = Object.assign({}, props.addNavigation)
	keyboardNav['keydown.control.g'] = (event: KeyboardEvent) => {
		event.stopPropagation()
		event.preventDefault()
		tableData.toggleRowExpand(props.rowIndex)
	}

	useKeyboardNav([
		{
			selectors: rowEl,
			handlers: keyboardNav,
		},
	])
}
</script>

<style scoped>
#row-index {
	color: var(--header-text-color);
	font-weight: bold;
	text-align: center;
	user-select: none;
	width: 2ch;
}

.expandable-row {
	border-top: 1px solid var(--row-border-color);
	height: var(--atable-row-height);
}

.expanded-row {
	border-bottom: 1px solid var(--row-border-color);
	border-top: 1px solid var(--row-border-color);
}

.expanded-row-content {
	border-bottom: 1px solid var(--row-border-color);
	border-top: 1px solid var(--row-border-color);
	padding: 1.5rem;
}
</style>
