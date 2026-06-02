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
		class="atable-cell"
		:class="cellClasses"
		@focus="onFocus"
		@paste="updateCellData"
		@input="debouncedUpdateCellData"
		@click="onCellClick">
		<component
			:is="column.cellComponent"
			v-if="column.cellComponent"
			:value="renderedValue"
			v-bind="column.cellComponentProps" />
		<span v-else-if="isHtmlValue" v-html="renderedValue" />
		<span v-else>{{ renderedValue }}</span>
	</td>
</template>

<script setup lang="ts">
import { KeypressHandlers, defaultKeypressHandlers, useKeyboardNav } from '@stonecrop/utilities'
import { useDebounceFn, useElementBounding } from '@vueuse/core'
import { computed, type CSSProperties, onMounted, ref, useTemplateRef, nextTick } from 'vue'

import { createTableStore } from '../stores/table'
import { isHtmlString } from '../utils'

const {
	colIndex,
	rowIndex,
	store,
	addNavigation = true,
	tabIndex = 0,
	pinned = false,
	debounce = 300,
} = defineProps<{
	colIndex: number
	rowIndex: number
	store: ReturnType<typeof createTableStore>
	addNavigation?: boolean | KeypressHandlers
	tabIndex?: number
	pinned?: boolean
	debounce?: number
}>()

const cellRef = useTemplateRef<HTMLTableCellElement>('cell')

// keep a shallow copy of the original cell value for comparison
const originalData = store.getCellData(colIndex, rowIndex)
const currentData = ref('')
const cellModified = ref(false)

const column = store.columns[colIndex]
const row = store.rows[rowIndex]

const textAlign = column.align || 'center'
const cellWidth = column.width || '40ch'

const displayValue = computed(() => store.getCellDisplayValue(colIndex, rowIndex))

// Resolved display text for Link columns with bare string IDs.
// null = not yet resolved or not applicable; non-null overrides displayValue.
const resolvedText = ref<string | null>(null)

onMounted(() => {
	if (!column.linkDoctype) return
	const raw = store.getCellData(colIndex, rowIndex)

	// Pre-resolved AFormLinkValue object — extract display text directly.
	if (raw !== null && raw !== undefined && typeof raw === 'object') {
		const obj = raw as Record<string, unknown>
		const display = obj.displayText ?? obj.id
		if (typeof display === 'string' || typeof display === 'number') {
			resolvedText.value = String(display)
		}
		return
	}

	// Bare string ID — call the resolver if available.
	const resolver = store.linkResolver
	if (!resolver || typeof raw !== 'string' || raw === '') return
	void resolver(column.linkDoctype, raw).then(text => {
		if (text != null) resolvedText.value = text
		return text
	})
})

const renderedValue = computed(() => resolvedText.value ?? displayValue.value)

const isHtmlValue = computed(() => {
	// TODO: check if display value is a native DOM element
	return typeof renderedValue.value === 'string' ? isHtmlString(renderedValue.value) : false
})

const cellStyle = computed((): CSSProperties => {
	return {
		textAlign,
		width: cellWidth,
		fontWeight: !cellModified.value ? 'inherit' : 'bold',
		paddingLeft: store.getIndent(colIndex, store.display[rowIndex]?.indent),
	}
})

const cellClasses = computed(() => {
	return {
		'sticky-column': pinned,
		'cell-modified': cellModified.value,
	}
})

const onCellClick = () => {
	// First, select all text if the cell is editable
	selectAllText()

	// Then handle modal display (original showModal behavior)
	showModal()
}

const showModal = () => {
	const { left, bottom, width, height } = useElementBounding(cellRef)

	if (column.mask) {
		// TODO: add masking to cell values
		// column.mask(event)
	}

	if (column.modalComponent) {
		store.$patch(state => {
			state.modal.visible = true
			state.modal.colIndex = colIndex
			state.modal.rowIndex = rowIndex
			// TODO: typing refs somehow resolves to unref'd value; probably a bug in TS?
			state.modal.left = left
			state.modal.bottom = bottom
			state.modal.width = width
			state.modal.height = height
			state.modal.cell = cellRef.value

			if (typeof column.modalComponent === 'function') {
				state.modal.component = column.modalComponent({ table: state.table, row, column })
			} else {
				state.modal.component = column.modalComponent
			}

			state.modal.componentProps = column.modalComponentExtraProps
		})
	}
}

