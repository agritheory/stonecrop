---
title: Checkbox
description: A boolean input rendered from an AForm schema field.
---

# Checkbox

`ACheckbox` renders a single boolean field — a native checkbox paired with a floating label — either standalone or as a field inside an [AForm](/reference/aform) schema. It supports the same `edit` / `read` / `display` interaction modes as every other Stonecrop field component.

## Import

```ts
import { ACheckbox } from '@stonecrop/aform'
```

## Basic

`v-model` binds to the checked state. `label` renders next to the input.

::demo-panel
:::client-only
:checkbox-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ACheckbox } from '@stonecrop/aform'

const accepted = ref(false)
</script>

<template>
	<div class="stonecrop-demo">
		<ACheckbox v-model="accepted" label="Accept terms and conditions" uuid="checkbox-demo" mode="edit" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ accepted }}</strong>
		</p>
	</div>
</template>
```
::

## Usage in a schema

`ACheckbox` is usually resolved by `AForm` from a schema field with `component: 'ACheckbox'`, rather than used directly:

```ts
const schema = [
	{
		fieldname: 'accepted',
		kind: 'field',
		component: 'ACheckbox',
		label: 'Accept terms and conditions',
		required: true,
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ accepted: false })
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
  - ['`v-model`', '`boolean | undefined`', '—', "The checkbox's checked state."]
  - ['`label`', '`string`', '—', 'Label text rendered next to the checkbox.']
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
  - ['`edit`', 'Interactive checkbox input.']
  - ['`read`', 'Checkbox input, disabled.']
  - ['`display`', 'Static label with a ✓ or ✗ shown in place of the input.']
---
::

## Accessibility

The input and its label are linked via `id`/`for` (backed by `uuid`), so the label is announced by screen readers on focus and clicking the label toggles the checkbox. `required` sets the native `required` attribute, so unsupported submission is caught by the browser's built-in validation UI in addition to any schema-level validation.

Source: [`aform/src/components/form/ACheckbox.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ACheckbox.vue)
