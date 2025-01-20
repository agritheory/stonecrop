<template>
	<table
		ref="table"
		class="atable"
		:style="{ width: store.config.fullWidth ? '100%' : 'auto' }"
		v-on-click-outside="store.closeModal">
		<slot name="header" :data="store">
			<ATableHeader :columns="store.columns" :store="store" />
		</slot>

		<tbody>
			<slot name="body" :data="store">
				<ARow v-for="(row, rowIndex) in store.rows" :key="row.id" :row="row" :rowIndex="rowIndex" :store="store">
					<ACell
						v-for="(col, colIndex) in store.columns"
						:key="col.name"
						:store="store"
						:col="col"
						spellcheck="false"
						:pinned="col.pinned"
						:rowIndex="rowIndex"
						:colIndex="colIndex"
						:component="col.cellComponent"
						:style="{
							textAlign: col?.align || 'center',
							minWidth: col?.width || '40ch',
							width: store.config.fullWidth ? 'auto' : null,
						}"
						@cellInput="emitInput" />
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
import { nextTick, watch, onMounted, useTemplateRef } from 'vue'

import ACell from './ACell.vue'
import ARow from './ARow.vue'
import ATableHeader from './ATableHeader.vue'
import ATableModal from './ATableModal.vue'
import { createTableStore } from '../stores/table'
import type { TableColumn, TableConfig, TableRow } from '../types'

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
	cellUpdate: [colIndex: number, rowIndex: number, newCellValue: any, prevCellValue: any]
}>()

const tableRef = useTemplateRef<HTMLTableElement>('table')
const rowsValue = modelValue ? modelValue : rows
const store = createTableStore({ columns, rows: rowsValue, id, config })

store.$onAction(({ name, store, args, after }) => {
	if (name === 'setCellData') {
		const [colIndex, rowIndex, newCellValue] = args
		const prevCellValue = store.getCellData(colIndex, rowIndex)

		after(() => {
			emit('cellUpdate', colIndex, rowIndex, newCellValue, prevCellValue)
		})
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
	if (columns.some(col => col.pinned)) {
		assignStickyCellWidths()

		// in tree view, also add a mutation observer to capture and adjust expanded rows
		if (store.config.view === 'tree') {
			useMutationObserver(tableRef, assignStickyCellWidths, { childList: true, subtree: true })
		}
	}
})

const emitInput = (colIndex: number, rowIndex: number, newCellValue: any, prevCellValue: any) => {
	emit('cellUpdate', colIndex, rowIndex, newCellValue, prevCellValue)
}

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

defineExpose({ store })
</script>

<style>
.sticky-index {
	position: sticky;
	left: 0px;
	z-index: 1;
	order: 0;
}

.sticky-column,
th.sticky-column,
td.sticky-column,
th.sticky-index,
td.sticky-index {
	position: sticky;
	z-index: 1;
	order: 0;
	background: white;
}

.sticky-column-edge,
.atable th.sticky-column-edge {
	border-right: 1px solid var(--sc-row-border-color);
	border-right-width: 1px;
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
