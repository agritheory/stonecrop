<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

// "Widget" item: stocked in Nos, but this line was purchased/received in Box.
// 1 Box = 10 Nos, 1 Kg = 25 Nos.
const itemSchema = [
	{
		fieldname: 'qty',
		fieldtype: 'Quantity',
		component: 'AQuantityInput',
		label: 'Quantity',
		options: {
			uoms: ['Nos', 'Box', 'Kg'],
			stockUom: 'Nos',
			conversionFactors: { Box: 10, Kg: 25 },
		},
	},
]

// uom ('Box') differs from stockUom ('Nos'); AQuantityInput computes stockQty/stockUom/
// conversionFactor internally and displays them read-only in its own box — nothing extra
// to sync at the form level.
//
// Uses ref(), not reactive(): AForm's v-model:data emits a plain-object copy of the data
// on every change (`{ ...dataModel.value }`), and re-assigning that to a `reactive()`
// binding replaces it with a non-reactive plain object after the first update, silently
// breaking every update after that. ref() survives the round trip because Vue re-wraps
// whatever is assigned to `.value` in reactivity.
const itemData = ref({
	qty: { qty: 5, uom: 'Box', stockQty: 50, stockUom: 'Nos', conversionFactor: 10 },
})

const readOnlyData = ref({
	qty: { qty: 5, uom: 'Box', stockQty: 50, stockUom: 'Nos', conversionFactor: 10 },
})
</script>

<template>
	<Story title="AQuantityInput">
		<Variant title="Realistic item (uom differs from stock uom)">
			<AForm :schema="itemSchema" v-model:data="itemData" />
			<p style="margin-top: 1rem; font-size: 0.9em">
				Item data: <strong>{{ itemData }}</strong>
			</p>
		</Variant>

		<Variant title="Display mode">
			<AForm :schema="itemSchema" :data="itemData" mode="display" />
		</Variant>

		<Variant title="Read mode">
			<AForm :schema="itemSchema" :data="readOnlyData" mode="read" />
		</Variant>
	</Story>
</template>
