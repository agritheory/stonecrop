<template>
	<table
		class="atable"
		:style="{ width: tableData.config.fullWidth ? '100%' : 'auto' }"
		v-on-click-outside="closeModal">
		<slot name="header" :data="tableData">
			<ATableHeader :columns="tableData.columns" :tableid="tableData.id" />
		</slot>

		<tbody>
			<slot name="body" :data="tableData">
				<ARow
					v-for="(row, rowIndex) in tableData.rows"
					:key="row.id"
					:row="row"
					:rowIndex="rowIndex"
					:tableid="tableData.id">
					<ACell
						v-for="(col, colIndex) in tableData.columns"
						:key="col.name"
						:tableid="tableData.id"
						:col="col"
						spellcheck="false"
						:pinned="col.pinned"
						:rowIndex="rowIndex"
						:colIndex="colIndex + (tableData.zeroColumn ? 0 : -1)"
						:component="col.cellComponent"
						:style="{
							textAlign: col?.align || 'center',
							minWidth: col?.width || '40ch',
							width: tableData.config.fullWidth ? 'auto' : null,
						}" />
				</ARow>
			</slot>
		</tbody>

		<slot name="footer" :data="tableData" />
		<slot name="modal" :data="tableData">
			<ATableModal
				v-show="tableData.modal.visible"
				:colIndex="tableData.modal.colIndex"
				:rowIndex="tableData.modal.rowIndex"
				:tableid="tableData.id"
				:style="{
					left: tableData.modal.left + 'px',
					top: tableData.modal.top + 'px',
					maxWidth: tableData.modal.width + 'px',
				}">
				<template #default>
					<component
						:key="`${tableData.modal.rowIndex}:${tableData.modal.colIndex}`"
						:is="tableData.modal.component"
						:colIndex="tableData.modal.colIndex"
						:rowIndex="tableData.modal.rowIndex"
						:tableid="tableData.id"
						v-bind="tableData.modal.componentProps" />
				</template>
			</ATableModal>
		</slot>
	</table>
</template>

<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { nextTick, provide, watch } from 'vue'

import TableDataStore from '.'
import ACell from '@/components/ACell.vue'
import ARow from '@/components/ARow.vue'
import ATableHeader from '@/components/ATableHeader.vue'
import ATableModal from '@/components/ATableModal.vue'
import type { TableColumn, TableConfig, TableRow } from '@/types'

const {
	id,
	modelValue,
	columns,
	rows = [],
	config = new Object(),
	tableid,
} = defineProps<{
	id?: string
	modelValue: TableRow[]
	columns: TableColumn[]
	rows?: TableRow[]
	config?: TableConfig
	tableid?: string
}>()

const getLeftPosition = (index, colWidth) => {
	if (index != 0) {
		return index * colWidth
	}
	return 0
}

const emit = defineEmits(['update:modelValue'])

const rowsValue = modelValue ? modelValue : rows
const tableData = new TableDataStore(id, columns, rowsValue, config)
provide(tableData.id, tableData)

watch(
	() => tableData.rows,
	newValue => {
		emit('update:modelValue', newValue)
	},
	{ deep: true }
)

// const formatCell = (event?: KeyboardEvent, column?: TableColumn, cellData?: any) => {
// 	let colIndex: number
// 	const target = event?.target as HTMLTableCellElement
// 	if (event) {
// 		colIndex = target.cellIndex + (tableData.zeroColumn ? -1 : 0)
// 	} else if (column && cellData) {
// 		colIndex = tableData.columns.indexOf(column)
// 	}

// 	if (!column && 'format' in tableData.columns[colIndex]) {
// 		// TODO: (utils) create helper to extract format from string
// 		const format = tableData.columns[colIndex].format
// 		if (typeof format === 'function') {
// 			return format(target.innerHTML)
// 		} else if (typeof format === 'string') {
// 			// parse format function from string
// 			// eslint-disable-next-line @typescript-eslint/no-implied-eval
// 			const formatFn: (args: any) => any = Function(`"use strict";return (${format})`)()
// 			return formatFn(target.innerHTML)
// 		} else {
// 			return target.innerHTML
// 		}
// 	} else if (cellData && 'format' in column) {
// 		const format = column.format
// 		if (typeof format === 'function') {
// 			return format(cellData)
// 		} else if (typeof format === 'string') {
// 			// parse format function from string
// 			// eslint-disable-next-line @typescript-eslint/no-implied-eval
// 			const formatFn: (args: any) => any = Function(`"use strict";return (${format})`)()
// 			return formatFn(cellData)
// 		} else {
// 			return cellData
// 		}
// 	} else if (cellData && column.type.toLowerCase() in ['int', 'decimal', 'float', 'number', 'percent']) {
// 		return cellData
// 		// TODO: number formatting
// 	} else {
// 		return cellData
// 	}
// }

// const moveCursorToEnd = (target: HTMLElement) => {
// 	target.focus()
// 	document.execCommand('selectAll', false, null)
// 	document.getSelection().collapseToEnd()
// }

const closeModal = (event: MouseEvent) => {
	if (!(event.target instanceof Node)) {
		// if the target is not a node, it's probably a custom click event to Document or Window
		// err on the side of closing the modal in that case
		if (tableData.modal.visible) tableData.modal.visible = false
	} else if (!tableData.modal.parent?.contains(event.target)) {
		if (tableData.modal.visible) tableData.modal.visible = false
	}
}

window.addEventListener('keydown', (event: KeyboardEvent) => {
	if (event.key === 'Escape') {
		if (tableData.modal.visible) {
			tableData.modal.visible = false

			// focus on the parent cell again
			const $parent = tableData.modal.parent
			if ($parent) {
				// wait for the modal to close before focusing
				void nextTick().then(() => {
					$parent.focus()
				})
			}
		}
	}
})
</script>

<style>
@import url('@stonecrop/themes/default/default.css');
</style>
