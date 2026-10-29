---
title: Action Set
description: Tile column and drawer UI for actions, host slots, and preview flyins.
---

# Action Set

`ActionSet` is the fixed-position tile column rendered by [`Desktop`](/reference/desktop). It exposes Search (opens an inline search panel in the drawer), host-configured drawer slots, and an Actions tab that lists FSM transitions and commands from the active record.

Use `Desktop` with `:action-set-slots` for custom panels, and `useActionSet()` inside slot components to open preview flyins. For pages that are not standard doctype views (e.g. DocBuilder), pass `:host-actions` and fill Desktop's default slot.

## Import

```ts
import { Desktop, useActionSet, ActionSetIconFiles, type ActionSetSlot, type ActionElements } from '@stonecrop/desktop'
```

## Basic (via Desktop)

FSM actions are derived automatically on record views; a list derives none, so an app that wants New there passes it with `:host-actions` on list views only. Host pages can supply custom actions the same way:

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

Inside a slot component, call `useActionSet().present({ view, props })` to open the preview pane beside the drawer. Pass `replacesDrawer: true` to have the preview take the drawer's place instead: the drawer is hidden while the preview is open, and closing the preview (its × button, Escape, or the slot's own tile) shows it again. The slot stays mounted throughout, so a half-written comment or an upload in progress survives. Opening another tile, or navigating to another record, closes the preview.

The pane opens at half the workspace. Its left edge is a separator the user can drag, move with the arrow keys (Home and End for the widest and narrowest) or double-click to reset; the width is kept for the rest of the session.

## API Reference

### Desktop props (ActionSet integration)

::api-data-table
---
headers: ['Name', 'Type', 'Description']
rows:
  - ['`actionSetSlots`', '`ActionSetSlot[]`', 'Host drawer slots shown as tiles alongside Search and Actions.']
  - ['`hostActions`', '`ActionElements[]`', 'Actions listed in the Actions drawer in place of those derived from the doctype; `[]` lists none. A list shows every action its doctype declares, so where a list and its records share a doctype, pass the actions for the list here on list views and leave this unset on others.']
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
  - ['`present(subject)`', 'Open a preview flyin with `ActionSetPreview` `{ view, props?, id?, replacesDrawer? }`. With `replacesDrawer`, the open slot drawer is hidden, not closed, while the preview is shown.']
  - ['`closePreview()`', 'Close the preview pane, showing again a slot drawer it replaced.']
  - ['`close()`', 'Close the drawer and preview.']
---
::

### Types

`ActionElements` remains `ButtonElement | DropdownElement` — same shape used in the Actions drawer list.

## Accessibility

The tile column uses plain `<button>` elements with `aria-label` from each slot label. The expand control exposes `aria-expanded`. The open drawer is a labeled `<aside>` beside the page rather than a modal: focus moves into it on open and returns on close, Tab moves on to the page and the preview, and Escape closes it. Each dropdown group in the Actions list is a labeled `role="group"`. Clicking the active tile again also closes the drawer. Preview pane close is a labeled button.

Source: [`desktop/src/components/ActionSet.vue`](https://github.com/agritheory/stonecrop/blob/development/desktop/src/components/ActionSet.vue)
