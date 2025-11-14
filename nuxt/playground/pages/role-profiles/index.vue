<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Role Profiles</h1>
			<button class="btn-primary" @click="handleNew">New Profile</button>
		</div>
		<ClientOnly>
			<div @click="handleTableClick">
				<ATable :columns="columns" :rows="roleProfiles" :config="config" />
			</div>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import type { TableRow, TableColumn, TableConfig } from '@stonecrop/atable'

const router = useRouter()

// Fetch role profiles from API
const { data: roleProfiles } = await useFetch<TableRow[]>('/api/role-profiles')

const columns: TableColumn[] = [
	{ label: 'Profile Name', name: 'profile_name', type: 'Data', width: '30ch' },
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
		// Get the first cell (profile_name) to identify the row
		const firstCell = row.querySelector('td')
		if (firstCell && roleProfiles.value) {
			const profileName = firstCell.textContent?.trim()
			const profile = roleProfiles.value.find((p: any) => p.profile_name === profileName)
			if (profile) {
				router.push(`/role-profiles/${profile.id}`)
			}
		}
	}
}

function handleNew() {
	router.push('/role-profiles/new')
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
