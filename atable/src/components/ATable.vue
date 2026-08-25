<template>
	<div class="atable-container" style="position: relative">
		<!-- Main table view -->
		<table
			ref="table"
			v-on-click-outside="store.closeModal"
			class="atable"
			:style="{
				width: store.config.fullWidth ? '100%' : 'auto',
			}">
			<slot name="header" :data="store">
				<ATableHeader :columns="store.columns" :store="store" />
			</slot>
			<tbody>
				<slot name="body" :data="store">
					<ARow
						v-for="(row, filteredIndex) in visibleRows"
						:key="`${row.originalIndex}-${filteredIndex}`"
						:row="row"
						:row-index="row.originalIndex"
						:store="store"
						@row:action="handleRowAction"
						@row:click="handleRowClick">
						<template v-for="(column, colIndex) in getProcessedColumnsForRow(row)" :key="column.name">
							<component
								:is="column.ganttComponent || 'AGanttCell'"
								v-if="column.isGantt"
								:store="store"
								:columns-count="store.columns.length - pinnedColumnCount"
								:color="row.gantt?.color"
								:start="row.gantt?.startIndex"
								:end="row.gantt?.endIndex"
								:colspan="column.colspan"
								:pinned="column.pinned"
								:row-index="row.originalIndex"
								:col-index="column.originalIndex ?? colIndex"
								:style="{
									textAlign: column?.align || 'center',
									minWidth: column?.width || '40ch',
									width: store.config.fullWidth ? 'auto' : null,
								}"
								@connection:create="handleConnectionCreate" />
							<component
								:is="column.cellComponent || 'ACell'"
								v-else
								:store="store"
								:pinned="column.pinned"
								:row-index="row.originalIndex"
								:col-index="colIndex"
								:style="{
									textAlign: column?.align || 'center',
									width: store.config.fullWidth ? 'auto' : null,
								}"
								spellcheck="false" />
						</template>
					</ARow>
				</slot>
			</tbody>

			<slot name="footer" :data="store" :page="pagination">
				<ATablePaginationFooter
					:column-count="footerColumnCount"
					:show-footer="showFooter"
					:has-more="hasMore"
					:has-prev="hasPrev"
					:has-next="hasNext"
					:has-local-next="hasLocalNext"
					:has-ever-had-more="hasEverHadMore"
					:loaded-count="loadedCount"
					:loading="paginationLoading"
					:next="paginationNext"
					:prev="paginationPrev" />
			</slot>

			<!-- Modal overlay -->
			<slot name="modal" :data="store">
				<ATableModal v-show="store.modal.visible" :store="store">
					<template #default>
						<component
							:is="store.modal.component"
							:key="`${store.modal.rowIndex}:${store.modal.colIndex}`"
							:col-index="store.modal.colIndex"
							:row-index="store.modal.rowIndex"
							:store="store"
							v-bind="store.modal.componentProps" />
					</template>
				</ATableModal>
			</slot>
		</table>

		<!-- Connection overlay for gantt connections -->
		<AGanttConnection
			v-if="store.isGanttView && store.isDependencyGraphEnabled"
			:store="store"
			@connection:delete="handleConnectionDelete" />
	</div>
</template>

<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { useMutationObserver } from '@vueuse/core'
import { computed, inject, nextTick, onMounted, useTemplateRef, watch } from 'vue'

import AGanttConnection from './AGanttConnection.vue'
import ARow from './ARow.vue'
import ATableHeader from './ATableHeader.vue'
import ATableModal from './ATableModal.vue'
import ATablePaginationFooter from './ATablePaginationFooter.vue'
import { useTablePagination } from '../composables/table-pagination'
import { createTableStore } from '../stores/table'
import type { ColumnSchema, GetRecordsOptions, GetRecordsResult } from '@stonecrop/schema'

import { schemaToColumns } from '../schemaToColumns'
import type {
	ConnectionEvent,
	ConnectionPath,
	GanttDragEvent,
	RowActionType,
	RowAddEvent,
	RowClickEvent,
	RowDeleteEvent,
	RowDuplicateEvent,
	RowInsertEvent,
	RowMoveEvent,
	TableColumn,
	TableConfig,
	TableRow,
} from '../types'

