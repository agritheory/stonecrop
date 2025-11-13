<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

// Sample data
const roleProfiles = ref([
	{ id: '1', profile_name: 'System Administrator', description: 'Full system access profile', active: true },
	{ id: '2', profile_name: 'Department Manager', description: 'Department management profile', active: true },
])

const columns = [
	{ label: 'Profile Name', name: 'profile_name', fieldname: 'profile_name', fieldtype: 'Data', width: '30ch' },
	{ label: 'Description', name: 'description', fieldname: 'description', fieldtype: 'Text', width: '40ch' },
	{ label: 'Active', name: 'active', fieldname: 'active', fieldtype: 'Check', width: '10ch' },
]

function handleRowClick(row: any) {
	router.push(`/role-profiles/${row.id}`)
}

function handleNew() {
	router.push('/role-profiles/new')
}
</script>

<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Role Profiles</h1>
			<button class="btn-primary" @click="handleNew">New Profile</button>
		</div>
		<ClientOnly>
			<ATable :columns="columns" :rows="roleProfiles" @row-click="handleRowClick" />
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
