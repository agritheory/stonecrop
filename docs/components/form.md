---
title: AForm
description: The schema-driven form orchestrator that resolves and renders Stonecrop field components together.
---

# AForm

`AForm` is the schema-driven orchestrator at the center of Stonecrop's form components. It takes a `schema` — an array of resolved field descriptors — and for each one resolves a Vue component by string name (e.g. `component: 'ACurrencyInput'`), renders it, and wires up shared `v-model:data`, `mode`, and validation plumbing so every field reads from and writes to one data object. Individual field components like [ACheckbox](./checkbox) and [ACurrencyInput](./currency) can be used standalone, but `AForm` is how they're normally composed into a real form.

## Import

```ts
import { AForm } from '@stonecrop/aform'
```

## Basic

A schema mixing three distinct field kinds — text, checkbox, and currency — all resolved and rendered by one `AForm`, sharing a single `data` object via `v-model:data`.

<DemoPanel>

<ClientOnly>
	<FormDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/FormDemo.vue

</template>

</DemoPanel>

The schema behind it:

```ts
const CURRENCIES = [
	{ id: 'USD', displayText: 'US Dollar', symbol: '$' },
	{ id: 'EUR', displayText: 'Euro', symbol: '€' },
	{ id: 'GBP', displayText: 'British Pound', symbol: '£' },
]

const schema: ResolvedField[] = [
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
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({
	first_name: 'Jane',
	last_name: 'Smith',
	subscribed: true,
	total: {
		amount: 100,
		currency: { id: 'EUR', displayText: 'Euro' },
		baseAmount: 110,
		baseCurrency: { id: 'USD', displayText: 'US Dollar' },
		exchangeRate: 1.1,
	},
})
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

## Modes

`mode` cascades from `AForm` down to every field it resolves — a single prop switches an entire form's interaction state at once. A field can still override the cascade with its own schema-level `mode`. The same schema and data below are rendered twice: once with `mode="edit"`, once with `mode="display"`.

<DemoPanel>

<ClientOnly>
	<FormModesDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/FormModesDemo.vue

</template>

</DemoPanel>

## API Reference

### Props

<div class="api-table">

| Name          | Type                            | Default  | Description                                                                                                                     |
| ------------- | -------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `schema`      | [`ResolvedField[]`](#schema-field-shape) | —        | The resolved field descriptors to render, in order. Required.                                                                  |
| `data`        | `Record<string, any>`             | —        | The form's data object, bound with `v-model:data`. Required — each field reads/writes `data[fieldname]` through it.            |
| `mode`        | `'edit' \| 'read' \| 'display'`   | `'edit'` | Cascades to every resolved field unless a field's own schema entry sets its own `mode`. See [Modes](#modes) above.             |
| `errors`      | `Record<string, string[]>`        | —        | Validation errors keyed by `fieldname`, passed through to the matching field's `errors` prop. `AForm` stays store-agnostic — the host is responsible for populating this. |

</div>

`AForm` also emits `update:data` (fired on every field change, alongside the `v-model:data` sync) and `update:schema` (fired whenever a field's value changes, re-emitting the current `schema` unchanged — useful for hosts that keep schema and data in the same reactive store).

## Schema field shape

Each entry in `schema` is a [`ResolvedField`](https://github.com/agritheory/stonecrop/blob/development/aform/src/types/index.ts) — a discriminated union keyed by `kind`. Most entries are `kind: 'field'` (a scalar or link value); `kind: 'link'` and `kind: 'fieldset'` entries carry their own nested `schema` and are rendered as an embedded `AForm`, and `kind: 'table'` entries are rendered by `ATable` with row data sourced from `data[fieldname]` rather than from the schema itself.

The common keys on a `kind: 'field'` entry:

<div class="api-table">

| Key         | Type                            | Description                                                                                          |
| ----------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `fieldname` | `string`                          | Key into the shared `data` object. Required.                                                          |
| `kind`      | `'field' \| 'link' \| 'table' \| 'fieldset'` | Discriminates how `AForm` resolves and renders the entry. Required.                       |
| `component` | `string`                          | Vue component name to resolve (e.g. `'ACheckbox'`, `'ACurrencyInput'`). Required for `kind: 'field'`. |
| `label`     | `string`                          | Human-readable label, passed through to the field.                                                    |
| `options`   | `string[] \| Record<string, unknown>` | Type-specific configuration — Select choices, or a config object like [`CurrencyOptions`](./currency#options). |
| `required`  | `boolean`                         | Marks the field required (`edit` mode only).                                                          |
| `mode`      | `'edit' \| 'read' \| 'display'`   | Per-field override of the form-level `mode`.                                                          |
| `hidden`    | `boolean`                         | Skips rendering the field entirely; its value stays present in `data`.                                |
| `readOnly`  | `boolean`                         | Present on the type and preserved through schema resolution, but not currently read by `AForm` or any field component — use `mode` (or a per-field `mode` override) to control interactivity instead. |
| `width`     | `string`                          | CSS width (e.g. `'40ch'`) applied to the field's flex basis.                                          |
| `validation`| `{ errorMessage: string }`        | Static error message shown below the field.                                                           |
| `default`   | `unknown`                         | Default value for new records.                                                                        |

</div>

## Accessibility

`AForm` renders a native `<form>` element, giving every resolved field a shared semantic and layout container rather than a bare `<div>` of unrelated inputs. Nested `link`/`fieldset` sections that carry a `label` are preceded by an `<h4>`, giving assistive technology a heading structure to navigate embedded sub-forms by. Accessibility for an individual control — label association, required-state, error announcement — is implemented by that field component itself; see [ACheckbox](./checkbox#accessibility) and [ACurrencyInput](./currency#accessibility) for examples.

Source: [`aform/src/components/AForm.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/AForm.vue)
