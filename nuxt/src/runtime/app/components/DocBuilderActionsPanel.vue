<template>
	<div class="actions-panel">
		<table v-if="hasActions" class="actions-table">
			<thead>
				<tr>
					<th>Key</th>
					<th>Label</th>
					<th>Handler</th>
					<th>Confirm</th>
					<th>Type</th>
					<th>Allowed States</th>
					<th>Next State</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(action, key) in modelValue?.actions" :key="key">
					<td>
						<code>{{ key }}</code>
					</td>
					<td>
						<input
							type="text"
							:value="action.label"
							@input="update(String(key), 'label', ($event.target as HTMLInputElement).value)" />
					</td>
					<td>
						<input
							type="text"
							:value="action.handler"
							:class="{ 'handler-missing': !action.handler }"
							placeholder="module:function"
							@input="update(String(key), 'handler', ($event.target as HTMLInputElement).value)" />
					</td>
					<td class="center">
						<input
							type="checkbox"
							:checked="action.confirm ?? false"
							@change="update(String(key), 'confirm', ($event.target as HTMLInputElement).checked)" />
					</td>
					<td>
						<span class="badge" :class="action.stateless ? 'badge-command' : 'badge-transition'">
							{{ action.stateless ? 'Command' : 'Transition' }}
						</span>
					</td>
					<td>{{ action.allowedStates?.join(', ') ?? '(all states)' }}</td>
					<td>{{ action.stateless ? '—' : (action.nextState ?? '') }}</td>
				</tr>
			</tbody>
		</table>
		<p v-else class="actions-empty">
			No actions defined. Draw transitions in the workflow graph above to create workflow actions.
		</p>
	</div>
</template>

<script setup lang="ts">
import type { WorkflowMeta } from '@stonecrop/schema'
import { computed } from 'vue'

const props = defineProps<{
	modelValue: WorkflowMeta | undefined
}>()

const emit = defineEmits<{
	'update:modelValue': [value: WorkflowMeta]
}>()

const hasActions = computed(() => props.modelValue?.actions && Object.keys(props.modelValue.actions).length > 0)

function update(key: string, field: string, value: unknown) {
	if (!props.modelValue) return
	const existingActions = props.modelValue.actions ?? {}
	emit('update:modelValue', {
		...props.modelValue,
		actions: {
			...existingActions,
			[key]: { ...existingActions[key], [field]: value },
		},
	})
}
</script>

<style scoped>
.actions-panel {
	padding: 0.5em 1em;
}

.actions-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.875rem;
}

.actions-table th {
	text-align: left;
	padding: 0.5em 0.75em;
	border-bottom: 2px solid var(--sc-gray-20, #e5e7eb);
	font-weight: 600;
	white-space: nowrap;
}

.actions-table td {
	padding: 0.375em 0.75em;
	border-bottom: 1px solid var(--sc-gray-10, #f3f4f6);
	vertical-align: middle;
}

.actions-table input[type='text'] {
	width: 100%;
	border: 1px solid var(--sc-gray-20, #d1d5db);
	border-radius: 3px;
	padding: 0.25em 0.5em;
	font-size: inherit;
	font-family: inherit;
}

.actions-table input[type='text'].handler-missing {
	border-color: #f87171;
	background: #fef2f2;
}

.actions-table input[type='text']:focus {
	outline: none;
	border-color: var(--sc-blue-40, #3b82f6);
}

.center {
	text-align: center;
}

.badge {
	display: inline-block;
	padding: 0.125em 0.5em;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 500;
}

.badge-transition {
	background: #dbeafe;
	color: #1e40af;
}

.badge-command {
	background: #f3e8ff;
	color: #6b21a8;
}

.actions-empty {
	color: #9ca3af;
	font-style: italic;
	padding: 1rem 0;
	text-align: center;
}
</style>
