---
title: Numeric Input
description: A plain numeric input rendered from an AForm schema field.
---

# Numeric Input

`ANumericInput` renders a single numeric field — a native `type="number"` input paired with a floating label — either standalone or as a field inside an [AForm](/reference/aform) schema. It supports the same `edit` / `read` / `display` interaction modes as every other Stonecrop field component.

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

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`v-model`', '`number | undefined`', '—', "The input's numeric value."]
  - ['`label`', '`string`', '—', 'Label text rendered next to the input.']
  - ['`required`', '`boolean`', '`false`', 'Marks the input as required (`edit` mode only).']
  - ['`mode`', "`'edit' | 'read' | 'display'`", "`'edit'`", 'See [Modes](#modes) below.']
  - ['`uuid`', '`string`', 'auto-generated', "`id`/`for` pair linking the input to its label."]
  - ['`validation`', '`{ errorMessage: string }`', "`{ errorMessage: '' }`", 'Static error message shown below the field.']
  - ['`errors`', '`string[]`', '—', 'Dynamic validation errors (e.g. from a trigger). Takes precedence over `validation.errorMessage` whenever the list is non-empty.']
---
::

### Modes

::api-data-table
---
headers: ['Mode', 'Rendering']
rows:
  - ['`edit`', 'Interactive `type="number"` input.']
  - ['`read`', 'Number input, disabled.']
  - ['`display`', 'Static label with the value in place of the input (empty string if unset).']
---
::

## Accessibility

The input and its label are linked via `id`/`for` (backed by `uuid`), so the label is announced by screen readers on focus and clicking the label focuses the input. `required` sets the native `required` attribute, so unsupported submission is caught by the browser's built-in validation UI in addition to any schema-level validation.

Source: [`aform/src/components/form/ANumericInput.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ANumericInput.vue)
