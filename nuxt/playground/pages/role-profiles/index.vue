<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Role Profiles</h1>
			<button class="btn-primary" @click="handleNew">New Profile</button>
		</div>
		<ClientOnly>
			<div @click="handleTableClick">
				<ATable :columns="columns" :rows="roleProfiles" />
			</div>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import type { TableRow, TableColumn } from '@stonecrop/atable'

const router = useRouter()

// Fetch role profiles from API
const { data: roleProfiles } = await useFetch<TableRow[]>('/api/role-profiles')

const { handleTableClick } = useTableNavigation({
	data: roleProfiles,
	router,
	basePath: '/role-profiles',
	identifierField: 'profile_name',
})

const columns: TableColumn[] = [
	{ label: 'Profile Name', name: 'profile_name', fieldtype: 'Data', width: '30ch' },
	{ label: 'Description', name: 'description', fieldtype: 'Text', width: '40ch' },
	{ label: 'Active', name: 'active', fieldtype: 'Check', width: '10ch' },
]

function handleNew() {
	router.push('/role-profiles/new')
}
</script>

<style scoped>
/* List page styles are now in ~/assets/styles/common.css */
</style>
