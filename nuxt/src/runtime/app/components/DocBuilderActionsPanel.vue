<template>
	<div class="actions-panel">
		<ATable
			v-if="hasActions"
			:columns="ACTION_COLUMNS"
			:rows="actionProjection"
			:config="{ view: 'list-expansion', fullWidth: true }">
			<!--
				ATable owns the frame (header, filter row, expansion chrome). We override #body to keep
				the per-row #content editor and to bind cells straight to the source via update() — ATable
				never calls setCellData/handleRowAction, so it never mutates the projection it renders.
			-->
			<template #body="{ data: store }">
				<ARow v-for="row in store.filteredRows" :key="String(row.__key)" :row-index="row.originalIndex" :store="store">
					<template #default>
						<td class="cell-key">
							<code>{{ row.key }}</code>
						</td>
						<td>
							<input
								type="text"
								:value="row.label"
								@input="update(String(row.__key), 'label', ($event.target as HTMLInputElement).value)" />
						</td>
						<td>
							<span class="badge" :class="row.stateless ? 'badge-command' : 'badge-transition'">
								{{ row.type }}
							</span>
						</td>
						<td>{{ row.allowedStates }}</td>
						<td>{{ row.nextState }}</td>
					</template>
					<template #content>
						<div class="client-handler-editor">
							<label class="handler-label">Client Handler (JS)</label>
							<ACodeEditor
								:model-value="row.__action?.clientHandler ?? ''"
								:extra-libs="INJECTED_API_STUBS"
								:libs="EDITOR_LIBS"
								:vs-path="VS_PATH"
								:options="EDITOR_OPTIONS"
								language="javascript"
								height="200px"
								@update:model-value="update(String(row.__key), 'clientHandler', $event)" />
						</div>
					</template>
				</ARow>
			</template>
		</ATable>
		<p v-else class="actions-empty">
			No actions defined. Draw transitions in the workflow graph above to create workflow actions.
		</p>
	</div>
</template>

<script setup lang="ts">
import { ATable, ARow } from '@stonecrop/atable'
import type { TableColumn } from '@stonecrop/atable'
import { ACodeEditor } from '@stonecrop/code-editor'
import type { ActionDefinition, WorkflowMeta } from '@stonecrop/schema'
import { computed } from 'vue'

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

const EDITOR_OPTIONS = {
	placeholder: "e.g.  await runAction('Submit');  router.push(`/issue/${record.id}`)",
}

// Restrict the handler editor's language service to the ES built-ins only — no DOM/browser
// globals. Authors get JS essentials (Promise, Array, JSON, …) plus the injected Stonecrop
// capability surface (INJECTED_API_STUBS) in autocomplete, and nothing else.
const EDITOR_LIBS = ['es2020']

// `sortable: false` suppresses ATable's click-to-sort affordance (row order here is the keyed
// object's order, not a view concern). `filterable` opts a column into the header filter row.
const ACTION_COLUMNS: TableColumn[] = [
	{ name: 'key', label: 'Key', sortable: false, filterable: true },
	{ name: 'label', label: 'Label', sortable: false },
	{ name: 'type', label: 'Type', sortable: false, filterable: true, filterType: 'select' },
	{ name: 'allowedStates', label: 'Allowed States', sortable: false },
	{ name: 'nextState', label: 'Next State', sortable: false },
]

const props = defineProps<{
	modelValue: WorkflowMeta | undefined
}>()

const emit = defineEmits<{
	'update:modelValue': [value: WorkflowMeta]
}>()

// One-way projection of the keyed `actions` object into ATable rows. Each row carries the
// column-named display scalars (so the header filters and the rendered cells read row[name])
// plus `__key`/`__action` backrefs the cells and the handler editor write through.
const actionProjection = computed(() =>
	Object.entries(props.modelValue?.actions ?? {}).map(([key, action]) => ({
		key,
		label: action.label ?? '',
		type: action.stateless ? 'Command' : 'Transition',
		stateless: action.stateless ?? false,
		allowedStates: action.allowedStates?.join(', ') ?? '(all states)',
		nextState: action.stateless ? '—' : (action.nextState ?? ''),
		__key: key,
		__action: action,
	}))
)

const hasActions = computed(() => actionProjection.value.length > 0)

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

/* The body cells are our own <td>s (not ACell), so reproduce ATable's row separator
   (ACell's only gridline is a top border) and its padding. */
.actions-panel :deep(.atable-row > td) {
	padding: var(--sc-atable-row-padding, 0.25rem) 0.75em;
	vertical-align: middle;
	border-top: 1px solid var(--sc-row-border-color, #e5e7eb);
}

.actions-panel :deep(input[type='text']) {
	width: 100%;
	border: 1px solid var(--sc-gray-20, #d1d5db);
	border-radius: 3px;
	padding: 0.25em 0.5em;
	font-size: inherit;
	font-family: inherit;
}

.actions-panel :deep(input[type='text']:focus) {
	outline: none;
	border-color: var(--sc-blue-40, #3b82f6);
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
