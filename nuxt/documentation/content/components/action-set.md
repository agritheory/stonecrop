---
title: Action Set
description: Tile column and drawer UI for actions, host slots, and preview flyins.
---

# Action Set

`ActionSet` is the fixed-position tile column rendered by [`Desktop`](/reference/desktop). It exposes Search (opens the command palette), host-configured drawer slots, and an Actions tab that lists FSM transitions and commands from the active record.

Use `Desktop` with `:action-set-slots` for custom panels, and `useActionSet()` inside slot components to open preview flyins. For pages that are not standard doctype views (e.g. DocBuilder), pass `:host-actions` and fill Desktop's default slot.

## Import

```ts
import { Desktop, useActionSet, ActionSetIconFiles, type ActionSetSlot, type ActionElements } from '@stonecrop/desktop'
```

## Basic (via Desktop)

FSM actions are derived automatically on record views. Host pages can supply custom actions with `:host-actions`:

::demo-panel
:::client-only
:action-set-demo
:::

#code
```vue
<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { Registry, Stonecrop } from '@stonecrop/stonecrop'
import { Desktop, type ActionElements } from '@stonecrop/desktop'

const registry = new Registry()
const stonecrop = new Stonecrop(registry)
provide('$registry', registry)
provide('$stonecrop', stonecrop)

const lastAction = ref('')
const hostActions = computed<ActionElements[]>(() => [
	{ type: 'button', label: 'Save', action: () => (lastAction.value = 'Save') },
	{
		type: 'dropdown',
		label: 'More',
		actions: [
			{ label: 'Duplicate', action: () => (lastAction.value = 'Duplicate') },
			{ label: 'Delete', action: () => (lastAction.value = 'Delete') },
		],
	},
])

const routeAdapter = {
	getCurrentDoctype: () => '',
	getCurrentRecordId: () => '',
	getCurrentView: () => 'doctypes' as const,
	navigate: () => {},
}
</script>

<template>
	<Desktop class="action-set-demo-desktop" :route-adapter="routeAdapter" :host-actions="hostActions">
		<p>Document content. Open the Actions tile to run host actions.</p>
		<p v-if="lastAction">Last action: <strong>{{ lastAction }}</strong></p>
	</Desktop>
</template>
```
::

## Custom slots

Pass `:action-set-slots` to Desktop. Each slot can provide an icon, label, optional badge, and a component rendered in the drawer:

```vue
const actionSetSlots = computed<ActionSetSlot[]>(() => [
	{ id: 'files', label: 'Files', icon: ActionSetIconFiles, component: FilesPanel },
])
```

Inside a slot component, call `useActionSet().present({ view, props })` to open the 50% preview pane.

## API Reference

### Desktop props (ActionSet integration)

::api-data-table
---
headers: ['Name', 'Type', 'Description']
rows:
  - ['`actionSetSlots`', '`ActionSetSlot[]`', 'Host drawer slots shown as tiles alongside Search and Actions.']
  - ['`hostActions`', '`ActionElements[]`', 'Custom action list when using Desktop `#default` slot (replaces FSM-derived actions).']
---
::

### ActionSetContext (`useActionSet()`)

::api-data-table
---
headers: ['Member', 'Description']
rows:
  - ['`doctype`', 'Computed ref of the active doctype.']
  - ['`recordId`', 'Computed ref of the active record id.']
  - ['`activeSlotId`', 'Currently open host slot, or null.']
  - ['`present(subject)`', 'Open a preview flyin with `ActionSetPreview` `{ view, props?, id? }`.']
  - ['`closePreview()`', 'Close the preview pane.']
  - ['`close()`', 'Close the drawer and preview.']
---
::

### Types

`ActionElements` remains `ButtonElement | DropdownElement` — same shape used in the Actions drawer list.

## Accessibility

Tiles and drawer tabs are plain `<button>` elements with `aria-label` set from slot labels. The drawer uses `role="dialog"`. Preview pane close is a labeled button.

Source: [`desktop/src/components/ActionSet.vue`](https://github.com/agritheory/stonecrop/blob/development/desktop/src/components/ActionSet.vue)
