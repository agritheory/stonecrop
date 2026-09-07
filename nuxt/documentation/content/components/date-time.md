---
title: Date Time
description: The segmented time-of-day input, and the schema-resolvable date-and-time field built on it.
---

# Date Time

Two components share this page, because they are two levels of the same control.

`ADateTimeInput` renders a compact time-of-day input: separate numeric segments for hours, minutes, and (optionally) seconds, plus an AM/PM selector or a 24-hour "military time" segment. It has no `v-model` and communicates through an emitted `get-time` event, so it is most often composed inside a higher-level field such as [`ADateSelection`](/components/date-selection) rather than used on its own.

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

`ADateTime` declares a `v-model` of `string | Date`, so mounting it this way wires `created_at` to the field and no extra listener is needed. Clicking the input opens an `ADateSelection` picker, and the chosen date and time are written back through the model.

## API Reference

The tables below describe `ADateTimeInput`. `ADateTime` takes the shared `ComponentProps` (`label`, `mode`, `uuid`, and the rest) plus `allowMilitaryTime` and `useSeconds`, which it forwards to the picker.

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
---
::

### Events

::api-data-table
---
headers: ['Name', 'Payload', 'Description']
rows:
  - ['`get-time`', "`{ hours: number; minutes: number; seconds: number; meridiem: string; militaryTime: number; source: 'init' | 'user' }`", 'Carries the current value rather than a commit. Emitted once on mount and again on every blur, Enter, arrow key, and meridiem change, so `source` is what separates the start-up announcement from a real edit. `militaryTime` is always the 24-hour hour value, regardless of `allowMilitaryTime`.']
---
::

## Accessibility

Each segment is a native `<input type="text" inputmode="numeric">`, which prompts a numeric keyboard on mobile devices. Focusing a segment selects its existing text for easy overtyping, and the Up/Down arrow keys increment or decrement the focused segment, rolling over into adjacent segments (and toggling AM/PM) at the 12/24-hour and 59-minute/second boundaries. The AM/PM control is a native `<select>`, so it remains reachable and operable with standard keyboard interaction. `ADateTimeInput` does not accept a `label` prop and has no `id`/`for` pairing of its own, so an accessible name for the group must be supplied by the surrounding context (for example a wrapping `<fieldset>`/`<legend>`, or an `aria-label` added by the consumer). `ADateTime` does take a `label` and pairs it with the input it renders.

Source: [`aform/src/components/form/ADateTimeInput.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ADateTimeInput.vue) and [`aform/src/components/form/ADateTime.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ADateTime.vue)
