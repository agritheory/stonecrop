---
title: Numeric Input
description: A plain numeric input rendered from an AForm schema field.
---

<script setup lang="ts">
const propsHeaders = ["Name", "Type", "Default", "Description"]
const propsRows = [
	["`v-model`", "`number | undefined`", "—", "The input's numeric value."],
	["`label`", "`string`", "—", "Label text rendered next to the input."],
	["`required`", "`boolean`", "`false`", "Marks the input as required (`edit` mode only)."],
	["`mode`", "`'edit' | 'read' | 'display'`", "`'edit'`", "See [Modes](#modes) below."],
	["`uuid`", "`string`", "auto-generated", "`id`/`for` pair linking the input to its label."],
	["`validation`", "`{ errorMessage: string }`", "`{ errorMessage: '' }`", "Static error message shown below the field."],
	["`errors`", "`string[]`", "—", "Dynamic validation errors (e.g. from a trigger). Takes precedence over `validation.errorMessage` whenever the list is non-empty."],
]

const modesHeaders = ["Mode", "Rendering"]
const modesRows = [
	["`edit`", 'Interactive `type="number"` input.'],
	["`read`", "Number input, disabled."],
	["`display`", "Static label with the value in place of the input (empty string if unset)."],
]
</script>

# Numeric Input

`ANumericInput` renders a single numeric field — a native `type="number"` input paired with a floating label — either standalone or as a field inside an [AForm](/reference/aform) schema. It supports the same `edit` / `read` / `display` interaction modes as every other Stonecrop field component.

## Import

```ts
import { ANumericInput } from '@stonecrop/aform'
```

## Basic

`v-model` binds to the numeric value.

<DemoPanel>

<ClientOnly>
	<NumericInputDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/NumericInputDemo.vue

</template>

</DemoPanel>

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

## API Reference

### Props

<ApiDataTable :headers="propsHeaders" :rows="propsRows" />

### Modes

<ApiDataTable :headers="modesHeaders" :rows="modesRows" />

## Accessibility

The input and its label are linked via `id`/`for` (backed by `uuid`), so the label is announced by screen readers on focus and clicking the label focuses the input. `required` sets the native `required` attribute, so unsupported submission is caught by the browser's built-in validation UI in addition to any schema-level validation.

Source: [`aform/src/components/form/ANumericInput.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ANumericInput.vue)
