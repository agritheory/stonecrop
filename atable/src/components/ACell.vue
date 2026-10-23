<template>
	<td
		ref="cell"
		:data-colindex="colIndex"
		:data-rowindex="rowIndex"
		:data-editable="column.edit"
		:contenteditable="isContentEditable"
		:tabindex="tabIndex"
		:spellcheck="false"
		:style="cellStyle"
		class="atable-cell"
		:class="cellClasses"
		@focus="onFocus"
		@focusout="onFocusOut"
		@keydown="onArithmeticKeydown"
		@paste="updateCellData"
		@input="debouncedUpdateCellData"
		@click="onCellClick">
		<component :is="column.cellComponent" v-if="column.cellComponent" v-bind="cellComponentBindings" />
		<component
			:is="'ATupleCellEditor'"
			v-else-if="tupleCategory && column.edit"
			ref="tupleEditor"
			:category="tupleCategory"
			:col-index="colIndex"
			:row-index="rowIndex"
			:store="store"
			:active="tupleCellActive"
			:display-text="String(renderedValue ?? '')"
			:input-id="tupleInputId"
			@deactivate="tupleCellActive = false" />
		<component :is="'ABadge'" v-else-if="badgeFromFormat" v-bind="badgeFromFormat" presentation="cell-fill" />
		<component :is="'ABadge'" v-else-if="badgeFromOptions" v-bind="badgeFromOptions" />
		<span v-else-if="isHtmlValue" v-html="renderedValue" />
		<span v-else ref="textSpan">{{ renderedValue }}</span>
	</td>
</template>

<script setup lang="ts">
import {
	KeypressHandlers,
	defaultKeypressHandlers,
	isArithmeticKey,
	roundToPrecision,
	useArithmeticInput,
	useKeyboardNav,
} from '@stonecrop/utilities'
import { componentCategory, isBadgeDescriptor, hasBadgeOptions } from '@stonecrop/schema'
import { useDebounceFn, useElementBounding } from '@vueuse/core'
import { computed, type CSSProperties, onMounted, ref, useTemplateRef, nextTick, watch } from 'vue'

import { getIndent } from '../stores/table'
import type { TableStore } from '../types'
import { isTableTuplePickerModal } from '../tuplePickerModal'
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
	store: TableStore
	addNavigation?: boolean | KeypressHandlers
	tabIndex?: number
	pinned?: boolean
	debounce?: number
}>()

const cellRef = useTemplateRef<HTMLTableCellElement>('cell')
const tupleEditor = useTemplateRef<{ focusInput: () => void; commitNumber: () => void }>('tupleEditor')

const originalData = store.getCellData(colIndex, rowIndex)
const currentData = ref('')
const cellModified = ref(false)
const tupleCellActive = ref(false)

const column = store.columns[colIndex]
const row = store.rows[rowIndex]

const textAlign = column.align || 'center'
const cellWidth = column.width || '40ch'

const displayValue = computed(() => store.getCellDisplayValue(colIndex, rowIndex))

const resolvedText = ref<string | null>(null)

const tupleCategory = computed((): 'quantity' | 'currency' | undefined => {
	if (column.cellComponent) return undefined
	const category = componentCategory(column.component)
	if (category === 'quantity' || category === 'currency') return category
	return undefined
})

// A number column takes arithmetic, as the form's ANumericInput does: `12*3+4` is read as 40 once the cell is left
// or Enter is pressed. Until then the cell holds the text as typed. `options.arithmetic: false` turns it off.
const arithmeticCell = computed(
	() =>
		componentCategory(column.component) === 'number' &&
		!(column.options && !Array.isArray(column.options) && column.options.arithmetic === false)
)

// Typing into a contenteditable cell can replace the rendered span with bare text nodes, and Vue patches only the
// span it rendered: a committed result puts that span back to show it.
const textSpan = useTemplateRef<HTMLSpanElement>('textSpan')

// The same arithmetic as the form's ANumericInput, with the cell's text as the box. It is read once the cell is left
// or Enter is pressed, never as it is typed ("12*" is no number yet), and only an edit writes to the row. The cell
// renders its own text, so the composable never writes it.
const arithmetic = useArithmeticInput({
	value: () => store.getCellData(colIndex, rowIndex),
	commit: value => {
		store.setCellData(colIndex, rowIndex, value)
		cellModified.value = value !== originalData
	},
	// A column with a fixed scale says so with `options.precision`: at 2, `10/3` is saved as 3.33.
	round: value =>
		column.options && !Array.isArray(column.options) && typeof column.options.precision === 'number'
			? roundToPrecision(value, column.options.precision)
			: value,
	live: false,
	enabled: () => false,
})

const tupleInputId = computed(() => `atable-${String(rowIndex)}-${String(colIndex)}-${column.name}`)

