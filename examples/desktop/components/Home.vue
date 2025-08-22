<template>
	<div class="home-wrapper">
		<AForm v-model="schema" />
	</div>
</template>

<script setup lang="ts">
import { AForm } from '@stonecrop/aform'
import { ref } from 'vue'

const { doctypes = ['todo', 'issue'] } = defineProps<{ doctypes?: string[] }>()

// Create schema for displaying doctypes in an ATable
const schema = ref([
	{
		component: 'ATable',
		config: { view: 'list' },
		columns: [
			{ name: 'name', label: 'Name', fieldtype: 'Data' },
			{ name: 'slug', label: 'Slug', fieldtype: 'Data' },
			{ name: 'description', label: 'Description', fieldtype: 'Data' },
			{ name: 'routes', label: 'Available Routes', fieldtype: 'Data' },
		],
		rows: doctypes.map(doctype => ({
			id: doctype,
			name: doctype.charAt(0).toUpperCase() + doctype.slice(1),
			slug: doctype,
			description: `Manage ${doctype} records`,
			routes: `/${doctype}/ (list), /${doctype}/1 (form)`,
		})),
	},
])
</script>

<style scoped>
.home-wrapper {
	min-height: 100vh;
	background-color: #f9fafb;
	padding: 2rem;
}

/* AForm-based View Styles */
.home-wrapper :deep(.view-header) {
	margin-bottom: 2rem;
}

.home-wrapper :deep(.view-header h1) {
	margin: 0.5rem 0 0 0;
	color: #1f2937;
	font-size: 2rem;
	font-weight: 700;
}

.home-wrapper :deep(.view-actions) {
	margin: 1rem 0 2rem 0;
}

.home-wrapper :deep(.empty-state) {
	text-align: center;
	padding: 3rem 1rem;
	color: #6b7280;
}

.home-wrapper :deep(.empty-state p) {
	margin-bottom: 1rem;
	font-size: 1.125rem;
}

/* Table Styles for AForm */
.home-wrapper :deep(.aform-table) {
	background: white;
	border-radius: 8px;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	overflow: hidden;
}

.home-wrapper :deep(.aform-table table) {
	width: 100%;
	border-collapse: collapse;
}

.home-wrapper :deep(.aform-table th) {
	background-color: #f9fafb;
	padding: 0.75rem 1rem;
	text-align: left;
	font-weight: 600;
	color: #374151;
	border-bottom: 1px solid #e5e7eb;
}

.home-wrapper :deep(.aform-table td) {
	padding: 0.75rem 1rem;
	border-bottom: 1px solid #f3f4f6;
	color: #374151;
}

.home-wrapper :deep(.aform-table tbody tr:hover) {
	background-color: #f9fafb;
	cursor: pointer;
}

/* Button Styles */
.home-wrapper :deep(.btn-primary) {
	background: #3b82f6;
	color: white;
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 500;
	font-size: 0.875rem;
	transition: all 0.2s ease;
}

.home-wrapper :deep(.btn-primary:hover:not(:disabled)) {
	background: #2563eb;
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
	.home-wrapper {
		padding: 1rem;
	}
}
</style>
