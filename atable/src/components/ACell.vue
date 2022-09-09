<template>
	<td
		ref="cell"
		:data-colindex="colIndex"
		:data-rowindex="rowIndex"
		:data-editable="tableData.columns[colIndex].edit"
		:contenteditable="tableData.columns[colIndex].edit"
		:tabindex="-1"
		:spellcheck="false"
		:style="cellStyle"
		@focus="onFocus"
		@paste="onChange"
		@blur="onChange"
		@input="onChange"
		@click="handleInput">
		{{ displayValue }}
	</td>
</template>

<script setup lang="ts">
import { computed, CSSProperties, inject, ref, resolveDynamicComponent } from 'vue'

import { useKeyboardNav } from '@sedum/utilities'
import TableDataStore from '.'

const props = defineProps<{
	colIndex: number
	rowIndex: number
	tableid: string
}>()

const tableData = inject<TableDataStore>(props.tableid)
const cell = ref<HTMLTableCellElement>(null)

let cellModified = ref(false)
const displayValue = computed(() => {
	const data = tableData.cellData<any>(props.colIndex, props.rowIndex)
	if (tableData.columns[props.colIndex].format) {
		const format = tableData.columns[props.colIndex].format
		if (typeof format === 'function') {
			return format(data)
		} else if (typeof format === 'string') {
			// parse format function from string
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const formatFn: (args: any) => any = Function(`"use strict";return (${format})`)()
			return formatFn(data)
		} else {
			return data
		}
	} else {
		return data
	}
})

const handleInput = () => {
	if (tableData.columns[props.colIndex].mask) {
		// TODO: add masking to cell values
		// tableData.columns[props.colIndex].mask(event)
	}

	const component = tableData.columns[props.colIndex].component
	if (component && resolveDynamicComponent(component)) {
		const domRect = cell.value.getBoundingClientRect()
		tableData.modal.visible = true
		tableData.modal.colIndex = props.colIndex
		tableData.modal.rowIndex = props.rowIndex
		tableData.modal.parent = cell.value
		tableData.modal.top = domRect.top + domRect.height
		tableData.modal.left = domRect.left
		tableData.modal.width = cellWidth.value
		tableData.modal.component = component
	}
}

useKeyboardNav([
	{
		selectors: cell,
		handlers: {
			'keydown.f2': handleInput,
			'keydown.alt.up': handleInput,
			'keydown.alt.down': handleInput,
			'keydown.alt.left': handleInput,
			'keydown.alt.right': handleInput,
		},
	},
])

const updateData = (event: Event) => {
	if (event) {
		// custom components need to handle their own updateData, this is the default
		if (!tableData.columns[props.colIndex].component) {
			tableData.setCellData(props.rowIndex, props.colIndex, cell.value.innerHTML)
		}
		cellModified.value = true
	}
}

const textAlign = computed(() => {
	return tableData.columns[props.colIndex].align || 'center'
})

const cellWidth = computed(() => {
	return tableData.columns[props.colIndex].width || '40ch'
})

let currentData = ''
const onFocus = () => {
	if (cell.value) {
		currentData = cell.value.innerText
		cell.value.tabIndex = 0
	}
}

const onChange = (event: FocusEvent | ClipboardEvent) => {
	if (cell.value) {
		if (event.type == 'blur') {
			cell.value.tabIndex = -1
		}

		if (cell.value.innerHTML !== currentData) {
			currentData = cell.value.innerText
			cell.value.dispatchEvent(new Event('change'))
			cellModified.value = true // set display instead
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

<style scoped>
td {
	border: 1px;
	border-style: solid;
	border-color: var(--cell-border-color);
	border-radius: 0px;
	box-sizing: border-box;
	margin: 0px;
	outline: none;
	box-shadow: none;
	color: var(--cell-text-color);
	text-overflow: ellipsis;
	overflow: hidden;
	padding-left: 0.5ch;
	padding-right: 0.5ch;
}

td:focus,
td:focus-within {
	background-color: var(--focus-cell-background);
	outline-width: 2px;
	outline-style: solid;
	outline-color: var(--focus-cell-outline);
	box-shadow: none;
	overflow: hidden;
	min-height: 1.15em;
	max-height: 1.15em;
	overflow: hidden;
}
</style>