// A link cell shows the name of the link it holds now, so it follows the cell's data, and a name that arrives
// for a link it no longer holds is dropped.
onMounted(() => {
	const linkDoctype = column.linkDoctype
	if (!linkDoctype) return

	watch(
		() => store.getCellData(colIndex, rowIndex),
		(raw, _previous, onCleanup) => {
			resolvedText.value = null

			if (raw !== null && raw !== undefined && typeof raw === 'object') {
				const obj = raw as Record<string, unknown>
				const display = obj.displayText ?? obj.id
				if (typeof display === 'string' || typeof display === 'number') {
					resolvedText.value = String(display)
				}
				return
			}

			const resolver = store.linkResolver
			if (!resolver || typeof raw !== 'string' || raw === '') return
			let current = true
			onCleanup(() => {
				current = false
			})
			void resolver(linkDoctype, raw).then(text => {
				if (current && text != null) resolvedText.value = text
				return text
			})
		},
		{ immediate: true }
	)
})

const renderedValue = computed(() => resolvedText.value ?? displayValue.value)

const badgeFromFormat = computed(() => {
	if (column.cellComponent) return undefined
	const value = renderedValue.value
	return isBadgeDescriptor(value) ? value : undefined
})

const badgeFromOptions = computed(() => {
	if (column.cellComponent || badgeFromFormat.value) return undefined
	if (!hasBadgeOptions(column.options)) return undefined
	return {
		value: store.getCellData(colIndex, rowIndex),
		options: column.options,
		presentation: 'cell-fill' as const,
	}
})

const usesBadgeDisplay = computed(
	() => !!column.cellComponent || badgeFromFormat.value !== undefined || hasBadgeOptions(column.options)
)

// A rich-text cell shows its document's plain text. Typing there would replace the document with a string, so the
// cell is not editable: the document is edited in a form, through AEditor.
const isRichText = componentCategory(column.component) === 'richtext'

const isContentEditable = computed(() => column.edit && !usesBadgeDisplay.value && !tupleCategory.value && !isRichText)

const cellComponentBindings = computed(() => {
	const props = { ...column.cellComponentProps }
	if (column.cellComponent !== 'ABadge') {
		return { ...props, value: renderedValue.value }
	}
	if (isBadgeDescriptor(renderedValue.value)) {
		return { presentation: 'cell-fill' as const, ...props, ...renderedValue.value }
	}
	return {
		presentation: 'cell-fill' as const,
		options: column.options,
		...props,
		value: store.getCellData(colIndex, rowIndex),
	}
})

const isHtmlValue = computed(() => {
	return typeof renderedValue.value === 'string' ? isHtmlString(renderedValue.value) : false
})

const cellStyle = computed((): CSSProperties => {
	return {
		textAlign,
		width: cellWidth,
		fontWeight: !cellModified.value ? 'inherit' : 'bold',
		paddingLeft: getIndent(colIndex, store.display[rowIndex]?.indent),
	}
})

const cellClasses = computed(() => {
	return {
		'sticky-column': pinned,
		'cell-modified': cellModified.value,
		'atable-cell--badge-fill': usesBadgeDisplay.value,
		'atable-cell--tuple': !!tupleCategory.value && !!column.edit,
		'atable-cell--tuple-active': tupleCellActive.value,
	}
})

const onCellClick = () => {
	if (tupleCategory.value && column.edit) {
		tupleCellActive.value = true
		void nextTick(() => tupleEditor.value?.focusInput())
		return
	}
	selectAllText()
	showModal()
}

const showModal = () => {
	if (column.mask) {
		// TODO: add masking to cell values
	}

	const cell = cellRef.value
	if (!column.modalComponent || !cell) return

	const { left, bottom, width, height } = useElementBounding(cellRef)
	const component =
		typeof column.modalComponent === 'function'
			? column.modalComponent({ table: store.table, row, column })
			: column.modalComponent

	store.openCellShell(
		colIndex,
		rowIndex,
		cell,
		{ left: left.value, bottom: bottom.value, width: width.value, height: height.value },
		component,
		column.modalComponentExtraProps ?? {}
	)
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

const selectAllText = () => {
	if (cellRef.value && column.edit && isContentEditable.value) {
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
			}
		}
	}
}

const onFocus = () => {
	if (tupleCategory.value && column.edit) {
		tupleCellActive.value = true
		void nextTick(() => tupleEditor.value?.focusInput())
		return
	}
	if (cellRef.value) {
		currentData.value = cellRef.value.textContent!
		if (arithmeticCell.value) arithmetic.begin(currentData.value)
		selectAllText()
	}
}

const commitArithmetic = () => {
	const cell = cellRef.value
	if (!cell || !arithmeticCell.value || !isContentEditable.value) return
	const typed = cell.textContent ?? ''
	if (typed === currentData.value) return
	arithmetic.update(typed)
	// An unfinished expression ("12*") commits nothing, and the cell goes back to its last number.
	arithmetic.settle()
	// Show the result now, not on the next render: focus may already be on its way to the next row, and the text
	// left in the cell is what the next edit starts from.
	const span = textSpan.value
	if (span) {
		cell.replaceChildren(span)
		span.textContent = String(renderedValue.value ?? '')
	}
	currentData.value = cell.textContent ?? ''
	arithmetic.rebase(currentData.value)
	// Still editing (Enter on the last row, with no row to move to): carry on from the end of the result, so `+1`
	// typed after `40` is `40+1`.
	if (document.activeElement === cell) placeCaretAtEnd(cell)
}

