<template>
	<div
		ref="root"
		class="quantity-cell-editor"
		:class="{ 'quantity-cell-editor--hide-stock': !showStockRow }"
		@keydown.esc="close">
		<AQuantityInput
			v-model="quantityValue"
			mode="read"
			label="Quantity"
			:uuid="`quantity-cell-editor-${rowIndex}-${colIndex}`"
			:options="{ stockUom, conversionFactors }" />
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

type QuantityCellStore = Pick<
	ReturnType<typeof createTableStore>,
	'columns' | 'modal' | 'updates' | 'getCellData' | 'getItemUomMeta'
>

const props = defineProps<{
	colIndex: number
	rowIndex: number
	store: QuantityCellStore
}>()

const uomColIndex = computed(() => props.store.columns.findIndex(column => column.name === 'uom'))
const itemIdColIndex = computed(() => props.store.columns.findIndex(column => column.name === 'itemId'))

const rowItemId = computed<string | null>(() => {
	if (itemIdColIndex.value === -1) return null
	const raw = props.store.getCellData(itemIdColIndex.value, props.rowIndex)
	if (raw && typeof raw === 'object') return (raw as { id?: string }).id ?? null
	return typeof raw === 'string' && raw ? raw : null
})

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

const resolveConversionFactor = (uom: string): number => {
	if (!uom || uom === stockUom.value) return 1
	return conversionFactors.value[uom] ?? 1
}

const currentUom = computed(
	() => (uomColIndex.value === -1 ? '' : props.store.getCellData(uomColIndex.value, props.rowIndex)) ?? ''
)

const currentQuantity = computed(() => {
	const pending = props.store.updates[`${props.colIndex}:${props.rowIndex}`]
	return pending !== undefined ? pending : props.store.getCellData(props.colIndex, props.rowIndex)
})

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
	set: () => {},
})

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

.quantity-cell-editor--hide-stock :deep(.aquantity__row--stock) {
	display: none;
}
</style>
