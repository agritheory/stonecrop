<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'
import type { ResolvedField } from '@stonecrop/aform'

// Uses <AForm :schema="...">, so it relies on the aform registration in
// app/plugins/stonecrop-aform.ts, as FormDemo.vue does: the field names its component by string.
const sheetUom = "4' x 8' sheet"

const schema: ResolvedField[] = [
	{
		kind: 'field',
		fieldname: 'quantity',
		component: 'AQuantityInput',
		label: 'Quantity',
		parts: { qty: 'quantity', uom: 'uom' },
		options: {
			uoms: ['Nos', 'Box', 'Kg', sheetUom],
			stockUom: 'Nos',
			conversionFactors: { Box: 10, Kg: 25, [sheetUom]: 1 },
		},
	},
	{ kind: 'field', fieldname: 'uom', component: 'ATextInput', label: 'Unit', hidden: true },
]

const record = ref({ quantity: 5, uom: 'Box' })
</script>

<template>
	<div class="stonecrop-demo">
		<AForm v-model:data="record" :schema="schema" />
		<p class="stonecrop-demo__state">
			Record: <strong>{{ record }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
