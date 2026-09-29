---
title: Duration
description: A start/end date-time range picker that derives an elapsed duration in ISO 8601.
---

# Duration

`ADuration` pairs a date/time range picker with a live elapsed-duration readout. The user selects a start and end date and time; `v-model` receives the time between them as an ISO 8601 duration such as `PT2H30M`, which Postgres stores in an `interval` column as it is. A day counts as 24 hours. It supports the same `edit` / `read` / `display` interaction modes as every other Stonecrop field component.

## Import

```ts
import { ADuration } from '@stonecrop/aform'
```

## Basic

`v-model` binds to the duration as an ISO 8601 string. Select a start date/time and an end date/time in the picker below, and the duration summary updates automatically.

::demo-panel
:::client-only
:duration-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ADuration } from '@stonecrop/aform'

const duration = ref<string | null>(null)
</script>

<template>
	<div class="stonecrop-demo">
		<ADuration v-model="duration" label="Task Duration" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ duration }}</strong>
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

`ADuration` is usually resolved by `AForm` from a schema field with `component: 'ADuration'`, rather than used directly. Extra field keys such as `allowMilitaryTime` and `useSeconds` are forwarded straight through to the component as props:

```ts
const schema = [
	{
		fieldname: 'task_duration',
		kind: 'field',
		component: 'ADuration',
		label: 'Task Duration',
		allowMilitaryTime: true,
		useSeconds: true,
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ task_duration: null })
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
  - ['`v-model`', '`string | null`', '—', 'The elapsed duration as an ISO 8601 duration (`PT2H30M`), derived from the selected start/end range. `read` and `display` show one it cannot read as "Invalid Duration".']
  - ['`label`', '`string`', "`'Duration'`", 'Label rendered below the picker (`edit` mode) or next to the value (`read`/`display`).']
  - ['`mode`', '`string`', "`'edit'`", "See [Modes](#modes) below. Declared as a plain `string` in the component's own props, not the shared `InteractionMode` union used elsewhere."]
  - ['`allowMilitaryTime`', '`boolean`', '`false`', 'Renders the embedded time pickers in 24-hour format.']
  - ['`useSeconds`', '`boolean`', '`false`', 'Shows a seconds field on the embedded time pickers.']
---
::

`ADuration` does not accept `required`, `uuid`, `validation`, or `errors` — it defines its own narrow prop set rather than the shared `ComponentProps` used by most other field components.

### Modes

::api-data-table
---
headers: ['Mode', 'Rendering']
rows:
  - ['`edit`', 'Interactive start/end date-time range picker (via the internal `ADateSelection`) with a live duration summary below it.']
  - ['`read`', 'Static duration text with the label — rendered identically to `display` mode, since there is no input to disable.']
  - ['`display`', 'Static duration text with the label.']
---
::

## Accessibility

The rendered `<label>` is not associated with a form control via `id`/`for` — unlike other Stonecrop field components, `ADuration` has no single input to anchor it to, since `edit` mode renders a composite range picker and `read`/`display` mode renders plain text. Screen reader users will hear the label and value as adjacent text rather than as a labeled control.

Source: [`aform/src/components/form/ADuration.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ADuration.vue)
