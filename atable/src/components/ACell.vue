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
		@paste="updateCellData"
		@blur="updateCellData"
		@input="updateCellData"
		@click="showModal"
		@mousedown="showModal"
		class="atable-cell"
		:class="pinned ? 'sticky-column' : ''">
		<component
			v-if="column.cellComponent"
			:is="column.cellComponent"
			:value="displayValue"
			v-bind="column.cellComponentProps" />
		<span v-else-if="isHtmlValue" v-html="displayValue" />
		<span v-else>{{ displayValue }}</span>
	</td>
</template>

<script setup lang="ts">
import { KeypressHandlers, defaultKeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
import { useElementBounding } from '@vueuse/core'
import { computed, CSSProperties, inject, ref, useTemplateRef } from 'vue'

import TableDataStore from '.'
import type { CellContext } from '@/types'
import { isHtmlString } from '@/utils'

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
const { bottom, left } = useElementBounding(cellRef)

// keep a shallow copy of the original cell value for comparison
const originalData = tableData.cellData<any>(colIndex, rowIndex)
const currentData = ref('')
const cellModified = ref(false)

const table = tableData.table
const column = tableData.columns[colIndex]
const row = tableData.rows[rowIndex]

const textAlign = column.align || 'center'
const cellWidth = column.width || '40ch'

const isHtmlValue = computed(() => {
	// TODO: check if display value is a native DOM element
	return typeof displayValue.value === 'string' ? isHtmlString(displayValue.value) : false
})

const cellStyle = computed((): CSSProperties => {
	return {
		textAlign,
		width: cellWidth,
		backgroundColor: !cellModified.value ? 'inherit' : 'var(--sc-cell-modified)',
		fontWeight: !cellModified.value ? 'inherit' : 'bold',
		paddingLeft: getIndent(colIndex, tableData.display[rowIndex]?.indent),
	}
})

const displayValue = computed(() => {
	const cellData = tableData.cellData<any>(colIndex, rowIndex)
	return getFormattedValue(cellData)
})

const getFormattedValue = (value: any) => {
	const format = column.format

	if (!format) {
		return value
	}

	if (typeof format === 'function') {
		return format(value, { table, row, column })
	} else if (typeof format === 'string') {
		// parse format function from string
		// eslint-disable-next-line @typescript-eslint/no-implied-eval
		const formatFn: (value: any, context?: CellContext) => string = Function(`"use strict";return (${format})`)()
		return formatFn(value, { table, row, column })
	}

	return value
}

const showModal = () => {
	if (column.mask) {
		// TODO: add masking to cell values
		// column.mask(event)
	}

	if (column.modalComponent) {
		tableData.modal.visible = true
		tableData.modal.colIndex = colIndex
		tableData.modal.rowIndex = rowIndex
		tableData.modal.parent = cellRef.value
		tableData.modal.top = bottom.value
		tableData.modal.left = left.value
		tableData.modal.width = cellWidth

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
			'keydown.f2': showModal,
			'keydown.alt.up': showModal,
			'keydown.alt.down': showModal,
			'keydown.alt.left': showModal,
			'keydown.alt.right': showModal,
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

const onFocus = () => {
	if (cellRef.value) {
		currentData.value = cellRef.value.textContent
	}
}

const updateCellData = () => {
	if (cellRef.value) {
		// only apply changes if the cell value has changed after being mounted
		if (column.format) {
			cellModified.value = cellRef.value.textContent !== getFormattedValue(originalData)
		} else {
			cellModified.value = cellRef.value.textContent !== originalData
		}

		if (cellRef.value.textContent !== currentData.value) {
			currentData.value = cellRef.value.textContent
			cellRef.value.dispatchEvent(new Event('change'))
			if (!column.format) {
				// TODO: need to setup reverse format function
				tableData.setCellData(rowIndex, colIndex, currentData.value)
			}
		}
	}
}

const getIndent = (colIndex: number, indentLevel?: number) => {
	if (indentLevel && colIndex === 0 && indentLevel > 0) {
		return `${indentLevel}ch`
	} else {
		return 'inherit'
	}
}
</script>

<style>
@import url('@stonecrop/themes/default.css');

.atable-cell {
	border-radius: 0px;
	box-sizing: border-box;
	margin: 0px;
	outline: none;
	box-shadow: none;
	color: var(--sc-cell-text-color);
	overflow: hidden;
	padding-left: 0.5ch !important;
	padding-right: 0.5ch;
	padding-top: var(--sc-atable-row-padding);
	padding-bottom: var(--sc-atable-row-padding);
	border-spacing: 0px;
	border-collapse: collapse;
	overflow: hidden;
	text-overflow: ellipsis;
	order: 1;
	white-space: nowrap;
	max-width: 40ch;
}
.atable-cell a {
	color: var(--sc-cell-text-color);
	text-decoration: none;
}
.atable-cell:focus,
.atable-cell:focus-within {
	background-color: var(--sc-focus-cell-background);
	outline-width: var(--sc-atable-cell-border-width);
	outline-style: solid;
	outline-offset: calc(var(--sc-atable-cell-border-width) * -1);
	outline-color: var(--sc-focus-cell-outline);
	box-shadow: none;
	overflow: hidden;
	text-wrap: nowrap;
	box-sizing: border-box;
}
</style>
