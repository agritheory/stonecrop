---
title: Form Loading
description: A loading-state placeholder shown while a form's data is being fetched or resolved.
---

<script setup lang="ts">
const propsHeaders = ["Name", "Type", "Default", "Description"]
const propsRows = [
	["—", "—", "—", "`AFormLoading` accepts no props."],
]

const slotsHeaders = ["Name", "Description"]
const slotsRows = [
	["`default`", "Loading message text. When non-empty, an animated `...` suffix is appended automatically."],
]
</script>

# Form Loading

`AFormLoading` is a presentational placeholder — an animated bar with an optional label — meant to stand in for a form or fieldset while its data is still being fetched or resolved. It takes no props; toggle its visibility (e.g. with `v-show`/`v-if`) alongside the form or fieldset it's covering for.

## Import

```ts
import { AFormLoading } from '@stonecrop/aform'
```

## Basic

Mount `AFormLoading` directly, with the loading message as its default slot content. Its bar-sweep and ellipsis animate continuously via CSS — no props or timers are required for the animation itself (the timer below is only there to swap the demo back to a "loaded" state so you can replay it).

<DemoPanel>

<ClientOnly>
	<FormLoadingDemo />
</ClientOnly>

<template #code>

<<< ../.vitepress/theme/demos/FormLoadingDemo.vue

</template>

</DemoPanel>

## API Reference

### Props

<ApiDataTable :headers="propsHeaders" :rows="propsRows" />

### Slots

<ApiDataTable :headers="slotsHeaders" :rows="slotsRows" />

## Accessibility

`AFormLoading` renders plain `<div>`s with no `role`, `aria-live`, or `aria-busy` attribute, so its appearance and disappearance are not announced to assistive technology on their own — a consumer that toggles it in place of a form should also manage focus or an `aria-live` region if that announcement matters.

Source: [`aform/src/components/AFormLoading.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/AFormLoading.vue)