const rows = defineModel<TableRow[]>('rows', { required: true })
// TODO: convert columns from defineModel to a regular prop
const columns = defineModel<TableColumn[]>('columns')

type LinkResolverFn = (doctype: string, id: string) => Promise<string | undefined>

const {
	id = '',
	config = new Object(),
	schema = [],
	linkResolver = undefined,
	getRecords = undefined,
	sourceKey = undefined,
} = defineProps<{
	id?: string
	config?: TableConfig
	schema?: ColumnSchema[]
	linkResolver?: LinkResolverFn
	getRecords?: (options?: GetRecordsOptions) => Promise<GetRecordsResult>
	sourceKey?: string
}>()

const emit = defineEmits<{
	cellUpdate: [{ colIndex: number; rowIndex: number; newValue: any; oldValue: any }]
	'gantt:drag': [event: GanttDragEvent]
	'connection:event': [event: ConnectionEvent]
	'columns:update': [columns: TableColumn[]]
	'row:add': [event: RowAddEvent]
	'row:click': [event: RowClickEvent]
	'row:delete': [event: RowDeleteEvent]
	'row:duplicate': [event: RowDuplicateEvent]
	'row:insert-above': [event: RowInsertEvent]
	'row:insert-below': [event: RowInsertEvent]
	'row:move': [event: RowMoveEvent]
	'row:open': [event: RowClickEvent]
}>()

const tableRef = useTemplateRef<HTMLTableElement>('table')
const resolvedColumns = columns.value?.length ? columns.value : schemaToColumns(schema ?? [])
const injectedLinkResolver = inject<LinkResolverFn | null>('aformLinkResolver', null)
const store = createTableStore({
	columns: resolvedColumns,
	rows: rows.value,
	id,
	config,
	linkResolver: linkResolver ?? injectedLinkResolver,
})

const pagination = useTablePagination({
	rows: () => store.filteredRows,
	pageSize: () => store.config.pageSize,
	getRecords,
	sourceKey: () => sourceKey,
})

const {
	visibleRows,
	showFooter,
	hasMore,
	hasPrev,
	hasNext,
	hasLocalNext,
	hasEverHadMore,
	loadedCount,
	loading: paginationLoading,
	next: paginationNext,
	prev: paginationPrev,
} = pagination

const footerColumnCount = computed(() => store.columns.length + (store.zeroColumn ? 1 : 0))

store.$onAction(({ name, store: storeInstance, args, after }) => {
	if (name === 'setCellData' || name === 'setCellText') {
		const [colIndex, rowIndex, newValue] = args
		const oldValue = storeInstance.getCellData(colIndex, rowIndex)
		after(() => {
			// Update rows model to trigger update:rows event
			rows.value = [...store.rows]
			emit('cellUpdate', { colIndex, rowIndex, newValue, oldValue })
		})
	} else if (name === 'updateGanttBar') {
		const [event] = args
		let shouldEmit = false
		if (event.type === 'resize') {
			shouldEmit = event.oldColspan !== event.newColspan
		} else if (event.type === 'bar') {
			shouldEmit = event.oldStart !== event.newStart || event.oldEnd !== event.newEnd
		}

		if (shouldEmit) {
			after(() => {
				emit('gantt:drag', event)
			})
		}
	} else if (name === 'resizeColumn') {
		after(() => {
			// Update columns model
			columns.value = [...store.columns]
			emit('columns:update', [...store.columns])
		})
	}
})

// Watch for external changes to rows and sync to store
watch(
	() => rows.value,
	newRows => {
		// Only update if the rows have actually changed (avoid infinite loops)
		if (JSON.stringify(newRows) !== JSON.stringify(store.rows)) {
			store.rows = [...newRows]
		}
	},
	{ deep: true }
)

