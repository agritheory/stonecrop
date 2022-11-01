<template>
	<Story title="list">
		<Variant title="default">
			<ATable id="list" :columns="http_logs.columns" :rows="http_logs.rows" :config="{ listView: true }">
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
						<template #default>
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
						</template>
					</ARow>
				</template>
			</ATable>
		</Variant>

		<Variant title="expandable">
			<ATable id="list" :columns="http_logs.columns" :rows="http_logs.rows" :config="{ listExpansionView: true }">
				<template #body="{ data }: { data: TableDataStore }">
					<AExpansionRow
						ref="rows"
						:data-id="row.id"
						v-for="(row, rowIndex) in data.rows"
						:key="row.id || v4()"
						:row="row"
						:rowIndex="rowIndex"
						:tableid="data.id"
						:tabIndex="0"
						:addNavigation="rowNav">
						<template #row>
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
						</template>
						<template #content>
							<AForm class="aform-main" :schema="basic_form_schema" :data="data" />

							<ATable
								id="list"
								:columns="http_logs.columns"
								:rows="http_logs.rows"
								:config="{ listExpansionView: true }">
								<template #body="{ data }: { data: TableDataStore }">
									<AExpansionRow
										ref="rows"
										:data-id="row.id"
										v-for="(row, rowIndex) in data.rows"
										:key="row.id || v4()"
										:row="row"
										:rowIndex="rowIndex"
										:tableid="data.id"
										:tabIndex="0"
										:addNavigation="rowNav">
										<template #row>
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
										</template>
										<template #content>
											<AForm class="aform-main" :schema="basic_form_schema" :data="data" />
										</template>
									</AExpansionRow>
								</template>
							</ATable>
						</template>
					</AExpansionRow>
				</template>
			</ATable>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { v4 } from 'uuid'
import { ref } from 'vue'

import { TableColumn } from 'types'
import data from './sample_data/http_logs.json'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import TableDataStore from '@/components'

const rows = ref<HTMLTableRowElement[]>([])

const basic_form_schema = ref([
	{
		fieldname: 'first_name',
		component: 'ATextInput',
		label: 'First Name',
	},
	{
		fieldname: 'middle_name',
		component: 'ATextInput',
		label: 'Middle Name',
	},
	{
		fieldname: 'last_name',
		component: 'ATextInput',
		label: 'Last Name',
	},
	{
		fieldname: 'age',
		component: 'ANumericInput',
		label: 'Age',
	},
	{
		fieldname: 'date',
		fieldtype: 'Date',
		component: 'ATextInput',
		label: 'Date',
	},
	{
		fieldname: 'card',
		fieldtype: 'Card',
		component: 'ATextInput',
		label: 'Card',
	},
	{
		fieldname: 'phone',
		fieldtype: 'Phone',
		component: 'ATextInput',
		label: 'Phone',
	},
])

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
})

let rowNav = {
	'keydown.up': (event: KeyboardEvent) => {
		const target =
			event.target instanceof HTMLTableCellElement ? event.target.parentElement : (event.target as HTMLTableRowElement)

		const $row = target.previousElementSibling
			? (target.previousElementSibling as HTMLTableRowElement)
			: (target as HTMLTableRowElement)

		$row.focus()
		return true
	},
	'keydown.down': (event: KeyboardEvent) => {
		const target =
			event.target instanceof HTMLTableCellElement ? event.target.parentElement : (event.target as HTMLTableRowElement)

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
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('@agritheory/themes/default/default.css');
tr:focus {
	background-color: lightblue;
	outline: auto;
}
</style>

<!-- enter documentation here -->
<docs lang="md"></docs>
