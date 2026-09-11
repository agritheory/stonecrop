---
title: Table Loading
description: Loading-state placeholders shown while a table's data is being fetched.
---

# Table Loading

`ATableLoading` and `ATableLoadingBar` are two loading-state placeholders meant to stand in for [Table](/components/table) while its data is being fetched — swap between the loading component and `ATable` with `v-show`/`v-if` on your own loading flag.

## Import

```ts
import { ATableLoading, ATableLoadingBar } from '@stonecrop/atable'
```

## Basic

Both accept slot content as their loading message; neither takes props. `ATableLoading` renders a centered block placeholder, `ATableLoadingBar` a thin animated progress bar.

::demo-panel
:::client-only
:table-loading-demo
:::

#code
```vue
<script setup lang="ts">
import { ATableLoading, ATableLoadingBar } from '@stonecrop/atable'
</script>

<template>
	<ATableLoading>Loading table…</ATableLoading>
	<ATableLoadingBar>Loading table…</ATableLoadingBar>
</template>
```
::

## Usage alongside Table

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ATable, ATableLoading, type TableRow, type TableColumn } from '@stonecrop/atable'

const loading = ref(true)
const rows = ref<TableRow[]>([])
const columns = ref<TableColumn[]>([])

onMounted(async () => {
	rows.value = await fetchRows()
	loading.value = false
})
</script>

<template>
	<ATableLoading v-if="loading">Loading…</ATableLoading>
	<ATable v-else v-model:rows="rows" v-model:columns="columns" />
</template>
```

## API Reference

### Props

Neither component takes props — both render their default slot as the loading message.

## Accessibility

Neither component sets `role="status"`, `aria-live`, or any other attribute that would announce the loading state to a screen reader — the message is only conveyed visually, and to sighted users via the animated bar/pulse.

Source: [`atable/src/components/ATableLoading.vue`](https://github.com/agritheory/stonecrop/blob/development/atable/src/components/ATableLoading.vue), [`atable/src/components/ATableLoadingBar.vue`](https://github.com/agritheory/stonecrop/blob/development/atable/src/components/ATableLoadingBar.vue)
