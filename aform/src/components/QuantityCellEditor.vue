<template>
	<div
		ref="root"
		class="quantity-cell-editor"
		:class="{ 'quantity-cell-editor--hide-stock': !showStockRow }"
		@keydown.esc="close">
		<AQuantityInput
			v-model="quantityValue"
			mode="edit"
			label="Quantity"
			:uuid="`quantity-cell-editor-${rowIndex}-${colIndex}`"
			:options="{ uoms, stockUom, conversionFactors }" />
		<div class="quantity-cell-editor__footer">
			<button type="button" class="quantity-cell-editor__done" @click="close">Done</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AQuantityInput from './form/AQuantityInput.vue'
import type { QuantityValue } from '../types'
import type { createTableStore } from '@stonecrop/atable'

// `store` is auto-passed by ATable when this component is named as a column's `modalComponent`
// (see @stonecrop/schema's ColumnSchema.modalComponent docs) — alongside `colIndex`/`rowIndex`.
const props = defineProps<{
	colIndex: number
	rowIndex: number
	store: ReturnType<typeof createTableStore>
}>()

// `quantity` and `uom` are expected to be separate columns (no composite column assumed), so this
// editor pairs them into AQuantityInput's `{ qty, uom }` shape and writes both back individually.
const uomColIndex = computed(() => props.store.columns.findIndex(column => column.name === 'uom'))
const itemIdColIndex = computed(() => props.store.columns.findIndex(column => column.name === 'itemId'))

const rowItemId = computed<string | null>(() => {
	if (itemIdColIndex.value === -1) return null
	const raw = props.store.getCellData(itemIdColIndex.value, props.rowIndex)
	if (raw && typeof raw === 'object') return (raw as { id?: string }).id ?? null
	return typeof raw === 'string' && raw ? raw : null
})

// The item's stock UOM and conversion factors live on whatever doctype the app's items come from,
// not on this row — duplicating them onto the row would drift out of sync the moment an item's
// conversions change. Resolved once per item via `store.getItemUomMeta()`, cached per `itemId`
// by the store so re-mounting this editor on the same row doesn't re-fetch.
const stockUom = ref('')
const conversionFactors = ref<Record<string, number>>({})

onMounted(async () => {
	const itemId = rowItemId.value
	if (!itemId) return
	const meta = await props.store.getItemUomMeta(itemId)
	if (!meta) return
	stockUom.value = meta.stockUom
	conversionFactors.value = meta.conversionFactors
})

// AQuantityInput's uom picker is a fixed dropdown, not free text, so seed it from the item's own
// known UOMs plus whatever's already used elsewhere in this table.
const uoms = computed(() => {
	const values = new Set<string>()
	if (stockUom.value) values.add(stockUom.value)
	for (const uom of Object.keys(conversionFactors.value)) values.add(uom)
	for (const row of props.store.rows) {
		const value = (row as Record<string, unknown>).uom
		if (typeof value === 'string' && value) values.add(value)
	}
	return Array.from(values)
})

// Mirrors AQuantityInput's own resolveConversionFactor so the popover shows the right stock qty
// immediately on open, before the user touches qty/uom.
const resolveConversionFactor = (uom: string): number => {
	if (!uom || uom === stockUom.value) return 1
	return conversionFactors.value[uom] ?? 1
}

const currentUom = computed(
	() => (uomColIndex.value === -1 ? '' : props.store.getCellData(uomColIndex.value, props.rowIndex)) ?? ''
)

// `quantity` typically has both `edit: true` and a `format`, so ACell.vue routes direct cell
// edits through `store.setCellText`, which only writes to `store.updates` — never to
// `store.table`/`store.rows` — leaving the actual reconciliation for save time. `getCellData`
// alone would therefore show a stale value here the moment someone types straight into the cell,
// so check `updates` first so the popover reflects what's currently in the cell, not just what
// was last saved.
const currentQuantity = computed(() => {
	const pending = props.store.updates[`${props.colIndex}:${props.rowIndex}`]
	return pending !== undefined ? pending : props.store.getCellData(props.colIndex, props.rowIndex)
})

// Only worth showing stock UOM/conversion factor/stock qty when a real conversion is actually
// happening — when the transaction UOM matches the item's own stock UOM, they're all just the
// same numbers restated, so hide the row rather than show a trivial 1:1 "conversion".
const showStockRow = computed(() => !!currentUom.value && !!stockUom.value && currentUom.value !== stockUom.value)

const quantityValue = computed<QuantityValue>({
	get: () => {
		const qty = Number(currentQuantity.value) || 0
		const uom = currentUom.value
		const conversionFactor = resolveConversionFactor(uom)
		return {
			qty,
			uom,
			stockUom: stockUom.value,
			conversionFactor,
			stockQty: Number((qty * conversionFactor).toFixed(6)),
		}
	},
	set: value => {
		// Quantity is edited directly in the grid cell now (column.edit: true); this popover only
		// edits UOM, so the qty half of the value is intentionally never written back here — the
		// AQuantityInput qty input itself is also locked via CSS (pointer-events: none), so
		// `value.qty` should always equal what `get()` already returned anyway.
		if (uomColIndex.value !== -1) {
			props.store.setCellData(uomColIndex.value, props.rowIndex, value.uom)
		}
	},
})

const close = () => {
	props.store.modal.visible = false
}

// ATableModal (in @stonecrop/atable) flips this popover above the cell whenever it would
// overflow the *table's own* height — but item grids are often short (1-2 rows) and sit inside a
// page with plenty of room below, so the flip fires far more often than it should and the popover
// ends up overlapping the fields above the grid instead of the row it belongs to. There's no prop
// to opt out of that, so this re-asserts a downward position after the fact, and keeps
// re-asserting whenever the popover's own size changes (e.g. the stock row toggling).
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

// ATableModal's own `.amodal` background is a flat placeholder grey with no border, so it reads
// as an unstyled box rather than an intentional panel floating over the grid. There's no prop for
// this either, so it's set once here, directly on the element this component ends up inside of.
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
.quantity-cell-editor {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1rem;
	min-width: 30ch;
	font-family: var(--sc-font-family);
}

.quantity-cell-editor__footer {
	display: flex;
	justify-content: flex-end;
	padding-top: 0.5rem;
	border-top: 1px solid var(--sc-form-border);
}

.quantity-cell-editor__done {
	padding: 0.5ch 1.5ch;
	border: 1px solid var(--sc-primary-color);
	border-radius: 2px;
	background: var(--sc-primary-color);
	color: var(--sc-primary-text-color);
	font-weight: 600;
	cursor: pointer;
}

.quantity-cell-editor__done:hover {
	filter: brightness(0.92);
}

/* Quantity is edited in the grid cell itself now; lock the popover's own qty input rather than
   remove it, so the qty/uom pairing stays visible while only UOM is actually editable here. */
.quantity-cell-editor :deep(.aquantity__qty) {
	pointer-events: none;
	opacity: 0.6;
	cursor: not-allowed;
}

.quantity-cell-editor--hide-stock :deep(.aquantity__row--stock) {
	display: none;
}
</style>
