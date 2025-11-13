<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

// Sample data - will be replaced with API calls
const roles = ref([
	{ id: '1', role_name: 'Administrator', description: 'Full system access', active: true, parent_role: null },
	{ id: '2', role_name: 'Manager', description: 'Manage team and resources', active: true, parent_role: '1' },
	{ id: '3', role_name: 'User', description: 'Basic user access', active: true, parent_role: '2' },
])

const columns = [
	{ label: 'Role Name', name: 'role_name', fieldname: 'role_name', fieldtype: 'Data', width: '25ch' },
	{ label: 'Description', name: 'description', fieldname: 'description', fieldtype: 'Text', width: '40ch' },
	{ label: 'Active', name: 'active', fieldname: 'active', fieldtype: 'Check', width: '10ch' },
]

function handleRowClick(row: any) {
	router.push(`/roles/${row.id}`)
}

function handleNewRole() {
	router.push('/roles/new')
}
</script>

<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Roles</h1>
			<button class="btn-primary" @click="handleNewRole">New Role</button>
		</div>
		<ClientOnly>
			<ATable :columns="columns" :rows="roles" @row-click="handleRowClick" />
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
