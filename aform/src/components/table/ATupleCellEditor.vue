<template>
	<ATupleCellShell
		:active="active"
		:display-text="displayText"
		:picker-label="pickerLabel"
		:picker-open="pickerOpenForCell"
		@open-picker="openPicker">
		<input
			ref="inputRef"
			:id="inputId"
			v-model="draftText"
			class="atable-tuple-shell__input"
			type="text"
			tabindex="-1"
			inputmode="decimal"
			:aria-label="amountLabel"
			@input="onInput"
			@keydown="onKeydown"
			@focus="onInputFocus"
			@blur="onInputBlur" />
	</ATupleCellShell>
</template>

<script setup lang="ts">
import {
	currencyAmountEntryPattern,
	currencyInputFractionDigits,
	formatCurrencyAmountInput,
	parseCurrencyAmountInput,
} from '@stonecrop/utilities'
import { isTableTuplePickerModal, type createTableStore } from '@stonecrop/atable'
import { useElementBounding } from '@vueuse/core'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'

import type { CurrencyOptions, CurrencyValue, QuantityOptions, QuantityValue } from '../../types'
import { normalizeBaseCurrency, patchCurrencyAmount } from '../../utils/currencyValue'
import { patchQuantityQty } from '../../utils/quantityValue'
import ATupleCellShell from './ATupleCellShell.vue'

const { category, colIndex, rowIndex, store, active, displayText, inputId } = defineProps<{
	category: 'quantity' | 'currency'
	colIndex: number
	rowIndex: number
	store: ReturnType<typeof createTableStore>
	active: boolean
	displayText: string
	inputId: string
}>()

const emit = defineEmits<{
	deactivate: []
}>()

const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const draftText = ref('')
const selectOnFocus = ref(true)

const amountMaskEnabled = computed(
	() => category === 'currency' && (options.value as CurrencyOptions).amountMask !== false
)

const column = computed(() => store.columns[colIndex])
const options = computed(() => column.value?.options ?? {})
const cellValue = computed(() => store.getCellData(colIndex, rowIndex))

const pickerLabel = computed(() => (category === 'currency' ? 'Choose currency' : 'Choose unit'))
const amountLabel = computed(() => (category === 'currency' ? 'Amount' : 'Quantity'))

const selectedCurrencyId = computed(() => String((cellValue.value as CurrencyValue | undefined)?.currency?.id ?? ''))

const cellElement = computed(() => {
	const el = inputRef.value?.closest('td')
	return el instanceof HTMLTableCellElement ? el : null
})
const { left, bottom, width, height } = useElementBounding(cellElement)

const pickerOpenForCell = computed(
	() => isTableTuplePickerModal(store.modal) && store.modal.colIndex === colIndex && store.modal.rowIndex === rowIndex
)

const syncDraftFromModel = () => {
	const v = cellValue.value
	if (category === 'quantity') {
		const q = v as QuantityValue | null | undefined
		draftText.value = q?.qty === null || q?.qty === undefined ? '' : String(q.qty)
		return
	}
	const c = v as CurrencyValue | null | undefined
	if (amountMaskEnabled.value) {
		draftText.value = formatCurrencyAmountInput(c?.amount ?? null, selectedCurrencyId.value)
		return
	}
	draftText.value = c?.amount === null || c?.amount === undefined ? '' : String(c.amount)
}

watch(cellValue, syncDraftFromModel, { deep: true })
watch(
	() => active,
	isActive => {
		if (isActive) syncDraftFromModel()
	}
)

const parseDraftAmount = (): number | null => {
	if (category === 'currency' && amountMaskEnabled.value) {
		return parseCurrencyAmountInput(draftText.value, selectedCurrencyId.value)
	}
	const text = draftText.value.trim()
	if (text === '' || text === '-') return null
	const n = Number(text)
	return Number.isFinite(n) ? n : null
}

const commitNumber = () => {
	const parsed = parseDraftAmount()
	if (category === 'quantity') {
		store.setCellData(
			colIndex,
			rowIndex,
			patchQuantityQty(cellValue.value as QuantityValue | null, parsed, options.value as QuantityOptions)
		)
		return
	}
	const base = normalizeBaseCurrency(options.value as CurrencyOptions, cellValue.value as CurrencyValue | null)
	store.setCellData(
		colIndex,
		rowIndex,
		patchCurrencyAmount(cellValue.value as CurrencyValue | null, parsed, options.value as CurrencyOptions, base)
	)
}

