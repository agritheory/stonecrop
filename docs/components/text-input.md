---
title: Text Input
description: A single-line text input rendered from an AForm schema field.
---

<script setup lang="ts">
const propsHeaders = ["Name", "Type", "Default", "Description"]
const propsRows = [
	["`v-model`", "`string | number | undefined`", "—", "The input's current value."],
	["`label`", "`string`", "—", "Label text rendered next to the input."],
	["`mask`", "`string`", "—", 'An input mask (e.g. `"(###) ###-####"`), or a stringified `(locale) => string` function that returns one. `#` marks an editable character position.'],
	["`required`", "`boolean`", "`false`", "Marks the input as required (`edit` mode only)."],
	["`mode`", "`'edit' | 'read' | 'display'`", "`'edit'`", "See [Modes](#modes) below."],
	["`uuid`", "`string`", "auto-generated", "`id`/`for` pair linking the input to its label."],
	["`validation`", "`{ errorMessage: string }`", "`{ errorMessage: '' }`", "Static error message shown below the field."],
	["`errors`", "`string[]`", "—", "Dynamic validation errors (e.g. from a trigger). Takes precedence over `validation.errorMessage` whenever the list is non-empty."],
]

const modesHeaders = ["Mode", "Rendering"]
const modesRows = [
	["`edit`", "Interactive text input."],
	["`read`", "Text input, disabled."],
	["`display`", "Static label with the value shown as plain text."],
]
</script>

# Text Input

`ATextInput` renders a single-line text field — a native input paired with a floating label — either standalone or as a field inside an [AForm](/reference/aform) schema. It supports the same `edit` / `read` / `display` interaction modes as every other Stonecrop field component, and can optionally apply an input mask.

## Import

```ts
import { ATextInput } from '@stonecrop/aform'
```

## Basic

`v-model` binds to the input's value. `label` renders next to the input.

<DemoPanel>

<ClientOnly>
	<TextInputDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/TextInputDemo.vue

</template>

</DemoPanel>

## Usage in a schema

`ATextInput` is usually resolved by `AForm` from a schema field with `component: 'ATextInput'`, rather than used directly:

```ts
const schema = [
	{
		fieldname: 'name',
		kind: 'field',
		component: 'ATextInput',
		label: 'Full name',
		required: true,
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ name: '' })
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

Source: [`aform/src/components/form/ATextInput.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ATextInput.vue)
