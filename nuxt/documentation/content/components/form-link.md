---
title: Form Link
description: An autocomplete input for selecting a linked (foreign-key) record.
---

# Form Link

`AFormLink` renders a foreign-key reference to another record — a search box that resolves free text to a linked document via a `filterFunction`, plus an optional arrow to navigate to the linked record. It's the component `ACurrencyInput` embeds internally for its own currency picker, and the component `resolveSchema()` assigns automatically to any field carrying an unresolved `doctype` marker.

## Import

```ts
import { AFormLink } from '@stonecrop/aform'
```

## Basic

`v-model` binds to an [`AFormLinkValue`](#afformlinkvalue). Type into the box to filter the list below it — try "eu" or "am".

::demo-panel
:::client-only
:form-link-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AFormLink } from '@stonecrop/aform'
import type { AFormLinkValue } from '@stonecrop/aform'

// Direct import, not via AForm — AForm resolves schema fields by string name through Vue's
// dynamic component registry, which needs @stonecrop/aform's `install` plugin registered on
// the app instance first. Direct imports skip that requirement, same as CheckboxDemo.vue.
const TERRITORIES: AFormLinkValue[] = [
	{ id: 'TERR-001', displayText: 'North America' },
	{ id: 'TERR-002', displayText: 'Europe' },
	{ id: 'TERR-003', displayText: 'Asia Pacific' },
	{ id: 'TERR-004', displayText: 'Latin America' },
	{ id: 'TERR-005', displayText: 'Middle East & Africa' },
]

const filterFunction = (search: string) =>
	TERRITORIES.filter(t => t.displayText!.toLowerCase().includes(search.toLowerCase()))

const territory = ref<AFormLinkValue>({ id: 'TERR-001', displayText: 'North America' })
</script>

<template>
	<div class="stonecrop-demo">
		<AFormLink
			v-model="territory"
			label="Territory"
			doctype="territory"
			uuid="form-link-demo"
			:filterFunction="filterFunction" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ territory }}</strong>
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

`AFormLink` is usually resolved by `AForm` from a schema field carrying a `doctype` marker, rather than used directly. `resolveSchema()` assigns `component: 'AFormLink'` automatically to any field that has a `doctype` but no matching `links` entry and no explicit `component`:

```ts
const schema = [
	{
		fieldname: 'territory',
		kind: 'field',
		component: 'AFormLink',
		label: 'Territory',
		doctype: 'territory',
		options: {
			filterFunction: (search: string) => searchTerritories(search),
		},
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({ territory: { id: '', displayText: '' } })
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
  - ['`v-model`', '[`AFormLinkValue`](#afformlinkvalue)', "`{ id: '', displayText: '' }`", 'The selected linked record.']
  - ['`label`', '`string`', '—', 'Label text rendered below the input. Suppressed when `embedded` is `true` (see [Accessibility](#accessibility)).']
  - ['`doctype`', '`string`', '—', 'Target doctype slug. Used for FK display-text resolution (via the injected `aformLinkResolver`) and for navigation.']
  - ['`filterFunction`', '`(search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>`', '—', 'Search function backing the autocomplete dropdown. Without it, the dropdown never opens.']
  - ['`isAsync`', '`boolean`', '`false`', 'Whether `filterFunction` results should show a loading state (`Loading…`) while resolving.']
  - ['`formatter`', '`(value: AFormLinkValue) => string`', '—', "Custom transform for the text shown in the input and in `display` mode — e.g. `ACurrencyInput` uses this to render a symbol."]
  - ['`icon`', "`'arrow-right' | 'chevron-right'`", "`'arrow-right'`", 'Glyph for the navigate button (→ or ›).']
  - ['`disabled`', '`boolean`', '`false`', 'Disables the input and hides the navigate button.']
  - ['`embedded`', '`boolean`', '`false`', "Bare rendering for compositing into another component's own bordered container (e.g. `ACurrencyInput`'s merged amount+currency group) — suppresses this component's own border and floating label."]
  - ['`placeholder`', '`string`', '—', 'Placeholder text for the input.']
  - ['`ariaLabel`', '`string`', '—', 'Accessible name for the input. Effectively required when `embedded` is `true`, since the visible `label` is suppressed there.']
  - ['`required`', '`boolean`', '`false`', "Sets the native `required` attribute on the input (`edit` mode only)."]
  - ['`mode`', "`'edit' | 'read' | 'display'`", "`'edit'`", 'See [Modes](#modes) below.']
  - ['`uuid`', '`string`', 'auto-generated', "Used to build the autocomplete listbox's id, wired to the input via `aria-controls`/`aria-activedescendant`."]
---
::

`AFormLink` also participates in navigation: when `doctype` is set and an `aformLinkNavigator` has been provided (via `app.provide('aformLinkNavigator', { navigate(doctype, id) { ... } })`), the arrow button calls it with the linked record's doctype and id. Without a provided navigator, the arrow still renders whenever the field holds a valid id, but clicks are no-ops.

### AFormLinkValue

::api-data-table
---
headers: ['Field', 'Type', 'Description']
rows:
  - ['`id`', '`string | number`', "The linked record's ID. `id: 0` is a valid id — only `''`/`null`/`undefined` count as empty."]
  - ['`displayText`', '`string`', 'Text shown in the input. Falls back to `String(id)` if omitted.']
  - ['`[extra: string]`', '`any`', "Additional properties carried on the value and passed through to `formatter` (e.g. `ACurrencyInput`'s `symbol`)."]
---
::

### Modes

::api-data-table
---
headers: ['Mode', 'Rendering']
rows:
  - ['`edit`', 'Interactive input. Dropdown opens on focus or typing (if `filterFunction` is set). Navigate arrow shown when the value has a valid id.']
  - ['`read`', 'Input disabled; dropdown never opens even on focus. Navigate arrow still shown when the value has a valid id.']
  - ['`display`', 'Static text only — the formatted value, or `—` when the value has no id. No input, no navigate arrow.']
---
::

## Accessibility

The input has `role="combobox"` with `aria-autocomplete="list"`, and toggles `aria-expanded`; the dropdown is a `role="listbox"` linked via `aria-controls`, with each option as `role="option"` and the highlighted option tracked with `aria-activedescendant`/`aria-selected`. Arrow Down/Up move the highlighted option, Enter selects it, and Escape (or a click outside) closes the dropdown and reverts the input's text to the current value. Unlike other Stonecrop field components, the visible `label` is rendered next to the input rather than wrapping it or being linked via `for`/`id` — pass `ariaLabel` for a dependable accessible name, which is effectively required in `embedded` mode since the visible label is suppressed there entirely.

Source: [`aform/src/components/form/AFormLink.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/AFormLink.vue)
