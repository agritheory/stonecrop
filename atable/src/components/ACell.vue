<template>
	<td
		ref="cell"
		:data-colindex="colIndex"
		:data-rowindex="rowIndex"
		:data-editable="currentColumn.edit"
		:contenteditable="currentColumn.edit"
		:tabindex="tabIndex"
		:spellcheck="false"
		:style="cellStyle"
		@focus="onFocus"
		@paste="onChange"
		@blur="onChange"
		@input="onChange"
		@click="handleInput"
		@mousedown="handleInput"
		class="atable__cell"
		:class="hasPinnedColumns ? 'sticky-column' : ''">
		<component
			v-if="currentColumn.cellComponent"
			:is="currentColumn.cellComponent"
			:value="displayValue"
			v-bind="currentColumn.cellComponentProps">
		</component>
		<span v-else>{{ displayValue }}</span>
	</td>
</template>

<script setup lang="ts">
import { KeypressHandlers, defaultKeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
import { computed, CSSProperties, inject, ref } from 'vue'

import TableDataStore from '.'
import type { CellFormatContext } from '@/types'

const props = withDefaults(
	defineProps<{
		colIndex: number
		rowIndex: number
		tableid: string
		addNavigation?: boolean | KeypressHandlers
		tabIndex?: number
	}>(),
	{
		tabIndex: 0,
		addNavigation: true,
	}
)

const tableData = inject<TableDataStore>(props.tableid)
const cell = ref<HTMLTableCellElement>(null)
const currentColumn = tableData.columns[props.colIndex]
const currentData = ref('')
const cellModified = ref(false)

const hasPinnedColumns = computed(() => tableData.columns.some(col => col.pinned))

const displayValue = computed(() => {
	const data = tableData.cellData<any>(props.colIndex, props.rowIndex)
	if (currentColumn.format) {
		const table = tableData.table
		const row = tableData.rows[props.rowIndex]
		const column = currentColumn
		const format = column.format

		if (typeof format === 'function') {
			return format(data, { table, row, column })
		} else if (typeof format === 'string') {
			// parse format function from string
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const formatFn: (args: any, context?: CellFormatContext) => string = Function(`"use strict";return (${format})`)()
			return formatFn(data, { table, row, column })
		} else {
			return data
		}
	} else {
		return data
	}
})

const handleInput = () => {
	if (currentColumn.mask) {
		// TODO: add masking to cell values
		// currentColumn.mask(event)
	}

	if (currentColumn.modalComponent) {
		const domRect = cell.value.getBoundingClientRect()
		tableData.modal.visible = true
		tableData.modal.colIndex = props.colIndex
		tableData.modal.rowIndex = props.rowIndex
		tableData.modal.parent = cell.value
		tableData.modal.top = domRect.top + domRect.height
		tableData.modal.left = domRect.left
		tableData.modal.width = cellWidth.value
		tableData.modal.component = currentColumn.modalComponent
		tableData.modal.componentProps = currentColumn.modalComponentProps
	}
}

if (props.addNavigation) {
	let handlers = {
		...defaultKeypressHandlers,
		...{
			'keydown.f2': handleInput,
			'keydown.alt.up': handleInput,
			'keydown.alt.down': handleInput,
			'keydown.alt.left': handleInput,
			'keydown.alt.right': handleInput,
		},
	}

	if (typeof props.addNavigation === 'object') {
		handlers = {
			...handlers,
			...props.addNavigation,
		}
	}

	useKeyboardNav([
		{
			selectors: cell,
			handlers: handlers,
		},
	])
}

// const updateData = (event: Event) => {
// 	if (event) {
// 		// custom components need to handle their own updateData, this is the default
// 		if (!currentColumn.component) {
// 			tableData.setCellData(props.rowIndex, props.colIndex, cell.value.innerHTML)
// 		}
// 		cellModified.value = true
// 	}
// }

const textAlign = computed(() => {
	return currentColumn.align || 'center'
})

const cellWidth = computed(() => {
	return currentColumn.width || '40ch'
})

const onFocus = () => {
	if (cell.value) {
		currentData.value = cell.value.textContent
	}
}

const onChange = () => {
	if (cell.value) {
		if (cell.value.textContent !== currentData.value) {
			currentData.value = cell.value.textContent
			cell.value.dispatchEvent(new Event('change'))
			cellModified.value = true // set display instead
			if (!currentColumn.format) {
				// TODO: need to setup reverse format function
				tableData.setCellData(props.rowIndex, props.colIndex, currentData.value)
			}
		}
	}
}

const getIndent = (colKey: number, indent: number) => {
	if (indent && colKey === 0 && indent > 0) {
		return `${indent}ch`
	} else {
		return 'inherit'
	}
}

const cellStyle: CSSProperties = {
	textAlign: textAlign.value,
	width: cellWidth.value,
	backgroundColor: !cellModified.value ? 'inherit' : 'var(--cell-modified-color)',
	fontWeight: !cellModified.value ? 'inherit' : 'bold',
	paddingLeft: getIndent(props.colIndex, tableData.display[props.rowIndex]?.indent),
}
</script>

<style>
@import url('@stonecrop/themes/default/default.css');
</style>
