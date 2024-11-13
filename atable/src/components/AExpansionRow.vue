<template>
	<tr v-bind="$attrs" ref="rowEl" :tabindex="tabIndex" class="expandable-row">
		<td :tabIndex="-1" @click="tableData.toggleRowExpand(rowIndex)" class="row-index">
			{{ rowExpandSymbol }}
		</td>
		<slot name="row" />
	</tr>
	<tr v-if="tableData.display[rowIndex].expanded" ref="rowExpanded" :tabindex="tabIndex" class="expanded-row">
		<td :tabIndex="-1" :colspan="tableData.columns.length + 1" class="expanded-row-content">
			<slot name="content" />
		</td>
	</tr>
</template>

<script setup lang="ts">
import { type KeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
import { computed, inject, useTemplateRef } from 'vue'

import TableDataStore from '.'

const {
	rowIndex,
	tableid,
	tabIndex = -1,
	addNavigation,
} = defineProps<{
	rowIndex: number
	tableid: string
	tabIndex?: number
	addNavigation?: boolean | KeypressHandlers
}>()

const tableData = inject<TableDataStore>(tableid)
const rowRef = useTemplateRef<HTMLTableRowElement>('rowEl')
// const expandedRowRef = useTemplateRef<HTMLDivElement>('rowExpanded')

const rowExpandSymbol = computed(() => {
	return tableData.display[rowIndex].expanded ? '▼' : '►'
})

if (addNavigation) {
	const handlers: KeypressHandlers = {
		'keydown.control.g': (event: KeyboardEvent) => {
			event.stopPropagation()
			event.preventDefault()
			tableData.toggleRowExpand(rowIndex)
		},
	}

	if (typeof addNavigation === 'object') {
		Object.assign(handlers, addNavigation)
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

.row-index {
	color: var(--sc-header-text-color);
	font-weight: bold;
	text-align: center;
	user-select: none;
	width: 2ch;
	display: flex;
	align-items: center;
	justify-content: center;
}
.expandable-row {
	border-top: 1px solid var(--sc-row-border-color);
	height: var(--sc-atable-row-height);
	border-left: 4px solid var(--sc-row-border-color);
	display: flex;
}

.expanded-row {
	border-bottom: 1px solid var(--sc-row-border-color);
	border-top: 1px solid var(--sc-row-border-color);
}

.expanded-row-content {
	border-bottom: 1px solid var(--sc-row-border-color);
	border-top: 1px solid var(--sc-row-border-color);
	padding: 1.5rem;
}
</style>
