<template>
	<div v-if="show" class="operation-log-panel">
		<div class="panel-header">
			<h3>Operation Log</h3>
			<button @click="$emit('close')" class="close-button">✕</button>
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

			<div class="operations-list">
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
						<div class="detail-row">
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
	if (typeof value === 'object') return JSON.stringify(value)
	return String(value)
}
</script>

<style scoped>
.operation-log-panel {
	position: fixed;
	left: 20px;
	bottom: 80px; /* Position above the button (button height ~40px + 20px bottom + 20px spacing) */
	width: 400px;
	max-height: 600px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	overflow: hidden;
	z-index: 1000;
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	background: #f3f4f6;
	border-bottom: 1px solid #e5e7eb;
}

.panel-header h3 {
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
	color: #1f2937;
}

.close-button {
	background: none;
	border: none;
	font-size: 1.25rem;
	cursor: pointer;
	color: #6b7280;
	padding: 0;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.close-button:hover {
	color: #1f2937;
}

.panel-content {
	max-height: 550px;
	overflow-y: auto;
}

.log-stats {
	padding: 1rem;
	background: #fafafa;
	border-bottom: 1px solid #e5e7eb;
}

.stat {
	display: flex;
	justify-content: space-between;
	margin-bottom: 0.5rem;
}

.stat:last-child {
	margin-bottom: 0;
}

.stat-label {
	font-weight: 500;
	color: #6b7280;
	font-size: 0.875rem;
}

.stat-value {
	font-weight: 600;
	color: #1f2937;
	font-size: 0.875rem;
}

.operations-list {
	padding: 1rem;
}

.operation-item {
	padding: 0.75rem;
	margin-bottom: 0.5rem;
	border-radius: 4px;
	border: 1px solid #e5e7eb;
	background: white;
}

.operation-item.current {
	border-color: #3b82f6;
	background: #eff6ff;
}

.operation-item.past {
	opacity: 0.6;
}

.operation-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 0.5rem;
}

.operation-type {
	font-weight: 600;
	color: #1f2937;
	font-size: 0.875rem;
	text-transform: uppercase;
}

.operation-time {
	font-size: 0.75rem;
	color: #6b7280;
}

.operation-details {
	font-size: 0.75rem;
}

.detail-row {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 0.25rem;
}

.detail-label {
	font-weight: 500;
	color: #6b7280;
	min-width: 60px;
}

.detail-value {
	color: #1f2937;
	word-break: break-all;
}
</style>
