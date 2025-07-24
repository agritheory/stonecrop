<template>
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

		<Variant title="columns prop vs model comparison">
			<div style="display: flex; gap: 20px">
				<div style="flex: 1">
					<h4>Using Columns Model (Read-only)</h4>
					<ATable v-model:rows="staticRows" v-model:columns="staticColumns" :config="tableConfig" />
				</div>
				<div style="flex: 1">
					<h4>Using Columns Model (Reactive)</h4>
					<ATable
						v-model:rows="reactiveRows"
						v-model:columns="reactiveColumns"
						:config="tableConfig"
						@columns:update="onReactiveColumnsUpdate" />
				</div>
			</div>

			<div style="margin-top: 20px">
				<button @click="toggleColumnReactivity">
					{{ reactiveMode ? 'Switch to Static Columns' : 'Switch to Reactive Columns' }}
				</button>
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import type { TableColumn, TableRow } from '@stonecrop/atable'
import { ref, reactive } from 'vue'

// Sample data
const sampleData: TableRow[] = [
	{ id: 1, name: 'Alice', age: 30, department: 'Engineering' },
	{ id: 2, name: 'Bob', age: 25, department: 'Design' },
	{ id: 3, name: 'Carol', age: 35, department: 'Product' },
]

// Columns model example
const tableRows = ref<TableRow[]>([...sampleData])
const tableColumns = ref<TableColumn[]>([
	{ name: 'id', label: 'ID', width: '80px', type: 'Data' },
	{ name: 'name', label: 'Name', width: '150px', type: 'Data' },
	{ name: 'age', label: 'Age', width: '100px', type: 'Data' },
])

const tableConfig = {
	view: 'list' as const,
	fullWidth: true,
}

// Static vs reactive comparison
const staticRows = ref<TableRow[]>([...sampleData])
const reactiveRows = ref<TableRow[]>([...sampleData])
const reactiveMode = ref(true)

const staticColumns: TableColumn[] = [
	{ name: 'id', label: 'ID', width: '80px', type: 'Data' },
	{ name: 'name', label: 'Name', width: '150px', type: 'Data' },
	{ name: 'age', label: 'Age', width: '100px', type: 'Data' },
]

const reactiveColumns = ref<TableColumn[]>([
	{ name: 'id', label: 'ID', width: '80px', type: 'Data' },
	{ name: 'name', label: 'Name', width: '150px', type: 'Data' },
	{ name: 'age', label: 'Age', width: '100px', type: 'Data' },
])

// Event handlers
const onColumnsUpdate = (columns: TableColumn[]) => {
	console.log('Columns updated:', columns)
}

const onReactiveColumnsUpdate = (columns: TableColumn[]) => {
	console.log('Reactive columns updated:', columns)
}

// Actions
const addColumn = () => {
	const columnCount = tableColumns.value.length
	const newColumn: TableColumn = {
		name: `column_${columnCount + 1}`,
		label: `Column ${columnCount + 1}`,
		width: '120px',
		type: 'Data',
	}
	tableColumns.value.push(newColumn)

	// Add corresponding data to rows
	tableRows.value.forEach((row, index) => {
		row[newColumn.name] = `Value ${index + 1}`
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
			width: `${newWidth}px`,
		}
	}
}

const toggleColumnReactivity = () => {
	reactiveMode.value = !reactiveMode.value
	if (reactiveMode.value) {
		// Add department column to reactive
		if (!reactiveColumns.value.find(c => c.name === 'department')) {
			reactiveColumns.value.push({
				name: 'department',
				label: 'Department',
				width: '150px',
				type: 'Data',
			})
		}
	} else {
		// Remove department column from reactive
		const index = reactiveColumns.value.findIndex(c => c.name === 'department')
		if (index !== -1) {
			reactiveColumns.value.splice(index, 1)
		}
	}
}
</script>

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
