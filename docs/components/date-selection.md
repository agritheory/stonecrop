---
title: Date Selection
description: A combined calendar and time-of-day picker for selecting a single date, a date range, and optional start/end times.
---

<script setup lang="ts">
const propsHeaders = ["Name", "Type", "Default", "Description"]
const propsRows = [
	["`showDate`", "`boolean`", "`true`", "Whether to render the `ADatePicker` calendar."],
	["`showTime`", "`boolean`", "`true`", "Whether to render the (start) `ADateTime` segment."],
	["`selectRange`", "`boolean`", "`true`", "Whether the calendar allows selecting a start/end date range, rather than a single date."],
	["`showEndTime`", "`boolean`", "`false`", 'When `selectRange` and `showTime` are both `true`, also renders a second `ADateTime`, labeled "End time", for the end of the range.'],
	["`allowMilitaryTime`", "`boolean`", "`false`", "Passed through to the `ADateTime` segment(s); renders 24-hour input instead of a 12-hour segment plus AM/PM selector."],
	["`defaultHours`", "`number`", "`12`", "Initial hours value passed to the `ADateTime` segment(s)."],
	["`defaultMinutes`", "`number`", "`0`", "Initial minutes value passed to the `ADateTime` segment(s)."],
	["`defaultSeconds`", "`number`", "`0`", "Initial seconds value passed to the `ADateTime` segment(s)."],
	["`defaultMeridiem`", "`string`", "`'AM'`", "Initial AM/PM value passed to the `ADateTime` segment(s)."],
	["`useSeconds`", "`boolean`", "`true`", "Whether the `ADateTime` segment(s) render a seconds field."],
]

const eventsHeaders = ["Name", "Payload", "Description"]
const eventsRows = [
	["`get-date`", "`{ selected: Date; start?: Date | null; end?: Date | null }`", "Re-emitted from the underlying `ADatePicker` whenever a date (or range endpoint) is picked."],
	["`get-time`", "`{ hours: number; minutes: number; seconds: number; meridiem: string }`", "Re-emitted from the start `ADateTime` whenever its value changes — unless `selectRange` and `showEndTime` are both `true`, in which case time changes feed into `get-range` instead."],
	["`get-range`", "`{ start: Date; end: Date }`", "Emitted only when `selectRange`, `showTime`, and `showEndTime` are all `true`. Merges the picked date range with both time segments into a start/end `Date` pair whenever either time segment changes."],
]
</script>

# Date Selection

`ADateSelection` composes a calendar (`ADatePicker`) with one or two time-of-day inputs (`ADateTime`) into a single widget for picking a date — or a date range — together with a time of day. It underlies higher-level fields like `ADuration` and `ADateRange`, and like `ADateTime`, it communicates purely through emitted events rather than a `v-model`.

## Import

```ts
import { ADateSelection } from '@stonecrop/aform'
```

## Basic

`ADateSelection` has no `v-model` — it emits `get-date` and `get-time` events (and `get-range`, when selecting a range with both start and end times) as the user interacts with the calendar and time segments. The demo below listens for `get-date` and `get-time` and displays the latest values.

<DemoPanel>

<ClientOnly>
	<DateSelectionDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/DateSelectionDemo.vue

</template>

</DemoPanel>

## Usage in a schema

`ADateSelection` is registered as a schema-resolvable component and can be referenced from an AForm schema field by name:

```ts
const schema = [
	{
		fieldname: 'scheduled_for',
		kind: 'field',
		component: 'ADateSelection',
		label: 'Scheduled For',
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ scheduled_for: null })
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

Because `ADateSelection` has no `v-model`, mounting it this way does not wire `scheduled_for` to the picker automatically — pair it with `@get-date` / `@get-time` (or `@get-range`) listeners at the call site to capture changes, the same way the standalone demo above does.

## API Reference

### Props

<ApiDataTable :headers="propsHeaders" :rows="propsRows" />

### Events

<ApiDataTable :headers="eventsHeaders" :rows="eventsRows" />

## Accessibility

The calendar cells inside the composed `ADatePicker` are focusable (`tabindex="0"`) and can be activated with a mouse click or, once focused, the Enter key. The composed `ADateTime` segment(s) support the same numeric-input, arrow-key increment/decrement, and Enter-to-confirm behavior described on the [Date Time](/components/date-time) page. `ADateSelection` does not accept a `label` prop or expose an `id`/`for` pairing of its own — an accessible name for the group must be supplied by the surrounding context.

Source: [`aform/src/components/form/ADateSelection.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ADateSelection.vue)
