<template>
	<div class="page-container">
		<div class="page-header">
			<h1>DocTypes</h1>
			<button class="btn-primary" @click="handleNew">New DocType</button>
		</div>
		<ClientOnly>
			<ATable :columns="columns" :rows="doctypes" :config="config" @row-click="handleRowClick" />
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import type { TableRow, TableColumn, TableConfig } from '@stonecrop/atable'
import { ref } from 'vue'

const router = useRouter()

// Sample data
const doctypes = ref<TableRow[]>([
	{ id: '1', name: 'User', module: 'Core', is_submittable: false, is_tree: false },
	{ id: '2', name: 'Role', module: 'Core', is_submittable: false, is_tree: true },
	{ id: '3', name: 'Task', module: 'Projects', is_submittable: true, is_tree: false },
])

const columns: TableColumn[] = [
	{ label: 'Name', name: 'name', type: 'Data', width: '25ch' },
	{ label: 'Module', name: 'module', type: 'Data', width: '20ch' },
	{ label: 'Submittable', name: 'is_submittable', type: 'Check', width: '12ch' },
	{ label: 'Tree', name: 'is_tree', type: 'Check', width: '10ch' },
]

const config: TableConfig = {
	fullWidth: true,
}

function handleRowClick(row: any) {
	router.push(`/doctypes/${row.id}`)
}

function handleNew() {
	router.push('/doctypes/new')
}
</script>

<style scoped>
.page-container {
	padding: 2rem;
}

.page-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}

.btn-primary {
	padding: 0.5rem 1rem;
	background: #4f46e5;
	color: white;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
}

.btn-primary:hover {
	background: #4338ca;
}
</style>
