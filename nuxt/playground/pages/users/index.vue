<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

// Sample data - will be replaced with API calls
const users = ref([
	{ id: '1', username: 'admin', disabled: false, created_at: '2024-01-01', modified_at: '2024-01-15' },
	{ id: '2', username: 'user1', disabled: false, created_at: '2024-01-02', modified_at: '2024-01-16' },
	{ id: '3', username: 'user2', disabled: true, created_at: '2024-01-03', modified_at: '2024-01-17' },
])

const columns = [
	{ label: 'Username', name: 'username', fieldname: 'username', fieldtype: 'Data', width: '20ch' },
	{ label: 'Disabled', name: 'disabled', fieldname: 'disabled', fieldtype: 'Check', width: '10ch' },
	{ label: 'Created', name: 'created_at', fieldname: 'created_at', fieldtype: 'Date', width: '20ch' },
	{ label: 'Modified', name: 'modified_at', fieldname: 'modified_at', fieldtype: 'Date', width: '20ch' },
]

function handleRowClick(row: any) {
	router.push(`/users/${row.id}`)
}

function handleNewUser() {
	router.push('/users/new')
}
</script>

<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Users</h1>
			<button class="btn-primary" @click="handleNewUser">New User</button>
		</div>
		<ClientOnly>
			<ATable :columns="columns" :rows="users" @row-click="handleRowClick" />
		</ClientOnly>
	</div>
</template>

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
