<template>
	<Story title="row-actions">
		<Variant title="basic (add/delete)">
			<div class="event-log">
				<strong>Events:</strong>
				<span v-for="(event, i) in basicEvents" :key="i">{{ event }}</span>
			</div>
			<ATable
				v-model:rows="basic_table.rows"
				v-model:columns="basic_table.columns"
				:config="basic_table.config"
				@row:add="e => logEvent(basicEvents, 'add', e)"
				@row:delete="e => logEvent(basicEvents, 'delete', e)" />
		</Variant>

		<Variant title="all actions">
			<div class="event-log">
				<strong>Events:</strong>
				<span v-for="(event, i) in allActionsEvents" :key="i">{{ event }}</span>
			</div>
			<ATable
				v-model:rows="all_actions_table.rows"
				v-model:columns="all_actions_table.columns"
				:config="all_actions_table.config"
				@row:add="e => logEvent(allActionsEvents, 'add', e)"
				@row:delete="e => logEvent(allActionsEvents, 'delete', e)"
				@row:duplicate="e => logEvent(allActionsEvents, 'duplicate', e)"
				@row:insert-above="e => logEvent(allActionsEvents, 'insert-above', e)"
				@row:insert-below="e => logEvent(allActionsEvents, 'insert-below', e)" />
		</Variant>

		<Variant title="dropdown mode">
			<p>Row actions forced into dropdown mode for compact display.</p>
			<ATable
				v-model:rows="dropdown_table.rows"
				v-model:columns="dropdown_table.columns"
				:config="dropdown_table.config" />
		</Variant>

		<Variant title="position: after-index">
			<p>Row actions positioned after the row index column.</p>
			<ATable
				v-model:rows="after_index_table.rows"
				v-model:columns="after_index_table.columns"
				:config="after_index_table.config" />
		</Variant>

		<Variant title="position: end">
			<p>Row actions positioned at the end of each row.</p>
			<ATable
				v-model:rows="end_position_table.rows"
				v-model:columns="end_position_table.columns"
				:config="end_position_table.config" />
		</Variant>

		<Variant title="custom labels">
			<p>Row actions with custom labels in dropdown mode.</p>
			<ATable
				v-model:rows="custom_labels_table.rows"
				v-model:columns="custom_labels_table.columns"
				:config="custom_labels_table.config" />
		</Variant>

		<Variant title="uncounted view">
			<p>Row actions work with uncounted view (no row numbers).</p>
			<ATable
				v-model:rows="uncounted_table.rows"
				v-model:columns="uncounted_table.columns"
				:config="uncounted_table.config" />
		</Variant>

		<Variant title="clickable rows (row:click)">
			<p>
				Set <code>config.clickable: true</code> to enable pointer cursor and hover styling. ATable emits
				<code>row:click</code> with <code>{ row, rowIndex, event }</code>.
			</p>
			<div class="event-log">
				<strong>Last clicked:</strong>
				<span v-if="lastClickedRow">row {{ lastClickedRow.rowIndex }} — {{ lastClickedRow.row.name }}</span>
				<span v-else>—</span>
			</div>
			<ATable
				v-model:rows="clickable_table.rows"
				v-model:columns="clickable_table.columns"
				:config="clickable_table.config"
				@row:click="e => (lastClickedRow = e)" />
		</Variant>

		<Variant title="open action (row:open)">
			<p>
				Add <code>open: true</code> to <code>rowActions.actions</code> to show an open/view icon per row. Emits
				<code>row:open</code> with <code>{ row, rowIndex }</code>.
			</p>
			<div class="event-log">
				<strong>Last opened:</strong>
				<span v-if="lastOpenedRow">row {{ lastOpenedRow.rowIndex }} — {{ lastOpenedRow.row.name }}</span>
				<span v-else>—</span>
			</div>
			<ATable
				v-model:rows="open_action_table.rows"
				v-model:columns="open_action_table.columns"
				:config="open_action_table.config"
				@row:open="e => (lastOpenedRow = e)" />
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import type {
	TableColumn,
	TableConfig,
	RowAddEvent,
	RowClickEvent,
	RowDeleteEvent,
	RowDuplicateEvent,
	RowInsertEvent,
} from '@stonecrop/atable'
import { ref, reactive } from 'vue'

// Sample data
const createSampleRows = () => [
	{ id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'active' },
	{ id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'inactive' },
	{ id: 3, name: 'Charlie Brown', email: 'charlie@example.com', status: 'active' },
	{ id: 4, name: 'Diana Ross', email: 'diana@example.com', status: 'pending' },
	{ id: 5, name: 'Edward Norton', email: 'edward@example.com', status: 'active' },
]

const columns: TableColumn[] = [
	{
		label: 'ID',
		name: 'id',
		align: 'left',
		edit: false,
		width: '3ch',
	},
	{
		label: 'Name',
		name: 'name',
		align: 'left',
		edit: true,
		width: '25ch',
	},
	{
		label: 'Email',
		name: 'email',
		align: 'left',
		edit: true,
		width: '30ch',
	},
	{
		label: 'Status',
		name: 'status',
		align: 'center',
		edit: true,
		width: '15ch',
	},
]

