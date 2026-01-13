<template>
	<Story title="tree">
		<Variant title="default (collapsed)">
			<ATable v-model:rows="coa.rows" v-model:columns="coa.columns" :config="coa.config" />
		</Variant>

		<Variant title="root expansion">
			<ATable
				v-model:rows="rootExpansion.rows"
				v-model:columns="rootExpansion.columns"
				:config="rootExpansion.config" />
		</Variant>

		<Variant title="branch expansion (gantt nodes only)">
			<ATable
				v-model:rows="branchExpansion.rows"
				v-model:columns="branchExpansion.columns"
				:config="branchExpansion.config" />
		</Variant>

		<Variant title="leaf expansion (fully expanded)">
			<ATable
				v-model:rows="leafExpansion.rows"
				v-model:columns="leafExpansion.columns"
				:config="leafExpansion.config" />
		</Variant>

		<Variant title="pinned columns">
			<ATable v-model:rows="pinned.rows" v-model:columns="pinned.columns" :config="pinned.config" />
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import type { TableColumn, TableConfig, TableRow } from '@stonecrop/atable'
import { ref } from 'vue'

import data from './sample_data/coa.json'

// Add gantt data to some rows for demonstration
const dataWithGantt = data.map((row, index) => {
	// Add gantt data to specific accounts for demonstration
	if (['1.1', '1.2', '2.1'].includes(row.account_number)) {
		return {
			...row,
			gantt: {
				startIndex: 0,
				endIndex: 2,
				color: '#4CAF50',
			},
		}
	}
	return row
}) as TableRow[]

const default_columns = [
	{
		label: 'Number',
		name: 'account_number',
		fieldtype: 'Data',
		align: 'left',
		edit: false,
		width: '10ch',
	},
	{
		label: 'Account',
		name: 'account_title',
		fieldtype: 'Data',
		align: 'left',
		edit: true,
		width: '50ch',
	},
	{
		label: 'Balance',
		name: 'balance',
		fieldtype: 'Currency',
		align: 'left',
		edit: false,
		width: '20ch',
		format: (value: { title?: string; value?: any }) => {
			return value.title
		},
		modalComponent: 'TestModalComponent',
	},
] as TableColumn[]

const pinned_columns = [
	{
		label: 'Number',
		name: 'account_number',
		fieldtype: 'Data',
		align: 'left',
		edit: false,
		width: '10ch',
		pinned: false,
	},
	{
		label: 'Account',
		name: 'account_title',
		fieldtype: 'Data',
		align: 'left',
		edit: true,
		width: '50ch',
		pinned: true,
	},
	{
		label: 'Balance',
		name: 'balance',
		fieldtype: 'Currency',
		align: 'left',
		edit: false,
		width: '20ch',
		format: (value: { title?: string; value?: any }) => {
			return value.title
		},
		modalComponent: 'TestModalComponent',
	},
]

const coa = ref({
	rows: data as TableRow[],
	columns: default_columns,
	config: { view: 'tree' } as TableConfig,
})

const rootExpansion = ref({
	rows: data as TableRow[],
	columns: default_columns,
	config: { view: 'tree', defaultTreeExpansion: 'root' } as TableConfig,
})

const branchExpansion = ref({
	rows: dataWithGantt,
	columns: default_columns,
	config: { view: 'tree', defaultTreeExpansion: 'branch' } as TableConfig,
})

const leafExpansion = ref({
	rows: data as TableRow[],
	columns: default_columns,
	config: { view: 'tree', defaultTreeExpansion: 'leaf' } as TableConfig,
})

const pinned = ref({
	rows: data as TableRow[],
	columns: pinned_columns,
	config: { view: 'tree' } as TableConfig,
})
</script>
