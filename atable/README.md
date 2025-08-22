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

The primary API for ATable is the column object.

- `title`: String; optional
- `name`: String; required (a reference to the column that must follow rules for valid JS variable naming)
- `type`: String; optional (a valid data types, full list [below](#column-data-types))
- `align`: String; optional (one of `left`, `right` or `center`; defaults to `center`)
- `edit`: Boolean; optional (indicates if the field is editable; defaults to `false`)
- `width`: String; optional (used to indicate the width of the cell; defaults to `40ch`)
- `mask`: Function; optional (a custom mask for the field, several are provided with types by default)
- `options`: Function; optional (used with `Select`, `Currency`, and `Quantity` fields)

```js
{
  title: 'Batch Name',
  name: 'name',
  type: 'Data',
  align: 'right',
  edit: false,
},
{
  title: 'Species',
  name: 'species',
  type: 'Select',
  align: 'left',
  edit: true,
  width: '30ch',
  required: true,
  options: () => ['Rainbow Trout', 'Steelhead', 'Golden Trout', 'Pacific Salmon']
},
{
  title: 'Date',
  name: 'set_date',
  type: 'Date',
  align: 'center',
  edit: true,
  width: '30ch',
  mask: value => `${value}+/-`,
}
```

## v-model:rows and v-model:columns

ATable now requires both rows and columns to be passed as model values using `v-model:rows` and `v-model:columns`. This allows you to dynamically modify both the table data and structure at runtime.

### Basic Usage

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
  { name: 'id', label: 'ID', width: '80px', type: 'Data' },
  { name: 'name', label: 'Name', width: '150px', type: 'Data' },
])

const onColumnsChange = (columns) => {
  console.log('Columns updated:', columns)
}
</script>
```

### Features

- **Reactive rows and columns**: Both data and structure can be modified at runtime
- **Column resizing**: When users resize columns, the model is automatically updated
- **Event emission**: The `columns:update` event is emitted whenever columns change
- **Required models**: Both `v-model:rows` and `v-model:columns` are required

### Migration

**Breaking Change**: The `:columns` prop has been removed. Update your existing code:

```vue
<!-- OLD: This no longer works -->
<ATable v-model="data" :columns="columns" />

<!-- NEW: Required syntax -->
<ATable v-model:rows="data" v-model:columns="columns" />
```## Column Data Types

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
