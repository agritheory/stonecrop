---
title: Semver Input
description: A semantic version text field with parsed major, minor, and patch parts.
---

# Semver Input

`ASemverInput` is a single-line version field built on [`ATextInput`](./text-input). The user types a semver string (including optional `v`, prerelease, and build metadata). The component keeps that string in `raw` and derives `major`, `minor`, and `patch` for the framework. Those parts are not shown in the form UI.

## Import

```ts
import { ASemverInput } from '@stonecrop/aform'
```

## Basic

`v-model` binds to a [`SemverValue`](#semvervalue) object. Try editing the string and watch the parsed parts update in the state dump below the field.

::demo-panel
:::client-only
:semver-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ASemverInput } from '@stonecrop/aform'

const version = ref({
	raw: '1.2.3-pre.1',
	major: 1,
	minor: 2,
	patch: 3,
})
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
	version: { raw: '', major: 0, minor: 0, patch: 0 },
})
</script>

<template>
	<AForm :schema="schema" v-model:data="data" />
</template>
```

## Mask

By default the field uses the named mask `semver`, which filters input to semver-safe characters without placeholders or a fixed width. Override with the schema `mask` property when you need a fixed `#` template instead (same engine as [`ATextInput`](./text-input)).

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`v-model`', '[`SemverValue`](#semvervalue)', 'see below', 'The typed version string and derived major/minor/patch parts.']
  - ['`label`', '`string`', '—', 'Label for the text input.']
  - ['`mask`', '`string`', "`'semver'`", "Input mask. Defaults to the semver charset filter; pass a `#` template to use the classic mask engine instead."]
  - ['`required`', '`boolean`', '`false`', 'Marks the input as required (`edit` mode only).']
  - ['`mode`', "`'edit' | 'read' | 'display'`", "`'edit'`", 'See [Modes](#modes) below.']
  - ['`uuid`', '`string`', 'none', "`id`/`for` pair linking the input to its label."]
  - ['`validation`', '`{ errorMessage: string }`', "`{ errorMessage: '' }`", 'Static error message shown below the field.']
  - ['`errors`', '`string[]`', '—', 'Dynamic validation errors. Takes precedence over `validation.errorMessage` when non-empty.']
---
::

### SemverValue

::api-data-table
---
headers: ['Field', 'Type', 'Description']
rows:
  - ['`raw`', '`string`', 'The entered version string, including optional `v`, prerelease, and build metadata.']
  - ['`major`', '`number`', 'Parsed major version.']
  - ['`minor`', '`number`', 'Parsed minor version — `0` when omitted from `raw`.']
  - ['`patch`', '`number`', 'Parsed patch version — `0` when omitted from `raw`.']
---
::

### Modes

::api-data-table
---
headers: ['Mode', 'Rendering']
rows:
  - ['`edit`', 'Interactive text input with the semver mask applied.']
  - ['`read`', 'Same layout, input disabled.']
  - ['`display`', 'Static text showing `raw`.']
---
::

## Accessibility

The input and its label are linked via `id`/`for` (backed by `uuid`). The field is a native text input, so keyboard and screen reader behavior matches [`ATextInput`](./text-input).

Source: [`aform/src/components/form/ASemverInput.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/form/ASemverInput.vue)
