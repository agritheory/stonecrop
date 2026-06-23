<template>
	<div class="docbuilder-index-container">
		<div class="docbuilder-header">
			<h1>DocType Builder</h1>
			<p class="subtitle">Select a DocType to view and edit its schema</p>
		</div>
		<ClientOnly>
			<div v-if="loading" class="loading">Loading doctypes...</div>
			<ATable v-else :columns="columns" :rows="doctypes" :config="config" @row-click="handleRowClick" />
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import type { TableRow, TableColumn, TableConfig } from '@stonecrop/atable'
import { ref, onMounted } from 'vue'
import { useRouter } from 'nuxt/app'

const router = useRouter()
const doctypes = ref<TableRow[]>([])
const loading = ref(true)

const columns: TableColumn[] = [
	{ label: 'Name', name: 'name', fieldtype: 'Data', width: '20ch' },
	{ label: 'Fields', name: 'fieldCount', fieldtype: 'Int', width: '10ch' },
]

const config: TableConfig = {
	view: 'uncounted',
}

onMounted(async () => {
	try {
		const data = await $fetch<TableRow[]>('/api/_stonecrop/docbuilder/doctypes')
		doctypes.value = data
	} catch (error) {
		console.error('Error loading doctypes:', error)
	} finally {
		loading.value = false
	}
})

function handleRowClick(row: any) {
	router.push(`/docbuilder/${row.slug}`)
}
</script>

<style scoped>
.docbuilder-index-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
}

.docbuilder-header {
	text-align: center;
	padding: 2rem 0 3rem;
}

.docbuilder-header h1 {
	font-size: 2.5rem;
	margin: 0 0 1rem;
	font-weight: 700;
}

.subtitle {
	font-size: 1.125rem;
	color: #6b7280;
	margin: 0;
}

.loading {
	text-align: center;
	padding: 2rem;
	color: #6b7280;
}
</style>
