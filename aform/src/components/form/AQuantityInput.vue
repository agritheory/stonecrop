<template>
	<div class="aform_form-element aquantity">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayText }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<div class="aquantity__row">
				<input
					:id="uuid"
					v-model.number="qty"
					class="aform_input-field aquantity__qty"
					type="number"
					:disabled="mode === 'read'"
					:required="required" />
				<select v-model="uom" class="aform_input-field aquantity__uom" :disabled="mode === 'read'">
					<option v-for="option in uoms" :key="option" :value="option">{{ option }}</option>
				</select>
			</div>
			<label class="aform_field-label" :for="uuid">{{ label }}</label>
			<p v-if="showStock" class="aquantity__stock">Stock: {{ modelValue.stockQty }} {{ modelValue.stockUom }}</p>
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
} = defineProps<ComponentProps & { options?: QuantityOptions }>()

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
	gap: 0.5rem;
}

.aquantity__qty {
	flex: 1;
	min-width: 0;
}

.aquantity__uom {
	flex: 0 0 auto;
	width: 10ch;
}

.aquantity__stock {
	margin: 0.25rem 0 0 0;
	font-size: 0.8em;
	color: var(--sc-gray-50, #888);
}
</style>
