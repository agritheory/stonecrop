<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Ability Rules</h1>
			<button class="btn-primary" @click="handleNew">New Rule</button>
		</div>
		<ClientOnly>
			<div @click="handleTableClick">
				<ATable :columns="columns" :rows="abilityRules" :config="config" />
			</div>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import type { TableColumn, TableConfig, TableRow } from '@stonecrop/atable'

const route = useRoute()
const router = useRouter()

// Fetch ability rules from API
const { data: abilityRules } = await useFetch<TableRow[]>('/api/ability-rules')

const columns: TableColumn[] = [
	{ label: 'Role', name: 'role_id', type: 'Link', width: '20ch' },
	{ label: 'DocType', name: 'doctype', type: 'Link', width: '20ch' },
	{ label: 'Action', name: 'action', type: 'Select', width: '15ch' },
	{ label: 'Subject', name: 'subject', type: 'Select', width: '15ch' },
	{ label: 'Inverted', name: 'inverted', type: 'Check', width: '10ch' },
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
		// Get all cells to match the row
		const cells = Array.from(row.querySelectorAll('td'))
		if (cells.length >= 2 && abilityRules.value) {
			const roleId = cells[0]?.textContent?.trim()
			const doctype = cells[1]?.textContent?.trim()
			const rule = abilityRules.value.find((r: any) => r.role_id === roleId && r.doctype === doctype)
			if (rule) {
				router.push(`/ability-rules/${rule.id}`)
			}
		}
	}
}

function handleNew() {
	router.push('/ability-rules/new')
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
