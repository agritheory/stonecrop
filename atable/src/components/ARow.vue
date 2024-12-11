<template>
	<tr ref="rowEl" :tabindex="tabIndex" v-show="isRowVisible" class="table-row">
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
import { useTemplateRef } from 'vue'

import { createTableStore } from '@/stores/table'

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
const isRowVisible = store.isRowVisible(rowIndex)
const rowExpandSymbol = store.getRowExpandSymbol(rowIndex)

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

.table-row {
	border-top: 1px solid var(--sc-row-border-color);
	display: flex;
	background-color: white;
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
</style>
