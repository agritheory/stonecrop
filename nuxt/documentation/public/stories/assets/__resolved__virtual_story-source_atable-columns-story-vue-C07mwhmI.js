const __resolved__virtual_storySource_atableColumnsStoryVue = `<template>
	<Story title="columns">
		<Variant title="v-model:columns">
			<div style="margin-bottom: 20px">
				<h3>Columns Model Example</h3>
				<p>This example shows how to use v-model:columns to make columns reactive.</p>
				<button @click="addColumn" style="margin-right: 10px">Add Column</button>
				<button @click="removeColumn" style="margin-right: 10px">Remove Column</button>
				<button @click="resizeFirstColumn">Resize First Column</button>
			</div>

			<ATable
				v-model:rows="tableRows"
				v-model:columns="tableColumns"
				:config="tableConfig"
				@columns:update="onColumnsUpdate" />

			<div style="margin-top: 20px">
				<h4>Current Columns Configuration:</h4>
				<pre>{{ JSON.stringify(tableColumns, null, 2) }}</pre>
			</div>
		</Variant>

		<Variant title="Schema-driven columns">
			<div style="margin-bottom: 20px">
				<h3>Schema-driven columns</h3>
				<p>
					Pass a <code>:schema</code> prop instead of <code>v-model:columns</code>. ATable calls
					<code>schemaToColumns()</code> internally — <code>fieldname</code> becomes <code>name</code>,
					<code>hidden: true</code> fields are excluded, and form-only properties are stripped.
				</p>
			</div>

			<ATable v-model:rows="schemaRows" :schema="schemaFields" :config="schemaConfig" />

			<div style="margin-top: 20px">
				<h4>Schema (source of truth):</h4>
				<pre>{{ JSON.stringify(schemaFields, null, 2) }}</pre>
				<p style="font-style: italic; color: #666; margin-top: 8px">
					<code>internal_notes</code> has <code>hidden: true</code> and does not appear as a column.
				</p>
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import type { TableColumn, TableConfig, TableRow } from '@stonecrop/atable'
import type { ColumnSchema } from '@stonecrop/schema'
import { ref } from 'vue'

const sampleData: TableRow[] = [
	{ id: 1, name: 'Alice', age: 30, department: 'Engineering' },
	{ id: 2, name: 'Bob', age: 25, department: 'Design' },
	{ id: 3, name: 'Carol', age: 35, department: 'Product' },
]

const tableRows = ref<TableRow[]>([...sampleData])
const tableColumns = ref<TableColumn[]>([
	{ name: 'id', label: 'ID', width: '80px', fieldtype: 'Int' },
	{ name: 'name', label: 'Name', width: '150px', fieldtype: 'Data' },
	{ name: 'age', label: 'Age', width: '100px', fieldtype: 'Int' },
])

const tableConfig: TableConfig = {
	view: 'list',
	fullWidth: true,
}

const onColumnsUpdate = (columns: TableColumn[]) => {
	console.log('Columns updated:', columns)
}

const addColumn = () => {
	const columnCount = tableColumns.value.length
	const newColumn: TableColumn = {
		name: \`column_\${columnCount + 1}\`,
		label: \`Column \${columnCount + 1}\`,
		width: '120px',
		fieldtype: 'Data',
	}
	tableColumns.value.push(newColumn)

	// Add corresponding data to rows
	tableRows.value.forEach((row, index) => {
		row[newColumn.name] = \`Value \${index + 1}\`
	})
}

const removeColumn = () => {
	if (tableColumns.value.length > 1) {
		const removedColumn = tableColumns.value.pop()
		if (removedColumn) {
			// Remove data from rows
			tableRows.value.forEach(row => {
				delete row[removedColumn.name]
			})
		}
	}
}

const resizeFirstColumn = () => {
	if (tableColumns.value.length > 0) {
		const currentWidth = parseInt(tableColumns.value[0].width || '80')
		const newWidth = currentWidth === 80 ? 200 : 80
		tableColumns.value[0] = {
			...tableColumns.value[0],
			width: \`\${newWidth}px\`,
		}
	}
}

// Schema-driven variant
const schemaFields: ColumnSchema[] = [
	{ fieldname: 'id', fieldtype: 'Int', label: 'ID', width: '80px' },
	{ fieldname: 'name', fieldtype: 'Data', label: 'Name', width: '150px' },
	{ fieldname: 'department', fieldtype: 'Data', label: 'Department', width: '150px' },
	{ fieldname: 'age', fieldtype: 'Int', label: 'Age', width: '80px', align: 'right' },
	{ fieldname: 'internal_notes', fieldtype: 'Data', label: 'Internal Notes', hidden: true },
]

const schemaRows = ref<TableRow[]>([
	{ id: 1, name: 'Alice', department: 'Engineering', age: 30, internal_notes: 'confidential' },
	{ id: 2, name: 'Bob', department: 'Design', age: 25, internal_notes: 'confidential' },
	{ id: 3, name: 'Carol', department: 'Product', age: 35, internal_notes: 'confidential' },
])

const schemaConfig: TableConfig = { view: 'list', fullWidth: true }
<\/script>

<style scoped>
pre {
	background: #f5f5f5;
	padding: 10px;
	border-radius: 4px;
	overflow-x: auto;
	font-size: 12px;
}

button {
	padding: 8px 16px;
	background: #007acc;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

button:hover {
	background: #005999;
}

h3,
h4 {
	margin-top: 0;
}
</style>
`;
export {
  __resolved__virtual_storySource_atableColumnsStoryVue as default
};
