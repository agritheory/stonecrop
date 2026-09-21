<template>
	<td
		ref="cellRef"
		class="atable-cell currency-value-cell"
		:class="{ 'sticky-column': pinned, 'cell-modified': cellModified }"
		:style="{ '--currency-symbol': symbol ? `'${symbol} '` : `''` }"
		:contenteditable="isEditable"
		:tabindex="0"
		:spellcheck="false"
		@focus="onFocus"
		@paste="updateCellData"
		@input="debouncedUpdateCellData"
		@click="onClick">
		{{ displayValue }}
	</td>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useDebounceFn, useElementBounding } from '@vueuse/core'
import type { createTableStore } from '../stores/table'

// Registered as the `cellComponent` for currency-typed columns (e.g. "rate"/"amount"). ATable.vue
// itself resolves `column.cellComponent || 'ACell'` — this REPLACES the entire cell (the `<td>`
// included), the same way `modalComponent` replaces the popover's content — it is not just inline
// content rendered inside ACell's own `<td>`, despite what ACell's internal (dead, for this
// purpose) `cellComponentBindings` logic suggests. So this receives the same props ACell itself
// would (`store`, `rowIndex`, `colIndex`, `pinned`), not a pre-formatted `value` string — and
// since it replaces ACell wholesale, ACell's own click-to-open-modal behavior (for a column that
// also has a `modalComponent`) has to be reimplemented here too, or that feature silently regresses.
const props = defineProps<{
	store: ReturnType<typeof createTableStore>
	rowIndex: number
	colIndex: number
	pinned?: boolean
}>()

const cellRef = useTemplateRef<HTMLTableCellElement>('cellRef')

const column = computed(() => props.store.columns[props.colIndex])
const isEditable = computed(() => !!column.value.edit)

const displayValue = computed(() => props.store.getCellDisplayValue(props.colIndex, props.rowIndex))

// The currency symbol is rendered as CSS generated content (`::before`, driven by the
// `--currency-symbol` custom property below) rather than embedded in the cell's own text — that
// way it's purely visual and never part of `textContent`, so editing (below) only ever touches
// the plain number, with no risk of the user's typing mangling or duplicating the symbol.

// Mirrors ACell.vue's own edit handling (this cell replaces ACell entirely, so nothing does this
// for free anymore): captured once, compared against on each edit to know if the cell has an
// unsaved change (the `cell-modified` bold/italic indicator other editable cells also get).
const originalData = props.store.getCellData(props.colIndex, props.rowIndex)
const currentData = ref('')
const cellModified = ref(false)

const selectAllText = () => {
	if (!cellRef.value || !isEditable.value) return
	const selection = window.getSelection()
	if (!selection) return
	try {
		const range = document.createRange()
		range.selectNodeContents(cellRef.value)
		selection.removeAllRanges()
		selection.addRange(range)
	} catch {
		// Best-effort — some environments (e.g. certain test runners) don't fully support Range/Selection.
	}
}

const onFocus = () => {
	if (!cellRef.value) return
	currentData.value = cellRef.value.textContent ?? ''
	selectAllText()
}

// A currency cell typically has both `edit: true` and a `format`, so — matching a quantity cell's
// own handling — a live edit is saved via `setCellText` (into `store.updates`, reconciled at save
// time) rather than `setCellData`.
const updateCellData = (event: Event) => {
	if (!isEditable.value) return
	const target = event.target as HTMLTableCellElement
	if (target.textContent === currentData.value) return
	currentData.value = target.textContent ?? ''
	cellModified.value =
		target.textContent !== props.store.getFormattedValue(props.colIndex, props.rowIndex, originalData)
	props.store.setCellText(props.colIndex, props.rowIndex, target.textContent ?? '')
}

const debouncedUpdateCellData = useDebounceFn(updateCellData, 300)

// Replicates ACell.vue's onCellClick/showModal for the one case that matters here: opening the
// column's modalComponent. A column with no modalComponent leaves this a no-op, matching its
// current (unclickable) behavior.
const onClick = () => {
	if (!column.value.modalComponent || !cellRef.value) return
	const { left, bottom, width, height } = useElementBounding(cellRef)
	const row = props.store.rows[props.rowIndex]
	props.store.modal.visible = true
	props.store.modal.colIndex = props.colIndex
	props.store.modal.rowIndex = props.rowIndex
	props.store.modal.left = left.value
	props.store.modal.bottom = bottom.value
	props.store.modal.width = width.value
	props.store.modal.height = height.value
	props.store.modal.cell = cellRef.value
	props.store.modal.component =
		typeof column.value.modalComponent === 'function'
			? column.value.modalComponent({ table: props.store.table, row, column: column.value })
			: column.value.modalComponent
	props.store.modal.componentProps = column.value.modalComponentExtraProps
}

// Currency is a document-level choice (one currency for every line), resolved once per table via
// `store.getCurrencyMeta()` — every currency cell across the table shares the same cached result,
// so this only ever triggers the app's resolver once regardless of how many cells mount.
const symbol = ref('')

props.store.getCurrencyMeta().then(meta => {
	symbol.value = meta?.currencySymbol ?? ''
	return meta
})
</script>

<style scoped>
.currency-value-cell::before {
	content: var(--currency-symbol);
}
</style>
