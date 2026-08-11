---
title: Date
description: A single-date field with a text input and an inline calendar picker.
---

# Date

`ADate` renders a single date field — a native-styled text input paired with a floating label, with an inline calendar (`ADatePicker`) that toggles open when the input is clicked and closes again on an outside click or on selection. Use it for any single-date field — due dates, birth dates, effective dates — either standalone or as a field inside an [AForm](/reference/aform) schema.

## Import

```ts
import { ADate } from '@stonecrop/aform'
```

## Basic

`v-model` binds to the selected date as an ISO `YYYY-MM-DD` string. Click the field to toggle the inline calendar; picking a date there also updates `v-model`.

<DemoPanel>

<ClientOnly>
	<DateDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/DateDemo.vue

</template>

</DemoPanel>

## Usage in a schema

`ADate` is usually resolved by `AForm` from a schema field with `component: 'ADate'`, rather than used directly:

```ts
const schema = [
	{
		fieldname: 'delivery_date',
		kind: 'field',
		component: 'ADate',
		label: 'Delivery Date',
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ delivery_date: '2026-08-05' })
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

## API Reference

### Props

<div class="api-table">

| Name         | Type                          | Default                | Description                                                                                                                    |
| ------------ | ----------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`    | `string \| Date \| undefined` | —                       | The selected date. Read back as an ISO `YYYY-MM-DD` string once the field has been used.                                       |
| `label`      | `string`                      | `'Date'`                | Label rendered next to the input.                                                                                              |
| `required`   | `boolean`                     | `false`                 | Marks the input as required (`edit` mode only).                                                                                |
| `mode`       | `'edit' \| 'read' \| 'display'` | `'edit'`                | See [Modes](#modes) below.                                                                                                      |
| `uuid`       | `string`                      | auto-generated          | `id`/`for` pair linking the input to its label.                                                                                |
| `validation` | `{ errorMessage: string }`    | `{ errorMessage: '' }`  | Static error message shown below the field.                                                                                    |
| `errors`     | `string[]`                    | —                       | Dynamic validation errors (e.g. from a trigger). Takes precedence over `validation.errorMessage` whenever the list is non-empty. |

</div>

### Modes

<div class="api-table">

| Mode      | Rendering                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------- |
| `edit`    | Interactive text input; clicking it opens an inline calendar for date selection.                  |
| `read`    | Same text input, disabled — the calendar does not open, since disabled inputs don't fire clicks.  |
| `display` | Static text showing the date via `toLocaleDateString()`, with the label rendered below it.        |

</div>

## Accessibility

The input and its label are linked via `id`/`for` (backed by `uuid`), so the label is announced by screen readers on focus. `required` sets the native `required` attribute, so unsupported submission is caught by the browser's built-in validation UI in addition to any schema-level validation. The inline calendar is opened only by a mouse/pointer click on the input — there is no keyboard shortcut to open it — and it closes automatically on an outside click.

Source: [`aform/src/components/form/ADate.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ADate.vue)
