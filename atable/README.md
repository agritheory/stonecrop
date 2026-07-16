# ATable

## User Guide

<details><summary>Key navigation</summary>

| Key(s)        | Function    |
| :------------ | :--------   |
| Enter         | `downCell`  |
| Tab           | `nextCell`  |
| Shift + Enter | `upCell`    |
| Shift+ Tab    | `prevCell`  |
| &#8592;       | `prevCell`  |
| &#8593;       | `upCell`    |
| &#8594;       | `nextCell`  |
| &#8595;       | `downCell`  |
| Home          | `lastCell`  |
| End           | `firstCell` |

</details>

## Tree View Configuration

ATable supports tree views with configurable default expansion states for hierarchical data. Use the `defaultTreeExpansion` option in your table configuration to control initial expansion behavior:

```js
// Default behavior (no defaultTreeExpansion specified) - all nodes expanded
const config = {
  view: 'tree'
}

// Only show root nodes (fully collapsed)
const config = {
  view: 'tree',
  defaultTreeExpansion: 'root'
}

// Show only nodes with gantt data and their paths (branch mode)
const config = {
  view: 'tree',
  defaultTreeExpansion: 'branch'
}

// Show all nodes (fully expanded) - same as default
const config = {
  view: 'tree',
  defaultTreeExpansion: 'leaf'
}
```

**Expansion Modes:**
- `root`: Only top-level nodes are visible (fully collapsed)
- `branch`: Shows the minimal tree to display all nodes with gantt data. Only expands nodes that lead to gantt-enabled nodes, stops expanding at gantt nodes that have no gantt descendants
- `leaf`: All nodes are visible (fully expanded)
- `undefined` (default): All nodes start expanded (same as 'leaf' mode)

**Example Usage:**
```vue
<ATable
  v-model:rows="treeData"
  v-model:columns="columns"
  :config="{ view: 'tree', defaultTreeExpansion: 'branch' }"
/>
```

## Column API

ATable supports two ways to define columns.

### Schema-driven columns (recommended)

Pass a `ColumnSchema[]` array via the `:schema` prop. ATable calls `schemaToColumns()` internally —
`fieldname` becomes `name`, `hidden: true` fields are excluded, and form-only properties are stripped.
This is the preferred approach when working from doctype definitions.

```vue
<template>
  <ATable v-model:rows="rows" :schema="fields" :config="config" />
</template>

<script setup lang="ts">
import type { ColumnSchema } from '@stonecrop/schema'

const fields: ColumnSchema[] = [
  { fieldname: 'name', component: 'ATextInput', label: 'Name', width: '150px' },
  { fieldname: 'species', component: 'ADropdown', label: 'Species', align: 'left', edit: true },
  { fieldname: 'set_date', component: 'ADate', label: 'Date', width: '30ch', edit: true },
  { fieldname: 'internal_notes', component: 'ATextInput', label: 'Notes', hidden: true },
]
</script>
```

`internal_notes` has `hidden: true` and will not appear as a column.

### Runtime columns

Pass `TableColumn[]` via `v-model:columns` when you need reactively updateable columns at runtime
(e.g. dynamically adding/removing columns, programmatic resizing). `TableColumn` extends `ColumnSchema`
— the key difference is that `name` is used instead of `fieldname`, and `format`/`modalComponent`
accept live functions in addition to serialized strings.

- `name`: String; required (column key — corresponds to `fieldname` in ColumnSchema)
- `label`: String; optional (display label for the column header)
- `component`: String; optional (rendering component — see [Column Data Types](#column-data-types))
- `align`: String; optional (one of `left`, `right`, `center`, `start`, `end`; defaults to `center`)
- `edit`: Boolean; optional (whether the cell is editable; defaults to `false`)
- `width`: String; optional (CSS column width; defaults to `40ch`)
- `mask`: Function; optional (a custom input mask for the cell)

```js
const tableColumns = ref([
  { name: 'batch_name', label: 'Batch Name', component: 'ATextInput', align: 'right' },
  { name: 'set_date', label: 'Date', component: 'ADate', align: 'center', edit: true, width: '30ch',
    mask: value => `${value}+/-` },
])
```

## v-model:rows and v-model:columns

`v-model:rows` is always required. `v-model:columns` is optional — use it when you need reactive column
management at runtime. When neither `:schema` nor `v-model:columns` is provided, ATable renders with
no columns.

### Schema-driven (no v-model:columns needed)

```vue
<ATable v-model:rows="tableData" :schema="fields" />
```

### Reactive columns

```vue
<template>
  <ATable
    v-model:rows="tableData"
    v-model:columns="tableColumns"
    @columns:update="onColumnsChange" />
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([...])
const tableColumns = ref([
  { name: 'id', label: 'ID', width: '80px', component: 'ANumericInput' },
  { name: 'name', label: 'Name', width: '150px', component: 'ATextInput' },
])

const onColumnsChange = (columns) => {
  console.log('Columns updated:', columns)
}
</script>
```

### Features

- **Reactive rows and columns**: Both data and structure can be modified at runtime
- **Schema-driven columns**: Pass `:schema` to let ATable derive columns automatically
- **Column resizing**: When users resize columns, the `v-model:columns` model is automatically updated
- **Event emission**: The `columns:update` event is emitted whenever columns change## Column Data Types

`v0.1`

- Data/ Text (unformatted text)
- Number (can be backed by int, decimal or float)
- Hyperlink
- Currency
- Quantity
- Date
- Date Range
- Select / Datalist / Combobox

`v0.2`

- Rich Text Editor
- Image
- File
- Diagram
