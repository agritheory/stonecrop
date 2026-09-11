---
title: Dropdown
description: A filterable autocomplete text input backed by a list of string options.
---

# Dropdown

`ADropdown` renders a text input paired with a filterable dropdown of string results — either standalone or as a field inside an [AForm](/reference/aform) schema. Typing filters the option list in place; results can also be filtered by a caller-supplied function instead of the built-in substring match.

## Import

```ts
import { ADropdown } from '@stonecrop/aform'
```

## Basic

`v-model` binds to the current text value. `options` is the flat list of choices shown in the dropdown — try typing to filter it.

::demo-panel
:::client-only
:dropdown-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ADropdown } from '@stonecrop/aform'

const fruits = ['Apple', 'Orange', 'Pear', 'Kiwi', 'Grape']
const fruit = ref('Orange')
</script>

<template>
	<div class="stonecrop-demo">
		<ADropdown v-model="fruit" :options="fruits" label="Fruit" mode="edit" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ fruit }}</strong>
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

`ADropdown` is usually resolved by `AForm` from a schema field with `component: 'ADropdown'`, rather than used directly. The field's `options` array is passed straight through as the component's `options` prop:

```ts
const schema = [
	{
		fieldname: 'fruit',
		kind: 'field',
		component: 'ADropdown',
		label: 'Fruit',
		options: ['Apple', 'Orange', 'Pear', 'Kiwi', 'Grape'],
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ fruit: 'Orange' })
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
  - ['`v-model`', '`string | undefined`', '—', "The input's current text value."]
  - ['`label`', '`string`', '—', 'Label text rendered next to the input.']
  - ['`options`', '`string[]`', '`[]`', 'The full list of candidate results shown in the dropdown.']
  - ['`isAsync`', '`boolean`', '`false`', 'Shows a "Loading results..." row while a supplied `filterFunction` resolves.']
  - ['`filterFunction`', '`(search: string) => string[] | Promise<string[]>`', '—', "Overrides the built-in substring match with caller-supplied filtering (e.g. an API request) against `options`."]
  - ['`required`', '`boolean`', '`false`', "Part of the shared field prop type; not applied to the native input by this component's current implementation."]
  - ['`mode`', "`'edit' | 'read' | 'display'`", "`'edit'`", 'See [Modes](#modes) below.']
  - ['`uuid`', '`string`', '—', "Part of the shared field prop type; this component does not link its label to its input via `id`/`for`."]
  - ['`validation`', '`{ errorMessage: string }`', "`{ errorMessage: '' }`", 'Static error message shown below the field.']
  - ['`errors`', '`string[]`', '—', 'Dynamic validation errors (e.g. from a trigger). Takes precedence over `validation.errorMessage` whenever the list is non-empty.']
---
::

### Modes

::api-data-table
---
headers: ['Mode', 'Rendering']
rows:
  - ['`edit`', 'Interactive text input with a filterable dropdown of results.']
  - ['`read`', 'Same input, disabled — it cannot be focused, so the dropdown cannot be opened.']
  - ['`display`', 'Static text: the current value, followed by the label.']
---
::

## Accessibility

The input and its label are not linked via `id`/`for` — `uuid` is part of the shared field prop type but is not read by this component, so screen readers do not get the same label association that `ACheckbox` or `ACurrencyInput` provide. Once the dropdown is open, Arrow Down/Up move the highlighted result, Enter commits it, and Escape or Tab closes the list and reverts to the last committed value; the result list itself carries no ARIA roles (no `role="listbox"`/`"option"`, no `aria-activedescendant`), so assistive technology is not told it is a listbox.

Source: [`aform/src/components/form/ADropdown.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ADropdown.vue)
