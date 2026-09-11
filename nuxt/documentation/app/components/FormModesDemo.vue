<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'
import type { ResolvedField } from '@stonecrop/aform'

// Same schema/data as FormDemo.vue, rendered by two AForm instances that share one data ref.
// `mode` cascades from AForm down to every field it resolves (per-field `mode` can still
// override it) — editing the top ("edit") form updates `data`, and the bottom ("display")
// form re-renders from that same ref to show the cascaded mode side by side.
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
		<div class="stonecrop-demo__mode">
			<p class="stonecrop-demo__mode-label"><code>mode="edit"</code></p>
			<AForm :schema="schema" v-model:data="data" mode="edit" />
		</div>
		<div class="stonecrop-demo__mode">
			<p class="stonecrop-demo__mode-label"><code>mode="display"</code></p>
			<AForm :schema="schema" :data="data" mode="display" />
		</div>
	</div>
</template>

<style scoped>
.stonecrop-demo__mode + .stonecrop-demo__mode {
	margin-top: 1.5rem;
	padding-top: 1.5rem;
	border-top: 1px dashed var(--sc-gray-20);
}

.stonecrop-demo__mode-label {
	margin: 0 0 0.5rem;
	font-size: 0.75em;
	color: var(--sc-gray-60);
}
</style>
