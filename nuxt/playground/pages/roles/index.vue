<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Roles</h1>
			<button class="btn-primary" @click="handleNewRole">New Role</button>
		</div>
		<ClientOnly>
			<div @click="handleTableClick">
				<ATable :columns="columns" :rows="roles" :config="config" />
			</div>
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

function handleTableClick(event: MouseEvent) {
	// Find the closest row element
	const target = event.target as HTMLElement
	const row = target.closest('tbody tr')

	if (row) {
		// Get the first cell (role_name) to identify the row
		const firstCell = row.querySelector('td')
		if (firstCell && roles.value) {
			const roleName = firstCell.textContent?.trim()
			const role = roles.value.find((r: any) => r.role_name === roleName)
			if (role) {
				router.push(`/roles/${role.id}`)
			}
		}
	}
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

/* Make table rows clickable */
:deep(tbody tr) {
	cursor: pointer;
	transition: background-color 0.15s ease;
}

:deep(tbody tr:hover) {
	background-color: #f3f4f6;
}
</style>
