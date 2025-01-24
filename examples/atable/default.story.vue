<template>
	<Story title="default">
		<Variant title="default">
			<ATable v-model="default_table.rows" :columns="default_table.columns" :config="default_table.config" />
		</Variant>

		<Variant title="uncounted">
			<ATable v-model="uncounted_table.rows" :columns="uncounted_table.columns" :config="uncounted_table.config" />
		</Variant>

		<Variant title="read-only">
			<ATable v-model="readonly_table.rows" :columns="readonly_table.columns" :config="readonly_table.config" />
		</Variant>

		<Variant title="full width">
			<ATable v-model="full_width_table.rows" :columns="full_width_table.columns" :config="full_width_table.config" />
		</Variant>

		<Variant title="loading options">
			<ATableLoading>Loading</ATableLoading>
			<br />
			<ATableLoadingBar>Loading</ATableLoadingBar>
			<br />
			<ATableLoading v-show="loading">Loading</ATableLoading>
			<ATable
				v-show="!loading"
				v-model="full_width_table.rows"
				:columns="full_width_table.columns"
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

const full_width_table = reactive({
	rows,
	columns,
	config: { view: 'list', fullWidth: true },
})
</script>

<style></style>

<!-- enter documentation here -->
<docs lang="md"></docs>
