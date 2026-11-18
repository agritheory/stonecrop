---
title: ABadge
description: A colored status/label chip, resolvable from a plain label or from a stored value against an options map.
---

# ABadge

`ABadge` renders a small colored chip — a status label, typically. It supports two independent ways to get a label: pass `label` (and optionally `variant`/`color`) directly, or pass `value` plus `options` and let `ABadge` resolve the display label and color itself via the same lookup [ADropdown](/components/dropdown) and [Table](/components/table) cells use for badge-colored choice fields. If neither resolves to a non-empty label, `ABadge` renders nothing.

## Import

```ts
import { ABadge } from '@stonecrop/aform'
```

## Basic

Pass `label` and `variant` directly. `variant` is one of five theme-driven colors: `neutral`, `success`, `warning`, `danger`, `brand`.

::demo-panel
:::client-only
:a-badge-demo
:::

#code
```vue
<script setup lang="ts">
import { ABadge } from '@stonecrop/aform'
import type { BadgeVariant } from '@stonecrop/schema'

const variants: BadgeVariant[] = ['neutral', 'success', 'warning', 'danger', 'brand']
</script>

<template>
	<div>
		<ABadge
			v-for="variant in variants"
			:key="variant"
			:label="variant"
			:variant="variant"
			presentation="input-accent" />
	</div>
</template>
```
::

## Resolving from a Value and Options

Instead of a direct `label`, pass `value` (a stored choice) and `options` — a `{ choice: variant }` map, same shape a Select-type field's `options` already carries. `ABadge` looks `value` up in `options` and derives both the label and the variant, so the badge and the field driving it always agree without either side hardcoding color logic.

::demo-panel
:::client-only
:a-badge-options-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ABadge, ADropdown } from '@stonecrop/aform'

const options = {
	Open: 'danger',
	'In Progress': 'warning',
	Closed: 'success',
}

const status = ref('Open')
</script>

<template>
	<div>
		<ADropdown v-model="status" label="Status" :options="Object.keys(options)" mode="edit" />
		<ABadge :value="status" :options="options" presentation="input-accent" />
	</div>
</template>
```
::

An options map entry can also be an object (`{ variant, color, label }`) instead of a bare variant string — useful when a choice needs a custom color or a display label that differs from the stored value.

## In a form

A schema field can name `ABadge` as its component. AForm draws it as a form field: the field's `label` sits above the badge, and the badge shows the value the record holds. It is painted as the field's `format` returns it, else from the field's `options` when they carry a badge for it, else plainly — the same resolution [ADropdown](/components/dropdown) uses. The badge's own `label` is never the field's label.

```ts
const schema = [{ fieldname: 'status', label: 'Status', component: 'ABadge', options: { Open: 'warning', Closed: 'success' } }]
```

A form field shows as `input-accent`. On its own, `ABadge` still defaults to `cell-fill`, and a non-empty `label` still wins over `value`.

## Presentation

`presentation` picks which of two visual treatments the resolved badge gets:

::api-data-table
---
headers: ["Value", "Rendering"]
rows:
  - ["`cell-fill`", "Block-level, full width, fixed to a table row's height — the default, meant for a table cell."]
  - ["`input-accent`", "Inline-sized with a 4px left accent border — meant for standalone use next to or inside a form field."]
---
::

## API Reference

### Props

::api-data-table
---
headers: ["Name", "Type", "Default", "Description"]
rows:
  - ["`label?`", "`string`", "—", "Direct label. Takes precedence over `value`/`options` resolution when non-empty. In a form, the field's label is shown above the badge instead; see In a form above."]
  - ["`variant?`", "`'neutral' | 'success' | 'warning' | 'danger' | 'brand'`", "`'neutral'`", "Theme-driven color, used when resolving from `label` directly."]
  - ["`color?`", "`string`", "—", "Custom color override, used when resolving from `label` directly. Takes precedence over `variant`'s theme color."]
  - ["`presentation?`", "`'cell-fill' | 'input-accent'`", "`'cell-fill'`", "See Presentation above."]
  - ["`value?`", "`unknown`", "—", "Stored field value to resolve against `options` — only used when `label` is empty."]
  - ["`options?`", "`FieldOptions`", "—", "A Select-style `{ choice: variant }` (or `{ choice: { variant, color, label } }`) map, or the structured `{ choices, badges }` form. Passed straight through to the same lookup `ADropdown`/`Table` cells use."]
---
::

## Accessibility

`ABadge` renders a bare `<span>` with only its visible label text and no `role`/`aria-label` — color is the only signal for `variant`, so a screen reader announces just the label, and a colorblind user relying on color alone to distinguish e.g. `warning` from `danger` gets no additional cue beyond the label text itself.

Source: [`aform/src/components/form/ABadge.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ABadge.vue)
