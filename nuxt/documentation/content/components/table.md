---
title: Table
description: A schema-driven data grid with list, tree, and Gantt views.
---

# Table

`ATable` renders a data grid from a `rows`/`columns` pair (both `v-model`-bound), similar to how [AForm](/reference/aform) renders a form from a schema. It supports several distinct view modes — flat lists, hierarchical trees, and Gantt timelines — configured through a single `config` prop, plus optional inline editing, sorting, filtering, and row actions.

## Import

```ts
import { ATable } from '@stonecrop/atable'
```

## Basic

`v-model:rows` and `v-model:columns` bind the grid's data and column definitions. `config.view` selects the layout — `'list'` is the default flat table.

::demo-panel
:::client-only
:table-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ATable, type TableColumn, type TableRow } from '@stonecrop/atable'

const rows = ref<TableRow[]>([
	{ id: '1', item: 'Widget A', quantity: 12, unit_price: 4.5, status: 'In Stock' },
	{ id: '2', item: 'Widget B', quantity: 0, unit_price: 9.25, status: 'Backordered' },
	{ id: '3', item: 'Widget C', quantity: 34, unit_price: 2.1, status: 'In Stock' },
])

const columns = ref<TableColumn[]>([
	{ label: 'Item', name: 'item', align: 'left', edit: false, width: '20ch' },
	{ label: 'Quantity', name: 'quantity', align: 'right', edit: true, width: '12ch' },
	{ label: 'Unit Price', name: 'unit_price', align: 'right', edit: true, width: '12ch' },
	{ label: 'Status', name: 'status', align: 'left', edit: false, width: '16ch' },
])
</script>

<template>
	<ATable v-model:rows="rows" v-model:columns="columns" :config="{ view: 'list' }" />
</template>
```
::

## Row Actions

Setting `config.rowActions.enabled` renders add/delete/duplicate/insert/move controls per row, emitting `row:add`, `row:delete`, `row:duplicate`, `row:insert-above`, `row:insert-below`, and `row:move`.

::demo-panel
:::client-only
:table-row-actions-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ATable, type TableColumn, type TableRow } from '@stonecrop/atable'

const rows = ref<TableRow[]>([
	{ id: '1', item: 'Widget A', quantity: 12 },
	{ id: '2', item: 'Widget B', quantity: 0 },
	{ id: '3', item: 'Widget C', quantity: 34 },
])

const columns = ref<TableColumn[]>([
	{ label: 'Item', name: 'item', align: 'left', edit: true, width: '20ch' },
	{ label: 'Quantity', name: 'quantity', align: 'right', edit: true, width: '12ch' },
])
</script>

<template>
	<ATable v-model:rows="rows" v-model:columns="columns" :config="{ view: 'list', rowActions: { enabled: true } }" />
</template>
```
::

## Filtering & Sorting

Setting `sortable`/`filterable` on a column adds a header sort toggle and a filter control. `filterType` picks the control: `'text'` for free-text matching, `'select'` for a dropdown (supply `filterOptions`, or omit them to auto-derive from the column's data), or `'dateRange'` for a date span.

::demo-panel
:::client-only
:table-filter-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ATable, type TableColumn, type TableRow } from '@stonecrop/atable'

const rows = ref<TableRow[]>([
	{ id: '1', item: 'Widget A', status: 'In Stock' },
	{ id: '2', item: 'Widget B', status: 'Backordered' },
	{ id: '3', item: 'Widget C', status: 'In Stock' },
	{ id: '4', item: 'Widget D', status: 'Discontinued' },
])

const columns = ref<TableColumn[]>([
	{ label: 'Item', name: 'item', align: 'left', edit: false, width: '20ch', sortable: true, filterable: true, filterType: 'text' },
	{
		label: 'Status',
		name: 'status',
		align: 'left',
		edit: false,
		width: '18ch',
		sortable: true,
		filterable: true,
		filterType: 'select',
		filterOptions: [
			{ label: 'In Stock', value: 'In Stock' },
			{ label: 'Backordered', value: 'Backordered' },
			{ label: 'Discontinued', value: 'Discontinued' },
		],
	},
])
</script>

<template>
	<ATable v-model:rows="rows" v-model:columns="columns" :config="{ view: 'list' }" />
</template>
```
::

## Tree View

`config.view: 'tree'` reads each row's `parent` field — the array index of its parent row, or `null` for a root row — and renders it as a collapsible hierarchy. `config.defaultTreeExpansion` controls the initial expansion state (`'root'`, `'branch'`, or `'leaf'`).

::demo-panel
:::client-only
:table-tree-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ATable, type TableColumn, type TableRow } from '@stonecrop/atable'

const rows = ref<TableRow[]>([
	{ id: '1', account: 'Assets', parent: null },
	{ id: '2', account: 'Current Assets', parent: 0 },
	{ id: '3', account: 'Cash', parent: 1 },
	{ id: '4', account: 'Accounts Receivable', parent: 1 },
	{ id: '5', account: 'Liabilities', parent: null },
])

const columns = ref<TableColumn[]>([{ label: 'Account', name: 'account', align: 'left', edit: false, width: '30ch' }])
</script>

<template>
	<ATable v-model:rows="rows" v-model:columns="columns" :config="{ view: 'tree', defaultTreeExpansion: 'leaf' }" />
</template>
```
::

