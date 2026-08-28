---
title: Fieldset
description: A collapsible container that groups a set of nested fields under a legend.
---

# Fieldset

`AFieldset` groups a set of related fields under a native `<fieldset>`/`<legend>`, optionally letting the whole group be collapsed and expanded. Inside an [AForm](/reference/aform) schema it renders its children through a nested `AForm`; used directly, its default slot can be filled with any content instead.

## Import

```ts
import { AFieldset } from '@stonecrop/aform'
```

## Basic

This demo fills `AFieldset`'s default slot directly with a few plain text fields, rather than letting it render its built-in nested `AForm`. The slot exposes a `collapsed` boolean — click the legend to toggle it.

::demo-panel
:::client-only
:fieldset-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AFieldset, ATextInput } from '@stonecrop/aform'

// Direct imports, not via AForm/schema resolution — same as CheckboxDemo.vue and CurrencyDemo.vue.
// AFieldset's default slot is filled directly with plain fields instead of relying on its built-in
// `<AForm :schema="schema" />` fallback, so no schema-string resolution is involved here either.
// `schema` is still a required prop on AFieldset, but it's unused once the slot is overridden — an
// empty array satisfies the prop without powering any rendering.
const firstName = ref('')
const lastName = ref('')
const email = ref('')
</script>

<template>
	<div class="stonecrop-demo">
		<AFieldset label="Contact Information" :collapsible="true" :schema="[]" v-slot="{ collapsed }">
			<div v-show="!collapsed" class="stonecrop-demo__fields">
				<ATextInput v-model="firstName" label="First Name" uuid="fieldset-demo-first-name" />
				<ATextInput v-model="lastName" label="Last Name" uuid="fieldset-demo-last-name" />
				<ATextInput v-model="email" label="Email" uuid="fieldset-demo-email" />
			</div>
		</AFieldset>
		<p class="stonecrop-demo__state">Click the legend to collapse or expand the fieldset.</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__fields {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	width: 100%;
}

.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
```
::

## Usage in a schema

`AFieldset` is usually resolved by `AForm` from a schema field with `kind: 'fieldset'`, which nests a `schema` array of its own child fields:

```ts
const schema = [
	{
		fieldname: 'personal_info',
		kind: 'fieldset',
		component: 'AFieldset',
		label: 'Personal Information',
		collapsible: true,
		schema: [
			{ fieldname: 'first_name', kind: 'field', component: 'ATextInput', label: 'First Name' },
			{ fieldname: 'last_name', kind: 'field', component: 'ATextInput', label: 'Last Name' },
			{ fieldname: 'age', kind: 'field', component: 'ANumericInput', label: 'Age' },
		],
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({
	personal_info: { first_name: '', last_name: '', age: null },
})
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
  - ['`schema`', '`ResolvedField[]`', '—', 'Child fields rendered by the built-in nested `AForm` when the default slot is not overridden. Required, even if a custom slot makes it unused.']
  - ['`label`', '`string`', '—', 'Legend text. The `<legend>` element only renders at all when `label` or `collapsible` is set.']
  - ['`collapsible`', '`boolean`', '—', "Whether clicking the legend toggles the group's collapsed state. Falsy (no toggle) when omitted."]
  - ['`data`', '`Record<string, any>`', '`{}`', 'Data object passed to the built-in nested `AForm`.']
  - ['`mode`', '`InteractionMode`', "`'edit'`", "Interaction mode forwarded to the built-in nested `AForm` (and, via the default slot's `AForm`, to every child field)."]
---
::

The default slot receives a `{ collapsed }` scope prop, so custom slot content can react to the collapsed state itself (as in the demo above) instead of relying on the built-in nested `AForm`. `AFieldset` also exposes its internal `collapsed` ref via `defineExpose`, for parent components holding a template ref to it.

## Accessibility

The legend is a native `<legend>` inside a native `<fieldset>`, so screen readers announce it as the group's accessible name for every field inside. When `collapsible` is set, the legend is also a click target that toggles visibility of the group's contents — this toggle is implemented with a `click`/`submit` handler on the `<legend>` itself rather than a `<button>`, so it is only reachable by pointer, not by keyboard focus.

Source: [`aform/src/components/form/AFieldset.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/AFieldset.vue)
