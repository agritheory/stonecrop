<template>
	<table
		ref="table"
		class="atable"
		:style="{
			width: store.config.fullWidth ? '100%' : 'auto',
		}"
		v-on-click-outside="store.closeModal">
		<slot name="header" :data="store">
			<ATableHeader :columns="store.columns" :store="store" />
		</slot>

		<tbody>
			<slot name="body" :data="store">
				<ARow v-for="(row, rowIndex) in store.rows" :key="row.id" :row="row" :rowIndex="rowIndex" :store="store">
					<template v-for="(column, colIndex) in getProcessedColumnsForRow(row)" :key="column.name">
						<component
							v-if="column.isGantt"
							:is="column.ganttComponent || 'AGanttCell'"
							:store="store"
							:columnsCount="store.columns.length - pinnedColumnCount"
							:color="row.gantt?.color"
							:start="row.gantt?.startIndex"
							:end="row.gantt?.endIndex"
							:colspan="column.colspan"
							:pinned="column.pinned"
							:rowIndex="rowIndex"
							:colIndex="column.originalIndex ?? colIndex"
							:style="{
								textAlign: column?.align || 'center',
								minWidth: column?.width || '40ch',
								width: store.config.fullWidth ? 'auto' : null,
							}" />
						<component
							v-else
							:is="column.cellComponent || 'ACell'"
							:store="store"
							:pinned="column.pinned"
							:rowIndex="rowIndex"
							:colIndex="colIndex"
							:style="{
								textAlign: column?.align || 'center',
								minWidth: column?.width || '40ch',
								width: store.config.fullWidth ? 'auto' : null,
							}"
							spellcheck="false" />
					</template>
				</ARow>
			</slot>
		</tbody>

		<slot name="footer" :data="store" />
		<slot name="modal" :data="store">
			<ATableModal v-show="store.modal.visible" :store="store">
				<template #default>
					<component
						:key="`${store.modal.rowIndex}:${store.modal.colIndex}`"
						:is="store.modal.component"
						:colIndex="store.modal.colIndex"
						:rowIndex="store.modal.rowIndex"
						:store="store"
						v-bind="store.modal.componentProps" />
				</template>
			</ATableModal>
		</slot>
	</table>
</template>

<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { useMutationObserver } from '@vueuse/core'
import { nextTick, watch, onMounted, useTemplateRef, computed } from 'vue'

import ARow from './ARow.vue'
import ATableHeader from './ATableHeader.vue'
import ATableModal from './ATableModal.vue'
import { createTableStore } from '../stores/table'
import type { GanttDragEvent, TableColumn, TableConfig, TableRow } from '../types'

const {
	id,
	modelValue,
	columns,
	rows = [],
	config = new Object(),
} = defineProps<{
	id?: string
	modelValue: TableRow[]
	columns: TableColumn[]
	rows?: TableRow[]
	config?: TableConfig
}>()

const emit = defineEmits<{
	'update:modelValue': [value: TableRow[]]
	cellUpdate: [{ colIndex: number; rowIndex: number; newValue: any; oldValue: any }]
	'gantt:drag': [event: GanttDragEvent]
}>()

const tableRef = useTemplateRef<HTMLTableElement>('table')
const rowsValue = modelValue ? modelValue : rows
const store = createTableStore({ columns, rows: rowsValue, id, config })

store.$onAction(({ name, store, args, after }) => {
	if (name === 'setCellData' || name === 'setCellText') {
		const [colIndex, rowIndex, newValue] = args
		const oldValue = store.getCellData(colIndex, rowIndex)
		after(() => {
			emit('cellUpdate', { colIndex, rowIndex, newValue, oldValue })
		})
	} else if (name === 'updateGanttBar') {
		const [event] = args
		const ganttBar = store.rows[event.rowIndex]?.gantt
		if (ganttBar) {
			// only emit if the bar was actually resized or moved; check before the mutation
			let emitDrag = false
			if (event.type === 'resize') {
				if (event.edge === 'start') {
					emitDrag = ganttBar.startIndex !== event.newValue
				} else if (event.edge === 'end') {
					emitDrag = ganttBar.endIndex !== event.newValue
				}
			} else if (event.type === 'bar') {
				emitDrag = ganttBar.startIndex !== event.newStart || ganttBar.endIndex !== event.newEnd
			}

			if (emitDrag) {
				after(() => {
					emit('gantt:drag', event)
				})
			}
		}
	}
})

watch(
	() => store.rows,
	newValue => {
		emit('update:modelValue', newValue)
	},
	{ deep: true }
)

onMounted(() => {
	if (columns.some(column => column.pinned)) {
		assignStickyCellWidths()

		// in tree view, also add a mutation observer to capture and adjust expanded rows
		if (store.config.view === 'tree') {
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
		const columns: HTMLTableCellElement[] = []

		for (const column of row.cells) {
			if (column.classList.contains('sticky-column') || column.classList.contains('sticky-index')) {
				column.style.left = `${totalWidth}px`
				totalWidth += column.offsetWidth
				columns.push(column)
			}
		}

		if (columns.length > 0) {
			const lastColumn = columns[columns.length - 1]
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
					$parent.focus()
				})
			}
		}
	}
})

const getProcessedColumnsForRow = (row: TableRow) => {
	const isGanttRow = row.indent === 0
	if (!isGanttRow || pinnedColumnCount.value === 0) {
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

defineExpose({ store })
</script>

<style>
.sticky-index {
	position: sticky;
	left: 0px;
	z-index: 10;
	order: 0;
}

.sticky-column,
th.sticky-column,
td.sticky-column,
th.sticky-index,
td.sticky-index {
	position: sticky;
	z-index: 10;
	order: 0;
	background: white;
}

.sticky-column-edge,
.atable th.sticky-column-edge {
	border-right: 1px solid var(--sc-row-border-color);
}
</style>

<style scoped>
@import url('@stonecrop/themes/default.css');
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

/* Make sure the vertical indicator doesn't extend into the header */
.atable:tbody {
	overflow: hidden; /* This ensures the indicator is clipped */
	position: relative; /* Create a stacking context */
}

/* Ensure the indicator stays within the tbody */
.atable:tbody::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 1px;
	background-color: transparent;
	z-index: 100;
}
</style>
