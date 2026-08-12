---
title: Date Time
description: A standalone hours:minutes:seconds time-of-day input with a 12-hour AM/PM or 24-hour toggle.
---

# Date Time

`ADateTime` renders a compact time-of-day input — separate numeric segments for hours, minutes, and (optionally) seconds, plus an AM/PM selector or a 24-hour "military time" segment. It communicates purely through an emitted `get-time` event rather than a `v-model`, so it's most often composed inside a higher-level field like [`ADateSelection`](/components/date-selection) rather than used standalone.

## Import

```ts
import { ADateTime } from '@stonecrop/aform'
```

## Basic

`ADateTime` has no `v-model` — it emits a `get-time` event with the current hours, minutes, seconds, and meridiem whenever a segment is confirmed (on blur, Enter, or the arrow-key increment/decrement handlers). Try editing a segment below.

<DemoPanel>

<ClientOnly>
	<DateTimeDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/DateTimeDemo.vue

</template>

</DemoPanel>

## Usage in a schema

`ADateTime` is registered as a schema-resolvable component — for example `@stonecrop/schema` maps a GraphQL `DateTime` scalar to `component: 'ADateTime'` — and can be referenced from an AForm schema field:

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

Because `ADateTime` has no `v-model`, mounting it this way does not wire `created_at` to the input automatically — pair it with a `@get-time` listener at the call site to capture changes, the same way the standalone demo above does.

## API Reference

### Props

<ApiTable>

| Name                | Type      | Default | Description                                                                             |
| -------------------- | ----------- | --------- | ------------------------------------------------------------------------------------------- |
| `allowMilitaryTime`   | `boolean` | `false`   | Renders a single 24-hour hours segment instead of a 12-hour segment plus AM/PM selector. |
| `defaultHours`        | `number`  | `12`      | Initial value of the hours segment.                                                     |
| `defaultMinutes`      | `number`  | `0`       | Initial value of the minutes segment.                                                   |
| `defaultSeconds`      | `number`  | `0`       | Initial value of the seconds segment (only rendered when `useSeconds` is `true`).        |
| `defaultMeridiem`     | `string`  | `'AM'`    | Initial AM/PM selector value; any value other than `'AM'` resolves to `'PM'`.            |
| `useSeconds`          | `boolean` | `true`    | Whether to render the seconds segment.                                                  |

</ApiTable>

### Events

<ApiTable>

| Name       | Payload                                                                                       | Description                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `get-time` | `{ hours: number; minutes: number; seconds: number; meridiem: string; militaryTime: number }` | Emitted once on mount, and again whenever a segment is confirmed. `militaryTime` is always the 24-hour hour value, regardless of `allowMilitaryTime`. |

</ApiTable>

## Accessibility

Each segment is a native `<input type="text" inputmode="numeric">`, which prompts a numeric keyboard on mobile devices. Focusing a segment selects its existing text for easy overtyping, and the Up/Down arrow keys increment or decrement the focused segment, rolling over into adjacent segments (and toggling AM/PM) at the 12/24-hour and 59-minute/second boundaries. The AM/PM control is a native `<select>`, so it remains reachable and operable with standard keyboard interaction. `ADateTime` does not accept a `label` prop and has no `id`/`for` pairing of its own — an accessible name for the group must be supplied by the surrounding context (for example a wrapping `<fieldset>`/`<legend>` or an `aria-label` added by the consumer).

Source: [`aform/src/components/form/ADateTime.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ADateTime.vue)
