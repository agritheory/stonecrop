<template>
	<Story title="default">
		<ATable :columns="http_logs.columns" :rows="http_logs.rows" :config="http_logs.config" />
	</Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { TableColumn } from 'types'
import data from './sample_data/http_logs.json'

const http_logs = ref({
	rows: data,
	columns: [
		{
			label: 'Home Page',
			name: 'home_page',
			type: 'Data',
			align: 'left',
			edit: false,
			width: '35ch',
			format: (value: { title?: string; value?: any }) => {
				return value.title
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
		// {
		//   label: "IP Address",
		//   name: "ip_address",
		//   type: "Data",
		//   align: 'left',
		//   edit: false,
		//   width: '20ch',
		// },
		// {
		//   label: "Status",
		//   name: "status",
		//   type: "Data",
		//   align: 'left',
		//   edit: true,
		//   width: '35ch',
		// },
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
	] as TableColumn[],
	config: { listView: true },
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('@agritheory/themes/default/default.css');
</style>

<!-- enter documentation here -->
<docs lang="md"></docs>
