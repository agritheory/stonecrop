<script setup lang="ts">
import { ref } from 'vue'
import { ACurrencyInput } from '@stonecrop/aform'

// Direct import, not via AForm — AForm resolves schema fields by string name through Vue's
// dynamic component registry, which needs @stonecrop/aform's `install` plugin registered on
// the app instance first. Direct imports skip that requirement, same as CheckboxDemo.vue.
const CURRENCIES = [
	{ id: 'USD', displayText: 'US Dollar', symbol: '$' },
	{ id: 'EUR', displayText: 'Euro', symbol: '€' },
	{ id: 'GBP', displayText: 'British Pound', symbol: '£' },
	{ id: 'NZD', displayText: 'New Zealand Dollar', symbol: 'NZD' },
	{ id: 'JPY', displayText: 'Japanese Yen', symbol: '¥' },
]

const currencyOptions = {
	doctype: 'currency',
	baseCurrency: { id: 'USD', displayText: 'US Dollar' },
	exchangeRates: { EUR: 1.1, GBP: 1.3, NZD: 0.6, JPY: 0.0067 },
	precision: 2,
	filterFunction: (search: string) => {
		const q = search.toLowerCase()
		return CURRENCIES.filter(
			c =>
				c.displayText.toLowerCase().includes(q) ||
				String(c.id).toLowerCase().includes(q) ||
				(c.symbol ?? '').toLowerCase().includes(q)
		)
	},
}

const total = ref({
	amount: 10050.45,
	currency: { id: 'EUR', displayText: 'Euro', symbol: '€' },
	baseAmount: 11055.495,
	baseCurrency: { id: 'USD', displayText: 'US Dollar', symbol: '$' },
	exchangeRate: 1.1,
})
</script>

<template>
	<div class="stonecrop-demo">
		<ACurrencyInput
			v-model="total"
			label="Total but with more words to break the placement"
			uuid="currency-demo"
			:options="currencyOptions" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ total }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
