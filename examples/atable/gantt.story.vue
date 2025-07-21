<template>
	<Story title="gantt">
		<Variant title="default">
			<ATable
				v-model="gantt.rows"
				:columns="gantt.columns"
				:config="gantt.config"
				@cellUpdate="handleUpdate"
				@gantt:drag="handleGanttDrag" />
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import type { GanttDragEvent, TableConfig } from '@stonecrop/atable'
import { ref } from 'vue'

import gantt_data from './sample_data/task.json'

const gantt_columns = [
	{
		label: 'Group | Resource',
		name: 'resource_name',
		edit: false,
		width: '50ch',
		type: 'Data',
		align: 'left',
		pinned: true,
		format: value => {
			if (value === undefined || value === null) {
				return ''
			} else if (Object.keys(value).length > 0) {
				if (value.resource_group) {
					return `<strong>${value.resource_group}</strong>`
				} else {
					return `${value.resource_name} (${value.resource_display})`
				}
			}
		},
	},
	{
		label: 'Total',
		name: 'total',
		edit: false,
		width: '12ch',
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
		type: 'Data',
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
</script>

<!-- enter documentation here -->
<docs lang="md"></docs>