// Watch for changes to columns and sync to store
watch(
	columns,
	newColumns => {
		// The model is optional, so it can be absent — there is nothing to sync from, and the store
		// keeps the columns it resolved from the schema.
		if (!newColumns) return
		// Only update if the columns have actually changed (avoid infinite loops)
		if (JSON.stringify(newColumns) !== JSON.stringify(store.columns)) {
			store.columns = [...newColumns]
			emit('columns:update', [...newColumns])
		}
	},
	{ deep: true }
)

onMounted(() => {
	if (columns.value?.some(column => column.pinned)) {
		assignStickyCellWidths()

		// in tree views, also add a mutation observer to capture and adjust expanded rows
		if (store.isTreeView) {
			useMutationObserver(tableRef, assignStickyCellWidths, { childList: true, subtree: true })
		}
	}
})

const pinnedColumnCount = computed(() => {
	return store.columns.filter(column => column.pinned).length
})

const assignStickyCellWidths = () => {
	const table = tableRef.value

	// set header cell width to match sticky cells' width
	const headerRow = table?.rows[0]
	const firstDataRow = table?.rows[1]
	const headerCells = headerRow ? Array.from(headerRow.cells) : []
	for (const [index, headerCell] of headerCells.entries()) {
		const rowCell = firstDataRow?.cells[index]
		if (rowCell) {
			headerCell.style.width = `${rowCell.offsetWidth}px`
		}
	}

	// pin cells in row that are sticky
	for (const row of table?.rows || []) {
		let totalWidth = 0
		const pinnedCells: HTMLTableCellElement[] = []

		for (const column of row.cells) {
			if (column.classList.contains('sticky-column') || column.classList.contains('sticky-index')) {
				column.style.left = `${totalWidth}px`
				totalWidth += column.offsetWidth
				pinnedCells.push(column)
			}
		}

		if (pinnedCells.length > 0) {
			const lastColumn = pinnedCells[pinnedCells.length - 1]
			lastColumn.classList.add('sticky-column-edge')
		}
	}
}

window.addEventListener('keydown', (event: KeyboardEvent) => {
	if (event.key === 'Escape') {
		if (store.modal.visible) {
			store.modal.visible = false

			// focus on the parent cell again
			const $parent = store.modal.parent
			if ($parent) {
				// wait for the modal to close before focusing
				void nextTick().then(() => {
					return $parent.focus()
				})
			}
		}
	}
})

const getProcessedColumnsForRow = (row: TableRow) => {
	if (!row.gantt || pinnedColumnCount.value === 0) {
		return store.columns
	}

	// For Gantt views, first add the pinned columns
	const result: TableColumn[] = []
	for (let i = 0; i < pinnedColumnCount.value; i++) {
		const column = { ...store.columns[i] }
		column.originalIndex = i // Preserve original index
		result.push(column)
	}

	// Finally, add the Gantt bar column with either a provided colspan or default to full-width colspan
	result.push({
		...store.columns[pinnedColumnCount.value],
		isGantt: true,
		colspan: row.gantt?.colspan || store.columns.length - pinnedColumnCount.value,
		originalIndex: pinnedColumnCount.value,
		width: 'auto', // TODO: refactor to API that can detect when data exists in a cell. Might have be custom and not generalizable
	})

	return result
}

const handleConnectionCreate = (connection: ConnectionPath) => {
	emit('connection:event', { type: 'create', connection })
}

const handleConnectionDelete = (connection: ConnectionPath) => {
	emit('connection:event', { type: 'delete', connection })
}

/**
 * Handle row click events from ARow components.
 */
const handleRowClick = (rowIndex: number, event: MouseEvent) => {
	const row = store.rows[rowIndex]
	emit('row:click', { row, rowIndex, event })
}

/**
 * Handle row action events from ARow components.
 * Performs the default action and emits the appropriate event.
 */
