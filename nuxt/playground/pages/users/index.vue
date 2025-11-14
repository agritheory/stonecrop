<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Users</h1>
			<button class="btn-primary" @click="handleNewUser">New User</button>
		</div>
		<ClientOnly>
			<ATable :columns="columns" :rows="users" :config="config" @row-click="handleRowClick" />
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import type { TableColumn, TableConfig, TableRow } from '@stonecrop/atable'

const router = useRouter()

// Fetch users from API
const { data: users } = await useFetch<TableRow[]>('/api/users')

const columns: TableColumn[] = [
	{ label: 'Username', name: 'username', type: 'Data', width: '20ch' },
	{ label: 'Disabled', name: 'disabled', type: 'Check', width: '10ch' },
	{ label: 'Created', name: 'created_at', type: 'Date', width: '20ch' },
	{ label: 'Modified', name: 'modified_at', type: 'Date', width: '20ch' },
]

const config: TableConfig = {
	fullWidth: true,
}

function handleRowClick(row: any) {
	router.push(`/users/${row.id}`)
}

function handleNewUser() {
	router.push('/users/new')
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
