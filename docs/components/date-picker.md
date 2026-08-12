---
title: Date Picker
description: A calendar-grid date input with single-date and range selection.
---

# Date Picker

`ADatePicker` renders an inline calendar grid for selecting a date, or — with `selectRange` enabled — a start/end date range. It's the calendar widget embedded (via `ADateSelection`) inside [`ADate`](/components/date) and `ADateRange`, and can also be used standalone.

## Import

```ts
import { ADatePicker } from '@stonecrop/aform'
```

## Basic

`v-model` binds to the selected date, as a JS `Date` (or an epoch-millisecond number). Click a day to select it, or use the previous/next month arrows to navigate.

<DemoPanel>

<ClientOnly>
	<DatePickerDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/DatePickerDemo.vue

</template>

</DemoPanel>

## Usage in a schema

`ADatePicker` is usually resolved by `AForm` from a schema field with `component: 'ADatePicker'`, rather than used directly:

```ts
const schema = [
	{
		fieldname: 'orderDate',
		kind: 'field',
		component: 'ADatePicker',
		label: 'Order Date',
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ orderDate: new Date() })
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

## API Reference

### Props

<ApiTable>

| Name         | Type                            | Default                | Description                                                                                                                    |
| ------------ | -------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`    | `Date \| number`                 | `new Date()`            | The selected date. Accepts a `Date` object or an epoch-millisecond timestamp.                                                  |
| `label`      | `string`                         | —                       | Label text. Only rendered in `read`/`display` mode, next to the static value — `edit` mode's calendar grid has no label.       |
| `selectRange`| `boolean`                        | `false`                 | When `true`, renders start/end date text inputs above the calendar and switches day selection to range mode. See below.       |
| `mode`       | `'edit' \| 'read' \| 'display'`   | `'edit'`                | See [Modes](#modes) below.                                                                                                      |
| `validation` | `{ errorMessage: string }`       | `{ errorMessage: '' }`  | Static error message shown below the field.                                                                                    |
| `errors`     | `string[]`                      | —                       | Dynamic validation errors (e.g. from a trigger). Takes precedence over `validation.errorMessage` whenever the list is non-empty. |

</ApiTable>

`ADatePicker` also accepts the shared `uuid`, `required`, and `mask` props defined on `ComponentProps`, but none of them are read by this component — there's no `id`/`for` pair, no native `required` attribute, and no input mask applied to the calendar grid.

### Modes

<ApiTable>

| Mode      | Rendering                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------- |
| `edit`    | Interactive calendar grid with previous/next month navigation. If `selectRange` is set, also renders editable start/end date text inputs above the grid. |
| `read`    | Static text — same rendering as `display`. There is no separate disabled-but-visible calendar.    |
| `display` | Static text: the selected date's `toLocaleDateString()` value (empty string if unset), followed by `label` if one was given. |

</ApiTable>

### Range selection

When `selectRange` is `true`, clicking a day sets the range's start date; the next click sets the end date (a click before the current start date replaces the start instead). Hovering a day while a start date is set previews the in-between range with a lighter highlight. The start/end text inputs above the grid can also be typed into directly — an invalid or empty value clears that end of the range on blur or <kbd>Enter</kbd>.

### Events

<ApiTable>

| Event      | Payload                                                        | Description                                                                                     |
| ---------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `get-date` | `{ start: Date \| null; end: Date \| null; selected: Date }`      | Emitted whenever a date is selected on the grid or entered into the start/end inputs. `start`/`end` are always `null` unless `selectRange` is `true`. |

</ApiTable>

## Accessibility

Each day cell is a native `td` with `tabindex="0"`, so the grid is keyboard-focusable cell by cell via <kbd>Tab</kbd>, and <kbd>Enter</kbd> on a focused cell selects that date (mirroring a click). On mount, the component moves focus to the currently selected date's cell, falling back to today's date if nothing is selected. Note that dedicated arrow-key navigation between days and month/year paging shortcuts exist in the source but are currently commented out, so day-to-day movement still relies on <kbd>Tab</kbd> order rather than arrow keys.

Source: [`aform/src/components/form/ADatePicker.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ADatePicker.vue)
