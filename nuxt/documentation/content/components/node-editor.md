---
title: Node Editor
description: A visual, drag-and-drop editor for finite-state-machine workflows.
---

# Node Editor

`StateEditor` is a visual editor for a doctype's [FSM workflow](/explanation/doctype) — states as draggable nodes, actions as connecting edges — built on [`@vue-flow/core`](https://vueflow.dev/). It's the practical entry point into `@stonecrop/node-editor`: it derives nodes/edges from a `WorkflowMeta` object (states + actions) and an optional saved node `Layout`, so you don't have to hand-build the underlying flow-element graph yourself. `NodeEditor` (the lower-level component `StateEditor` wraps) is exported too, for cases that need direct control over that graph.

## Import

```ts
import { StateEditor } from '@stonecrop/node-editor'
```

## Basic

`v-model` binds the `WorkflowMeta` (states + actions); `layout` supplies saved node positions — without it, positions are auto-computed with a `dagre` layout, and a console warning notes that position changes won't be persisted anywhere.

::demo-panel
:::client-only
:node-editor-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StateEditor, type Layout } from '@stonecrop/node-editor'
import type { WorkflowMeta } from '@stonecrop/schema'

const layout: Layout = {
	idle: { position: { x: 50, y: 50 } },
	loading: { position: { x: 300, y: 50 } },
	failure: { position: { x: 300, y: 200 }, targetPosition: 'right', sourcePosition: 'left' },
	success: { position: { x: 550, y: 50 } },
}

const fetchWorkflow = ref<WorkflowMeta>({
	states: ['idle', 'loading', 'success', 'failure'],
	actions: {
		FETCH: { label: 'FETCH', handler: '', allowedStates: ['idle'], nextState: 'loading' },
		RESOLVE: { label: 'RESOLVE', handler: '', allowedStates: ['loading'], nextState: 'success' },
		REJECT: { label: 'REJECT', handler: '', allowedStates: ['loading'], nextState: 'failure' },
		RETRY: { label: 'RETRY', handler: '', allowedStates: ['failure'], nextState: 'loading' },
	},
})
</script>

<template>
	<StateEditor v-model="fetchWorkflow" :layout="layout" />
</template>
```
::

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`v-model`', '`WorkflowMeta | undefined`', '—', 'The workflow being edited — its `states` list and `actions` map.']
  - ['`layout`', '`Layout | undefined`', '—', "Saved per-state node positions (`v-model:layout` also works, to persist drag changes back out). Warns to the console if omitted — position changes then have nowhere to be written."]
  - ['`nodeContainerClass`', '`HTMLAttributes["class"]`', "`''`", "Extra class(es) applied to each node's container element."]
---
::

### Related export

`NodeEditor` is the lower-level component `StateEditor` renders internally — it works directly against `@vue-flow/core`'s flow-element array (`v-model`-bound) rather than a `WorkflowMeta`, for cases that need to build or transform that graph directly rather than deriving it from a workflow's states/actions.

## Accessibility

`@vue-flow/core` renders nodes and edges as absolutely-positioned `<div>`s manipulated by mouse/touch drag, with no keyboard-accessible alternative for repositioning a node in the current setup — a screen reader or keyboard-only user has no way to move a node or inspect the graph's structure beyond reading each node's visible label text.

Source: [`node_editor/src/components/StateEditor.vue`](https://github.com/agritheory/stonecrop/blob/development/node_editor/src/components/StateEditor.vue)
