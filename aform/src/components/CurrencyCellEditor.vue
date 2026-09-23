<template>
	<div class="currency-cell-editor" :class="{ 'currency-cell-editor--hide-base': !showBaseRow }" @keydown.esc="close">
		<ACurrencyInput
			v-model="amountValue"
			mode="read"
			label="Amount"
			:uuid="`currency-cell-editor-${rowIndex}-${colIndex}`"
			:options="currencyOptions" />
		<div class="currency-cell-editor__footer">
			<button type="button" class="currency-cell-editor__done" @click="close">Done</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ACurrencyInput from './form/ACurrencyInput.vue'
import type { CurrencyValue } from '../types'
import type { createTableStore } from '@stonecrop/atable'

type CurrencyCellStore = Pick<
	ReturnType<typeof createTableStore>,
	'modal' | 'updates' | 'getCellData' | 'getCurrencyMeta'
>

const props = defineProps<{
	colIndex: number
	rowIndex: number
	store: CurrencyCellStore
}>()

const currencyCode = ref('')
const currencyName = ref('')
const currencySymbol = ref('')
const precision = ref<number | undefined>(undefined)
const exchangeRate = ref(1)

onMounted(async () => {
	const meta = await props.store.getCurrencyMeta()
	if (!meta) return
	currencyCode.value = meta.currencyCode
	currencyName.value = meta.currencyName
	currencySymbol.value = meta.currencySymbol
	precision.value = meta.precision
	exchangeRate.value = meta.exchangeRate
})

const currencyOptions = computed(() => ({
	doctype: 'currency',
	precision: precision.value,
	filterFunction: () =>
		currencyCode.value
			? [{ id: currencyCode.value, displayText: currencyName.value, symbol: currencySymbol.value }]
			: [],
}))

const baseDecimals = computed(() => (typeof precision.value === 'number' ? precision.value : 6))

const currentAmount = computed(() => {
	const pending = props.store.updates[`${props.colIndex}:${props.rowIndex}`]
	return pending !== undefined ? pending : props.store.getCellData(props.colIndex, props.rowIndex)
})

const amountValue = computed<CurrencyValue>({
	get: () => {
		const amount = Number(currentAmount.value) || 0
		const currency = { id: currencyCode.value, displayText: currencyName.value, symbol: currencySymbol.value }
		return {
			amount,
			currency,
			baseAmount: Number((amount * exchangeRate.value).toFixed(baseDecimals.value)),
			baseCurrency: currency,
			exchangeRate: exchangeRate.value,
		}
	},
	set: () => {},
})

const showBaseRow = computed(() => exchangeRate.value !== 1)

const close = () => {
	props.store.modal.visible = false
}

let resizeObserver: ResizeObserver | null = null

const forceDownwardPosition = () => {
	const cell = props.store.modal.cell as HTMLElement | null | undefined
	const table = cell?.closest('table')
	const amodal = table?.querySelector<HTMLElement>('.amodal')
	if (!cell || !table || !amodal) return
	const headerHeight = table.querySelector('thead')?.getBoundingClientRect().height ?? 0
	amodal.style.top = `${cell.offsetTop + headerHeight + cell.offsetHeight}px`
	amodal.style.bottom = 'auto'
}

const styleModalPanel = (amodal: HTMLElement) => {
	amodal.style.background = 'var(--sc-form-background)'
	amodal.style.border = '1px solid var(--sc-input-border-color)'
	amodal.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'
}

onMounted(() => {
	const cell = props.store.modal.cell as HTMLElement | null | undefined
	const amodal = cell?.closest('table')?.querySelector<HTMLElement>('.amodal')
	if (!amodal) return
	forceDownwardPosition()
	styleModalPanel(amodal)
	resizeObserver = new ResizeObserver(forceDownwardPosition)
	resizeObserver.observe(amodal)
})

onUnmounted(() => {
	resizeObserver?.disconnect()
})
</script>

<style scoped>
.currency-cell-editor {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1rem;
	min-width: 30ch;
	font-family: var(--sc-font-family);
}

.currency-cell-editor__footer {
	display: flex;
	justify-content: flex-end;
	padding-top: 0.5rem;
	border-top: 1px solid var(--sc-form-border);
}

.currency-cell-editor__done {
	padding: 0.5ch 1.5ch;
	border: 1px solid var(--sc-primary-color);
	border-radius: 2px;
	background: var(--sc-primary-color);
	color: var(--sc-primary-text-color);
	font-weight: 600;
	cursor: pointer;
}

.currency-cell-editor__done:hover {
	filter: brightness(0.92);
}

.currency-cell-editor--hide-base :deep(.acurrency__row--base) {
	display: none;
}
</style>
