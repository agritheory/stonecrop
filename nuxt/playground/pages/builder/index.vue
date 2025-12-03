<template>
	<div class="builder-index-container">
		<div class="builder-index-header">
			<h1>DocType Builder</h1>
			<p class="subtitle">Select a DocType to view its schema, fields, permissions, and state machine</p>
		</div>
		<ClientOnly>
			<ATable :columns="columns" :rows="doctypes" :config="config" @row-click="handleRowClick" />
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import type { TableRow, TableColumn, TableConfig } from '@stonecrop/atable'

const router = useRouter()

// Fetch available DocTypes for builder from API
const { data: doctypes } = await useFetch<TableRow[]>('/api/builder/doctypes')

const columns: TableColumn[] = [
	{ label: 'DocType', name: 'displayName', type: 'Data', width: '20ch' },
	{ label: 'Module', name: 'module', type: 'Data', width: '15ch' },
	{ label: 'Description', name: 'description', type: 'Data', width: '40ch' },
	{ label: 'Fields', name: 'fields', type: 'Int', width: '10ch' },
	{ label: 'Rules', name: 'abilityRules', type: 'Int', width: '10ch' },
	{ label: 'State Machine', name: 'hasStateMachine', type: 'Check', width: '15ch' },
]

const config: TableConfig = {
	view: 'uncounted',
}

function handleRowClick(row: any) {
	// Navigate to the specific builder page using the lowercase 'name' field
	router.push(`/builder/${row.name}`)
}
</script>

<style scoped>
.builder-index-container {
	max-width: 1400px;
	margin: 0 auto;
	padding: 2rem;
}

.builder-index-header {
	text-align: center;
	padding: 2rem 0 3rem;
}

.builder-index-header h1 {
	font-size: 2.5rem;
	margin: 0 0 1rem;
	font-weight: 700;
	color: #1a202c;
}

.subtitle {
	font-size: 1.125rem;
	color: #4a5568;
	margin: 0;
}

/* Table styling */
:deep(.atable) {
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
	border-radius: 1rem;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	border: 1px solid rgba(0, 0, 0, 0.05);
}

:deep(.atable tbody tr),
.clickable-row {
	cursor: pointer;
	transition: background-color 0.15s ease;
}

:deep(.atable tbody tr:hover),
.clickable-row:hover {
	background: rgba(0, 220, 130, 0.05);
}

:deep(.atable th) {
	background: rgba(0, 220, 130, 0.1);
	color: #1a202c;
	font-weight: 600;
	padding: 1rem;
}

:deep(.atable td) {
	padding: 1rem;
	color: #2d3748;
}
</style>
