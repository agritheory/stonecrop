<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'
import type { ResolvedField } from '@stonecrop/aform'

// Uses <AForm :schema="..."> (string component names, e.g. 'ATextInput'), which relies on
// Vue's dynamic-component registry. That registry is only populated once @stonecrop/aform's
// `install` plugin is registered on the app instance — done centrally in
// docs/.vitepress/theme/index.ts (`app.use(installAform)`). Every other component's demo page
// imports its field directly instead, to avoid depending on that registration; this page's
// whole point is showing AForm's orchestration, so it uses the real thing.

// Schema adapted from examples/aform/form.story.vue (text + checkbox fields) and
// examples/aform/currency.story.vue (the currency field + its options shape) — three distinct
// field kinds resolved and rendered together by a single AForm.
const CURRENCIES = [
	{ id: 'USD', displayText: 'US Dollar', symbol: '$' },
	{ id: 'EUR', displayText: 'Euro', symbol: '€' },
	{ id: 'GBP', displayText: 'British Pound', symbol: '£' },
]

const schema = ref<ResolvedField[]>([
	{
		fieldname: 'first_name',
		kind: 'field',
		component: 'ATextInput',
		label: 'First Name',
	},
	{
		fieldname: 'last_name',
		kind: 'field',
		component: 'ATextInput',
		label: 'Last Name',
	},
	{
		fieldname: 'subscribed',
		kind: 'field',
		component: 'ACheckbox',
		label: 'Subscribed to order updates',
	},
	{
		fieldname: 'total',
		kind: 'field',
		component: 'ACurrencyInput',
		label: 'Order Total',
		options: {
			doctype: 'currency',
			baseCurrency: { id: 'USD', displayText: 'US Dollar' },
			exchangeRates: { EUR: 1.1, GBP: 1.3 },
			precision: 2,
			filterFunction: (search: string) =>
				CURRENCIES.filter(c => c.displayText.toLowerCase().includes(search.toLowerCase())),
		},
	},
])

const data = ref({
	first_name: 'Jane',
	last_name: 'Smith',
	subscribed: true,
	total: {
		amount: 100,
		currency: { id: 'EUR', displayText: 'Euro', symbol: '€' },
		baseAmount: 110,
		baseCurrency: { id: 'USD', displayText: 'US Dollar', symbol: '$' },
		exchangeRate: 1.1,
	},
})
</script>

<template>
	<div class="stonecrop-demo">
		<AForm :schema="schema" v-model:data="data" />
		<p class="stonecrop-demo__state">
			<code>v-model:data</code> value: <strong>{{ data }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
	word-break: break-word;
}
</style>
