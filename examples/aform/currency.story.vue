<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

// "Invoice line" item: company's base currency is USD, but this line was billed in EUR.
// `symbol` is optional on AFormLinkValue — ACurrencyInput shows it in the compact currency
// box once picked, and alongside the name in the search dropdown, falling back to the name
// wherever it's omitted.
const CURRENCIES = [
	{ id: 'USD', displayText: 'US Dollar', symbol: '$' },
	{ id: 'EUR', displayText: 'Euro', symbol: '€' },
	{ id: 'GBP', displayText: 'British Pound', symbol: '£' },
]

const searchCurrencies = (search: string) =>
	CURRENCIES.filter(c => c.displayText.toLowerCase().includes(search.toLowerCase()))

const lineSchema = [
	{
		fieldname: 'total',
		kind: 'field',
		component: 'ACurrencyInput',
		label: 'Total',
		options: {
			doctype: 'currency',
			baseCurrency: { id: 'USD', displayText: 'US Dollar' },
			exchangeRates: { EUR: 1.1, GBP: 1.3 },
			// USD carries 2 decimals, so the derived base amount is rounded to cents. Omitting
			// `precision` would leave it at full rate precision instead.
			precision: 2,
			filterFunction: searchCurrencies,
		},
	},
]

// Same field against a 0-decimal base currency. `precision` is the base currency's scale, not the
// input's: the entered amount stays as typed, only the derived base amount is rounded — try 10.75
// and watch Base Amount land on a whole yen.
const yenSchema = [
	{
		fieldname: 'total',
		kind: 'field',
		component: 'ACurrencyInput',
		label: 'Total',
		options: {
			doctype: 'currency',
			baseCurrency: { id: 'JPY', displayText: 'Yen' },
			exchangeRates: { USD: 157.2, EUR: 172.94, GBP: 203.51 },
			precision: 0,
			filterFunction: searchCurrencies,
		},
	},
]

// currency ('EUR') differs from baseCurrency ('USD'); ACurrencyInput computes baseAmount/
// baseCurrency/exchangeRate internally and displays them read-only in its own row — nothing
// extra to sync at the form level.
//
// Uses ref(), not reactive(): AForm's v-model:data emits a plain-object copy of the data on every
// change (`{ ...dataModel.value }`), and re-assigning that to a `reactive()` binding replaces it
// with a non-reactive plain object after the first update, silently breaking every update after
// that. ref() survives the round trip because Vue re-wraps whatever is assigned to `.value` in
// reactivity.
const lineData = ref({
	total: {
		amount: 100,
		currency: { id: 'EUR', displayText: 'Euro', symbol: '€' },
		baseAmount: 110,
		baseCurrency: { id: 'USD', displayText: 'US Dollar', symbol: '$' },
		exchangeRate: 1.1,
	},
})

const readOnlyData = ref({
	total: {
		amount: 100,
		currency: { id: 'EUR', displayText: 'Euro', symbol: '€' },
		baseAmount: 110,
		baseCurrency: { id: 'USD', displayText: 'US Dollar', symbol: '$' },
		exchangeRate: 1.1,
	},
})

const yenData = ref({
	total: {
		amount: 100,
		currency: { id: 'EUR', displayText: 'Euro', symbol: '€' },
		baseAmount: 17294,
		baseCurrency: { id: 'JPY', displayText: 'Yen', symbol: '¥' },
		exchangeRate: 172.94,
	},
})
</script>

<template>
	<Story title="ACurrencyInput">
		<Variant title="Realistic line (currency differs from base currency)">
			<AForm :schema="lineSchema" v-model:data="lineData" />
			<p style="margin-top: 1rem; font-size: 0.9em">
				Line data: <strong>{{ lineData }}</strong>
			</p>
		</Variant>

		<Variant title="Whole-unit base currency (precision: 0)">
			<AForm :schema="yenSchema" v-model:data="yenData" />
			<p style="margin-top: 1rem; font-size: 0.9em">
				Line data: <strong>{{ yenData }}</strong>
			</p>
		</Variant>

		<Variant title="Display mode">
			<AForm :schema="lineSchema" :data="lineData" mode="display" />
		</Variant>

		<Variant title="Read mode">
			<AForm :schema="lineSchema" :data="readOnlyData" mode="read" />
		</Variant>
	</Story>
</template>
