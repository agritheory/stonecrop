<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Users</h1>
			<button class="btn-primary" @click="handleNewUser">New User</button>
		</div>
		<ClientOnly>
			<div @click="handleTableClick">
				<ATable :columns="columns" :rows="users" :config="config" />
			</div>
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

function handleTableClick(event: MouseEvent) {
	// Find the closest row element
	const target = event.target as HTMLElement
	const row = target.closest('tbody tr')

	if (row) {
		// Get the first cell (username) to identify the row
		const firstCell = row.querySelector('td')
		if (firstCell && users.value) {
			const username = firstCell.textContent?.trim()
			const user = users.value.find((u: any) => u.username === username)
			if (user) {
				router.push(`/users/${user.id}`)
			}
		}
	}
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

/* Make table rows clickable */
:deep(tbody tr) {
	cursor: pointer;
	transition: background-color 0.15s ease;
}

:deep(tbody tr:hover) {
	background-color: #f3f4f6;
}
</style>
