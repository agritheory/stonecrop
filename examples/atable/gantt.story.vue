<template>
	<Story title="gantt">
		<Variant title="default">
			<ATable
				v-model:rows="gantt.rows"
				v-model:columns="gantt.columns"
				:config="gantt.config"
				@cellUpdate="handleUpdate"
				@gantt:drag="handleGanttDrag"
				@connection:event="handleConnectionEvent" />
		</Variant>

		<Variant title="gantt (no dependency graph)">
			<ATable
				v-model:rows="gantt.rows"
				v-model:columns="gantt.columns"
				:config="gantt_no_deps.config"
				@cellUpdate="handleUpdate"
				@gantt:drag="handleGanttDrag"
				@connection:event="handleConnectionEvent" />
		</Variant>

		<Variant title="tree">
			<ATable
				v-model:rows="project_gantt.rows"
				v-model:columns="project_gantt.columns"
				:config="project_gantt.config"
				@gantt:drag="handleGanttDrag"
				@connection:event="handleConnectionEvent" />
		</Variant>

		<Variant title="tree (no dependency graph)">
			<ATable
				v-model:rows="project_gantt.rows"
				v-model:columns="project_gantt.columns"
				:config="project_gantt_no_deps.config"
				@gantt:drag="handleGanttDrag"
				@connection:event="handleConnectionEvent" />
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import type { ConnectionEvent, GanttDragEvent, TableColumn, TableConfig } from '@stonecrop/atable'
import { ref } from 'vue'

import project_data from './sample_data/project_gantt.json'
import gantt_data from './sample_data/task.json'

const gantt_columns: TableColumn[] = [
	{
		label: 'Group | Resource',
		name: 'resource_name',
		edit: false,
		width: '50ch',
		fieldtype: 'Data',
		align: 'left',
		pinned: true,
		format: value => {
			if (value && Object.keys(value).length > 0) {
				if (value.resource_group) {
					return `<strong>${value.resource_group}</strong>`
				} else {
					return `${value.resource_name} (${value.resource_display})`
				}
			}
			return ''
		},
	},
	{
		label: 'Total',
		name: 'total',
		edit: false,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		pinned: true,
		format: (value, context) => {
			if (context.row.indent == 0) {
				return ''
			}
			return Object.entries(context.row)
				.filter(([key]) => key.startsWith('period_'))
				.reduce((sum, [_, v]) => sum + (v.qty || 0), 0)
		},
	},
	{
		label: '12/28/2024',
		name: 'period_1',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '01/11/2025',
		name: 'period_2',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '01/25/2025',
		name: 'period_3',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '02/08/2025',
		name: 'period_4',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '02/22/2025',
		name: 'period_5',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '03/08/2025',
		name: 'period_6',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '03/22/2025',
		name: 'period_7',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '04/05/2025',
		name: 'period_8',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '04/19/2025',
		name: 'period_9',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '05/03/2025',
		name: 'period_10',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '05/17/2025',
		name: 'period_11',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '05/31/2025',
		name: 'period_12',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '06/14/2025',
		name: 'period_13',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '06/28/2025',
		name: 'period_14',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '07/12/2025',
		name: 'period_15',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '07/26/2025',
		name: 'period_16',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '08/09/2025',
		name: 'period_17',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '08/23/2025',
		name: 'period_18',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '09/06/2025',
		name: 'period_19',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '09/20/2025',
		name: 'period_20',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '10/04/2025',
		name: 'period_21',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '10/18/2025',
		name: 'period_22',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '11/01/2025',
		name: 'period_23',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '11/15/2025',
		name: 'period_24',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '11/29/2025',
		name: 'period_25',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
	{
		label: '12/13/2025',
		name: 'period_26',
		edit: true,
		width: '12ch',
		fieldtype: 'Data',
		align: 'right',
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else {
				return value.qty
			}
		},
	},
]

const gantt = ref({
	rows: gantt_data,
	columns: gantt_columns,
	config: { view: 'gantt' } as TableConfig,
})

const gantt_no_deps = ref({
	rows: gantt_data,
	columns: gantt_columns,
	config: { view: 'gantt', dependencyGraph: false } as TableConfig,
})

