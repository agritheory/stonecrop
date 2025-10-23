<template>
	<div class="view-wrapper">
		<Desktop :available-doctypes="availableDoctypes" :show-debug="showDebug" />

		<!-- Operation Log Panel - pass operation log data as props -->
		<OperationLogPanel
			v-if="showDebug"
			:show="showOperationLog"
			:operations="operations"
			:current-index="currentIndex"
			:can-undo="canUndo"
			:can-redo="canRedo"
			@close="showOperationLog = false" />

		<!-- Toggle button for operation log -->
		<button v-if="showDebug" class="operation-log-toggle" @click="toggleOperationLog">
			{{ showOperationLog ? '✕' : '📋' }} Operation Log
		</button>
	</div>
</template>

<script setup lang="ts">
import { Desktop } from '@stonecrop/desktop'
import { useStonecrop } from '@stonecrop/stonecrop'
import { ref } from 'vue'

import OperationLogPanel from './OperationLogPanel.vue'

interface Props {
	availableDoctypes?: string[]
	showDebug?: boolean
}

const { availableDoctypes = ['todo-list', 'todo-form', 'issue-list', 'issue-form'], showDebug = true } =
	defineProps<Props>()

const showOperationLog = ref(false)

// Single unified interface - everything from useStonecrop
const {
	operationLog: { operations, currentIndex, canUndo, canRedo },
} = useStonecrop()

function toggleOperationLog() {
	showOperationLog.value = !showOperationLog.value
}
</script>

<style scoped>
.view-wrapper {
	min-height: 100vh;
	box-sizing: border-box; /* Include padding in height calculation */
	background-color: #f9fafb;
	padding: 2rem;
	padding-bottom: 4rem; /* Extra padding for SheetNav */
}

.view-wrapper :deep(.debug-info) {
	background: #f3f4f6;
	padding: 1rem;
	border-radius: 4px;
	margin-bottom: 2rem;
	font-size: 0.875rem;
}

/* AForm-based View Styles */
.view-wrapper :deep(.view-header) {
	margin-bottom: 2rem;
}

.view-wrapper :deep(.view-header h1) {
	margin: 0.5rem 0 0 0;
	color: #1f2937;
	font-size: 2rem;
	font-weight: 700;
}

.view-wrapper :deep(.view-actions) {
	margin: 1rem 0 2rem 0;
}

.view-wrapper :deep(.breadcrumbs) {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 0.5rem;
	font-size: 0.875rem;
	color: #6b7280;
}

.view-wrapper :deep(.breadcrumbs a) {
	color: #3b82f6;
	text-decoration: none;
	font-weight: 500;
}

.view-wrapper :deep(.breadcrumbs a:hover) {
	text-decoration: underline;
}

.view-wrapper :deep(.separator) {
	color: #d1d5db;
	font-weight: 400;
}

.view-wrapper :deep(.current) {
	color: #1f2937;
	font-weight: 600;
}

.view-wrapper :deep(.empty-state) {
	text-align: center;
	padding: 3rem 1rem;
	color: #6b7280;
}

/* Operation Log Toggle Button */
.operation-log-toggle {
	position: fixed;
	bottom: 20px;
	left: 20px; /* Changed from right to left */
	background: #3b82f6;
	color: white;
	border: none;
	padding: 0.75rem 1.25rem;
	border-radius: 24px;
	font-weight: 600;
	font-size: 0.875rem;
	cursor: pointer;
	box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	transition: all 0.2s ease;
	z-index: 999;
}

.operation-log-toggle:hover {
	background: #2563eb;
	box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
	transform: translateY(-2px);
}

.operation-log-toggle:active {
	transform: translateY(0);
}

.view-wrapper :deep(.empty-state p) {
	margin-bottom: 1rem;
	font-size: 1.125rem;
}

/* Table Styles for AForm */
.view-wrapper :deep(.aform-table) {
	background: white;
	border-radius: 8px;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	overflow: hidden;
}

.view-wrapper :deep(.aform-table table) {
	width: 100%;
	border-collapse: collapse;
}

.view-wrapper :deep(.aform-table th) {
	background-color: #f9fafb;
	padding: 0.75rem 1rem;
	text-align: left;
	font-weight: 600;
	color: #374151;
	border-bottom: 1px solid #e5e7eb;
}

