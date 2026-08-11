---
title: Textbox Input
description: A multi-line textarea input rendered from an AForm schema field.
---

# Textbox Input

`ATextboxInput` renders a multi-line text field — a `<textarea>` paired with a floating label — either standalone or as a field inside an [AForm](/reference/aform) schema. It's the multi-line counterpart to [`ATextInput`](/components/text-input): the same label/mode/validation behavior, but backed by a resizable textarea with configurable `rows`, `maxlength`, and `placeholder` instead of a single-line input (and no `mask` support).

## Import

```ts
import { ATextboxInput } from '@stonecrop/aform'
```

## Basic

`v-model` binds to the textarea's value. `rows` controls the visible height.

<DemoPanel>

<ClientOnly>
	<TextboxInputDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/TextboxInputDemo.vue

</template>

</DemoPanel>

## Usage in a schema

`ATextboxInput` is usually resolved by `AForm` from a schema field with `component: 'ATextboxInput'`, rather than used directly:

```ts
const schema = [
	{
		fieldname: 'notes',
		kind: 'field',
		component: 'ATextboxInput',
		label: 'Notes',
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ notes: '' })
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

## API Reference

### Props

<div class="api-table">

| Name          | Type                             | Default                | Description                                                                                                                    |
| ------------- | --------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`     | `string \| null \| undefined`     | —                       | The textarea's current value.                                                                                                  |
| `label`       | `string`                         | —                       | Label text rendered next to the textarea.                                                                                       |
| `placeholder` | `string`                         | `''`                    | Placeholder text shown when the field is empty.                                                                                |
| `rows`        | `number`                         | `4`                     | Visible number of text lines (maps to the textarea's `rows` attribute).                                                        |
| `maxlength`   | `number`                         | —                       | Maximum number of characters the field will accept.                                                                            |
| `required`    | `boolean`                        | `false`                 | Marks the input as required (`edit` mode only).                                                                                |
| `mode`        | `'edit' \| 'read' \| 'display'`   | `'edit'`                | See [Modes](#modes) below.                                                                                                      |
| `uuid`        | `string`                         | auto-generated          | `id`/`for` pair linking the textarea to its label.                                                                             |
| `validation`  | `{ errorMessage: string }`       | `{ errorMessage: '' }`  | Static error message shown below the field.                                                                                    |
| `errors`      | `string[]`                       | —                       | Dynamic validation errors (e.g. from a trigger). Takes precedence over `validation.errorMessage` whenever the list is non-empty. |

</div>

### Modes

<div class="api-table">

| Mode      | Rendering                                                              |
| --------- | ------------------------------------------------------------------------- |
| `edit`    | Interactive, resizable textarea.                                      |
| `read`    | Textarea, disabled.                                                   |
| `display` | Static label with the value shown as plain, whitespace-preserved text. |

</div>

## Accessibility

The textarea and its label are linked via `id`/`for` (backed by `uuid`), so the label is announced by screen readers on focus and clicking the label focuses the textarea. `required` sets the native `required` attribute, so unsupported submission is caught by the browser's built-in validation UI in addition to any schema-level validation.

Source: [`aform/src/components/form/ATextboxInput.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ATextboxInput.vue)
