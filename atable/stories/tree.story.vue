<template>
	<Story title="tree">
		<ATable :columns="coa.columns" :rows="coa.rows" :config="coa.config" />
	</Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import data from './sample_data/coa.json'
import { TableColumn, TableConfig, TableRow } from 'types/index'

const coa = ref({
	rows: data as TableRow[],
	columns: [
		{
			label: 'Number',
			name: 'account_number',
			type: 'Data',
			align: 'left',
			edit: false,
			width: '10ch',
		},
		{
			label: 'Account',
			name: 'account_title',
			type: 'Data',
			align: 'left',
			edit: true,
			width: '50ch',
		},
		{
			label: 'Balance',
			name: 'balance',
			type: 'Data',
			align: 'left',
			edit: false,
			width: '20ch',
			format: (value: { title?: string; value?: any }) => {
				return value.title
			},
			modalComponent: 'TestModalComponent',
		},
	] as TableColumn[],
	config: { view: 'tree' } as TableConfig,
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('@agritheory/themes/default/default.css');
</style>

<!-- enter documentation here -->
<docs lang="md"></docs>
