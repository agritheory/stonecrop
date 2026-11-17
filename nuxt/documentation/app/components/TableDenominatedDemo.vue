<script setup lang="ts">
import { ref } from 'vue'
import type { ColumnSchema } from '@stonecrop/schema'
import { ATable, type TableRow } from '@stonecrop/atable'

import { playgroundBaseCurrency, playgroundCurrencyOptions } from '~/utils/playground-currency'

const usd = playgroundBaseCurrency
const eur = { id: 'EUR', displayText: 'Euro', symbol: '€' }

const quantityOptions = {
	uoms: ['Nos', 'Box'],
	stockUom: 'Nos',
	conversionFactors: { Box: 10 },
}

const rows = ref<TableRow[]>([
	{
		id: '1',
		item: 'Widget A (received in Box)',
		qty: { qty: 5, uom: 'Box', stockQty: 50, stockUom: 'Nos', conversionFactor: 10 },
		lineTotal: { amount: 100, currency: eur, baseAmount: 110, baseCurrency: usd, exchangeRate: 1.1 },
	},
	{
		id: '2',
		item: 'Widget B (stock UOM)',
		qty: { qty: 40, uom: 'Nos', stockQty: 40, stockUom: 'Nos', conversionFactor: 1 },
		lineTotal: { amount: 40, currency: usd, baseAmount: 40, baseCurrency: usd, exchangeRate: 1 },
	},
	{
		id: '3',
		item: 'Return line',
		qty: { qty: -2, uom: 'Nos', stockQty: -2, stockUom: 'Nos', conversionFactor: 1 },
		lineTotal: { amount: -20, currency: usd, baseAmount: -20, baseCurrency: usd, exchangeRate: 1 },
	},
])

const schema = ref<ColumnSchema[]>([
	{ fieldname: 'item', component: 'ATextInput', label: 'Item', edit: false, width: '22ch' },
	{
		fieldname: 'qty',
		component: 'AQuantityInput',
		label: 'Qty',
		edit: true,
		align: 'right',
		width: '14ch',
		sortable: true,
		filterable: true,
		filterType: 'number',
		options: quantityOptions,
	},
	{
		fieldname: 'lineTotal',
		component: 'ACurrencyInput',
		label: 'Line total',
		edit: true,
		align: 'right',
		width: '14ch',
		sortable: true,
		filterable: true,
		filterType: 'number',
		options: playgroundCurrencyOptions,
	},
])
</script>

<template>
	<div class="stonecrop-demo">
		<p class="stonecrop-demo__hint">
			Sort or filter Qty and Line total — comparisons use stock qty and base amount, not the entered Box count or
			foreign amount alone.
		</p>
		<ATable v-model:rows="rows" :schema="schema" :config="{ view: 'list' }" />
	</div>
</template>

<style scoped>
.stonecrop-demo__hint {
	margin: 0 0 1rem;
	font-size: 0.85em;
	color: var(--sc-gray-60);
	line-height: 1.45;
}
</style>
