<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Roles</h1>
			<button class="btn-primary" @click="handleNewRole">New Role</button>
		</div>
		<ClientOnly>
			<ATable :columns="columns" :rows="roles" :config="config" @row-click="handleRowClick" />
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import type { TableColumn, TableConfig, TableRow } from '@stonecrop/atable'

const route = useRoute()
const router = useRouter()

// Fetch roles from API
const { data: roles } = await useFetch<TableRow[]>('/api/roles')

const columns: TableColumn[] = [
	{ label: 'Role Name', name: 'role_name', type: 'Data', width: '25ch' },
	{ label: 'Description', name: 'description', type: 'Text', width: '40ch' },
	{ label: 'Active', name: 'active', type: 'Check', width: '10ch' },
]

const config: TableConfig = {
	fullWidth: true,
}

function handleRowClick(row: any) {
	router.push(`/roles/${row.id}`)
}

function handleNewRole() {
	router.push('/roles/new')
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
