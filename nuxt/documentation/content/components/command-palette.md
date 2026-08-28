---
title: Command Palette
description: A generic keyboard-navigable search overlay for locating and jumping to items.
---

# Command Palette

`CommandPalette` is a generic, teleported search overlay — a text input over a scored/filtered result list, fully keyboard-navigable. It's generic over the result type `T` and takes a synchronous `search(query) => T[]` function, so it can search anything: pages, records, commands. This site's own [search](/) (press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd>) is built on this exact component.

## Import

```ts
import { CommandPalette } from '@stonecrop/desktop'
```

## Basic

Provide `isOpen` (toggle it from a button or a keyboard shortcut) and a `search` function; render each result via the `title`/`content` slots.

::demo-panel
:::client-only
:command-palette-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CommandPalette } from '@stonecrop/desktop'

interface Fruit {
	name: string
	color: string
}

const fruits: Fruit[] = [
	{ name: 'Apple', color: 'Red' },
	{ name: 'Banana', color: 'Yellow' },
	{ name: 'Grape', color: 'Purple' },
	{ name: 'Kiwi', color: 'Green' },
	{ name: 'Mango', color: 'Orange' },
]

const isOpen = ref(false)

const search = (query: string): Fruit[] => {
	const q = query.toLowerCase()
	return fruits.filter(f => f.name.toLowerCase().includes(q))
}

const onSelect = (fruit: Fruit) => {
	isOpen.value = false
}
</script>

<template>
	<button @click="isOpen = true">Open Command Palette</button>
	<CommandPalette :is-open="isOpen" :search="search" placeholder="Search fruit…" @select="onSelect" @close="isOpen = false">
		<template #title="{ result }">{{ result.name }}</template>
		<template #content="{ result }">{{ result.color }}</template>
		<template #empty>No fruit found</template>
	</CommandPalette>
</template>
```
::

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`search`', '`(query: string) => T[]`', '— (required)', 'Synchronous search function; called on every keystroke with the current query.']
  - ['`isOpen`', '`boolean`', '`false`', 'Whether the overlay is shown. Opening resets the query and focuses the input.']
  - ['`placeholder`', '`string`', "`'Type a command or search...'`", 'Input placeholder text.']
  - ['`maxResults`', '`number`', '`10`', "Caps how many of `search`'s results are rendered."]
---
::

### Emits

::api-data-table
---
headers: ['Name', 'Payload', 'Description']
rows:
  - ['`select`', '`T`', 'The highlighted or clicked result — fires on Enter or click.']
  - ['`close`', 'none', 'Fires on Escape or a click outside the overlay.']
---
::

### Slots

::api-data-table
---
headers: ['Name', 'Scope', 'Description']
rows:
  - ['`title`', '`{ result: T }`', 'Primary line for a result row.']
  - ['`content`', '`{ result: T }`', 'Secondary line for a result row.']
  - ['`empty`', '—', "Shown when the query is non-empty and `search` returns no results. Defaults to \"No results found for '...'\"."]
---
::

## Accessibility

The overlay is keyboard-first: <kbd>↓</kbd>/<kbd>↑</kbd> move the highlighted result, <kbd>Enter</kbd> selects it, and <kbd>Escape</kbd> closes the overlay. The text input receives focus automatically when the overlay opens. The current source sets no `role` (e.g. `dialog`/`listbox`) or `aria-*` attributes on the overlay or its result list, so a screen reader doesn't announce it as a modal or its result count — the interaction relies on visible text and focus movement alone.

Source: [`desktop/src/components/CommandPalette.vue`](https://github.com/agritheory/stonecrop/blob/development/desktop/src/components/CommandPalette.vue)
