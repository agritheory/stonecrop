<template>
	<div class="view-wrapper">
		<Desktop
			:available-doctypes="availableDoctypes"
			:show-debug="showDebug"
			@action="handleDesktopAction"
			@navigate="handleDesktopNavigate"
			@record:open="handleRecordOpen"
			@load-records="handleLoadRecords"
			@load-record="handleLoadRecord" />

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
import type {
	ActionEventPayload,
	NavigationTarget,
	RecordOpenEventPayload,
	LoadRecordsEventPayload,
	LoadRecordEventPayload,
} from '@stonecrop/desktop'
import { useStonecrop } from '@stonecrop/stonecrop'
import { ref } from 'vue'

import OperationLogPanel from './OperationLogPanel.vue'
import { addNotification } from '../actions'

interface Props {
	availableDoctypes?: string[]
	showDebug?: boolean
}

const { availableDoctypes = ['todo-list', 'todo-form', 'issue-list', 'issue-form'], showDebug = true } =
	defineProps<Props>()

const showOperationLog = ref(false)

// Single unified interface - everything from useStonecrop
const {
	stonecrop,
	operationLog: { operations, currentIndex, canUndo, canRedo },
} = useStonecrop()

function toggleOperationLog() {
	showOperationLog.value = !showOperationLog.value
}

/**
 * Handle FSM transition actions emitted by Desktop.
 *
 * Pattern:
 *   1. Sync any changed field values into HST.
 *   2. Fire the FSM transition (triggers registerTransitionAction side effects).
 *   3. Dispatch through DataClient (real REST call via RestDataClient.runAction).
 *   4. Sync the result back into HST.
 */
async function handleDesktopAction(payload: ActionEventPayload) {
	if (!stonecrop.value) return

	// 0. Confirm destructive actions. This is the host's call, not Desktop's: only the app
	// knows which of its actions are destructive, and Desktop deliberately blesses no action
	// name. It used to own a `confirmFn` prop that it fired for a hardcoded `DELETE`.
	if (payload.name === 'DELETE' && !window.confirm('Are you sure you want to delete this record?')) {
		return
	}

	// 1. Persist form field changes into HST before triggering the transition
	const existing = stonecrop.value.getRecordById(payload.doctype, payload.recordId)
	if (existing) {
		const store = stonecrop.value.getStore()
		for (const [fieldname, value] of Object.entries(payload.data)) {
			const path = `${payload.doctype}.${payload.recordId}.${fieldname}`
			if (store.has(path) && store.get(path) !== value) {
				store.set(path, value)
			}
		}
		// 2. Trigger the FSM transition — fires registerTransitionAction side effects
		await existing.triggerTransition(payload.name, { fsmContext: payload.data })
	}

	// 3. Dispatch through DataClient
	const doctype = stonecrop.value.registry.getDoctype(payload.doctype)
	if (!doctype) return

	const result = await stonecrop.value.dispatchAction(doctype, payload.name, [payload.recordId, payload.data])

	if (!result.success) {
		addNotification(`${payload.name} failed: ${result.error ?? 'unknown error'}`, 'error')
		return
	}

	// 4. Report the outcome. The store is NOT written here: `dispatchAction` already filed the
	// returned record under the identity the server settled on. Writing it again under
	// `payload.recordId` would file a created record under the draft segment too, leaving a
	// phantom row named `new` in the list view — which is what this handler used to do.
	switch (payload.name) {
		case 'SAVE': {
			addNotification(`${payload.doctype} record ${payload.recordId} saved`, 'success')
			break
		}
		case 'DELETE':
			stonecrop.value.removeRecord(payload.doctype, payload.recordId)
			addNotification(`${payload.doctype} record ${payload.recordId} deleted`, 'info')
			break
	}
}

function handleDesktopNavigate(target: NavigationTarget) {
	// Example: log navigation intent — the routeAdapter (or the built-in router
	// fallback) already performed the navigation.  This handler is for any
	// additional host-side logic like analytics.
	console.debug('[example] Desktop navigate', target)
}

function handleRecordOpen(payload: RecordOpenEventPayload) {
	console.debug('[example] record:open', payload)
}

/**
 * Both load events are notifications, not fetch requests. Stonecrop reads through the registered
 * RestDataClient for lists and records alike, so a handler here is only for host-side side effects
 * — analytics, breadcrumb prefetch, a progress indicator.
 *
 * This app used to call `stonecrop.getRecords()` from the list handler. That was the closest any
 * host came to the right shape, and it is now what Desktop does for every host.
 */
function handleLoadRecords(payload: LoadRecordsEventPayload) {
	console.debug('[example] load-records', payload)
}

function handleLoadRecord(payload: LoadRecordEventPayload) {
	console.debug('[example] load-record', payload)
}
</script>

<style scoped>
.view-wrapper {
	min-height: 100vh;
	box-sizing: border-box; /* Include padding in height calculation */
	background-color: var(--sc-page-background);
	padding: 2rem;
	padding-bottom: 4rem; /* Extra padding for SheetNav */
}

.view-wrapper :deep(.debug-info) {
	background: var(--sc-input-field-background);
	padding: 1rem;
	border-radius: 0;
	margin-bottom: 2rem;
	font-size: 0.875rem;
}

/* AForm-based View Styles */
.view-wrapper :deep(.view-header) {
	margin-bottom: 2rem;
}

