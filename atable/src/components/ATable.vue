<template>
	<table class="atable">
		<slot name="tableheader">
			<ATableHeader :columns="tableData.columns" :config="tableData.config" :tableid="tableData.id" />
		</slot>
		<tbody>
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
					:style="{
						textAlign: col?.align?.toLowerCase() || 'center',
						minWidth: col?.width || '40ch',
					}" />
			</ARow>
		</tbody>
		<slot name="footer" />
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
				:is="tableData.modal.component"
				:colIndex="tableData.modal.colIndex"
				:rowIndex="tableData.modal.rowIndex"
				:tableid="tableData.id" />
		</ATableModal>
	</table>
</template>

<script setup lang="ts">
import { v4 } from 'uuid'
import { provide } from 'vue'

import { TableColumn, TableConfig, TableRow } from 'types'
import TableDataStore from '.'
import ACell from '@/components/ACell.vue'
import ARow from '@/components/ARow.vue'
import ATableHeader from '@/components/ATableHeader.vue'
import ATableModal from '@/components/ATableModal.vue'
import { defaultKeypressHandlers, useKeyboardNav } from '@sedum/utilities'

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

useKeyboardNav([
	{
		selectors: 'td',
		handlers: defaultKeypressHandlers,
	},
])

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
</script>

<style scoped>
table {
	display: table;
	border-collapse: var(--border-collapsed);
	caret-color: var(--brand-color);
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

tr {
	background-color: var(--row-color-zebra-light);
	outline: none;
}

tr:nth-child(even) {
	background-color: var(--row-color-zebra-dark);
}
</style>
