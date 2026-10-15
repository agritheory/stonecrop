<script setup lang="ts">
import { ref } from 'vue'
import type { ColumnSchema } from '@stonecrop/schema'
import { ACurrencyInput, ANumericInput, AQuantityInput, type CurrencyValue, type QuantityValue } from '@stonecrop/aform'
import { ATable, type TableRow } from '@stonecrop/atable'

import { playgroundBaseCurrency, playgroundCurrencyOptions } from '~/utils/playground-currency'

const usd = playgroundBaseCurrency
const eur = { id: 'EUR', displayText: 'Euro', symbol: '€' }

const quantityOptions = { uoms: ['Nos', 'Box'], stockUom: 'Nos', conversionFactors: { Box: 10 }, arithmetic: true }
const currencyOptions = { ...playgroundCurrencyOptions, arithmetic: true }

const count = ref<number | null>(42)
const quantity = ref<QuantityValue | null>({ qty: 2, uom: 'Box', stockQty: 20, stockUom: 'Nos', conversionFactor: 10 })
const total = ref<CurrencyValue | null>({
	amount: 100,
	currency: eur,
	baseAmount: 110,
	baseCurrency: usd,
	exchangeRate: 1.1,
})

const rows = ref<TableRow[]>([
	{
		id: '1',
		item: 'Widget A',
		count: 12,
		qty: { qty: 5, uom: 'Box', stockQty: 50, stockUom: 'Nos', conversionFactor: 10 },
		lineTotal: { amount: 100, currency: eur, baseAmount: 110, baseCurrency: usd, exchangeRate: 1.1 },
	},
	{
		id: '2',
		item: 'Widget B',
		count: 3,
		qty: { qty: 40, uom: 'Nos', stockQty: 40, stockUom: 'Nos', conversionFactor: 1 },
		lineTotal: { amount: 40, currency: usd, baseAmount: 40, baseCurrency: usd, exchangeRate: 1 },
	},
])

const schema = ref<ColumnSchema[]>([
	{ fieldname: 'item', component: 'ATextInput', label: 'Item', edit: false, width: '14ch' },
	{
		fieldname: 'count',
		component: 'ANumericInput',
		label: 'Count',
		edit: true,
		align: 'right',
		width: '10ch',
		options: { arithmetic: true },
	},
	{
		fieldname: 'qty',
		component: 'AQuantityInput',
		label: 'Qty',
		edit: true,
		align: 'right',
		width: '14ch',
		options: quantityOptions,
	},
	{
		fieldname: 'lineTotal',
		component: 'ACurrencyInput',
		label: 'Line total',
		edit: true,
		align: 'right',
		width: '14ch',
		options: currencyOptions,
	},
])
</script>

<template>
	<div class="stonecrop-demo">
		<p class="stonecrop-demo__hint">
			Try <code>12*3+4</code>, <code>(2+3)*4</code> or <code>17%5</code>, then leave the box or press Enter. Letters,
			<code>e</code> and <code>^</code> are refused; an unfinished expression such as <code>12*</code> keeps the last
			number.
		</p>
		<div class="stonecrop-demo__fields">
			<ANumericInput
				v-model="count"
				label="Count"
				uuid="arithmetic-demo-count"
				mode="edit"
				:options="{ arithmetic: true }" />
			<AQuantityInput
				v-model="quantity"
				label="Quantity"
				uuid="arithmetic-demo-qty"
				mode="edit"
				:options="quantityOptions" />
			<ACurrencyInput
				v-model="total"
				label="Total"
				uuid="arithmetic-demo-total"
				mode="edit"
				:options="currencyOptions" />
		</div>
		<p class="stonecrop-demo__state">
			Count: <strong>{{ count }}</strong> · Qty: <strong>{{ quantity?.qty }}</strong> ({{ quantity?.stockQty }} Nos) ·
			Amount: <strong>{{ total?.amount }}</strong> (base {{ total?.baseAmount }})
		</p>
		<ATable v-model:rows="rows" :schema="schema" :config="{ view: 'list' }" />
		<p class="stonecrop-demo__state">
			Rows: <code>{{ rows.map(r => [r.count, r.qty?.qty, r.lineTotal?.amount]) }}</code>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__hint,
.stonecrop-demo__state {
	margin: 0 0 1rem;
	font-size: 0.85em;
	line-height: 1.45;
}

.stonecrop-demo__hint {
	color: var(--sc-gray-60);
}

.stonecrop-demo__fields {
	display: grid;
	gap: 2rem;
	margin: 1.5rem 0;
}

.stonecrop-demo__state {
	margin-top: 1rem;
}
</style>
