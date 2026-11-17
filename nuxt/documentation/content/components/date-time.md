---
title: Date Time
description: The segmented time-of-day input, and the schema-resolvable date-and-time field built on it.
---

# Date Time

Two components share this page, because they are two levels of the same control.

`ADateTimeInput` renders a compact time-of-day input: separate numeric segments for hours, minutes, and (optionally) seconds, plus an AM/PM selector or a 24-hour "military time" segment. Inside a higher-level field such as [`ADateSelection`](/components/date-selection) it reports its value through an emitted `get-time` event. As a form field it binds a time of day with `v-model`, so a doctype can draw a time field with it (see [As a form field](#as-a-form-field)).

`ADateTime` is the field a schema resolves to. It renders a read-only text input that opens an `ADateSelection` picker, and it binds with `v-model`.

## Import

```ts
import { ADateTime, ADateTimeInput } from '@stonecrop/aform'
```

## Basic

`ADateTimeInput` emits `get-time` with the current hours, minutes, seconds, and meridiem whenever a segment is confirmed (on blur, Enter, or the arrow-key increment and decrement handlers). It also fires once as the widget mounts, which is what the `source` field distinguishes. Try editing a segment below.

::demo-panel
:::client-only
:date-time-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ADateTimeInput } from '@stonecrop/aform'

// Direct import, not via AForm — AForm resolves schema fields by string name through Vue's
// dynamic component registry, which needs @stonecrop/aform's `install` plugin registered on
// the app instance first. Direct imports skip that requirement, same as CheckboxDemo.vue.
type TimePayload = {
	hours: number
	minutes: number
	seconds: number
	meridiem: string
	militaryTime: number
	source: 'init' | 'user'
}

const time = ref<TimePayload | null>(null)

const handleTime = (data: TimePayload) => {
	time.value = data
}
</script>

<template>
	<div class="stonecrop-demo">
		<ADateTimeInput :default-hours="9" :default-minutes="30" use-seconds @get-time="handleTime" />
		<p class="stonecrop-demo__state">
			<code>get-time</code> payload: <strong>{{ time }}</strong>
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

`ADateTime`, not `ADateTimeInput`, is the schema-resolvable component: `@stonecrop/schema` maps a GraphQL `DateTime` scalar to `component: 'ADateTime'`, and an AForm schema field can name it directly:

```ts
const schema = [
	{
		fieldname: 'created_at',
		kind: 'field',
		component: 'ADateTime',
		label: 'Created At',
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ created_at: null })
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

`ADateTime` declares a `v-model` of `string | Date | null`, so mounting it this way wires `created_at` to the field and no extra listener is needed. Clicking the input opens an `ADateSelection` picker, and the chosen date and time are written back through the model.

## As a form field

A schema field can name `ADateTimeInput` as its component. AForm binds it to the record's time of day, and it shows the field's `label` above its boxes:

```ts
const schema = [{ fieldname: 'start_time', label: 'Start Time', component: 'ADateTimeInput' }]
```

It reads `HH:MM`, `HH:MM:SS` or Postgres' `HH:MM:SS.ffffff`, and writes `HH:MM:SS`, or `HH:MM` with `useSeconds` off. It writes only when someone changes the time: mounting it, or leaving a box unchanged, leaves the record alone. A record with no time shows empty boxes, and nothing is written until someone types; a box left empty beside one typed in counts from the start of its unit, so `9` in the hours writes `09:00:00`. In `read` mode the boxes are disabled, and in `display` mode the time shows as text.

A widget counts as bound when its caller listens for `update:modelValue`, as `v-model` and AForm do. Without a listener it starts at its `default*` time, as inside `ADateSelection`.

## API Reference

The tables below describe `ADateTimeInput`. `ADateTime` takes the shared `ComponentProps` (`label`, `mode`, `uuid`, and the rest) plus `allowMilitaryTime` and `useSeconds`, which it forwards to the picker. With `useSeconds` off, the field's text leaves out seconds too, and a date picked on an empty field saves the time the picker shows, to the minute.

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`allowMilitaryTime`', '`boolean`', '`false`', 'Renders a single 24-hour hours segment instead of a 12-hour segment plus AM/PM selector.']
  - ['`defaultHours`', '`number`', '`12`', 'Initial value of the hours segment.']
  - ['`defaultMinutes`', '`number`', '`0`', 'Initial value of the minutes segment.']
  - ['`defaultSeconds`', '`number`', '`0`', "Initial value of the seconds segment (only rendered when `useSeconds` is `true`)."]
  - ['`defaultMeridiem`', '`string`', "`'AM'`", "Initial AM/PM selector value; any value other than `'AM'` resolves to `'PM'`."]
  - ['`useSeconds`', '`boolean`', '`true`', 'Whether to render the seconds segment.']
  - ['`modelValue`', '`string | null`', '—', 'The time of day it binds with `v-model`: `HH:MM:SS`, or `HH:MM` with `useSeconds` off. See [As a form field](#as-a-form-field).']
  - ['`label`', '`string`', '—', 'The field label shown above the boxes, paired with the hours box through `uuid`.']
  - ['`mode`', "`'edit' | 'read' | 'display'`", "`'edit'`", '`read` disables the boxes; `display` shows the time as text.']
  - ['`uuid`', '`string`', '—', 'The hours box `id`, which the label points to.']
---
::

### Events

::api-data-table
---
headers: ['Name', 'Payload', 'Description']
rows:
  - ['`update:modelValue`', '`string`', 'The time of day, written when someone changes it. Never written as the widget mounts, or while a bound widget shows an empty time.']
  - ['`get-time`', "`{ hours: number; minutes: number; seconds: number; meridiem: string; militaryTime: number; source: 'init' | 'user' }`", 'Carries the current value rather than a commit. Emitted once on mount and again on every blur, Enter, arrow key, and meridiem change, so `source` is what separates the start-up announcement from a real edit. `militaryTime` is always the 24-hour hour value, regardless of `allowMilitaryTime`.']
---
::

## Accessibility

Each segment is a native `<input type="text" inputmode="numeric">`, which prompts a numeric keyboard on mobile devices. Focusing a segment selects its existing text for easy overtyping, and the Up/Down arrow keys increment or decrement the focused segment, rolling over into adjacent segments (and toggling AM/PM) at the 12/24-hour and 59-minute/second boundaries. A roll-over that crosses noon or midnight is reported once every segment has wrapped, so Up at 11:59 AM reports 12:00 PM. The AM/PM control is a native `<select>`, so it remains reachable and operable with standard keyboard interaction. Given a `label` and a `uuid`, `ADateTimeInput` pairs the label with its hours box, as AForm does for a time field. Without one, an accessible name for the group must be supplied by the surrounding context (for example a wrapping `<fieldset>`/`<legend>`, or an `aria-label` added by the consumer), as inside `ADateSelection`. `ADateTime` does take a `label` and pairs it with the input it renders.

A click, <kbd>Space</kbd>, <kbd>F4</kbd>, <kbd>Alt</kbd>+<kbd>Down</kbd> or <kbd>Down</kbd> on that input opens the picker, and a key also puts focus on the calendar's day, whose keys are on the [Date Picker](/components/date-picker#accessibility) page. Picking a day leaves the picker open for the time. <kbd>Escape</kbd> closes it and returns focus to the input, and it also closes on an outside click or when focus leaves the field. The input is a `combobox` that tells a screen reader it opens a dialog and whether that dialog is open, and the picker is a dialog named by the field's label.

Source: [`aform/src/components/form/ADateTimeInput.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ADateTimeInput.vue) and [`aform/src/components/form/ADateTime.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ADateTime.vue)
