<template>
	<div class="aform_form-element aquantity">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayText }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<div class="aquantity__row">
				<div class="aquantity__field aquantity__field--qty">
					<input
						:id="uuid"
						v-model.number="qty"
						class="aform_input-field aquantity__qty"
						type="number"
						:disabled="mode === 'read'"
						:required="required" />
					<label class="aform_field-label" :for="uuid">{{ label }}</label>
				</div>
				<div class="aquantity__field aquantity__field--uom">
					<select
						:id="`${uuid}-uom`"
						v-model="uom"
						class="aform_input-field aquantity__uom"
						:disabled="mode === 'read'">
						<option v-for="option in uoms" :key="option" :value="option">{{ option }}</option>
					</select>
					<label class="aform_field-label" :for="`${uuid}-uom`">{{ uomLabel }}</label>
				</div>
			</div>
			<div class="aquantity__row aquantity__row--stock">
				<div class="aquantity__field aquantity__field--stock-uom">
					<input :value="modelValue.stockUom" class="aform_input-field aquantity__stock-field" type="text" disabled />
					<label class="aform_field-label">{{ stockUomLabel }}</label>
				</div>
				<div class="aquantity__field aquantity__field--stock-qty">
					<input :value="modelValue.stockQty" class="aform_input-field aquantity__stock-field" type="number" disabled />
					<label class="aform_field-label">{{ stockQtyLabel }}</label>
				</div>
				<div class="aquantity__field aquantity__field--conversion">
					<input
						:value="modelValue.conversionFactor"
						class="aform_input-field aquantity__stock-field"
						type="number"
						disabled />
					<label class="aform_field-label">{{ conversionFactorLabel }}</label>
				</div>
			</div>
			<p v-show="validation.errorMessage" class="aform_error" v-html="validation.errorMessage"></p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ComponentProps, QuantityOptions, QuantityValue } from '../../types'

const {
	label,
	required,
	mode,
	uuid,
	validation = { errorMessage: '&nbsp;' },
	options = {},
	uomLabel = 'UOM',
	stockUomLabel = 'Stock UOM',
	stockQtyLabel = 'Stock Qty',
	conversionFactorLabel = 'Conversion Factor',
} = defineProps<
	ComponentProps & {
		options?: QuantityOptions
		uomLabel?: string
		stockUomLabel?: string
		stockQtyLabel?: string
		conversionFactorLabel?: string
	}
>()

const modelValue = defineModel<QuantityValue>({
	default: { qty: 0, uom: '', stockQty: 0, stockUom: '', conversionFactor: 1 },
})

const uoms = computed(() => options.uoms ?? [])

const resolveConversionFactor = (uom: string): number => {
	const stockUom = options.stockUom ?? modelValue.value.stockUom
	if (!uom || uom === stockUom) return 1
	return options.conversionFactors?.[uom] ?? modelValue.value.conversionFactor ?? 1
}

const recompute = (qty: number, uom: string) => {
	const conversionFactor = resolveConversionFactor(uom)
	modelValue.value = {
		qty,
		uom,
		conversionFactor,
		stockUom: options.stockUom ?? modelValue.value.stockUom,
		stockQty: qty * conversionFactor,
	}
}

const qty = computed({
	get: () => modelValue.value?.qty ?? 0,
	set: (value: number) => recompute(value, modelValue.value?.uom ?? ''),
})

const uom = computed({
	get: () => modelValue.value?.uom ?? '',
	set: (value: string) => recompute(modelValue.value?.qty ?? 0, value),
})

const showStock = computed(() => {
	const v = modelValue.value
	return !!v?.stockUom && (v.uom !== v.stockUom || v.qty !== v.stockQty)
})

const displayText = computed(() => {
	const v = modelValue.value
	if (!v || !v.uom) return '—'
	const base = `${v.qty} ${v.uom}`
	return showStock.value ? `${base} (${v.stockQty} ${v.stockUom})` : base
})
</script>

<style scoped>
.aquantity__row {
	display: flex;
	gap: 1ch;
}

.aquantity__row--stock {
	margin-top: 1.5rem;
}

.aquantity__field {
	position: relative;
	flex: 1;
	min-width: 0;
}

.aquantity__field--uom {
	flex: 0 0 auto;
	width: 12ch;
}

.aquantity__qty,
.aquantity__uom,
.aquantity__stock-field {
	width: 100%;
}

.aquantity__stock-field:disabled {
	color: var(--sc-gray-50, #888);
}
</style>
