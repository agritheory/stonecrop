<template>
	<div class="currency-cell-editor" :class="{ 'currency-cell-editor--hide-base': !showBaseRow }" @keydown.esc="close">
		<ACurrencyInput
			v-model="amountValue"
			mode="edit"
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

// `store` is auto-passed by ATable when this component is named as a column's `modalComponent`
// (see @stonecrop/schema's ColumnSchema.modalComponent docs) — alongside `colIndex`/`rowIndex`.
const props = defineProps<{
	colIndex: number
	rowIndex: number
	store: ReturnType<typeof createTableStore>
}>()

// Currency is a document-level choice (one currencyCode for every line), not a per-row one, so
// it's resolved once per table via `store.getCurrencyMeta()` — shared with every other currency
// cell/editor on the same table rather than fetched again here.
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

// The currency picker inside ACurrencyInput is normally a live search box, but currency isn't a
// per-line concept here — there's nowhere to persist a different choice per row, so the picker is
// locked to the one currency this document actually uses rather than left free (which would look
// editable while silently discarding whatever was picked).
const currencyOptions = computed(() => ({
	doctype: 'currency',
	precision: precision.value,
	filterFunction: () =>
		currencyCode.value
			? [{ id: currencyCode.value, displayText: currencyName.value, symbol: currencySymbol.value }]
			: [],
}))

// No distinct base currency *identity* is modeled here — baseCurrency is kept equal to the
// transaction currency, since there's nothing better to show it as. The exchange rate itself is
// real (sourced from `store.getCurrencyMeta()`), though, so it's used as-is rather than hardcoded to 1.
const baseDecimals = computed(() => (typeof precision.value === 'number' ? precision.value : 6))

// A currency cell typically has both `edit: true` and a `format`, so its cellComponent (e.g.
// CurrencyValueCell) routes direct cell edits through `store.setCellText`, which only writes to
// `store.updates` — never to `store.table`/`store.rows` — leaving reconciliation for save time.
// Check `updates` first so this reflects a live cell edit rather than stale data, same fix as
// QuantityCellEditor's `quantity`.
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
	set: () => {
		// Amount is now edited directly in the grid cell (column.edit: true); this popover's own
		// amount input is locked via CSS (pointer-events: none), so nothing to write back here.
	},
})

// Only worth showing base currency/base amount/exchange rate when a real conversion is actually
// happening (exchangeRate !== 1) — same reasoning as QuantityCellEditor's stock row: when it's 1,
// the base fields just restate the transaction amount, so hide them rather than show a trivial
// no-op "conversion".
const showBaseRow = computed(() => exchangeRate.value !== 1)

const close = () => {
	props.store.modal.visible = false
}

// Same fixes as QuantityCellEditor: ATableModal flips this popover above the cell whenever it
// overflows the table's own (often short) height, and its default panel styling is an unstyled
// flat grey. Both are re-asserted here since there's no prop to configure either from outside.
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

/* Amount is edited in the grid cell itself now; lock the popover's own amount input rather than
   remove it, so the currency/amount pairing stays visible while only currency (already locked to
   one option) is shown alongside it — matching QuantityCellEditor's qty lock. */
.currency-cell-editor :deep(.acurrency__amount) {
	pointer-events: none;
	opacity: 0.6;
	cursor: not-allowed;
}
</style>
