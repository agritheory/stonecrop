---
title: Currency
description: A currency amount input with automatic base-currency conversion.
---

<script setup lang="ts">
const propsHeaders = ["Name", "Type", "Default", "Description"]
const propsRows = [
	["`v-model`", "[`CurrencyValue`](#currencyvalue)", "see below", "The current amount, currency, and derived base-currency figures."],
	["`label`", "`string`", "—", "Label for the amount input."],
	["`options`", "[`CurrencyOptions`](#options)", "`{}`", "Type-specific configuration — base currency, exchange rates, precision, currency search."],
	["`required`", "`boolean`", "`false`", "Marks the amount and currency inputs as required (`edit` mode only)."],
	["`mode`", "`'edit' | 'read' | 'display'`", "`'edit'`", "See [Modes](#modes) below."],
	["`uuid`", "`string`", "auto-generated", "`id`/`for` pair linking the amount input to its label."],
	["`currencyLabel`", "`string`", "`'Currency'`", "Label for the embedded currency picker."],
	["`baseCurrencyLabel`", "`string`", "`'Base Currency'`", "Label for the read-only base currency field."],
	["`baseAmountLabel`", "`string`", "`'Base Amount'`", "Label for the read-only derived base amount field."],
	["`exchangeRateLabel`", "`string`", "`'Exchange Rate'`", "Label for the read-only exchange rate field."],
	["`validation`", "`{ errorMessage: string }`", "`{ errorMessage: '&nbsp;' }`", "Static error message shown below the field."],
	["`errors`", "`string[]`", "—", "Dynamic validation errors (e.g. from a trigger). Takes precedence over `validation.errorMessage` whenever the list is non-empty."],
]

const optionsHeaders = ["Name", "Type", "Default", "Description"]
const optionsRows = [
	["`doctype`", "`string`", "—", "Currency doctype name, used for FK resolution via `aformLinkResolver`."],
	["`baseCurrency`", "`AFormLinkValue | string`", "—", "The record's fixed base currency. A bare id resolves to `displayText` via `aformLinkResolver`."],
	["`exchangeRates`", "`Record<string, number>`", "—", "Exchange rate for each non-base currency id, relative to `baseCurrency` (which is implicitly `1`)."],
	["`precision`", "`number`", "—", "Decimal places to round the derived `baseAmount` to (JPY carries 0, most currencies 2, KWD 3). Only affects `baseAmount` — the entered `amount` is left as typed. Omitted or invalid values round only enough to shed floating-point noise."],
	["`filterFunction`", "`(search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>`", "—", "Search function backing the currency picker's autocomplete dropdown."],
	["`isAsync`", "`boolean`", "`false`", "Whether `filterFunction` results should show a loading state."],
]

const currencyValueHeaders = ["Field", "Type", "Description"]
const currencyValueRows = [
	["`amount`", "`number`", "The entered amount, in `currency` units."],
	["`currency`", "`AFormLinkValue`", "FK reference to the currency the user entered `amount` in."],
	["`baseAmount`", "`number`", "`amount` converted into `baseCurrency` units — `amount * exchangeRate`."],
	["`baseCurrency`", "`AFormLinkValue`", "The record's base currency — fixed, not user-editable."],
	["`exchangeRate`", "`number`", "Multiplier from `currency` to `baseCurrency`, hidden from the UI."],
]

const modesHeaders = ["Mode", "Rendering"]
const modesRows = [
	["`edit`", "Interactive amount input with an embedded currency picker."],
	["`read`", "Same layout, all inputs disabled."],
	["`display`", "Static text: `amount currency` (with the base-currency equivalent in parentheses, if it differs)."],
]
</script>

# Currency

`ACurrencyInput` pairs an amount with a currency picker, and derives a read-only base-currency amount and exchange rate alongside it. It's built for invoice/line-item style fields where a value can be entered in one currency but needs to be tracked in the record's base currency too.

## Import

```ts
import { ACurrencyInput } from '@stonecrop/aform'
```

## Basic

`v-model` binds to a [`CurrencyValue`](#currencyvalue) object. The base amount and exchange rate below the input are derived automatically — try changing the currency or amount.

<DemoPanel>

<ClientOnly>
	<CurrencyDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/CurrencyDemo.vue

</template>

</DemoPanel>

## Usage in a schema

`ACurrencyInput` is usually resolved by `AForm` from a schema field with `component: 'ACurrencyInput'`, rather than used directly:

```ts
const schema = [
	{
		fieldname: 'total',
		kind: 'field',
		component: 'ACurrencyInput',
		label: 'Total',
		options: {
			doctype: 'currency',
			baseCurrency: { id: 'USD', displayText: 'US Dollar' },
			exchangeRates: { EUR: 1.1, GBP: 1.3 },
			precision: 2,
			filterFunction: (search: string) => searchCurrencies(search),
		},
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({
	total: {
		amount: 0,
		currency: { id: '' },
		baseAmount: 0,
		baseCurrency: { id: '' },
		exchangeRate: 1,
	},
})
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

## API Reference

### Props

<ApiDataTable :headers="propsHeaders" :rows="propsRows" />

### Options

<ApiDataTable :headers="optionsHeaders" :rows="optionsRows" />

### CurrencyValue

<ApiDataTable :headers="currencyValueHeaders" :rows="currencyValueRows" />

### Modes

<ApiDataTable :headers="modesHeaders" :rows="modesRows" />

## Accessibility

The amount input and its label are linked via `id`/`for` (backed by `uuid`). The derived Base Currency, Base Amount, and Exchange Rate fields are always rendered as disabled inputs rather than plain text, so screen readers announce them consistently with the rest of the field group. `required` sets the native `required` attribute on the amount input and the embedded currency picker.

Source: [`aform/src/components/form/ACurrencyInput.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ACurrencyInput.vue)
