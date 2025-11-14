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

const { handleTableClick } = useTableNavigation({
	data: users,
	router,
	basePath: '/users',
	identifierField: 'username',
})

const columns: TableColumn[] = [
	{ label: 'Username', name: 'username', type: 'Data', width: '20ch' },
	{ label: 'Disabled', name: 'disabled', type: 'Check', width: '10ch' },
	{ label: 'Created', name: 'created_at', type: 'Date', width: '20ch' },
	{ label: 'Modified', name: 'modified_at', type: 'Date', width: '20ch' },
]

const config: TableConfig = {
	fullWidth: true,
}

function handleNewUser() {
	router.push('/users/new')
}
</script>

<style scoped>
/* List page styles are now in ~/assets/styles/common.css */
</style>