const placeCaretAtEnd = (cell: HTMLElement) => {
	try {
		const range = document.createRange()
		range.selectNodeContents(cell)
		range.collapse(false)
		const selection = window.getSelection()
		selection?.removeAllRanges()
		selection?.addRange(range)
	} catch {
		// Fallback for environments where the Range API is not fully supported
	}
}

const onArithmeticKeydown = (event: KeyboardEvent) => {
	if (!arithmeticCell.value || !isContentEditable.value) return
	if (event.ctrlKey || event.metaKey || event.altKey) return
	if (event.key === 'Enter') {
		commitArithmetic()
		return
	}
	if (event.key.length !== 1) return
	// The cell's text once typed in, as `=` may only start it.
	const next = cellTextWith(event.key)
	const allowed = next === undefined ? isArithmeticKey(event.key) : arithmetic.accepts(next)
	if (!allowed) event.preventDefault()
}

// The cell's text once `inserted` replaces its selection, or undefined where the selection can't be read.
const cellTextWith = (inserted: string): string | undefined => {
	const cell = cellRef.value
	const range = window.getSelection()?.rangeCount ? window.getSelection()!.getRangeAt(0) : undefined
	if (!cell || !range || !cell.contains(range.startContainer) || !cell.contains(range.endContainer)) return
	try {
		const offset = (node: Node, at: number) => {
			const before = document.createRange()
			before.selectNodeContents(cell)
			before.setEnd(node, at)
			return before.toString().length
		}
		const text = cell.textContent ?? ''
		return (
			text.slice(0, offset(range.startContainer, range.startOffset)) +
			inserted +
			text.slice(offset(range.endContainer, range.endOffset))
		)
	} catch {
		// Fallback for environments where the Range API is not fully supported
		return
	}
}

const onFocusOut = (event: FocusEvent) => {
	commitArithmetic()
	if (!tupleCategory.value || !column.edit || !tupleCellActive.value) return

	const related = event.relatedTarget
	const cell = cellRef.value

	if (related instanceof Node && document.querySelector('.amodal')?.contains(related)) return

	if (
		store.modal.visible &&
		store.modal.colIndex === colIndex &&
		store.modal.rowIndex === rowIndex &&
		isTableTuplePickerModal(store.modal)
	) {
		return
	}

	if (related instanceof Node && cell?.contains(related)) {
		if (related instanceof Element) {
			if (related.closest('.atable-tuple-shell__input')) return
			if (related.closest('.atable-tuple-shell__handle')) return
		}
	}

	tupleEditor.value?.commitNumber?.()
	tupleCellActive.value = false
	store.closeTuplePicker()
}

const saveCursorPosition = () => {
	try {
		const selection = window.getSelection()
		if (selection && selection.rangeCount > 0 && cellRef.value) {
			const range = selection.getRangeAt(0)
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
	if (!column.edit || tupleCategory.value) return
	// An arithmetic cell is read once it is left, not as it is typed: "12*" is no number yet.
	if (arithmeticCell.value) {
		const pasted = (payload as ClipboardEvent).clipboardData?.getData('text') ?? ''
		if (pasted && !arithmetic.accepts(cellTextWith(pasted) ?? pasted)) payload.preventDefault()
		return
	}

	const target = payload.target as HTMLTableCellElement
	if (target.textContent === currentData.value) {
		return
	}

	const cursorPosition = saveCursorPosition()

	currentData.value = target.textContent!

	if (column.format) {
		cellModified.value = target.textContent !== store.getFormattedValue(colIndex, rowIndex, originalData)
		store.setCellText(colIndex, rowIndex, target.textContent)
	} else {
		cellModified.value = target.textContent !== originalData
		store.setCellData(colIndex, rowIndex, target.textContent)
	}

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
.atable-cell {
	background-color: inherit;
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
.atable-cell--badge-fill {
	padding: 0 !important;
	margin-left: 0;
}

.atable-cell--tuple {
	padding-left: 0 !important;
	padding-right: 0.5ch !important;
}

/* Same inset ring as other cells (.atable-cell:focus-within); inner controls must not add a second ring. */
.atable-cell--tuple :deep(.atable-tuple-shell__input:focus),
.atable-cell--tuple :deep(.atable-tuple-shell__input:focus-visible),
.atable-cell--tuple :deep(.atable-tuple-shell__handle:focus),
.atable-cell--tuple :deep(.atable-tuple-shell__handle:focus-visible) {
	outline: none;
	box-shadow: none;
}
</style>
