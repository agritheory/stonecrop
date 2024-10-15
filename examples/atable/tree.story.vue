<template>
	<Story title="tree">
		<Variant title="default">
			<ATable v-model="coa.rows" :columns="coa.columns" :config="coa.config" />
		</Variant>

		<Variant title="pinned columns">
			<ATable v-model="pinned.rows" :columns="pinned.columns" :config="pinned.config" />
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import type { TableColumn, TableConfig, TableRow } from '@stonecrop/atable'
import { ref } from 'vue'

import data from './sample_data/coa.json'

const default_columns = [
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
] as TableColumn[]

const pinned_columns = [
	{
		label: 'Number',
		name: 'account_number',
		type: 'Data',
		align: 'left',
		edit: false,
		width: '10ch',
		pinned: false,
	},
	{
		label: 'Account',
		name: 'account_title',
		type: 'Data',
		align: 'left',
		edit: true,
		width: '50ch',
		pinned: true,
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
]

const coa = ref({
	rows: data as TableRow[],
	columns: default_columns,
	config: { view: 'tree' } as TableConfig,
})

const pinned = ref({
	rows: data as TableRow[],
	columns: pinned_columns,
	config: { view: 'tree' } as TableConfig,
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('@stonecrop/themes/default/default.css');
@import url('@stonecrop/atable/styles');
</style>

<!-- enter documentation here -->
<docs lang="md"></docs>
