<template>
	<div v-if="show" :class="inline ? 'operation-log-inline' : 'operation-log-panel'">
		<div class="panel-header">
			<h3>Global Operation Log</h3>
			<button v-if="!inline" class="close-button" @click="$emit('close')">✕</button>
		</div>
		<div class="panel-content">
			<div class="log-stats">
				<div class="stat">
					<span class="stat-label">Total Operations:</span>
					<span class="stat-value">{{ operations.length }}</span>
				</div>
				<div class="stat">
					<span class="stat-label">Current Index:</span>
					<span class="stat-value">{{ currentIndex }}</span>
				</div>
				<div class="stat">
					<span class="stat-label">Can Undo:</span>
					<span class="stat-value">{{ canUndo ? '✓' : '✗' }}</span>
				</div>
				<div class="stat">
					<span class="stat-label">Can Redo:</span>
					<span class="stat-value">{{ canRedo ? '✓' : '✗' }}</span>
				</div>
			</div>

			<div v-if="operations.length === 0" class="empty-state">
				<p>No operations yet. Start editing to see HST operations.</p>
			</div>

			<div v-else class="operations-list">
				<div
					v-for="(op, index) in operations"
					:key="op.id"
					:class="['operation-item', { current: index === currentIndex, past: index < currentIndex }]">
					<div class="operation-header">
						<span class="operation-type">{{ op.type }}</span>
						<span class="operation-time">{{ formatTime(op.timestamp) }}</span>
					</div>
					<div class="operation-details">
						<div class="detail-row">
							<span class="detail-label">Path:</span>
							<span class="detail-value">{{ op.path }}</span>
						</div>
						<div v-if="op.fieldname" class="detail-row">
							<span class="detail-label">Field:</span>
							<span class="detail-value">{{ op.fieldname }}</span>
						</div>
						<div class="detail-row">
							<span class="detail-label">Before:</span>
							<span class="detail-value">{{ formatValue(op.beforeValue) }}</span>
						</div>
						<div class="detail-row">
							<span class="detail-label">After:</span>
							<span class="detail-value">{{ formatValue(op.afterValue) }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { HSTOperation } from '@stonecrop/stonecrop'

interface Props {
	show?: boolean
	operations: HSTOperation[]
	currentIndex: number
	canUndo: boolean
	canRedo: boolean
	inline?: boolean
}

defineProps<Props>()

defineEmits<{
	close: []
}>()

const formatTime = (timestamp: Date): string => {
	return new Date(timestamp).toLocaleTimeString()
}

const formatValue = (value: any): string => {
	if (value === null || value === undefined) return 'null'
	if (typeof value === 'object') return JSON.stringify(value, null, 2)
	return String(value)
}
</script>

<style scoped>
.operation-log-panel {
	position: fixed;
	left: 20px;
	bottom: 80px;
	width: 400px;
	background: var(--sc-form-background);
	border-radius: 0.25rem;
	border: 1px solid var(--sc-form-border);
	overflow: hidden;
	z-index: 1000;
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	background: var(--sc-gray-5);
	border-bottom: 1px solid var(--sc-gray-10);
}

.panel-header h3 {
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
	color: var(--sc-gray-80);
}

.close-button {
	background: none;
	border: none;
	font-size: 1.25rem;
	cursor: pointer;
	color: var(--sc-gray-50);
	padding: 0;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.close-button:hover {
	color: var(--sc-gray-80);
}

.panel-content {
	overflow-y: auto;
}

.log-stats {
	padding: 1rem;
	background: var(--sc-gray-5);
	border-bottom: 1px solid var(--sc-gray-10);
}

.stat {
	display: flex;
	justify-content: space-between;
	margin-bottom: 0.5rem;
	font-size: 0.875rem;
}

.stat:last-child {
	margin-bottom: 0;
}

.stat-label {
	color: var(--sc-gray-50);
	font-weight: 500;
}

.stat-value {
	color: var(--sc-gray-80);
	font-weight: 600;
}

.empty-state {
	padding: 3rem 1.5rem;
	text-align: center;
	color: var(--sc-gray-50);
}

.operations-list {
	padding: 0.5rem;
}

.operation-item {
	background: var(--sc-form-background);
	border: 1px solid var(--sc-gray-10);
	border-radius: 0.25rem;
	padding: 0.75rem;
	margin-bottom: 0.5rem;
}

.operation-item.current {
	border-color: var(--sc-primary-color);
	background: var(--sc-cell-changed-color);
}

.operation-item.past {
	opacity: 0.6;
}

.operation-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.5rem;
}

.operation-type {
	font-weight: 600;
	color: var(--sc-gray-80);
	font-size: 0.875rem;
	text-transform: uppercase;
}

.operation-time {
	font-size: 0.75rem;
	color: var(--sc-gray-50);
}

.operation-details {
	font-size: 0.8125rem;
}

.detail-row {
	display: flex;
	margin-bottom: 0.25rem;
}

.detail-row:last-child {
	margin-bottom: 0;
}

.detail-label {
	color: var(--sc-gray-50);
	font-weight: 500;
	min-width: 60px;
}

.detail-value {
	color: var(--sc-gray-80);
	word-break: break-all;
	flex: 1;
	font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
