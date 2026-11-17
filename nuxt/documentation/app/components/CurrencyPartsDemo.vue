<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'
import type { ResolvedField } from '@stonecrop/aform'

// Uses <AForm :schema="...">, so it relies on the aform registration in
// app/plugins/stonecrop-aform.ts, as FormDemo.vue does: each field names its component by string.
const CURRENCIES = [
	{ id: 'USD', displayText: 'US Dollar', symbol: '$' },
	{ id: 'EUR', displayText: 'Euro', symbol: '€' },
	{ id: 'GBP', displayText: 'British Pound', symbol: '£' },
]

const currencyOptions = {
	doctype: 'currency',
	baseCurrency: { id: 'USD', displayText: 'US Dollar' },
	exchangeRates: { EUR: 1.1, GBP: 1.3 },
	precision: 2,
	filterFunction: (search: string) => {
		const query = search.toLowerCase()
		return CURRENCIES.filter(
			currency => currency.displayText.toLowerCase().includes(query) || currency.id.toLowerCase().includes(query)
		)
	},
}

const total = (fieldname: string, label: string): ResolvedField => ({
	kind: 'field',
	fieldname,
	component: 'ACurrencyInput',
	label,
	parts: { amount: fieldname, currency: 'currencyCode', exchangeRate: 'exchangeRate' },
	options: currencyOptions,
})

const schema: ResolvedField[] = [total('netTotal', 'Net Total'), total('grandTotal', 'Grand Total')]

const record = ref({ netTotal: 1000, grandTotal: 1080, currencyCode: CURRENCIES[1], exchangeRate: 1.1 })
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