const onInput = () => {
	if (category === 'currency' && amountMaskEnabled.value) {
		const parsed = parseCurrencyAmountInput(draftText.value, selectedCurrencyId.value)
		if (draftText.value.trim() === '' || draftText.value.trim() === '-' || parsed !== null) {
			commitNumber()
		}
		return
	}
	commitNumber()
}

const shouldStayActiveAfterBlur = (related: EventTarget | null): boolean => {
	if (!(related instanceof Node)) return false
	if (document.querySelector('.amodal')?.contains(related)) return true
	if (pickerOpenForCell.value) return true
	const cell = inputRef.value?.closest('td')
	if (!cell?.contains(related)) return false
	if (related instanceof Element && related.closest('.atable-tuple-shell__handle')) return true
	if (related === inputRef.value) return true
	return false
}

const onInputBlur = (event: FocusEvent) => {
	commitNumber()
	if (category === 'currency' && amountMaskEnabled.value) syncDraftFromModel()
	if (!shouldStayActiveAfterBlur(event.relatedTarget)) emit('deactivate')
}

const openPicker = () => {
	const cell = cellElement.value
	if (!cell) return
	store.openTuplePicker(colIndex, rowIndex, cell, {
		left: left.value,
		bottom: bottom.value,
		width: width.value,
		height: height.value,
	})
}

const onKeydown = (event: KeyboardEvent) => {
	if (event.shiftKey && event.key === 'ArrowDown') {
		event.preventDefault()
		event.stopPropagation()
		openPicker()
		return
	}
	if (category === 'currency' && amountMaskEnabled.value && !pickerOpenForCell.value) {
		if (onCurrencyKeydownMasked(event)) return
	}
}

const onCurrencyKeydownMasked = (event: KeyboardEvent): boolean => {
	if (event.ctrlKey || event.metaKey || event.altKey) return false
	const navigation = new Set([
		'Backspace',
		'Delete',
		'Tab',
		'Escape',
		'Enter',
		'ArrowLeft',
		'ArrowRight',
		'ArrowUp',
		'ArrowDown',
		'Home',
		'End',
	])
	if (navigation.has(event.key)) return false
	if (/^[0-9]$/.test(event.key)) return false
	if (event.key === '-') {
		const input = event.target as HTMLInputElement
		if (!input.value.includes('-') && input.selectionStart === 0) return false
	}
	if (event.key === '.' || event.key === ',') {
		if (currencyInputFractionDigits(selectedCurrencyId.value) === 0) {
			event.preventDefault()
			return true
		}
		const input = event.target as HTMLInputElement
		if (!input.value.includes('.') && !input.value.includes(',')) return false
	}
	const pattern = currencyAmountEntryPattern(selectedCurrencyId.value)
	const input = event.target as HTMLInputElement
	const { selectionStart, selectionEnd, value } = input
	if (selectionStart === null || selectionEnd === null) {
		event.preventDefault()
		return true
	}
	const next = value.slice(0, selectionStart) + event.key + value.slice(selectionEnd)
	if (event.key.length === 1 && !pattern.test(next)) event.preventDefault()
	return true
}

const onInputFocus = () => {
	if (selectOnFocus.value) {
		void nextTick(() => {
			inputRef.value?.select()
			selectOnFocus.value = false
		})
	}
}

const focusInput = () => {
	selectOnFocus.value = true
	void nextTick(() => inputRef.value?.focus())
}

defineExpose({ focusInput, openPicker, commitNumber })
</script>

<style scoped>
.atable-tuple-shell__input {
	display: block;
	width: 100%;
	min-width: 0;
	box-sizing: border-box;
	border: none;
	outline: none;
	box-shadow: none;
	background: transparent;
	font: inherit;
	color: inherit;
	text-align: inherit;
	padding: 0;
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.atable-tuple-shell__input::-webkit-outer-spin-button,
.atable-tuple-shell__input::-webkit-inner-spin-button {
	appearance: none;
}
</style>