if (addNavigation) {
	let handlers = {
		...defaultKeypressHandlers,
		'keydown.f2': showModal,
		'keydown.alt.up': showModal,
		'keydown.alt.down': showModal,
		'keydown.alt.left': showModal,
		'keydown.alt.right': showModal,
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

const selectAllText = () => {
	if (cellRef.value && column.edit) {
		// Use the Selection API to select all text content in the contenteditable cell
		const selection = window.getSelection()
		if (selection) {
			try {
				const range = document.createRange()
				if (range.selectNodeContents) {
					range.selectNodeContents(cellRef.value)
					selection.removeAllRanges()
					selection.addRange(range)
				}
			} catch {
				// Fallback for environments where Range API is not fully supported
				// This is expected in some test environments
			}
		}
	}
}

const onFocus = () => {
	if (cellRef.value) {
		currentData.value = cellRef.value.textContent!
		// Select all text when the cell receives focus
		selectAllText()
	}
}

const saveCursorPosition = () => {
	try {
		const selection = window.getSelection()
		if (selection && selection.rangeCount > 0 && cellRef.value) {
			const range = selection.getRangeAt(0)
			// Save the offset from the start of the cell
			const preCaretRange = range.cloneRange()
			if (preCaretRange.selectNodeContents && preCaretRange.setEnd) {
				preCaretRange.selectNodeContents(cellRef.value)
				preCaretRange.setEnd(range.endContainer, range.endOffset)
				return preCaretRange.toString().length
			}
		}
	} catch {
		// Fallback for environments where Selection API is not fully supported
	}
	return 0
}

const restoreCursorPosition = (position: number) => {
	if (!cellRef.value) return

	try {
		const selection = window.getSelection()
		if (!selection) return

		let charIndex = 0
		const walker = document.createTreeWalker
			? document.createTreeWalker(cellRef.value, NodeFilter.SHOW_TEXT, null)
			: null

		if (!walker) return

		let node: Node | null
		let range: Range | null = null

		while ((node = walker.nextNode())) {
			const textNode = node as Text
			const nextCharIndex = charIndex + textNode.textContent.length

			if (position <= nextCharIndex) {
				range = document.createRange()
				if (range.setStart && range.setEnd) {
					range.setStart(textNode, position - charIndex)
					range.setEnd(textNode, position - charIndex)
					break
				}
			}
			charIndex = nextCharIndex
		}

		if (range && selection.removeAllRanges && selection.addRange) {
			selection.removeAllRanges()
			selection.addRange(range)
		}
	} catch {
		// Fallback for environments where DOM APIs are not fully supported
	}
}

const updateCellData = (payload: Event) => {
	if (!column.edit) return

	const target = payload.target as HTMLTableCellElement
	if (target.textContent === currentData.value) {
		return
	}

	// Save cursor position before updating
	const cursorPosition = saveCursorPosition()

	currentData.value = target.textContent!

	// only apply changes if the cell value has changed after being mounted
	if (column.format) {
		cellModified.value = target.textContent !== store.getFormattedValue(colIndex, rowIndex, originalData)
		// TODO: need to setup reverse format function?
		store.setCellText(colIndex, rowIndex, target.textContent)
	} else {
		cellModified.value = target.textContent !== originalData
		store.setCellData(colIndex, rowIndex, target.textContent)
	}

	// Use nextTick to restore cursor position after Vue's reactive updates but before browser repaint
	void nextTick().then(() => {
		return restoreCursorPosition(cursorPosition)
	})
}

const debouncedUpdateCellData = useDebounceFn(updateCellData, debounce)

defineExpose({
	currentData,
})
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
	border-top: 1px solid var(--sc-row-border-color);
	margin-left: 1px;
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
.cell-modified {
	font-weight: bold;
	font-style: italic;
}
.cell-modified-highlight {
	background-color: var(--sc-cell-changed-color);
}
</style>
