---
title: Semver Input
description: A text field that only takes a semantic version, such as 1.4.0 or 2.0.0-rc.1.
---

# Semver Input

`ASemverInput` is a single-line field for a [SemVer 2.0.0](https://semver.org) version: `1.4.0`, `2.0.0-rc.1`, `1.4.0+build.5`. It refuses any keystroke or paste that no version could start with, so the field only ever holds a whole version or nothing.

## Import

```ts
import { ASemverInput } from '@stonecrop/aform'
```

## Basic

`v-model` binds to the version as a string, and to `null` while the box is empty or holds a version still being typed, such as `1.4.`. Try typing `v` or a fourth number: the box refuses them.

::demo-panel
:::client-only
:semver-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ASemverInput } from '@stonecrop/aform'

const version = ref<string | null>('1.2.3-pre.1')
</script>

<template>
	<div class="stonecrop-demo">
		<ASemverInput v-model="version" label="Version" uuid="semver-demo" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ version }}</strong>
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

`ASemverInput` is usually resolved by `AForm` from a schema field with `component: 'ASemverInput'`:

```ts
const schema = [
	{
		fieldname: 'version',
		kind: 'field',
		component: 'ASemverInput',
		label: 'Version',
	},
]
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AForm } from '@stonecrop/aform'

const data = ref({
	version: null,
})
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

## What it accepts

Exactly the [SemVer 2.0.0](https://semver.org) grammar: three numbers without leading zeros, then an optional prerelease after `-` and optional build metadata after `+`. It is the same grammar, and the same ordering, as the `semver` type of the [pg-semver](https://github.com/theory/pg-semver) Postgres extension.

| Typed | The box | `v-model` |
|---|---|---|
| `1.4.0-beta.2` | `1.4.0-beta.2` | `'1.4.0-beta.2'` |
| `1.4.` | `1.4.` | `null`, until the version is whole |
| `v1.4.0`, `01.4.0`, `1.4.0.1`, `1.4.0b1` | refuses the key that breaks the grammar | unchanged |

A value set from outside the field shows as it is, even when it is not a version, so text saved before the field checked it can still be read and fixed.

In [`ATable`](./table), a column with `component: 'ASemverInput'` filters as text and sorts by version precedence: `1.2.0` before `1.10.0`, and `2.0.0-rc.1` before `2.0.0`.

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`v-model`', '`string \| null`', '—', 'The version, or `null` while there is no whole one.']
  - ['`label`', '`string`', '—', 'Label for the text input.']
  - ['`required`', '`boolean`', '`false`', 'Marks the input as required (`edit` mode only).']
  - ['`mode`', "`'edit' | 'read' | 'display'`", "`'edit'`", 'See [Modes](#modes) below.']
  - ['`uuid`', '`string`', 'none', "`id`/`for` pair linking the input to its label."]
  - ['`validation`', '`{ errorMessage: string }`', "`{ errorMessage: '' }`", 'Static error message shown below the field.']
  - ['`errors`', '`string[]`', '—', 'Dynamic validation errors. Takes precedence over `validation.errorMessage` when non-empty.']
---
::

### Modes

::api-data-table
---
headers: ['Mode', 'Rendering']
rows:
  - ['`edit`', 'Text input that refuses edits no version could start with.']
  - ['`read`', 'Same layout, input disabled.']
  - ['`display`', 'Static text showing the version.']
---
::

## Accessibility

The input and its label are linked via `id`/`for` (backed by `uuid`). The field is a native text input, so keyboard and screen reader behavior matches [`ATextInput`](./text-input).

Source: [`aform/src/components/form/ASemverInput.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ASemverInput.vue)
