<template>
	<Story title="list">
		<ATable id="list" :columns="http_logs.columns" :rows="http_logs.rows" :config="http_logs.config">
			<template #body="{ data }: { data: TableDataStore }">
				<ARow
					ref="rows"
					v-for="(row, rowIndex) in data.rows"
					:key="row.id || v4()"
					:row="row"
					:rowIndex="rowIndex"
					:tableid="data.id"
					:tabIndex="0"
					:addNavigation="rowNav">
					<ACell
						v-for="(col, colIndex) in data.columns"
						:key="colIndex"
						:tableid="data.id"
						:col="col"
						spellcheck="false"
						:tabIndex="0"
						:addNavigation="rowNav"
						:contenteditable="false"
						:rowIndex="rowIndex"
						:colIndex="colIndex + (data.zeroColumn ? 0 : -1)"
						:style="{
							textAlign: col?.align?.toLowerCase() || 'center',
							minWidth: col?.width || '40ch',
						}" />
				</ARow>
			</template>
		</ATable>
	</Story>
</template>

<script lang="ts" setup>
import { v4 } from 'uuid'
import { ref } from 'vue'

import { useKeyboardNav } from '@agritheory/utilities'

import { TableColumn } from 'types'
import data from './sample_data/http_logs.json'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import TableDataStore from '@/components'

const rows = ref<HTMLTableRowElement[]>([])
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
			component: 'ADate',
			format: (value: number) => {
				return new Date(Number(value)).toLocaleDateString('en-US')
			},
		},
	] as TableColumn[],
	config: { numberedRows: true, treeView: false },
})

let rowNav = {
	'keydown.up': e => {
		let target = e.target instanceof HTMLTableCellElement ? e.target.parentElement : e.target
		const $row = target.previousElementSibling
			? (target.previousElementSibling as HTMLTableRowElement)
			: (target as HTMLTableRowElement)
		$row.focus()
		return true
	},
	'keydown.down': e => {
		let target = e.target instanceof HTMLTableCellElement ? e.target.parentElement : e.target
		const $row = target.nextElementSibling
			? (target.nextElementSibling as HTMLTableRowElement)
			: (target as HTMLTableRowElement)
		$row.focus()
		return true
	},
}

rowNav['keydown.alt.up'] = rowNav['keydown.up']
rowNav['keydown.alt.down'] = rowNav['keydown.down']

rowNav['keydown.shift.enter'] = rowNav['keydown.up']
rowNav['keydown.enter'] = rowNav['keydown.down']

//useKeyboardNav([{ selectors: rows }])
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import '@/themes/atable.css';

tr:focus {
	background-color: lightblue;
	outline: auto;
}
</style>

<!-- enter documentation here -->
<docs lang="md"></docs>