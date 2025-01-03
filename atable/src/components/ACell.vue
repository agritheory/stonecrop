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
		@input="updateCellData"
		@click="showModal"
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
import { computed, type CSSProperties, ref, useTemplateRef } from 'vue'

import { useTableStore } from '../stores/table'
import { isHtmlString } from '../utils'

const {
	colIndex,
	rowIndex,
	tabIndex = 0,
	pinned,
	addNavigation = true,
	tableId,
} = defineProps<{
	colIndex: number
	rowIndex: number
	tabIndex?: number
	pinned?: boolean
	addNavigation?: boolean | KeypressHandlers
	tableId: string
}>()

const store = useTableStore()

const emit = defineEmits<{ cellInput: [colIndex: number, rowIndex: number, newValue: string, oldValue: string] }>()

const cellRef = useTemplateRef<HTMLTableCellElement>('cell')
const { width, height } = useElementBounding(cellRef)

// keep a shallow copy of the original cell value for comparison
const originalData = store.getCellData(tableId, colIndex, rowIndex)
const currentData = ref('')
const cellModified = ref(false)

const column = store.columns[tableId][colIndex]
const row = store.rows[tableId][rowIndex]

const textAlign = column.align || 'center'
const cellWidth = column.width || '40ch'

const displayValue = computed(() => store.getCellDisplayValue(tableId, colIndex, rowIndex))
const isHtmlValue = computed(() => {
	// TODO: check if display value is a native DOM element
	return typeof displayValue.value === 'string' ? isHtmlString(displayValue.value) : false
})

const cellStyle = computed((): CSSProperties => {
	return {
		textAlign,
		width: cellWidth,
		backgroundColor: !cellModified.value ? 'inherit' : 'var(--sc-cell-changed-color)',
		fontWeight: !cellModified.value ? 'inherit' : 'bold',
		paddingLeft: store.getIndent(tableId, colIndex, store.display[tableId][rowIndex]?.indent),
	}
})

const showModal = () => {
	if (column.mask) {
		// TODO: add masking to cell values
		// column.mask(event)
	}

	if (column.modalComponent) {
		store.$patch(state => {
			state.modal[tableId].visible = true
			state.modal[tableId].colIndex = colIndex
			state.modal[tableId].rowIndex = rowIndex
			state.modal[tableId].parent = cellRef.value
			state.modal[tableId].top = cellRef.value.offsetTop + cellRef.value.offsetHeight
			state.modal[tableId].left = cellRef.value.offsetLeft
			state.modal[tableId].width = width.value
			state.modal[tableId].height = height.value

			if (typeof column.modalComponent === 'function') {
				state.modal[tableId].component = column.modalComponent({ table: state.table[tableId], row, column })
			} else {
				state.modal[tableId].component = column.modalComponent
			}

			state.modal[tableId].componentProps = column.modalComponentExtraProps
		})
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
// 			store.setCellData(colIndex, rowIndex, cell.value.innerHTML)
// 		}
// 		cellModified.value = true
// 	}
// }

const onFocus = () => {
	if (cellRef.value) {
		currentData.value = cellRef.value.textContent
	}
}

const updateCellData = (payload: Event) => {
	const target = payload.target as HTMLTableCellElement
	if (target.textContent === currentData.value) {
		return
	}

	emit('cellInput', colIndex, rowIndex, target.textContent, currentData.value)
	currentData.value = target.textContent

	// only apply changes if the cell value has changed after being mounted
	if (column.format) {
		cellModified.value = target.textContent !== store.getFormattedValue(tableId, colIndex, rowIndex, originalData)
		// TODO: need to setup reverse format function?
		store.setCellText(tableId, colIndex, rowIndex, target.textContent)
	} else {
		cellModified.value = target.textContent !== originalData
		store.setCellData(tableId, colIndex, rowIndex, target.textContent)
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
