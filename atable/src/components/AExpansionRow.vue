<template>
	<tr v-bind="$attrs" ref="rowEl" :tabindex="tabIndex" class="expandable-row">
		<td :tabIndex="-1" @click="tableData.toggleRowExpand(rowIndex)" class="row-index">
			{{ rowExpandSymbol }}
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
import { type KeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
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
	}
)

const tableData = inject<TableDataStore>(props.tableid)
const rowEl = ref<HTMLTableRowElement>(null)
const rowExpanded = ref<HTMLDivElement>(null)

const rowExpandSymbol = computed(() => {
	return tableData.display[props.rowIndex].expanded ? '▼' : '►'
})

if (props.addNavigation) {
	const handlers: KeypressHandlers = {
		'keydown.control.g': (event: KeyboardEvent) => {
			event.stopPropagation()
			event.preventDefault()
			tableData.toggleRowExpand(props.rowIndex)
		},
	}

	if (typeof props.addNavigation === 'object') {
		Object.assign(handlers, props.addNavigation)
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
