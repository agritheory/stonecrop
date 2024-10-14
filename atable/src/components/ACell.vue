<template>
	<td
		ref="cell"
		:data-colindex="colIndex"
		:data-rowindex="rowIndex"
		:data-editable="column.edit"
		:contenteditable="column.edit"
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
		:class="pinned ? 'sticky-column' : ''">
		<component
			v-if="column.cellComponent"
			:is="column.cellComponent"
			:value="displayValue"
			v-bind="column.cellComponentProps">
		</component>
		<span v-else>{{ displayValue }}</span>
	</td>
</template>

<script setup lang="ts">
import { KeypressHandlers, defaultKeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
import { computed, CSSProperties, inject, ref, useTemplateRef } from 'vue'

import TableDataStore from '.'
import type { CellContext } from '@/types'

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
	pinned?: boolean
}>()

const tableData = inject<TableDataStore>(tableid)
const cellRef = useTemplateRef<HTMLTableCellElement>('cell')
const currentData = ref('')
const cellModified = ref(false)

const table = tableData.table
const column = tableData.columns[colIndex]
const row = tableData.rows[rowIndex]

const displayValue = computed(() => {
	const cellData = tableData.cellData<any>(colIndex, rowIndex)
	const format = column.format

	if (!format) {
		return cellData
	}

	if (typeof format === 'function') {
		return format(cellData, { table, row, column })
	} else if (typeof format === 'string') {
		// parse format function from string
		// eslint-disable-next-line @typescript-eslint/no-implied-eval
		const formatFn: (value: any, context?: CellContext) => string = Function(`"use strict";return (${format})`)()
		return formatFn(cellData, { table, row, column })
	}

	return cellData
})

const handleInput = () => {
	if (column.mask) {
		// TODO: add masking to cell values
		// column.mask(event)
	}

	if (column.modalComponent) {
		const domRect = cellRef.value.getBoundingClientRect()
		tableData.modal.visible = true
		tableData.modal.colIndex = colIndex
		tableData.modal.rowIndex = rowIndex
		tableData.modal.parent = cellRef.value
		tableData.modal.top = domRect.top + domRect.height
		tableData.modal.left = domRect.left
		tableData.modal.width = cellWidth.value

		if (typeof column.modalComponent === 'function') {
			tableData.modal.component = column.modalComponent({ table, row, column })
		} else {
			tableData.modal.component = column.modalComponent
		}

		tableData.modal.componentProps = column.modalComponentExtraProps
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
			selectors: cellRef,
			handlers: handlers,
		},
	])
}

// const updateData = (event: Event) => {
// 	if (event) {
// 		// custom components need to handle their own updateData, this is the default
// 		if (!column.component) {
// 			tableData.setCellData(rowIndex, colIndex, cell.value.innerHTML)
// 		}
// 		cellModified.value = true
// 	}
// }

const textAlign = computed(() => {
	return column.align || 'center'
})

const cellWidth = computed(() => {
	return column.width || '40ch'
})

const onFocus = () => {
	if (cellRef.value) {
		currentData.value = cellRef.value.textContent
	}
}

const onChange = () => {
	if (cellRef.value) {
		if (cellRef.value.textContent !== currentData.value) {
			currentData.value = cellRef.value.textContent
			cellRef.value.dispatchEvent(new Event('change'))
			cellModified.value = true // set display instead
			if (!column.format) {
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
