<template>
	<Story title="default">
		<Variant title="default">
			<ATable :columns="http_logs.columns" v-model="http_logs.rows" :config="http_logs.config" />
		</Variant>
		<Variant title="read-only">
			<ATable
				:columns="http_logs_readonly.columns"
				:rows="http_logs_readonly.rows"
				:config="http_logs_readonly.config" />
		</Variant>
		<Variant title="pinned columns">
			<ATable
				:columns="pinned_columns_table.columns"
				v-model="pinned_columns_table.rows"
				:config="pinned_columns_table.config" />
		</Variant>
		<Variant title="full width">
			<ATable :columns="full_width_table.columns" v-model="full_width_table.rows" :config="full_width_table.config" />
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import type { CellFormatContext, TableColumn } from '@stonecrop/atable'
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
		format: (value: { title?: string; value?: any }, context: CellFormatContext) => {
			return `${value.title} (IP: ${context.row.ip_address})`
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
		modalComponentProps: {
			readonly: true,
		},
		format: (value: number) => {
			return new Date(Number(value)).toLocaleDateString('en-US')
		},
	},
]

const pinned_columns: TableColumn[] = [
	{
		label: 'Home Page',
		name: 'home_page',
		type: 'Data',
		align: 'left',
		edit: false,
		width: '30ch',
		pinned: true,
		format: (value: { title?: string; value?: any }) => `${value.title}`,
	},
	{
		label: 'HTTP Method',
		name: 'http_method',
		type: 'Data',
		align: 'left',
		edit: true,
		width: '20ch',
		pinned: false,
	},
	{
		label: 'Report Date',
		name: 'report_date',
		type: 'component',
		align: 'center',
		edit: true,
		width: '25ch',
		pinned: false,
		modalComponent: 'ADate',
		format: (value: number) => {
			return new Date(Number(value)).toLocaleDateString('en-US')
		},
	},
]

const http_logs = ref({
	rows: data,
	columns,
	config: { view: 'list' },
})

const http_logs_readonly = ref({
	rows: data,
	columns: readonly_columns,
	config: { view: 'list' },
})

const pinned_columns_table = ref({
	rows: data,
	columns: pinned_columns,
	config: { view: 'list' },
})

const full_width_table = ref({
	rows: data,
	columns,
	config: { view: 'list', fullWidth: true },
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('@stonecrop/themes/default/default.css');
@import url('@stonecrop/atable/styles');
</style>

<!-- enter documentation here -->
<docs lang="md"></docs>
