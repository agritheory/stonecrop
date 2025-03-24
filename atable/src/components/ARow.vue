<template>
	<tr ref="rowEl" :tabindex="tabIndex" v-show="isRowVisible" class="atable-row">
		<!-- render numbered/tree view index; skip render for uncounted lists -->
		<slot name="index" v-if="store.config.view !== 'uncounted'">
			<td
				v-if="store.config.view === 'list'"
				:tabIndex="-1"
				class="list-index"
				:class="store.hasPinnedColumns ? 'sticky-index' : ''">
				{{ rowIndex + 1 }}
			</td>
			<td
				v-else-if="store.config.view === 'tree'"
				:tabIndex="-1"
				class="tree-index"
				:class="store.hasPinnedColumns ? 'sticky-index' : ''"
				@click="store.toggleRowExpand(rowIndex)">
				{{ rowExpandSymbol }}
			</td>
		</slot>

		<!-- render cell content -->
		<slot></slot>
	</tr>
</template>

<script setup lang="ts">
import { type KeypressHandlers, useKeyboardNav, defaultKeypressHandlers } from '@stonecrop/utilities'
import { computed, useTemplateRef } from 'vue'

import { createTableStore } from '../stores/table'

const {
	rowIndex,
	store,
	tabIndex = -1,
	addNavigation = false, // default to allowing cell navigation
} = defineProps<{
	rowIndex: number
	store: ReturnType<typeof createTableStore>
	tabIndex?: number
	addNavigation?: boolean | KeypressHandlers
}>()

const rowRef = useTemplateRef<HTMLTableRowElement>('rowEl')

const isRowVisible = computed(() => store.isRowVisible(rowIndex))
const rowExpandSymbol = computed(() => store.getRowExpandSymbol(rowIndex))

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
@import url('@stonecrop/themes/default.css');

.atable-row {
	display: flex;
	background-color: white;
}

.table-row > td:first-child {
	border-left: 4px solid var(--sc-row-border-color);
}

.list-index {
	color: var(--sc-header-text-color);
	font-weight: bold;
	padding-left: var(--sc-atable-row-padding);
	padding-right: 0.5em;
	text-align: left;
	user-select: none;
	width: 7ch;
	text-overflow: ellipsis;
	overflow: hidden;
	box-sizing: border-box;
	padding-top: var(--sc-atable-row-padding);
	padding-bottom: var(--sc-atable-row-padding);
}

.tree-index {
	color: var(--sc-header-text-color);
	font-weight: bold;
	text-align: center;
	user-select: none;
	width: 2ch;
	box-sizing: border-box;
	padding-top: var(--sc-atable-row-padding);
	padding-bottom: var(--sc-atable-row-padding);
}
/* sticky cells in modified rows should be a solid color to properly hide non-sticky cells */
.atable-row:has(td.cell-modified) > td.sticky-column,
.atable-row:has(td.cell-modified) > th.sticky-column,
.atable-row:has(td.cell-modified) > td.sticky-index,
.atable-row:has(td.cell-modified) > th.sticky-index {
	background: var(--sc-cell-changed-color);
}
</style>
<style scoped>
.atable-row.changed-row-gradient:has(td.cell-modified) {
	--cell-color-start: color-mix(in srgb, var(--sc-cell-changed-color), #fff 20%);
	--cell-color-end: color-mix(in srgb, var(--sc-cell-changed-color), #fff 60%);
	background: linear-gradient(90deg, var(--cell-color-start), var(--cell-color-end));
}
</style>
