---
title: Date Range
description: A start/end date range field with a single input and an inline range picker.
---

# Date Range

`ADateRange` renders a start/end date range as a single field — a read-only-styled text input that summarizes the selected range, with an inline calendar (`ADatePicker`, in range-select mode) that opens when the input is clicked. Use it for reporting periods, filters, or any field that needs a from/to date pair, either standalone or as a field inside an [AForm](/reference/aform) schema.

## Import

```ts
import { ADateRange } from '@stonecrop/aform'
```

## Basic

`v-model` binds to a [`DateRangeValue`](#daterangevalue) object — `{ start_date, end_date }` — with each side either an ISO date string or `null`. Click the field to open the calendar and pick a start date, then an end date; picking the end date closes the calendar and updates `v-model`.

<DemoPanel>

<ClientOnly>
	<DateRangeDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/DateRangeDemo.vue

</template>

</DemoPanel>

## Usage in a schema

`ADateRange` is usually resolved by `AForm` from a schema field with `component: 'ADateRange'`, rather than used directly:

```ts
const schema = [
	{
		fieldname: 'reporting_period',
		kind: 'field',
		component: 'ADateRange',
		label: 'Reporting Period',
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ reporting_period: { start_date: null, end_date: null } })
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

## API Reference

### Props

<ApiTable>

| Name         | Type                                    | Default                                | Description                                                                                                                    |
| ------------ | ---------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`    | [`DateRangeValue`](#daterangevalue)      | `{ start_date: null, end_date: null }`   | The selected date range.                                                                                                       |
| `label`      | `string`                                  | `'Date Range'`                            | Label rendered next to the input.                                                                                              |
| `mode`       | `'edit' \| 'read' \| 'display'`           | `'edit'`                                  | See [Modes](#modes) below.                                                                                                      |
| `uuid`       | `string`                                  | auto-generated                            | `id`/`for` pair linking the input to its label.                                                                                |
| `validation` | `{ errorMessage: string }`                | `{ errorMessage: '' }`                    | Static error message shown below the field.                                                                                    |
| `errors`     | `string[]`                                | —                                          | Dynamic validation errors (e.g. from a trigger). Takes precedence over `validation.errorMessage` whenever the list is non-empty. |

</ApiTable>

### DateRangeValue

<ApiTable>

| Field        | Type              | Description                                                  |
| ------------- | ------------------ | ---------------------------------------------------------------- |
| `start_date` | `string \| null`   | ISO date string for the start of the range, or `null` if unset. |
| `end_date`   | `string \| null`   | ISO date string for the end of the range, or `null` if unset.   |

</ApiTable>

### Modes

<ApiTable>

| Mode      | Rendering                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------- |
| `edit`    | Read-only-styled text input showing the formatted range; clicking it opens an inline range calendar.    |
| `read`    | Same input, disabled — the calendar does not open, since disabled inputs don't fire clicks.              |
| `display` | Static text — `start — end`, `From start` (end unset), or `Until end` (start unset) — with the label.    |

</ApiTable>

## Accessibility

The input and its label are linked via `id`/`for` (backed by `uuid`). The input carries the native `readonly` attribute at all times, so keyboard and screen-reader users are never left editing raw text that doesn't match the picker's output — all changes go through the calendar. The calendar itself is opened only by a mouse/pointer click on the input, and closes automatically on an outside click.

Source: [`aform/src/components/form/ADateRange.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ADateRange.vue)