.view-wrapper :deep(.aform-table td) {
	padding: 0.75rem 1rem;
	border-bottom: 1px solid #f3f4f6;
	color: #374151;
}

.view-wrapper :deep(.aform-table tbody tr:hover) {
	background-color: #f9fafb;
}

/* Button Styles */
.view-wrapper :deep(.btn-primary) {
	background: #3b82f6;
	color: white;
	border: none;
	padding: 0.75rem 1.5rem;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 500;
	font-size: 0.875rem;
	transition: all 0.2s ease;
}

.view-wrapper :deep(.btn-primary:hover:not(:disabled)) {
	background: #2563eb;
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.view-wrapper :deep(.btn-primary:disabled) {
	opacity: 0.5;
	cursor: not-allowed;
	transform: none;
	box-shadow: none;
}

.view-wrapper :deep(.btn-secondary) {
	background: #f3f4f6;
	color: #374151;
	border: 1px solid #d1d5db;
	padding: 0.75rem 1.5rem;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 500;
	font-size: 0.875rem;
	transition: all 0.2s ease;
}

.view-wrapper :deep(.btn-secondary:hover) {
	background: #e5e7eb;
	border-color: #9ca3af;
	transform: translateY(-1px);
}

.view-wrapper :deep(.btn-danger) {
	background: #ef4444;
	color: white;
	border: none;
	padding: 0.75rem 1.5rem;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 500;
	font-size: 0.875rem;
	transition: all 0.2s ease;
}

.view-wrapper :deep(.btn-danger:hover) {
	background: #dc2626;
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.view-wrapper :deep(.btn-sm) {
	padding: 0.375rem 0.75rem;
	font-size: 0.8rem;
}

/* Loading & Empty States */
.view-wrapper :deep(.loading),
.view-wrapper :deep(.empty-state),
.view-wrapper :deep(.error-state) {
	text-align: center;
	padding: 3rem;
	background: white;
	border-radius: 8px;
	border: 1px solid #e5e7eb;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.view-wrapper :deep(.loading) {
	color: #6b7280;
}

.view-wrapper :deep(.empty-state p) {
	color: #6b7280;
	margin-bottom: 1.5rem;
	font-size: 1rem;
}

.view-wrapper :deep(.error-state) {
	color: #ef4444;
}

/* Records Table */
.view-wrapper :deep(.records-table) {
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	overflow: hidden;
	background: white;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.view-wrapper :deep(.table-header) {
	display: flex;
	background: #f9fafb;
	border-bottom: 1px solid #e5e7eb;
	font-weight: 600;
	color: #374151;
}

.view-wrapper :deep(.table-row) {
	display: flex;
	border-bottom: 1px solid #e5e7eb;
	cursor: pointer;
	transition: background-color 0.15s;
}

.view-wrapper :deep(.table-row:hover) {
	background: #f9fafb;
}

.view-wrapper :deep(.table-row:last-child) {
	border-bottom: none;
}

.view-wrapper :deep(.header-cell),
.view-wrapper :deep(.table-cell) {
	flex: 1;
	padding: 1rem;
	text-align: left;
	font-size: 0.875rem;
}

.view-wrapper :deep(.header-cell) {
	font-weight: 600;
	color: #374151;
}

.view-wrapper :deep(.table-cell) {
	color: #6b7280;
}

.view-wrapper :deep(.actions-cell) {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

/* Form Container */
.view-wrapper :deep(.form-container) {
	background: white;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	padding: 2rem;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* Records List Specific */
.view-wrapper :deep(.records-list) {
	max-width: none;
}

/* Record Form Specific */
.view-wrapper :deep(.record-form) {
	max-width: 800px;
	margin: 0 auto;
}

/* Responsive Design */
@media (max-width: 768px) {
	.view-wrapper {
		padding: 1rem;
	}

	.view-wrapper :deep(.actions) {
		flex-direction: column;
		align-items: stretch;
	}

	.view-wrapper :deep(.table-header),
	.view-wrapper :deep(.table-row) {
		flex-direction: column;
	}

	.view-wrapper :deep(.header-cell),
	.view-wrapper :deep(.table-cell) {
		padding: 0.75rem;
		border-bottom: 1px solid #f3f4f6;
	}

	.view-wrapper :deep(.actions-cell) {
		border-bottom: none;
		justify-content: flex-start;
	}
}
</style>