const handleRowAction = (actionType: RowActionType, rowIndex: number, event?: MouseEvent) => {
	switch (actionType) {
		case 'add': {
			// Add a new row after the current row
			const newIndex = store.addRow({}, rowIndex + 1)
			const newRow = store.rows[newIndex]
			rows.value = [...store.rows]
			emit('row:add', { rowIndex: newIndex, row: newRow })
			break
		}
		case 'delete': {
			const deletedRow = store.deleteRow(rowIndex)
			if (deletedRow) {
				rows.value = [...store.rows]
				emit('row:delete', { rowIndex, row: deletedRow })
			}
			break
		}
		case 'duplicate': {
			const newIndex = store.duplicateRow(rowIndex)
			if (newIndex >= 0) {
				const newRow = store.rows[newIndex]
				rows.value = [...store.rows]
				emit('row:duplicate', { sourceIndex: rowIndex, newIndex, row: newRow })
			}
			break
		}
		case 'insertAbove': {
			const newIndex = store.insertRowAbove(rowIndex)
			const newRow = store.rows[newIndex]
			rows.value = [...store.rows]
			emit('row:insert-above', { targetIndex: rowIndex, newIndex, row: newRow })
			break
		}
		case 'insertBelow': {
			const newIndex = store.insertRowBelow(rowIndex)
			const newRow = store.rows[newIndex]
			rows.value = [...store.rows]
			emit('row:insert-below', { targetIndex: rowIndex, newIndex, row: newRow })
			break
		}
		case 'move': {
			// Move action requires a target index - for now, emit an event
			// The consumer should handle showing a UI for selecting the target
			emit('row:move', { fromIndex: rowIndex, toIndex: -1 })
			break
		}
		case 'moveUp': {
			if (rowIndex > 0 && store.moveRow(rowIndex, rowIndex - 1)) {
				rows.value = [...store.rows]
				emit('row:move', { fromIndex: rowIndex, toIndex: rowIndex - 1 })
			}
			break
		}
		case 'moveDown': {
			if (rowIndex < store.rows.length - 1 && store.moveRow(rowIndex, rowIndex + 1)) {
				rows.value = [...store.rows]
				emit('row:move', { fromIndex: rowIndex, toIndex: rowIndex + 1 })
			}
			break
		}
		case 'open': {
			const row = store.rows[rowIndex]
			emit('row:open', { row, rowIndex, event })
			break
		}
	}
}

defineExpose({
	store,
	pagination,
	createConnection: store.createConnection,
	deleteConnection: store.deleteConnection,
	getConnectionsForBar: store.getConnectionsForBar,
	getHandlesForBar: store.getHandlesForBar,
	// Row action methods
	addRow: store.addRow,
	deleteRow: store.deleteRow,
	duplicateRow: store.duplicateRow,
	insertRowAbove: store.insertRowAbove,
	insertRowBelow: store.insertRowBelow,
	moveRow: store.moveRow,
})
</script>

<style>
.atable-container {
	position: relative;
}

.sticky-index {
	position: sticky;
	left: 0px;
	z-index: 100;
	order: 0;
}

.sticky-column,
th.sticky-column,
td.sticky-column,
th.sticky-index,
td.sticky-index {
	position: sticky;
	z-index: 100;
	order: 0;
	background: white;
}

.sticky-column-edge,
.atable th.sticky-column-edge {
	border-right: 1px solid var(--sc-row-border-color);
}
</style>

<style scoped>
.atable {
	position: relative;
	font-family: var(--sc-atable-font-family);
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-size: var(--sc-table-font-size);
	border-collapse: collapse;
	box-sizing: border-box;
	table-layout: auto;
	width: auto;
	overflow: clip;
	height: 1px;
	/* border-left:4px solid var(--sc-form-border); */
}
.atable th {
	border-width: 0px;
	border-style: solid;
	border-radius: 0px;
	padding-left: 0.5ch;
	padding-right: 0.5ch;
	padding-top: var(--sc-atable-row-padding);
	padding-bottom: var(--sc-atable-row-padding);
	color: var(--sc-gray-60);
	height: var(--sc-atable-row-height);
	font-weight: 300;
	letter-spacing: 0.05rem;
	order: 1;
	box-sizing: border-box;
}
.atable th:focus {
	outline: none;
}
</style>