// Project-Gantt columns with period data
const project_gantt_columns: TableColumn[] = [
	{
		label: 'Project / Phase / Task',
		name: 'project_name',
		fieldtype: 'Data',
		align: 'left',
		edit: false,
		width: '40ch',
		pinned: true,
		format: (value, context) => {
			if (value === undefined || value === null) {
				return ''
			} else if (Object.keys(value).length > 0) {
				const indent = context.row.indent || 0
				const indentSpace = '&nbsp;'.repeat(indent * 4)

				if (value.display === '(Project)' || value.display === '(Phase)') {
					return `${indentSpace}<strong>${value.title}</strong>`
				} else if (value.assignee) {
					return `${indentSpace}${value.title} <small>(${value.assignee})</small>`
				} else {
					return `${indentSpace}${value.title}`
				}
			}
		},
	},
	{
		label: 'Code',
		name: 'project_code',
		fieldtype: 'Data',
		align: 'left',
		edit: false,
		width: '15ch',
		pinned: true,
		format: (value, context) => {
			const projectName = context.row.project_name
			return projectName?.project_code || projectName?.task_code || ''
		},
	},
	{
		label: 'Status',
		name: 'status',
		fieldtype: 'Data',
		align: 'center',
		edit: false,
		width: '12ch',
		pinned: true,
		format: (value, context) => {
			const status = context.row.project_name?.status || ''
			const statusColors = {
				Completed: 'color: #2e7d32; font-weight: bold;',
				Active: 'color: #f57c00; font-weight: bold;',
				'On Track': 'color: #1976d2; font-weight: bold;',
				Planned: 'color: #757575; font-weight: bold;',
			}
			return `<span style="${statusColors[status] || ''}">${status}</span>`
		},
	},
	{
		label: 'Jan 1-15',
		name: 'period_1',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.actual_hours || 0}h`
			}
		},
	},
	{
		label: 'Jan 16-31',
		name: 'period_2',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.actual_hours || 0}h`
			}
		},
	},
	{
		label: 'Feb 1-15',
		name: 'period_3',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.actual_hours || 0}h`
			}
		},
	},
	{
		label: 'Feb 16-28',
		name: 'period_4',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.actual_hours || 0}h`
			}
		},
	},
	{
		label: 'Mar 1-15',
		name: 'period_5',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.actual_hours || 0}h`
			}
		},
	},
	{
		label: 'Mar 16-31',
		name: 'period_6',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.actual_hours || 0}h`
			}
		},
	},
	{
		label: 'Apr 1-15',
		name: 'period_7',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.actual_hours || 0}h`
			}
		},
	},
	{
		label: 'Apr 16-30',
		name: 'period_8',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.actual_hours || 0}h`
			}
		},
	},
	{
		label: 'May 1-15',
		name: 'period_9',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.actual_hours || 0}h`
			}
		},
	},
	{
		label: 'May 16-31',
		name: 'period_10',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.actual_hours || 0}h`
			}
		},
	},
	{
		label: 'Jun 1-15',
		name: 'period_11',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.actual_hours || 0}h`
			}
		},
	},
	{
		label: 'Jun 16-30',
		name: 'period_12',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.planned_hours || 0}h`
			}
		},
	},
	{
		label: 'Jul 1-15',
		name: 'period_13',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.planned_hours || 0}h`
			}
		},
	},
	{
		label: 'Jul 16-31',
		name: 'period_14',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.planned_hours || 0}h`
			}
		},
	},
	{
		label: 'Aug 1-15',
		name: 'period_15',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.planned_hours || 0}h`
			}
		},
	},
	{
		label: 'Aug 16-31',
		name: 'period_16',
		fieldtype: 'Data',
		align: 'right',
		edit: true,
		width: '10ch',
		format: (value, context) => {
			// Only show data for task level (indent 2)
			if (!value || context.row.indent !== 2) {
				return ''
			} else {
				return `${value.planned_hours || 0}h`
			}
		},
	},
]

const project_gantt = ref({
	rows: project_data,
	columns: project_gantt_columns,
	config: { view: 'tree-gantt' },
})

const project_gantt_no_deps = ref({
	rows: project_data,
	columns: project_gantt_columns,
	config: { view: 'tree-gantt', dependencyGraph: false },
})

const handleUpdate = ({ colIndex, rowIndex, newValue, oldValue }) => {
	console.log(`Cell updated at (${rowIndex}, ${colIndex}): ${oldValue} -> ${newValue}`)
}

const handleGanttDrag = (event: GanttDragEvent) => {
	if (event.type === 'bar') {
		console.log(
			`Bar moved ${event.delta} units (Start: ${event.oldStart} -> ${event.newStart}; End: ${event.oldEnd} -> ${event.newEnd}) at row ${event.rowIndex}`
		)
	} else if (event.type === 'resize') {
		console.log(`Bar resized ${event.edge} by ${event.delta} units at row ${event.rowIndex}`)
	}
}

const handleConnectionEvent = (event: ConnectionEvent) => {
	console.log(`Connection ${event.type}:`, event.connection)
}
</script>

<!-- enter documentation here -->
<docs lang="md">
# Tree View

The tree view displays hierarchical data with expandable/collapsible nodes. The tree-gantt variant combines this with gantt chart functionality for project and phase levels.

## Tree View Features

- Hierarchical data display with indentation
- Expandable/collapsible parent nodes
- Visual indicators for parent/child relationships

## Tree-Gantt View Features

- Combines tree structure with gantt visualization
- Gantt bars appear on project (indent: 0) and phase (indent: 1) levels
- Task level (indent: 2) contains actual data values
- Maintains tree navigation while showing timeline data
- Draggable and resizable gantt bars
- Pinned columns for project information

## Dependency Graph Configuration

Both `gantt` and `tree-gantt` views support optional dependency graph functionality:

- **With dependencies** (default): Connection handles and dependency lines are visible
- **Without dependencies**: Connection handles and dependency lines are hidden

## Configuration Examples

```vue
<!-- Gantt with dependencies (default) -->
<ATable :config="{ view: 'gantt' }" />

<!-- Gantt without dependencies -->
<ATable :config="{ view: 'gantt', dependencyGraph: false }" />

<!-- Tree-Gantt with dependencies (default) -->
<ATable :config="{ view: 'tree-gantt' }" />

<!-- Tree-Gantt without dependencies -->
<ATable :config="{ view: 'tree-gantt', dependencyGraph: false }" />
```

## Project-Gantt View Features

- 3-level hierarchy: Project > Phase > Task
- Visual project status indicators
- Time tracking data only at task level
- Color-coded gantt bars for projects and phases
- Assignee information for tasks
- Progress tracking across time periods

## Usage

```vue
<ATable
	v-model:rows="treeData"
	v-model:columns="treeColumns"
	:config="{ view: 'tree-gantt' }"
	@gantt:drag="handleGanttDrag" />
```

The tree-gantt view is perfect for displaying hierarchical project data with timeline visualization, where:

- Projects and phases provide visual timeline context via gantt bars
- Tasks contain the actual time tracking and progress data
- Hierarchical structure maintains project organization
</docs>
