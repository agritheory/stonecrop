<template>
	<div class="builder-index-container">
		<div class="builder-index-header">
			<h1>DocType Builder</h1>
			<p class="subtitle">Select a DocType to view its schema, fields, permissions, and workflow</p>
		</div>
		<ClientOnly>
			<ATable :columns="columns" :rows="doctypes" :config="config" @row:click="handleRowClick" />
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import type { TableRow, TableColumn, TableConfig, RowClickEvent } from '@stonecrop/atable'

const router = useRouter()

// Fetch available DocTypes for builder from API
const { data: doctypes } = await useFetch<TableRow[]>('/api/builder/doctypes')

const columns: TableColumn[] = [
	{ label: 'DocType', name: 'displayName', fieldtype: 'Data', width: '20ch' },
	{ label: 'Module', name: 'module', fieldtype: 'Data', width: '15ch' },
	{ label: 'Description', name: 'description', fieldtype: 'Data', width: '40ch' },
	{ label: 'Fields', name: 'fields', fieldtype: 'Int', width: '10ch' },
	{ label: 'Rules', name: 'abilityRules', fieldtype: 'Int', width: '10ch' },
	{ label: 'Workflow', name: 'hasWorkflow', fieldtype: 'Check', width: '15ch' },
]

const config: TableConfig = {
	view: 'uncounted',
}

function handleRowClick({ row }: RowClickEvent) {
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
	color: var(--sc-gray-80);
}

.subtitle {
	font-size: 1.125rem;
	color: var(--sc-gray-60);
	margin: 0;
}
</style>
