<template>
	<Story title="list">
		<Variant title="default">
			<ATable id="list" :columns="http_logs.columns" v-model="http_logs.rows" :config="{ view: 'list' }">
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
								:style="getRowCellStyle(col)" />
						</template>
					</ARow>
				</template>
			</ATable>
		</Variant>

		<Variant title="expandable">
			<ATable id="list" :columns="http_logs.columns" v-model="http_logs.rows" :config="{ view: 'list-expansion' }">
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
								:style="getRowCellStyle(col)" />
						</template>
						<template #content>
							<AForm class="aform-main" v-model="basic_form_schema" :data="data" />

							<ATable
								id="list"
								:columns="inbox.columns"
								:rows="chooseRandomData(inbox.rows)"
								:config="{ view: 'list-expansion' }">
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
												:style="getRowCellStyle(col)" />
										</template>
										<template #content>
											<AForm class="aform-main" v-model="basic_form_schema" :data="data" />
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
import { CSSProperties, ref } from 'vue'

import { TableColumn } from 'types'
import inbox_data from './sample_data/inbox.json'
import http_data from './sample_data/http_logs.json'
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
	rows: http_data,
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
})

const inbox = ref({
	rows: inbox_data,
	columns: [
		{
			label: 'ID',
			name: 'id',
			type: 'Data',
			align: 'left',
			edit: true,
			width: '20ch',
		},
		{
			label: 'Email',
			name: 'email',
			type: 'Data',
			align: 'left',
			edit: false,
			width: '35ch',
		},
		{
			label: 'Name',
			name: 'name',
			type: 'Data',
			align: 'left',
			edit: true,
			width: '35ch',
		},
	] as TableColumn[],
})

const chooseRandomData = (rows: any[]) => {
	return Array(3)
		.fill(0)
		.map((_, i) => rows[Math.floor(Math.random() * rows.length)])
}

const getRowCellStyle = (column: TableColumn): CSSProperties => {
	return {
		minWidth: column?.width || '40ch',
		textAlign: column?.align || 'center',
	}
}

const rowNav = {
	'keydown.up': (event: KeyboardEvent) => {
		event.preventDefault()
		event.stopPropagation()

		const target =
			event.target instanceof HTMLTableCellElement ? event.target.parentElement : (event.target as HTMLTableRowElement)

		const $row = target.previousElementSibling
			? (target.previousElementSibling as HTMLTableRowElement)
			: (target as HTMLTableRowElement)

		$row.focus()
		return true
	},
	'keydown.down': (event: KeyboardEvent) => {
		event.preventDefault()
		event.stopPropagation()

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
@import url('@stonecrop/themes/default/default.css');

tr:focus {
	background-color: lightblue;
	outline: auto;
}

form {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: baseline;
}

form div {
	min-width: 40ch;
	border: 1px solid transparent;
	padding: 0rem;
	margin: 0rem;
	margin-right: 1ch;
}

input {
	width: calc(100% - 1ch);
	outline: 1px solid transparent;
	border: 1px solid var(--input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	min-height: 1.15rem;
	border-radius: 0.25rem;
}

label {
	color: var(--input-label-color);
	display: block;
	min-height: 1.15rem;
	padding: 0rem;
	margin: 0rem;
	border: 1px solid transparent;
	margin-bottom: 0.25rem;
	z-index: 2;
	font-size: 80%;
	position: absolute;
	background: white;
	margin: calc(-1.5rem - calc(2.15rem / 2)) 0 0 1ch;
	padding: 0 0.25ch 0 0.25ch;
}

input:focus {
	border: 1px solid var(--input-active-border-color);
}

input:focus + label {
	color: var(--input-active-label-color);
}
</style>

<!-- enter documentation here -->
<docs lang="md"></docs>
