---
title: Numeric Input
description: A plain numeric input rendered from an AForm schema field.
---

# Numeric Input

`ANumericInput` renders a single numeric field — a number input without spinner arrows, paired with a floating label — either standalone or as a field inside an [AForm](/reference/aform) schema. It supports the same `edit` / `read` / `display` interaction modes as every other Stonecrop field component.

## Import

```ts
import { ANumericInput } from '@stonecrop/aform'
```

## Basic

`v-model` binds to the numeric value.

::demo-panel
:::client-only
:numeric-input-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ANumericInput } from '@stonecrop/aform'

const quantity = ref(42)
</script>

<template>
	<div class="stonecrop-demo">
		<ANumericInput v-model="quantity" label="Quantity" uuid="numeric-input-demo" mode="edit" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ quantity }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
```
::

## Usage in a schema

`ANumericInput` is usually resolved by `AForm` from a schema field with `component: 'ANumericInput'`, rather than used directly:

```ts
const schema = [
	{
		fieldname: 'quantity',
		kind: 'field',
		component: 'ANumericInput',
		label: 'Quantity',
		required: true,
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ quantity: 0 })
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

## Arithmetic

The box takes arithmetic as well as plain numbers: type `12*3+4` and the field holds `40`. The model takes each complete result as you type. When you leave the box or press Enter, the box shows the result in place of the expression.

- Allowed: digits, `.`, `+`, `-`, `*`, `/`, `%` (remainder) and parentheses. `*` and `/` bind tighter than `+` and `-`.
- A leading `=` or `+` works as it does in a spreadsheet: `=12*3` and `+12*3` are both `36`. `=` is refused anywhere but first.
- Refused: `e`/`E`, `^` and any other letter, whether typed or pasted.
- An unfinished or impossible expression (`12*`, `(3+4`, `5/0`) leaves the last number in place.
- A result keeps every digit it works out (`10/3` is `3.33333333333333`) unless the field sets `options.precision`: at `2`, `10/3` is `3.33`. A currency field rounds to its currency's decimals by itself.

::demo-panel
:::client-only
:arithmetic-input-demo
:::
::

Set `options.arithmetic: false` for a plain `type="number"` box. The same applies to [Quantity Input](/components/quantity-input), [Currency](/components/currency), and the matching [Table](/components/table#quantity-and-currency-columns) columns (including `ANumericInput` columns).

```ts
const schema = [
	{
		fieldname: 'quantity',
		kind: 'field',
		component: 'ANumericInput',
		label: 'Quantity',
		options: { arithmetic: false }, // a plain number box
	},
]
```

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`v-model`', '`number | null`', 'none', "The input's numeric value, or `null` once emptied."]
  - ['`label`', '`string`', '—', 'Label text rendered next to the input.']
  - ['`required`', '`boolean`', '`false`', 'Marks the input as required (`edit` mode only).']
  - ['`mode`', "`'edit' | 'read' | 'display'`", "`'edit'`", 'See [Modes](#modes) below.']
  - ['`uuid`', '`string`', 'none', "`id`/`for` pair linking the input to its label. Nothing generates one, so the pairing exists only when you pass it."]
  - ['`validation`', '`{ errorMessage: string }`', "`{ errorMessage: '' }`", 'Static error message shown below the field.']
  - ['`errors`', '`string[]`', '—', 'Dynamic validation errors (e.g. from a trigger). Takes precedence over `validation.errorMessage` whenever the list is non-empty.']
---
::

### Options

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`arithmetic`', '`boolean`', '`true`', 'Whether the box takes arithmetic: `12*3+4` is read as `40` once the box is left or Enter is pressed. Digits, `.`, `+ - * / %` and parentheses only; `e`, `^` and other letters are refused. Set `false` for a plain `type="number"` box. An unfinished expression (`12*`) leaves the last number in place. See [Arithmetic](#arithmetic).']
  - ['`precision`', '`number`', '—', 'Decimal places to round the number to, as a column with a fixed scale holds it: at `2`, `10/3` is `3.33`. Omit to keep every digit the box works out. A non-integer or out-of-range value is ignored.']
---
::

### Modes

::api-data-table
---
headers: ['Mode', 'Rendering']
rows:
  - ['`edit`', 'Interactive input: `type="text"` with `inputmode="decimal"` that takes arithmetic, or `type="number"` when `options.arithmetic` is `false`.']
  - ['`read`', 'Number input, disabled.']
  - ['`display`', 'Static label with the value in place of the input (empty string if unset).']
---
::

## Accessibility

The input and its label are linked via `id`/`for` (backed by `uuid`), so the label is announced by screen readers on focus and clicking the label focuses the input. `required` sets the native `required` attribute, so unsupported submission is caught by the browser's built-in validation UI in addition to any schema-level validation.

Source: [`aform/src/components/form/ANumericInput.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ANumericInput.vue)
