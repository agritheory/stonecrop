<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

// Sample data
const abilityRules = ref([
	{ id: '1', role_id: '1', doctype: 'User', action: 'create', subject: 'all', inverted: false, active: true },
	{ id: '2', role_id: '2', doctype: 'User', action: 'read', subject: 'own', inverted: false, active: true },
	{ id: '3', role_id: '3', doctype: 'User', action: 'update', subject: 'own', inverted: false, active: true },
])

const columns = [
	{ label: 'Role', name: 'role_id', fieldname: 'role_id', fieldtype: 'Link', width: '20ch' },
	{ label: 'DocType', name: 'doctype', fieldname: 'doctype', fieldtype: 'Link', width: '20ch' },
	{ label: 'Action', name: 'action', fieldname: 'action', fieldtype: 'Select', width: '15ch' },
	{ label: 'Subject', name: 'subject', fieldname: 'subject', fieldtype: 'Select', width: '15ch' },
	{ label: 'Inverted', name: 'inverted', fieldname: 'inverted', fieldtype: 'Check', width: '10ch' },
	{ label: 'Active', name: 'active', fieldname: 'active', fieldtype: 'Check', width: '10ch' },
]

function handleRowClick(row: any) {
	router.push(`/ability-rules/${row.id}`)
}

function handleNew() {
	router.push('/ability-rules/new')
}
</script>

<template>
	<div class="page-container">
		<div class="page-header">
			<h1>Ability Rules</h1>
			<button class="btn-primary" @click="handleNew">New Rule</button>
		</div>
		<ClientOnly>
			<ATable :columns="columns" :rows="abilityRules" @row-click="handleRowClick" />
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
