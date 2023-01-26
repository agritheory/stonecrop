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
		@mousedown="handleInput">
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
import { computed, CSSProperties, inject, ref } from 'vue'

import { defaultKeypressHandlers, useKeyboardNav } from '@agritheory/utilities'
import TableDataStore from '.'

const props = withDefaults(
	defineProps<{
		colIndex: number
		rowIndex: number
		tableid: string
		addNavigation?: boolean | object
		tabIndex?: number
		clickHandler?: (event: MouseEvent) => void
	}>(),
	{
		tabIndex: 0,
		addNavigation: true,
	}
)

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

const handleInput = (event: MouseEvent) => {
	// Not sure if click handler is needed anymore?
	if (props.clickHandler) {
		props.clickHandler(event)
		return
	}

	if (tableData.columns[props.colIndex].mask) {
		// TODO: add masking to cell values
		// tableData.columns[props.colIndex].mask(event)
	}

	if (tableData.columns[props.colIndex].modalComponent) {
		const domRect = cell.value.getBoundingClientRect()
		tableData.modal.visible = true
		tableData.modal.colIndex = props.colIndex
		tableData.modal.rowIndex = props.rowIndex
		tableData.modal.parent = cell.value
		tableData.modal.top = domRect.top + domRect.height
		tableData.modal.left = domRect.left
		tableData.modal.width = cellWidth.value
		tableData.modal.component = tableData.columns[props.colIndex].modalComponent
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
// 		if (!tableData.columns[props.colIndex].component) {
// 			tableData.setCellData(props.rowIndex, props.colIndex, cell.value.innerHTML)
// 		}
// 		cellModified.value = true
// 	}
// }

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
	}
}

const onChange = () => {
	if (cell.value) {
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
@import url('@agritheory/themes/default/default.css');
td {
	border-radius: 0px;
	box-sizing: border-box;
	margin: 0px;
	outline: none;
	box-shadow: none;
	color: var(--cell-text-color);
	text-overflow: ellipsis;
	overflow: hidden;
	padding-left: 0.5ch !important;
	padding-right: 0.5ch;

	padding-top: var(--atable-row-padding);
	padding-bottom: var(--atable-row-padding);

	border-spacing: 0px;
	border-collapse: collapse;
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