// Event logging
const basicEvents = ref<string[]>([])
const allActionsEvents = ref<string[]>([])
const lastClickedRow = ref<RowClickEvent | null>(null)
const lastOpenedRow = ref<RowClickEvent | null>(null)

const logEvent = (
	eventLog: typeof basicEvents.value,
	type: string,
	event: RowAddEvent | RowDeleteEvent | RowDuplicateEvent | RowInsertEvent
) => {
	const msg = `${type}: row ${event.rowIndex}`
	eventLog.unshift(msg)
	if (eventLog.length > 5) eventLog.pop()
}

// Basic table with add/delete only
const basic_table = reactive({
	rows: createSampleRows(),
	columns: [...columns],
	config: {
		view: 'list',
		rowActions: {
			enabled: true,
			position: 'before-index',
			actions: {
				add: true,
				delete: true,
			},
		},
	} as TableConfig,
})

// Table with all actions enabled
const all_actions_table = reactive({
	rows: createSampleRows(),
	columns: [...columns],
	config: {
		view: 'list',
		rowActions: {
			enabled: true,
			position: 'before-index',
			actions: {
				add: true,
				delete: true,
				duplicate: true,
				insertAbove: true,
				insertBelow: true,
			},
		},
	} as TableConfig,
})

// Dropdown mode table
const dropdown_table = reactive({
	rows: createSampleRows(),
	columns: [...columns],
	config: {
		view: 'list',
		rowActions: {
			enabled: true,
			forceDropdown: true,
			actions: {
				add: true,
				delete: true,
				duplicate: true,
				insertAbove: true,
				insertBelow: true,
			},
		},
	} as TableConfig,
})

// After-index position table
const after_index_table = reactive({
	rows: createSampleRows(),
	columns: [...columns],
	config: {
		view: 'list',
		rowActions: {
			enabled: true,
			position: 'after-index',
			actions: {
				add: true,
				delete: true,
				duplicate: true,
			},
		},
	} as TableConfig,
})

// End position table
const end_position_table = reactive({
	rows: createSampleRows(),
	columns: [...columns],
	config: {
		view: 'list',
		rowActions: {
			enabled: true,
			position: 'end',
			actions: {
				add: true,
				delete: true,
			},
		},
	} as TableConfig,
})

// Custom labels table
const custom_labels_table = reactive({
	rows: createSampleRows(),
	columns: [...columns],
	config: {
		view: 'list',
		rowActions: {
			enabled: true,
			forceDropdown: true,
			actions: {
				add: { enabled: true, label: 'New Row' },
				delete: { enabled: true, label: 'Remove' },
				duplicate: { enabled: true, label: 'Copy Row' },
				insertAbove: { enabled: true, label: 'Add Above' },
				insertBelow: { enabled: true, label: 'Add Below' },
			},
		},
	} as TableConfig,
})

// Uncounted view table
const uncounted_table = reactive({
	rows: createSampleRows(),
	columns: [...columns],
	config: {
		view: 'uncounted',
		rowActions: {
			enabled: true,
			actions: {
				add: true,
				delete: true,
				duplicate: true,
			},
		},
	} as TableConfig,
})

// Clickable rows table (row:click)
const clickable_table = reactive({
	rows: createSampleRows(),
	columns: [...columns],
	config: {
		view: 'list',
		clickable: true,
	} as TableConfig,
})

// Open action table (row:open)
const open_action_table = reactive({
	rows: createSampleRows(),
	columns: [...columns],
	config: {
		view: 'list',
		rowActions: {
			enabled: true,
			actions: {
				open: true,
				delete: true,
			},
		},
	} as TableConfig,
})
</script>

<style scoped>
.event-log {
	background: var(--sc-input-field-background);
	padding: 0.5rem 1rem;
	margin-bottom: 1rem;
	font-family: monospace;
	font-size: 0.875rem;
}

.event-log strong {
	margin-right: 0.5rem;
}

.event-log span {
	display: inline-block;
	background: var(--sc-gray-10);
	padding: 0.125rem 0.5rem;
	margin: 0.125rem;
}

p {
	color: var(--sc-input-label-color);
	margin-bottom: 0.5rem;
}
</style>

<docs lang="md">
# Row Actions

The `rowActions` configuration allows you to add row-level action buttons to each row in the table.

## Configuration Options

```typescript
rowActions: {
  enabled: boolean           // Enable/disable row actions
  position?: 'before-index' | 'after-index' | 'end'  // Button position
  dropdownThreshold?: number // Width threshold for dropdown mode (px)
  forceDropdown?: boolean    // Always use dropdown mode
  actions?: {
    add?: boolean | RowActionOptions
    delete?: boolean | RowActionOptions
    duplicate?: boolean | RowActionOptions
    insertAbove?: boolean | RowActionOptions
    insertBelow?: boolean | RowActionOptions
    move?: boolean | RowActionOptions
  }
}
```

## Events

- `row:click` - Emitted when a row is clicked (requires `config.clickable: true` for hover styling, but fires for any row click)
- `row:add` - Emitted when a row is added
- `row:delete` - Emitted when a row is deleted
- `row:duplicate` - Emitted when a row is duplicated
- `row:insert-above` - Emitted when a row is inserted above
- `row:insert-below` - Emitted when a row is inserted below
- `row:move` - Emitted when a row move is requested
- `row:open` - Emitted when the `open` row action is clicked
</docs>
