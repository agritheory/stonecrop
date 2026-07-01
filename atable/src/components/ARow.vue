<template>
	<tr
		v-show="isRowVisible"
		v-bind="$attrs"
		ref="rowEl"
		:tabindex="tabIndex"
		class="atable-row"
		:class="{ 'atable-row-clickable': isClickable }"
		@click="onRowClick">
		<!-- Row actions before index (default position) -->
		<ARowActions
			v-if="showRowActions && actionsPosition === 'before-index'"
			:row-index="rowIndex"
			:store="store"
			:config="rowActionsConfig"
			:position="actionsPosition"
			@action="onRowAction" />

		<!-- render numbered/tree view index; skip render for uncounted lists -->
		<slot v-if="store.config.view !== 'uncounted'" name="index">
			<td
				v-if="store.config.view === 'list'"
				:tabIndex="-1"
				class="list-index"
				:class="store.hasPinnedColumns ? 'sticky-index' : ''">
				{{ rowIndex + 1 }}
			</td>
			<td
				v-else-if="store.isTreeView"
				:tabIndex="-1"
				class="tree-index"
				:class="store.hasPinnedColumns ? 'sticky-index' : ''"
				@click="store.toggleRowExpand(rowIndex)">
				{{ rowExpandSymbol }}
			</td>
			<td
				v-else-if="store.config.view === 'list-expansion'"
				:tabIndex="-1"
				class="expansion-index"
				:class="store.hasPinnedColumns ? 'sticky-index' : ''"
				@click="store.toggleRowExpand(rowIndex)">
				{{ rowExpandSymbol }}
			</td>
		</slot>

		<!-- Row actions after index -->
		<ARowActions
			v-if="showRowActions && actionsPosition === 'after-index'"
			:row-index="rowIndex"
			:store="store"
			:config="rowActionsConfig"
			:position="actionsPosition"
			@action="onRowAction" />

		<!-- render cell content -->
		<slot></slot>

		<!-- Row actions at end -->
		<ARowActions
			v-if="showRowActions && actionsPosition === 'end'"
			:row-index="rowIndex"
			:store="store"
			:config="rowActionsConfig"
			:position="actionsPosition"
			@action="onRowAction" />
	</tr>

	<!-- list-expansion content panel: a second row spanning the whole width -->
	<tr v-if="isExpanded" :tabindex="tabIndex" class="atable-expanded-row">
		<td :tabIndex="-1" :colspan="expandedColspan" class="atable-expanded-content">
			<slot name="content" :row="store.rows[rowIndex]" :row-index="rowIndex" :store="store" />
		</td>
	</tr>
</template>

<script setup lang="ts">
import { type KeypressHandlers, useKeyboardNav, defaultKeypressHandlers } from '@stonecrop/utilities'
import { computed, useTemplateRef } from 'vue'

import ARowActions from './ARowActions.vue'
import { createTableStore } from '../stores/table'
import type { RowActionsConfig, RowActionType } from '../types'

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

const emit = defineEmits<{
	'row:action': [type: RowActionType, rowIndex: number, event?: MouseEvent]
	'row:click': [rowIndex: number, event: MouseEvent]
}>()

const rowRef = useTemplateRef<HTMLTableRowElement>('rowEl')

const isRowVisible = computed(() => store.isRowVisible(rowIndex))
const rowExpandSymbol = computed(() => store.getRowExpandSymbol(rowIndex))
const isClickable = computed(() => store.config.clickable ?? false)

// Row actions configuration
const rowActionsConfig = computed((): RowActionsConfig => {
	return store.config.rowActions || { enabled: false }
})

const showRowActions = computed(() => {
	return rowActionsConfig.value.enabled
})

const actionsPosition = computed(() => {
	return rowActionsConfig.value.position || 'before-index'
})

// list-expansion: this row owns an expandable content panel (a second <tr>).
const isExpanded = computed(() => store.config.view === 'list-expansion' && Boolean(store.display[rowIndex]?.expanded))

// The content panel spans every column the main row occupies: data columns + the
// index/chevron column (absent only in uncounted) + the row-actions column when enabled.
const expandedColspan = computed(() => {
	const indexCol = store.config.view === 'uncounted' ? 0 : 1
	const actionsCol = showRowActions.value ? 1 : 0
	return store.columns.length + indexCol + actionsCol
})

const onRowAction = (actionType: RowActionType, index: number, event?: MouseEvent) => {
	emit('row:action', actionType, index, event)
}

const onRowClick = (event: MouseEvent) => {
	// Ignore clicks on the row actions cell or an expand/collapse chevron (tree or list-expansion),
	// so toggling a chevron never doubles as a row-click navigation.
	const target = event.target as HTMLElement
	if (target.closest('.atable-row-actions') || target.closest('.tree-index') || target.closest('.expansion-index'))
		return
	emit('row:click', rowIndex, event)
}

// A list-expansion row always binds Ctrl+G to toggle its own panel while opt-in
// cell navigation stays gated on `addNavigation` (default off), so other view
// types are unchanged.
const isListExpansion = store.config.view === 'list-expansion'

if (addNavigation || isListExpansion) {
	let handlers: KeypressHandlers = {}

	if (addNavigation === true) {
		handlers = { ...defaultKeypressHandlers }
	} else if (typeof addNavigation === 'object') {
		handlers = { ...defaultKeypressHandlers, ...addNavigation }
	}

	if (isListExpansion && !handlers['keydown.control.g']) {
		handlers['keydown.control.g'] = (event: KeyboardEvent) => {
			event.stopPropagation()
			event.preventDefault()
			store.toggleRowExpand(rowIndex)
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
	background-color: white;
}

.atable-row-clickable {
	cursor: pointer;
}

.atable-row-clickable:hover > td {
	background-color: var(--sc-row-hover-color, #f0f4f8);
}

.atable-row:last-child > td {
	border-bottom: 1px solid var(--sc-row-border-color);
}

.atable-row > td:first-child {
	border-left: 4px solid var(--sc-row-border-color);
}

.atable-row > td:last-child {
	border-right: 1px solid var(--sc-row-border-color);
}

.list-index {
	color: var(--sc-header-text-color);
	font-weight: bold;
	padding-left: var(--sc-atable-row-padding);
	padding-right: 0.5em;
	text-align: left;
	user-select: none;
	/* width: 7ch; */
	border-top: 1px solid var(--sc-row-border-color);
	text-overflow: ellipsis;
	overflow: hidden;
	box-sizing: border-box;
	padding-top: var(--sc-atable-row-padding);
	padding-bottom: var(--sc-atable-row-padding);
}

.tree-index,
.expansion-index {
	color: var(--sc-header-text-color);
	font-weight: bold;
	text-align: center;
	user-select: none;
	width: 2ch;
	box-sizing: border-box;
	cursor: pointer;
	padding-top: var(--sc-atable-row-padding);
	padding-bottom: var(--sc-atable-row-padding);
}

.atable-expanded-row {
	border-left: 2px solid var(--sc-row-border-color);
}

.atable-expanded-content {
	border-top: 1px solid var(--sc-row-border-color);
	padding: 1.5rem;
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
