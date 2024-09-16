<template>
	<td
		ref="cell"
		:data-colindex="colIndex"
		:data-rowindex="rowIndex"
		:data-editable="tableData.columns[colIndex].edit"
		:contenteditable="tableData.columns[colIndex].edit"
		:tabindex="tabIndex"
		:spellcheck="false"
		:style="cellStyle"
		@focus="onFocus"
		@paste="onChange"
		@blur="onChange"
		@input="onChange"
		@click="handleInput"
		@mousedown="handleInput"
		class="atable__cell">
		<component
			v-if="tableData.columns[colIndex].cellComponent"
			:is="tableData.columns[colIndex].cellComponent"
			:value="displayValue"
			v-bind="tableData.columns[colIndex].cellComponentProps">
		</component>
		<span v-else>{{ displayValue }}</span>
	</td>
</template>

<script setup lang="ts">
import { KeypressHandlers, defaultKeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
import { computed, CSSProperties, inject, ref, useTemplateRef } from 'vue'

import TableDataStore from '.'
import type { CellFormatContext } from '@/types'

const {
	colIndex,
	rowIndex,
	tableid,
	addNavigation = true,
	tabIndex = 0,
} = defineProps<{
	colIndex: number
	rowIndex: number
	tableid: string
	addNavigation?: boolean | KeypressHandlers
	tabIndex?: number
}>()

const tableData = inject<TableDataStore>(tableid)
const cell = useTemplateRef<HTMLTableCellElement>('cell')
const currentData = ref('')
const cellModified = ref(false)

const displayValue = computed(() => {
	const data = tableData.cellData<any>(colIndex, rowIndex)
	if (tableData.columns[colIndex].format) {
		const table = tableData.table
		const row = tableData.rows[rowIndex]
		const column = tableData.columns[colIndex]
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
	if (tableData.columns[colIndex].mask) {
		// TODO: add masking to cell values
		// tableData.columns[colIndex].mask(event)
	}

	if (tableData.columns[colIndex].modalComponent) {
		const domRect = cell.value.getBoundingClientRect()
		tableData.modal.visible = true
		tableData.modal.colIndex = colIndex
		tableData.modal.rowIndex = rowIndex
		tableData.modal.parent = cell.value
		tableData.modal.top = domRect.top + domRect.height
		tableData.modal.left = domRect.left
		tableData.modal.width = cellWidth.value
		tableData.modal.component = tableData.columns[colIndex].modalComponent
		tableData.modal.componentProps = tableData.columns[colIndex].modalComponentProps
	}
}

if (addNavigation) {
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

	if (typeof addNavigation === 'object') {
		handlers = {
			...handlers,
			...addNavigation,
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
// 		if (!tableData.columns[colIndex].component) {
// 			tableData.setCellData(rowIndex, colIndex, cell.value.innerHTML)
// 		}
// 		cellModified.value = true
// 	}
// }

const textAlign = computed(() => {
	return tableData.columns[colIndex].align || 'center'
})

const cellWidth = computed(() => {
	return tableData.columns[colIndex].width || '40ch'
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
			if (!tableData.columns[colIndex].format) {
				// TODO: need to setup reverse format function
				tableData.setCellData(rowIndex, colIndex, currentData.value)
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
	paddingLeft: getIndent(colIndex, tableData.display[rowIndex]?.indent),
}
</script>

<style>
@import url('@stonecrop/themes/default/default.css');
</style>
