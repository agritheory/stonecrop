---
title: Quantity Input
description: A quantity input with unit-of-measure conversion to a stock unit.
---

# Quantity Input

`AQuantityInput` pairs a quantity with a unit-of-measure (UOM) picker and derives stock-equivalent figures on the value. When the entered UOM differs from the item's stock UOM, a compact helper line under the field shows the conversion (for example `= 50 Nos · 1 Box = 10 Nos`). It's built for inventory/line-item style fields where a quantity can be entered in one unit (e.g. `Box`) but needs to be tracked in the item's stock unit (e.g. `Nos`) too.

## Import

```ts
import { AQuantityInput } from '@stonecrop/aform'
```

## Basic

`v-model` binds to a [`QuantityValue`](#quantityvalue) object. The stock conversion helper below the input updates automatically when the quantity or unit changes and the UOM differs from the stock UOM.

::demo-panel
:::client-only
:quantity-input-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AQuantityInput } from '@stonecrop/aform'

// "Widget" item: stocked in Nos, but lines may use Box, weight, or sheet size.
// 1 Box = 10 Nos, 1 Kg = 25 Nos, 1 sheet = 1 Nos.
const sheetUom = "4' x 8' sheet"
const quantityOptions = {
	uoms: ['Nos', 'Box', 'Kg', sheetUom],
	stockUom: 'Nos',
	conversionFactors: { Box: 10, Kg: 25, [sheetUom]: 1 },
}

const item = ref({
	qty: 5,
	uom: 'Box',
	stockQty: 50,
	stockUom: 'Nos',
	conversionFactor: 10,
})
</script>

<template>
	<div class="stonecrop-demo">
		<AQuantityInput v-model="item" label="Quantity" uuid="quantity-input-demo" :options="quantityOptions" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ item }}</strong>
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

`AQuantityInput` is usually resolved by `AForm` from a schema field with `component: 'AQuantityInput'`, rather than used directly:

```ts
// "Widget" item: stocked in Nos, but lines may use Box, weight, or sheet size.
const sheetUom = "4' x 8' sheet"
const schema = [
	{
		fieldname: 'qty',
		kind: 'field',
		component: 'AQuantityInput',
		label: 'Quantity',
		options: {
			uoms: ['Nos', 'Box', 'Kg', sheetUom],
			stockUom: 'Nos',
			conversionFactors: { Box: 10, Kg: 25, [sheetUom]: 1 },
		},
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({
	qty: { qty: 5, uom: 'Box', stockQty: 50, stockUom: 'Nos', conversionFactor: 10 },
})
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`v-model`', '[`QuantityValue`](#quantityvalue)', "`{ qty: null, uom: '', stockQty: null, stockUom: '', conversionFactor: 1 }`", 'The current quantity, unit, and derived stock-equivalent figures.']
  - ['`label`', '`string`', '—', 'Label for the quantity input.']
  - ['`options`', '[`QuantityOptions`](#options)', '`{}`', 'Type-specific configuration — available UOMs, stock UOM, conversion factors.']
  - ['`required`', '`boolean`', '`false`', 'Marks the quantity input as required (`edit` mode only).']
  - ['`mode`', "`'edit' | 'read' | 'display'`", "`'edit'`", 'See [Modes](#modes) below.']
  - ['`uuid`', '`string`', 'none', "`id`/`for` pair linking the quantity input to its label, and root for the UOM dropdown's element ids. Nothing generates one, so the pairing exists only when you pass it."]
  - ['`uomLabel`', '`string`', "`'UOM'`", "Label for the embedded unit-of-measure dropdown."]
  - ['`validation`', '`{ errorMessage: string }`', "`{ errorMessage: '' }`", 'Static error message shown below the field.']
  - ['`errors`', '`string[]`', '—', 'Dynamic validation errors (e.g. from a trigger). Takes precedence over `validation.errorMessage` whenever the list is non-empty.']
---
::

### Options

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`uoms`', '`string[]`', '—', 'Dropdown choices for the `uom` field.']
  - ['`stockUom`', '`string`', '—', "The item's base/stock unit of measure — fixed, not user-editable."]
  - ['`conversionFactors`', '`Record<string, number>`', '—', "Conversion factor for each non-stock UOM, relative to `stockUom` (which is implicitly `1`). If the selected UOM is absent from this map, the factor resets to `1` unless it's unchanged from the current value (in which case the existing factor round-trips)."]
---
::

### QuantityValue

::api-data-table
---
headers: ['Field', 'Type', 'Description']
rows:
  - ['`qty`', '`number | null`', 'The entered quantity, in `uom` units, or `null` when none is entered.']
  - ['`uom`', '`string`', 'Unit of measure the user entered `qty` in.']
  - ['`stockQty`', '`number | null`', '`qty` converted into `stockUom` units (`qty * conversionFactor`), or `null` when `qty` is.']
  - ['`stockUom`', '`string`', "The item's base/stock unit of measure — fixed, not user-editable."]
  - ['`conversionFactor`', '`number`', 'Multiplier from `uom` to `stockUom` — hidden from the UI, drives `stockQty`.']
---
::

### Modes

::api-data-table
---
headers: ['Mode', 'Rendering']
rows:
  - ['`edit`', 'Interactive quantity input with an embedded UOM dropdown; when `uom` differs from `stockUom`, a helper line shows the stock conversion beneath the field.']
  - ['`read`', 'Same layout, all inputs disabled.']
  - ['`display`', 'Static text: `qty uom` (with the stock-equivalent quantity/UOM in parentheses when they differ; `—` if no quantity or UOM is set). Table cells omit the UOM when it matches `stockUom`.']
---
::

## Accessibility

The quantity input and its label are linked via `id`/`for` (backed by `uuid`). When a conversion helper is visible, it is included in `aria-describedby` on the quantity input (unless an error is shown, in which case the error id takes precedence). The UOM dropdown is a custom listbox button (`role="listbox"`/`role="option"`) exposing `aria-haspopup`, `aria-expanded`, and `aria-activedescendant`, and supports Arrow Up/Down to move the active option, Enter to select it, and Escape to close — the same interaction pattern as a native `<select>`. `required` sets the native `required` attribute on the quantity input only.

Source: [`aform/src/components/form/AQuantityInput.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/AQuantityInput.vue)
