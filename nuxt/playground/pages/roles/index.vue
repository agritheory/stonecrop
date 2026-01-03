<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Roles</h1>
			<button class="btn-primary" @click="handleNewRole">New Role</button>
		</div>
		<ClientOnly>
			<div @click="handleTableClick">
				<ATable :columns="columns" :rows="roles" />
			</div>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import type { TableColumn, TableRow } from '@stonecrop/atable'

const router = useRouter()

// Fetch roles from API
const { data: roles } = await useFetch<TableRow[]>('/api/roles')

const { handleTableClick } = useTableNavigation({
	data: roles,
	router,
	basePath: '/roles',
	identifierField: 'role_name',
})

const columns: TableColumn[] = [
	{ label: 'Role Name', name: 'role_name', fieldtype: 'Data', width: '25ch' },
	{ label: 'Description', name: 'description', fieldtype: 'Text', width: '40ch' },
	{ label: 'Active', name: 'active', fieldtype: 'Check', width: '10ch' },
]

function handleNewRole() {
	router.push('/roles/new')
}
</script>

<style scoped>
/* List page styles are now in ~/assets/styles/common.css */
</style>
