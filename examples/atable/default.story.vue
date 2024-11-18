<template>
	<Story title="default">
		<Variant title="default">
			<ATable v-model="default_table.rows" :columns="default_table.columns" :config="default_table.config" />
		</Variant>
		<Variant title="read-only">
			<ATable v-model="readonly_table.rows" :columns="readonly_table.columns" :config="readonly_table.config" />
		</Variant>
		<Variant title="full width">
			<ATable v-model="full_width_table.rows" :columns="full_width_table.columns" :config="full_width_table.config" />
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import type { CellContext, TableColumn } from '@stonecrop/atable'
import { ref } from 'vue'

import data from './sample_data/http_logs.json'

const columns: TableColumn[] = [
	{
		label: 'Home Page',
		name: 'home_page',
		type: 'Data',
		align: 'left',
		edit: false,
		width: '40ch',
		format: (value: { title?: string; value?: any }, context: CellContext) => {
			return `<a href="${value.title}" target="_blank">${value.title} (IP: ${context.row.ip_address})</a>`
		},
	},
	{
		label: 'HTTP Method',
		name: 'http_method',
		type: 'Data',
		align: 'left',
		edit: true,
		width: '20ch',
	},
	{
		label: 'Report Date',
		name: 'report_date',
		type: 'component',
		align: 'center',
		edit: true,
		width: '25ch',
		modalComponent: 'ADate',
		format: (value: number) => {
			return new Date(Number(value)).toLocaleDateString('en-US')
		},
	},
]

const readonly_columns: TableColumn[] = [
	{
		label: 'Home Page',
		name: 'home_page',
		type: 'Data',
		align: 'left',
		edit: false,
		width: '40ch',
		format: '(value, { row }) => `${value.title} (IP: ${row.ip_address})`',
	},
	{
		label: 'HTTP Method',
		name: 'http_method',
		type: 'Data',
		align: 'left',
		edit: true,
		width: '20ch',
	},
	{
		label: 'Report Date',
		name: 'report_date',
		type: 'component',
		align: 'center',
		edit: true,
		width: '25ch',
		modalComponent: 'ADate',
		modalComponentExtraProps: {
			readonly: true,
		},
		format: (value: number) => {
			return new Date(Number(value)).toLocaleDateString('en-US')
		},
	},
]

const default_table = ref({
	rows: data,
	columns,
	config: { view: 'list' },
})

const readonly_table = ref({
	rows: data,
	columns: readonly_columns,
	config: { view: 'list' },
})

const full_width_table = ref({
	rows: data,
	columns,
	config: { view: 'list', fullWidth: true },
})
</script>

<style>
:root {
	--sc-cell-modified: yellow;
}
</style>

<!-- enter documentation here -->
<docs lang="md"></docs>
