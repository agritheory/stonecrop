<template>
	<tr v-bind="$attrs" ref="rowEl" :tabindex="tabIndex" class="expandable-row">
		<td :tabIndex="-1" @click="store.toggleRowExpand(rowIndex, tableId)" class="row-index">
			{{ rowExpandSymbol }}
		</td>
		<slot name="row" />
	</tr>
	<tr v-if="store.display[tableId][rowIndex].expanded" ref="rowExpanded" :tabindex="tabIndex" class="expanded-row">
		<td :tabIndex="-1" :colspan="store.columns[tableId].length + 1" class="expanded-row-content">
			<slot name="content" />
		</td>
	</tr>
</template>

<script setup lang="ts">
import { type KeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
import { computed, useTemplateRef } from 'vue'

import { useTableStore } from '../stores/table'

const {
	rowIndex,
	tabIndex = -1,
	addNavigation,
	tableId,
} = defineProps<{
	rowIndex: number
	tabIndex?: number
	addNavigation?: boolean | KeypressHandlers
	tableId: string
}>()

const store = useTableStore()

const rowRef = useTemplateRef<HTMLTableRowElement>('rowEl')
// const expandedRowRef = useTemplateRef<HTMLDivElement>('rowExpanded')

const rowExpandSymbol = computed(() => {
	return store.display[tableId][rowIndex].expanded ? '▼' : '►'
})

if (addNavigation) {
	const handlers: KeypressHandlers = {
		'keydown.control.g': (event: KeyboardEvent) => {
			event.stopPropagation()
			event.preventDefault()
			store.toggleRowExpand(rowIndex, tableId)
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
	display: flex;
}
.expandable-row > td:first-child {
	border-left: 4px solid var(--sc-row-border-color);
}

.expanded-row {
	display: flex;
	border-left: 2px solid var(--sc-row-border-color);
}

.expandable-row:last-child {
	border-bottom: 1px solid var(--sc-row-border-color);
}
.expanded-row-content {
	border-top: 1px solid var(--sc-row-border-color);
	padding: 1.5rem;
}
</style>
