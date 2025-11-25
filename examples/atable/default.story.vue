<template>
	<Story title="default">
		<Variant title="default">
			<ATable
				v-model:rows="default_table.rows"
				v-model:columns="default_table.columns"
				:config="default_table.config" />
		</Variant>

		<Variant title="uncounted">
			<ATable
				v-model:rows="uncounted_table.rows"
				v-model:columns="uncounted_table.columns"
				:config="uncounted_table.config" />
		</Variant>

		<Variant title="read-only">
			<ATable
				v-model:rows="readonly_table.rows"
				v-model:columns="readonly_table.columns"
				:config="readonly_table.config" />
		</Variant>

		<Variant title="full width">
			<ATable
				v-model:rows="full_width_table.rows"
				v-model:columns="full_width_table.columns"
				:config="full_width_table.config" />
		</Variant>

		<Variant title="resizable">
			<ATable v-model:rows="resizable_1.rows" v-model:columns="resizable_1.columns" :config="resizable_1.config" />
			<ATable v-model:rows="resizable_2.rows" v-model:columns="resizable_2.columns" :config="resizable_2.config" />
		</Variant>

		<Variant title="filterable">
			<ATable
				v-model:rows="filterable_table.rows"
				v-model:columns="filterable_table.columns"
				:config="filterable_table.config" />
		</Variant>

		<Variant title="loading options">
			<ATableLoading>Loading</ATableLoading>
			<br />
			<ATableLoadingBar>Loading</ATableLoadingBar>
			<br />
			<ATableLoading v-show="loading">Loading</ATableLoading>
			<ATable
				v-show="!loading"
				v-model:rows="full_width_table.rows"
				v-model:columns="full_width_table.columns"
				:config="full_width_table.config" />
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import type { TableColumn } from '@stonecrop/atable'
import { ref, onMounted, reactive } from 'vue'

import rows from './sample_data/http_logs.json'

const loading = ref()

onMounted(() => {
	loading.value = true
	setTimeout(() => {
		loading.value = false
	}, 2500)
})

const columns: TableColumn[] = [
	{
		label: 'Home Page',
		name: 'home_page',
		type: 'Data',
		align: 'left',
		edit: false,
		width: '40ch',
		format: (value: { title?: string; value?: any }, context) => {
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
		modalComponent: 'DateInput',
		format: (value: number) => new Date(value).toLocaleDateString('en-US'),
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
		edit: false,
		width: '20ch',
	},
	{
		label: 'Report Date',
		name: 'report_date',
		type: 'component',
		align: 'center',
		edit: false,
		width: '25ch',
		modalComponent: 'DateInput',
		modalComponentExtraProps: { readonly: true },
		format: (value: number) => new Date(value).toLocaleDateString('en-US'),
	},
]

const columns_filterable: TableColumn[] = [
	{
		label: 'Home Page',
		name: 'home_page',
		type: 'Data',
		align: 'left',
		edit: false,
		width: '40ch',
		sortable: true,
		filterable: true,
		filterType: 'text',
		format: (value: { title?: string; value?: any }, context) => {
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
		sortable: true,
		filterable: true,
		filterType: 'select',
		filterOptions: [
			{ label: 'GET', value: 'GET' },
			{ label: 'POST', value: 'POST' },
			{ label: 'PUT', value: 'PUT' },
			{ label: 'DELETE', value: 'DELETE' },
		],
	},
	{
		label: 'Status',
		name: 'status',
		type: 'Data',
		align: 'center',
		edit: true,
		width: '15ch',
		sortable: true,
		filterable: true,
		filterType: 'select', // Auto-generate options from data
	},
	{
		label: 'Report Date',
		name: 'report_date',
		type: 'component',
		align: 'center',
		edit: true,
		width: '25ch',
		sortable: true,
		filterable: true,
		filterType: 'dateRange',
		modalComponent: 'DateInput',
		format: (value: number) => {
			const originalDate = new Date(value)
			const currentYear = new Date().getFullYear()
			const updatedDate = new Date(currentYear, originalDate.getMonth(), originalDate.getDate())
			return updatedDate.toLocaleDateString('en-US')
		},
	},
]

const default_table = reactive({
	rows,
	columns,
	config: { view: 'list' },
})

const uncounted_table = reactive({
	rows,
	columns,
	config: { view: 'uncounted' },
})

const readonly_table = reactive({
	rows,
	columns: readonly_columns,
	config: { view: 'list' },
})

const resizable_1 = reactive({
	rows,
	columns: [...columns].map(column => ({ ...column, resizable: true })),
	config: { view: 'list' },
})

const resizable_2 = reactive({
	rows,
	columns: [...columns].map(column => ({ ...column, resizable: true })),
	config: { view: 'list' },
})

const full_width_table = reactive({
	rows,
	columns,
	config: { view: 'list', fullWidth: true },
})

const filterable_table = reactive({
	rows,
	columns: columns_filterable,
	config: { view: 'list' },
})
</script>

<style></style>

<!-- enter documentation here -->
<docs lang="md"></docs>
