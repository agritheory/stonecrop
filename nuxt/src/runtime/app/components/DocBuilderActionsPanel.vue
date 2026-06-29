<template>
	<div class="actions-panel">
		<table v-if="hasActions" class="actions-table">
			<thead>
				<tr>
					<th class="expand-col" />
					<th>Key</th>
					<th>Label</th>
					<th>Type</th>
					<th>Allowed States</th>
					<th>Next State</th>
				</tr>
			</thead>
			<tbody>
				<template v-for="(action, key, index) in modelValue?.actions" :key="key">
					<ARow :row-index="index" :store="actionStore">
						<template #default>
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
								<span class="badge" :class="action.stateless ? 'badge-command' : 'badge-transition'">
									{{ action.stateless ? 'Command' : 'Transition' }}
								</span>
							</td>
							<td>{{ action.allowedStates?.join(', ') ?? '(all states)' }}</td>
							<td>{{ action.stateless ? '—' : (action.nextState ?? '') }}</td>
						</template>
						<template #content>
							<div class="client-handler-editor">
								<label class="handler-label">Client Handler (JS)</label>
								<ACodeEditor
									:model-value="action.clientHandler ?? ''"
									:extra-libs="INJECTED_API_STUBS"
									:vs-path="VS_PATH"
									language="javascript"
									height="200px"
									@update:model-value="update(String(key), 'clientHandler', $event)" />
							</div>
						</template>
					</ARow>
				</template>
			</tbody>
		</table>
		<p v-else class="actions-empty">
			No actions defined. Draw transitions in the workflow graph above to create workflow actions.
		</p>
	</div>
</template>

<script setup lang="ts">
import { ARow, createTableStore } from '@stonecrop/atable'
import type { TableColumn } from '@stonecrop/atable'
import { ACodeEditor } from '@stonecrop/code-editor'
import type { ActionDefinition, WorkflowMeta } from '@stonecrop/schema'
import { computed, watch } from 'vue'

// Type stubs for the API surface injected into a clientHandler at runtime.
// Keep in sync with the capability map assembled in the `useClientAction` composable
// (@stonecrop/nuxt). Note: only read-only `graphql.query` is injected — there is
// no `graphql.mutation` (a raw mutation would bypass the dispatch and leave HST stale).
const INJECTED_API_STUBS = `
declare const router: {
  push(to: string | object): Promise<void>
  replace(to: string | object): Promise<void>
  back(): void
  forward(): void
}
declare function runAction(action: string, args?: Record<string, unknown>): Promise<{ success: boolean; data: unknown; error: string | null }>
declare const graphql: {
  query(query: string, variables?: Record<string, unknown>): Promise<unknown>
}
declare const record: Record<string, unknown>
`

// Path to locally-served Monaco AMD build (served via Nitro publicAssets in module.ts).
// Falls back to CDN when running outside the docbuilder context.
const VS_PATH = '/stonecrop-monaco/vs'

const ACTION_COLUMNS: TableColumn[] = [
	{ name: 'key' },
	{ name: 'label' },
	{ name: 'type' },
	{ name: 'allowedStates' },
	{ name: 'nextState' },
]

const props = defineProps<{
	modelValue: WorkflowMeta | undefined
}>()

const emit = defineEmits<{
	'update:modelValue': [value: WorkflowMeta]
}>()

const actionRows = computed(() =>
	Object.entries(props.modelValue?.actions ?? {}).map(([key, action]) => ({ key, ...action }))
)

const hasActions = computed(() => actionRows.value.length > 0)

const actionStore = createTableStore({
	columns: ACTION_COLUMNS,
	rows: actionRows.value,
	config: { view: 'list-expansion' },
})

watch(actionRows, newRows => actionStore.updateRows(newRows))

function update(key: string, field: string, value: unknown) {
	if (!props.modelValue) return
	const existingActions = props.modelValue.actions ?? {}
	emit('update:modelValue', {
		...props.modelValue,
		actions: {
			...existingActions,
			[key]: { ...existingActions[key], [field]: value } as ActionDefinition,
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

.expand-col {
	width: 2ch;
}

.actions-table :deep(td) {
	padding: var(--sc-atable-row-padding, 0.125rem) 0.75em;
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

.client-handler-editor {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.handler-label {
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--sc-header-text-color, #374151);
	text-transform: uppercase;
	letter-spacing: 0.05em;
}
</style>
