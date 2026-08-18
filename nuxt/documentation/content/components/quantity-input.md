---
title: Quantity Input
description: A quantity input with unit-of-measure conversion to a stock unit.
---

# Quantity Input

`AQuantityInput` pairs a quantity with a unit-of-measure (UOM) picker, and derives a read-only stock-equivalent quantity, stock UOM, and conversion factor alongside it. It's built for inventory/line-item style fields where a quantity can be entered in one unit (e.g. `Box`) but needs to be tracked in the item's stock unit (e.g. `Nos`) too.

## Import

```ts
import { AQuantityInput } from '@stonecrop/aform'
```

## Basic

`v-model` binds to a [`QuantityValue`](#quantityvalue) object. The Stock UOM, Stock Qty, and Conversion Factor fields below the input are derived automatically — try changing the quantity or unit.

::demo-panel
:::client-only
:quantity-input-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AQuantityInput } from '@stonecrop/aform'

// "Widget" item: stocked in Nos, but this line was purchased/received in Box.
// 1 Box = 10 Nos, 1 Kg = 25 Nos.
const quantityOptions = {
	uoms: ['Nos', 'Box', 'Kg'],
	stockUom: 'Nos',
	conversionFactors: { Box: 10, Kg: 25 },
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
// "Widget" item: stocked in Nos, but this line was purchased/received in Box.
// 1 Box = 10 Nos, 1 Kg = 25 Nos.
const schema = [
	{
		fieldname: 'qty',
		kind: 'field',
		component: 'AQuantityInput',
		label: 'Quantity',
		options: {
			uoms: ['Nos', 'Box', 'Kg'],
			stockUom: 'Nos',
			conversionFactors: { Box: 10, Kg: 25 },
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
  - ['`v-model`', '[`QuantityValue`](#quantityvalue)', "`{ qty: 0, uom: '', stockQty: 0, stockUom: '', conversionFactor: 1 }`", 'The current quantity, unit, and derived stock-equivalent figures.']
  - ['`label`', '`string`', '—', 'Label for the quantity input.']
  - ['`options`', '[`QuantityOptions`](#options)', '`{}`', 'Type-specific configuration — available UOMs, stock UOM, conversion factors.']
  - ['`required`', '`boolean`', '`false`', 'Marks the quantity input as required (`edit` mode only).']
  - ['`mode`', "`'edit' | 'read' | 'display'`", "`'edit'`", 'See [Modes](#modes) below.']
  - ['`uuid`', '`string`', 'auto-generated', "`id`/`for` pair linking the quantity input to its label, and root for the UOM dropdown's element ids."]
  - ['`uomLabel`', '`string`', "`'UOM'`", "Label for the embedded unit-of-measure dropdown."]
  - ['`stockUomLabel`', '`string`', "`'Stock UOM'`", "Label for the read-only stock UOM field."]
  - ['`stockQtyLabel`', '`string`', "`'Stock Qty'`", "Label for the read-only derived stock quantity field."]
  - ['`conversionFactorLabel`', '`string`', "`'Conversion Factor'`", "Label for the read-only conversion factor field."]
  - ['`validation`', '`{ errorMessage: string }`', "`{ errorMessage: '&nbsp;' }`", 'Static error message shown below the field.']
  - ['`errors`', '`string[]`', '—', 'Accepted for interface compatibility with other field components, but has no effect — unlike other Stonecrop inputs, `AQuantityInput` always renders `validation.errorMessage` only.']
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
  - ['`qty`', '`number`', 'The entered quantity, in `uom` units.']
  - ['`uom`', '`string`', 'Unit of measure the user entered `qty` in.']
  - ['`stockQty`', '`number`', '`qty` converted into `stockUom` units — `qty * conversionFactor`.']
  - ['`stockUom`', '`string`', "The item's base/stock unit of measure — fixed, not user-editable."]
  - ['`conversionFactor`', '`number`', 'Multiplier from `uom` to `stockUom` — hidden from the UI, drives `stockQty`.']
---
::

### Modes

::api-data-table
---
headers: ['Mode', 'Rendering']
rows:
  - ['`edit`', 'Interactive quantity input with an embedded UOM dropdown, plus read-only Stock UOM/Stock Qty/Conversion Factor fields below.']
  - ['`read`', 'Same layout, all inputs disabled.']
  - ['`display`', 'Static text: `qty uom` (with the stock-equivalent quantity/UOM in parentheses, if either differs; `—` if no UOM is set).']
---
::

## Accessibility

The quantity input and its label are linked via `id`/`for` (backed by `uuid`). The UOM dropdown is a custom listbox button (`role="listbox"`/`role="option"`) exposing `aria-haspopup`, `aria-expanded`, and `aria-activedescendant`, and supports Arrow Up/Down to move the active option, Enter to select it, and Escape to close — the same interaction pattern as a native `<select>`. The read-only Stock UOM, Stock Qty, and Conversion Factor fields are rendered as disabled inputs but are not linked to their labels via `id`/`for`, unlike the primary quantity input. `required` sets the native `required` attribute on the quantity input only.

Source: [`aform/src/components/form/AQuantityInput.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/AQuantityInput.vue)
