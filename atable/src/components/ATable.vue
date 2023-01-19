<template>
	<table class="atable" :style="{ width: tableData.config.fullWidth ? '100%' : 'auto' }">
		<slot name="header" :data="tableData">
			<ATableHeader :columns="tableData.columns" :config="tableData.config" :tableid="tableData.id" />
		</slot>

		<tbody>
			<slot name="body" :data="tableData">
				<ARow
					v-for="(row, rowIndex) in tableData.rows"
					:key="row.id || v4()"
					:row="row"
					:rowIndex="rowIndex"
					:tableid="tableData.id">
					<ACell
						v-for="(col, colIndex) in tableData.columns"
						:key="colIndex"
						:tableid="tableData.id"
						:col="col"
						spellcheck="false"
						:rowIndex="rowIndex"
						:colIndex="colIndex + (tableData.zeroColumn ? 0 : -1)"
						:component="col.cellComponent"
						:style="{
							textAlign: col?.align || 'center',
							minWidth: col?.width || '40ch',
						}" />
				</ARow>
			</slot>
		</tbody>

		<slot name="footer" :data="tableData" />
		<slot name="modal" :data="tableData">
			<ATableModal
				:colIndex="tableData.modal.colIndex"
				:rowIndex="tableData.modal.rowIndex"
				:tableid="tableData.id"
				v-show="tableData.modal.visible"
				:style="{
					left: tableData.modal.left + 'px',
					top: tableData.modal.top + 'px',
					maxWidth: tableData.modal.width + 'px',
				}">
				<component
					:key="`${tableData.modal.rowIndex}:${tableData.modal.colIndex}`"
					:is="tableData.modal.component"
					:colIndex="tableData.modal.colIndex"
					:rowIndex="tableData.modal.rowIndex"
					:tableid="tableData.id" />
			</ATableModal>
		</slot>
	</table>
</template>

<script setup lang="ts">
import { v4 } from 'uuid'
import { nextTick, provide } from 'vue'

import { TableColumn, TableConfig, TableRow } from 'types'
import TableDataStore from '.'
import ACell from '@/components/ACell.vue'
import ARow from '@/components/ARow.vue'
import ATableHeader from '@/components/ATableHeader.vue'
import ATableModal from '@/components/ATableModal.vue'

const props = withDefaults(
	defineProps<{
		id?: string
		columns: TableColumn[]
		rows?: TableRow[]
		config?: TableConfig
		tableid?: string
	}>(),
	{
		rows: () => [],
		config: () => new Object(),
	}
)

let tableData = new TableDataStore(props.id, props.columns, props.rows, props.config)
provide(tableData.id, tableData)

const formatCell = (event?: KeyboardEvent, column?: TableColumn, cellData?: any) => {
	let colIndex: number
	const target = event?.target as HTMLTableCellElement
	if (event) {
		colIndex = target.cellIndex + (tableData.zeroColumn ? -1 : 0)
	} else if (column && cellData) {
		colIndex = tableData.columns.indexOf(column)
	}

	if (!column && 'format' in tableData.columns[colIndex]) {
		// TODO: (utils) create helper to extract format from string
		const format = tableData.columns[colIndex].format
		if (typeof format === 'function') {
			return format(target.innerHTML)
		} else if (typeof format === 'string') {
			// parse format function from string
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const formatFn: (args: any) => any = Function(`"use strict";return (${format})`)()
			return formatFn(target.innerHTML)
		} else {
			return target.innerHTML
		}
	} else if (cellData && 'format' in column) {
		const format = column.format
		if (typeof format === 'function') {
			return format(cellData)
		} else if (typeof format === 'string') {
			// parse format function from string
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const formatFn: (args: any) => any = Function(`"use strict";return (${format})`)()
			return formatFn(cellData)
		} else {
			return cellData
		}
	} else if (cellData && column.type.toLowerCase() in ['int', 'decimal', 'float', 'number', 'percent']) {
		return cellData
		// TODO: number formatting
	} else {
		return cellData
	}
}

const moveCursorToEnd = (target: HTMLElement) => {
	target.focus()
	document.execCommand('selectAll', false, null)
	document.getSelection().collapseToEnd()
}

const clickOutside = (event: MouseEvent) => {
	if (!tableData.modal.parent?.contains(event.target as HTMLElement)) {
		if (tableData.modal.visible) {
			// call set data
			tableData.modal.visible = false
		}
	}
}

window.addEventListener('click', clickOutside)
window.addEventListener('keydown', (event: KeyboardEvent) => {
	if (event.key === 'Escape') {
		if (tableData.modal.visible) {
			tableData.modal.visible = false

			// focus on the parent cell again
			const $parent = tableData.modal.parent
			if ($parent) {
				// wait for the modal to close
				void nextTick().then(() => {
					// for some reason, the parent is not immediately visible in the DOM;
					// re-fetching the cell to add focus instead
					const rowIndex = $parent.dataset.rowindex
					const colIndex = $parent.dataset.colindex
					const $parentCell = document.querySelectorAll(`[data-rowindex='${rowIndex}'][data-colindex='${colIndex}']`)
					if ($parentCell) {
						;($parentCell[0] as HTMLTableCellElement).focus()
					}
				})
			}
		}
	}
})
</script>

<style scoped>
@import url('@agritheory/themes/default/default.css');

table {
	display: table;
	border-collapse: collapse;
	caret-color: var(--brand-color);
}

table.atable,
.atable {
	font-family: var(--atable-font-family);
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-size: var(--table-font-size);
	border-collapse: collapse;
}

th {
	box-sizing: border-box;
	background-color: var(--brand-color);
	border-width: 1px;
	border-style: solid;
	border-color: var(--header-border-color);
	border-radius: 0px;
	color: var(--header-text-color);
}
</style>
