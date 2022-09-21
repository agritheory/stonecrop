<template>
	<Story title="tree">
		<ATable :columns="coa.columns" :rows="coa.rows" :config="coa.config" />
	</Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import data from '@/assets/sample_data/coa.json'

const coa = ref({
	rows: data,
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
			component: 'TestModalComponent',
		},
	],
	config: { numberedRows: false, treeView: true },
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import '@/assets/default.css';
</style>

<!-- enter documentation here -->
<docs lang="md"></docs>