.view-wrapper :deep(.view-header h1) {
	margin: 0.5rem 0 0 0;
	color: var(--sc-gray-80);
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
	color: var(--sc-input-label-color);
}

.view-wrapper :deep(.breadcrumbs a) {
	color: var(--sc-primary-color);
	text-decoration: none;
	font-weight: 500;
}

.view-wrapper :deep(.breadcrumbs a:hover) {
	text-decoration: underline;
}

.view-wrapper :deep(.separator) {
	color: var(--sc-form-border);
	font-weight: 400;
}

.view-wrapper :deep(.current) {
	color: var(--sc-gray-80);
	font-weight: 600;
}

.view-wrapper :deep(.empty-state) {
	text-align: center;
	padding: 3rem 1rem;
	color: var(--sc-input-label-color);
}

/* Operation Log Toggle Button */
.operation-log-toggle {
	position: fixed;
	bottom: 20px;
	left: 20px; /* Changed from right to left */
	background: var(--sc-primary-color);
	color: var(--sc-primary-text-color);
	border: none;
	padding: 0.75rem 1.25rem;
	border-radius: 0;
	font-weight: 600;
	font-size: 0.875rem;
	cursor: pointer;
	box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	transition: all 0.2s ease;
	z-index: 400;
}

.operation-log-toggle:hover {
	background: var(--sc-color-brand);
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
	background: var(--sc-form-background);
	border-radius: 0;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	overflow: hidden;
}

.view-wrapper :deep(.aform-table table) {
	width: 100%;
	border-collapse: collapse;
}

.view-wrapper :deep(.aform-table th) {
	background-color: var(--sc-page-background);
	padding: 0.75rem 1rem;
	text-align: left;
	font-weight: 600;
	color: var(--sc-cell-text-color);
	border-bottom: 1px solid var(--sc-form-border);
}

.view-wrapper :deep(.aform-table td) {
	padding: 0.75rem 1rem;
	border-bottom: 1px solid var(--sc-input-field-background);
	color: var(--sc-cell-text-color);
}

.view-wrapper :deep(.aform-table tbody tr:hover) {
	background-color: var(--sc-page-background);
}

/* Button Styles */
.view-wrapper :deep(.btn-primary) {
	background: var(--sc-primary-color);
	color: var(--sc-primary-text-color);
	border: none;
	padding: 0.75rem 1.5rem;
	border-radius: 0;
	cursor: pointer;
	font-weight: 500;
	font-size: 0.875rem;
	transition: all 0.2s ease;
}

.view-wrapper :deep(.btn-primary:hover:not(:disabled)) {
	background: var(--sc-color-brand);
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
	background: var(--sc-input-field-background);
	color: var(--sc-cell-text-color);
	border: 1px solid var(--sc-form-border);
	padding: 0.75rem 1.5rem;
	border-radius: 0;
	cursor: pointer;
	font-weight: 500;
	font-size: 0.875rem;
	transition: all 0.2s ease;
}

.view-wrapper :deep(.btn-secondary:hover) {
	background: var(--sc-form-border);
	border-color: var(--sc-gray-50);
	transform: translateY(-1px);
}

.view-wrapper :deep(.btn-danger) {
	background: var(--sc-brand-danger);
	color: var(--sc-primary-text-color);
	border: none;
	padding: 0.75rem 1.5rem;
	border-radius: 0;
	cursor: pointer;
	font-weight: 500;
	font-size: 0.875rem;
	transition: all 0.2s ease;
}

.view-wrapper :deep(.btn-danger:hover) {
	background: var(--sc-brand-danger);
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
	background: var(--sc-form-background);
	border-radius: 0;
	border: 1px solid var(--sc-form-border);
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.view-wrapper :deep(.loading) {
	color: var(--sc-input-label-color);
}

.view-wrapper :deep(.empty-state p) {
	color: var(--sc-input-label-color);
	margin-bottom: 1.5rem;
	font-size: 1rem;
}

.view-wrapper :deep(.error-state) {
	color: var(--sc-brand-danger);
}

/* Records Table */
.view-wrapper :deep(.records-table) {
	border: 1px solid var(--sc-form-border);
	border-radius: 0;
	overflow: hidden;
	background: var(--sc-form-background);
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.view-wrapper :deep(.table-header) {
	display: flex;
	background: var(--sc-page-background);
	border-bottom: 1px solid var(--sc-form-border);
	font-weight: 600;
	color: var(--sc-cell-text-color);
}

.view-wrapper :deep(.table-row) {
	display: flex;
	border-bottom: 1px solid var(--sc-form-border);
	cursor: pointer;
	transition: background-color 0.15s;
}

.view-wrapper :deep(.table-row:hover) {
	background: var(--sc-page-background);
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
	color: var(--sc-cell-text-color);
}

.view-wrapper :deep(.table-cell) {
	color: var(--sc-input-label-color);
}

.view-wrapper :deep(.actions-cell) {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

/* Form Container */
.view-wrapper :deep(.form-container) {
	background: var(--sc-form-background);
	border: 1px solid var(--sc-form-border);
	border-radius: 0;
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
		border-bottom: 1px solid var(--sc-input-field-background);
	}

	.view-wrapper :deep(.actions-cell) {
		border-bottom: none;
		justify-content: flex-start;
	}
}
</style>