## Gantt View

`config.view: 'gantt'` needs one `pinned` column for the row label; every column after it forms the timeline backdrop. Each row's `gantt` field (`startIndex`/`endIndex`, both column-index based, plus a `color`) draws that row's bar across the timeline. `gantt:drag` fires when a bar is resized or moved; `connection:event` fires when a dependency line between two bars is created or deleted (toggle with `config.dependencyGraph`).

::demo-panel
:::client-only
:table-gantt-demo
:::

#code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ATable, type TableColumn, type TableRow } from '@stonecrop/atable'

const columns = ref<TableColumn[]>([
	{ label: 'Task', name: 'task', align: 'left', edit: false, width: '16ch', pinned: true },
	{ label: 'Week 1', name: 'w1', align: 'center', edit: false, width: '10ch' },
	{ label: 'Week 2', name: 'w2', align: 'center', edit: false, width: '10ch' },
	{ label: 'Week 3', name: 'w3', align: 'center', edit: false, width: '10ch' },
	{ label: 'Week 4', name: 'w4', align: 'center', edit: false, width: '10ch' },
])

const rows = ref<TableRow[]>([
	{ id: '1', task: 'Design', gantt: { startIndex: 0, endIndex: 1, color: '#4c9aff' } },
	{ id: '2', task: 'Build', gantt: { startIndex: 1, endIndex: 3, color: '#5a8a5a' } },
	{ id: '3', task: 'Launch', gantt: { startIndex: 3, endIndex: 4, color: '#d97706' } },
])
</script>

<template>
	<ATable v-model:rows="rows" v-model:columns="columns" :config="{ view: 'gantt' }" />
</template>
```
::

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['`rows`', '`TableRow[]`', '— (required)', 'The grid data, `v-model:rows`-bound.']
  - ['`columns`', '`TableColumn[]`', '—', 'Column definitions, `v-model:columns`-bound.']
  - ['`id`', '`string`', "`''`", 'DOM id applied to the root element.']
  - ['`config`', '`TableConfig`', '`{}`', "View settings — `view` (`'list'`, `'uncounted'`, `'list-expansion'`, `'tree'`, `'gantt'`, `'tree-gantt'`), `fullWidth`, `clickable`, `rowActions`, `defaultTreeExpansion`, `dependencyGraph`."]
  - ['`schema`', '`ColumnSchema[]`', '`[]`', 'Optional doctype-derived schema, converted to columns via `schemaToColumns`.']
  - ['`linkResolver`', '`(doctype, id) => Promise<string | undefined>`', '—', 'Resolves a link-type cell value to a display string.']
---
::

### Emits

::api-data-table
---
headers: ['Name', 'Payload', 'Description']
rows:
  - ['`cellUpdate`', '`{ colIndex, rowIndex, newValue, oldValue }`', 'An editable cell was changed.']
  - ['`row:click`', '`RowClickEvent`', 'A row was clicked (only when `config.clickable` is set).']
  - ['`row:open`', '`RowClickEvent`', 'A row was opened (e.g. double-click).']
  - ['`row:add`', '`RowAddEvent`', 'The add-row action was used.']
  - ['`row:delete`', '`RowDeleteEvent`', 'The delete-row action was used.']
  - ['`row:duplicate`', '`RowDuplicateEvent`', 'The duplicate-row action was used.']
  - ['`row:insert-above`', '`RowInsertEvent`', 'The insert-above action was used.']
  - ['`row:insert-below`', '`RowInsertEvent`', 'The insert-below action was used.']
  - ['`row:move`', '`RowMoveEvent`', 'A row was dragged to a new position.']
  - ['`columns:update`', '`TableColumn[]`', 'Column order/width/visibility changed.']
  - ['`gantt:drag`', '`GanttDragEvent`', 'A Gantt bar was resized or moved (Gantt views only).']
  - ['`connection:event`', '`ConnectionEvent`', 'A Gantt dependency line was created or deleted (Gantt views only).']
---
::

## Accessibility

`ATable` renders a native `<table>` with real `<thead>`/`<tbody>`/`<tr>`/`<td>` elements, so screen readers get correct row/column structure and cell content for free. Sort and filter controls in the header, and the row-action icons/dropdown, are plain `<button>`/`<input>` elements with no `aria-label` or `aria-sort` attributes in the current source — a screen reader announces them by their visible text/icon only, not by role or state.

Source: [`atable/src/components/ATable.vue`](https://github.com/agritheory/stonecrop/blob/development/atable/src/components/ATable.vue)
