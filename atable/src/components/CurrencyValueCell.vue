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
	} catch {}
}

const onFocus = () => {
	if (!cellRef.value) return
	currentData.value = cellRef.value.textContent ?? ''
	selectAllText()
}

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
