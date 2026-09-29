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

`v-model` binds to the selected day, as a `YYYY-MM-DD` string. Click a day to select it, or use the previous/next month arrows to navigate. The keyboard can do both (see [Accessibility](#accessibility)).

::demo-panel
:::client-only
:date-picker-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ADatePicker } from '@stonecrop/aform'

// ADatePicker's `edit` mode renders only the calendar grid — the `label` prop is only
// used in `read`/`display` mode, so it's omitted here.
const selected = ref<string>()
</script>

<template>
	<div class="stonecrop-demo">
		<ADatePicker v-model="selected" mode="edit" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ selected }}</strong>
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

const data = ref({ orderDate: '2026-01-15' })
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
  - ['`v-model`', '`string | null`', '`undefined`', 'The selected day, as `YYYY-MM-DD`. Unset, `null`, or not a day, the calendar opens on today. A day set from outside moves the calendar to its month and marks it.']
  - ['`label`', '`string`', '—', "Label text. Only rendered in `read`/`display` mode, next to the static value — `edit` mode's calendar grid has no label."]
  - ['`selectRange`', '`boolean`', '`false`', 'When `true`, renders start/end date text inputs above the calendar and switches day selection to range mode. See below.']
  - ['`mode`', "`'edit' | 'read' | 'display'`", "`'edit'`", 'See [Modes](#modes) below.']
  - ['`validation`', '`{ errorMessage: string }`', "`{ errorMessage: '' }`", 'Static error message shown below the field.']
  - ['`errors`', '`string[]`', '—', 'Dynamic validation errors (e.g. from a trigger). Takes precedence over `validation.errorMessage` whenever the list is non-empty.']
---
::

`ADatePicker` also accepts the shared `uuid`, `required`, and `mask` props defined on `ComponentProps`, but none of them are read by this component — there's no `id`/`for` pair, no native `required` attribute, and no input mask applied to the calendar grid.

### Modes

::api-data-table
---
headers: ['Mode', 'Rendering']
rows:
  - ['`edit`', 'Interactive calendar grid with previous/next month navigation. If `selectRange` is set, also renders editable start/end date text inputs above the grid.']
  - ['`read`', 'Static text — same rendering as `display`. There is no separate disabled-but-visible calendar.']
  - ['`display`', "Static text: the selected day in the user's locale format (empty string if unset, `Invalid Date` if not a `YYYY-MM-DD` day), followed by `label` if one was given."]
---
::

### Range selection

When `selectRange` is `true`, clicking a day sets the range's start date; the next click sets the end date (a click before the current start date replaces the start instead). Hovering a day while a start date is set previews the in-between range with a lighter highlight. The start/end text inputs above the grid show each picked day as the user's locale writes it in numbers, in Gregorian years and Western digits. They can be typed into in that form or as `YYYY-MM-DD`; any other text, a day that does not exist, or an empty value clears that end of the range on blur or <kbd>Enter</kbd>.

### Events

::api-data-table
---
headers: ['Event', 'Payload', 'Description']
rows:
  - ['`get-date`', '`{ start: string | null; end: string | null; selected: string }`', "Emitted whenever a date is selected on the grid or entered into the start/end inputs, each day as `YYYY-MM-DD`. `start`/`end` are always `null` unless `selectRange` is `true`."]
---
::

## Accessibility

The grid is one <kbd>Tab</kbd> stop, on the picked day (or today). From there:

- the arrow keys move a day or a week, crossing into the next or previous month;
- <kbd>Page Up</kbd> and <kbd>Page Down</kbd> move a month, and with <kbd>Shift</kbd> a year;
- <kbd>Home</kbd> and <kbd>End</kbd> go to the week's Monday and Sunday;
- <kbd>Enter</kbd> or <kbd>Space</kbd> picks the focused day.

The previous/next month arrows are for the mouse, and carry the <kbd>Tab</kbd> stop to the same day of the month shown. In range mode the start and end text inputs keep their own arrow keys. The calendar takes no focus when it appears, so a field that opens it keeps focus in its own box.

For screen readers the calendar is a `grid` named by its month and year, and each day is named by its full date in the user's locale. The picked days are marked selected (`aria-selected`), and today is marked as the current date (`aria-current="date"`).

Source: [`aform/src/components/form/ADatePicker.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ADatePicker.vue)
