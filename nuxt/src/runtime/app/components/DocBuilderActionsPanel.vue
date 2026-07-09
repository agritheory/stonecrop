<template>
	<div class="actions-panel">
		<ATable v-if="hasRows" :columns="ACTION_COLUMNS" :rows="rows" :config="{ view: 'list-expansion', fullWidth: true }">
			<!--
				ATable owns the frame (header, filter row, expansion chrome). We override #body to keep
				the per-row #content editor and to bind cells straight to the source via the write helpers
				— ATable never calls setCellData/handleRowAction, so it never mutates the projection it renders.
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
								@input="onFieldInput(row, 'label', ($event.target as HTMLInputElement).value)" />
						</td>
						<td>
							<span class="badge" :class="`badge-${row.kind}`">
								{{ row.type }}
							</span>
						</td>
						<td>
							<!-- Triggers fire on field edits, so `on` is authored here; actions don't (— shown). -->
							<input
								v-if="row.kind === 'trigger'"
								type="text"
								:value="onDisplay(row)"
								placeholder="fields, comma-separated"
								@input="onOnInput(row, ($event.target as HTMLInputElement).value)" />
							<span v-else class="cell-muted">{{ row.on }}</span>
						</td>
						<td>{{ row.allowedStates }}</td>
						<td>{{ row.nextState }}</td>
					</template>
					<template #content>
						<div class="client-handler-editor">
							<label class="handler-label">Client Handler (JS)</label>
							<ACodeEditor
								:model-value="(row.__action ?? row.__trigger)?.clientHandler ?? ''"
								:extra-libs="row.kind === 'trigger' ? TRIGGER_API_STUBS : INJECTED_API_STUBS"
								:libs="EDITOR_LIBS"
								:vs-path="VS_PATH"
								:options="row.kind === 'trigger' ? TRIGGER_EDITOR_OPTIONS : EDITOR_OPTIONS"
								language="javascript"
								height="200px"
								@update:model-value="onFieldInput(row, 'clientHandler', $event)" />
							<button v-if="row.kind === 'trigger'" type="button" class="remove-trigger" @click="onRemoveTrigger(row)">
								Remove trigger
							</button>
						</div>
					</template>
				</ARow>
			</template>
		</ATable>
		<p v-else class="actions-empty">
			No actions or triggers yet. Draw transitions in the workflow graph above, or add a trigger below.
		</p>
		<div class="panel-footer">
			<button type="button" class="add-trigger" @click="onAddTrigger">+ Add Trigger</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ATable, ARow } from '@stonecrop/atable'
import type { TableColumn } from '@stonecrop/atable'
import { ACodeEditor } from '@stonecrop/code-editor'
import type { WorkflowMeta } from '@stonecrop/schema'
import { computed, reactive } from 'vue'

import {
	addTrigger,
	parseOnInput,
	projectWorkflowRows,
	removeTrigger,
	writeActionField,
	writeTriggerField,
	type ActionRow,
} from './docbuilderActions'

// Type stubs for the API surface injected into an *action* clientHandler at runtime.
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

// Type stubs for a *trigger* clientHandler — a different, narrower surface than an action's.
// The validation engine (@stonecrop/stonecrop) runs a trigger with { record, value, setError }
// only; router/runAction/graphql are NOT injected, so surfacing them here would mislead authors
// into writing handlers that throw at runtime.
const TRIGGER_API_STUBS = `
declare const record: Record<string, unknown>
declare const value: unknown
declare function setError(field: string, message: string): void
`

// Path to locally-served Monaco AMD build (served via Nitro publicAssets in module.ts).
// Falls back to CDN when running outside the docbuilder context.
const VS_PATH = '/stonecrop-monaco/vs'

const EDITOR_OPTIONS = {
	placeholder: "e.g.  await runAction('Submit');  router.push(`/issue/${record.id}`)",
}
const TRIGGER_EDITOR_OPTIONS = {
	placeholder: "e.g.  if (value < 0) setError('amount', 'Must be positive')",
}

// Restrict the handler editor's language service to the ES built-ins only — no DOM/browser
// globals. Authors get JS essentials (Promise, Array, JSON, …) plus the injected Stonecrop
// capability surface (the stubs above) in autocomplete, and nothing else.
const EDITOR_LIBS = ['es2020']

// `sortable: false` suppresses ATable's click-to-sort affordance (row order here is the keyed
// object's order, not a view concern). `filterable` opts a column into the header filter row.
const ACTION_COLUMNS: TableColumn[] = [
	{ name: 'key', label: 'Key', sortable: false, filterable: true },
	{ name: 'label', label: 'Label', sortable: false },
	{ name: 'type', label: 'Type', sortable: false, filterable: true, filterType: 'select' },
	{ name: 'on', label: 'On (fields)', sortable: false },
	{ name: 'allowedStates', label: 'Allowed States', sortable: false },
	{ name: 'nextState', label: 'Next State', sortable: false },
]

const props = defineProps<{
	modelValue: WorkflowMeta | undefined
}>()

const emit = defineEmits<{
	'update:modelValue': [value: WorkflowMeta]
}>()

// One-way projection of both sibling maps (`actions` + `triggers`) into ATable rows. Each row
// carries the column-named display scalars (so the header filters and rendered cells read row[name])
// plus `__key`/`__kind`/`__action`/`__trigger` backrefs the cells and handler editor write through.
// See ./docbuilderActions (pure + unit-tested; the SFC can't mount in the DOM-less test env).
const rows = computed(() => projectWorkflowRows(props.modelValue))
const hasRows = computed(() => rows.value.length > 0)

/** Route a label/clientHandler edit back to whichever sibling map the row came from. */
function onFieldInput(row: ActionRow, field: string, value: unknown) {
	if (!props.modelValue) return
	const next =
		row.kind === 'trigger'
			? writeTriggerField(props.modelValue, row.__key, field, value)
			: writeActionField(props.modelValue, row.__key, field, value)
	emit('update:modelValue', next)
}

// Verbatim buffer for each Trigger's `on` text input, keyed by trigger key. The model stores `on`
// as a string[], but re-deriving the input's display from that array on every keystroke normalizes
// away in-progress separators — typing "a, b" would round-trip to "ab" before the comma+space could
// land. So the input renders this raw buffer while editing; the model stays synced (parsed) per
// keystroke, so Save always has the current value.
const onDrafts = reactive<Record<string, string | undefined>>({})

/** What the `on` input shows: the raw edit buffer if the user has touched it, else the model value.
 * A `''` draft (user cleared the field) is kept verbatim; only `undefined` falls back to the model. */
function onDisplay(row: ActionRow): string {
	const draft = onDrafts[row.__key]
	return draft ?? row.on
}

/** Keep the verbatim buffer for display and the parsed fire-set array in the model both in sync. */
function onOnInput(row: ActionRow, value: string) {
	if (!props.modelValue) return
	onDrafts[row.__key] = value
	emit('update:modelValue', writeTriggerField(props.modelValue, row.__key, 'on', parseOnInput(value)))
}

/** Append an empty trigger (seeds the workflow if there is none yet — states/actions are optional). */
function onAddTrigger() {
	emit('update:modelValue', addTrigger(props.modelValue))
}

function onRemoveTrigger(row: ActionRow) {
	if (!props.modelValue) return
	// Clear any stale draft so a later trigger that reuses this key (keygen fills the lowest free
	// slot) doesn't inherit it — undefined falls back to the model in onDisplay.
	onDrafts[row.__key] = undefined
	emit('update:modelValue', removeTrigger(props.modelValue, row.__key))
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

.cell-muted {
	color: #9ca3af;
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

.badge-trigger {
	background: #dcfce7;
	color: #166534;
}

.actions-empty {
	color: #9ca3af;
	font-style: italic;
	padding: 1rem 0;
	text-align: center;
}

.panel-footer {
	padding: 0.75rem 0 0.25rem;
}

.add-trigger {
	padding: 0.4em 0.9em;
	background: var(--sc-blue-40, #3b82f6);
	color: white;
	border: none;
	border-radius: 0.4rem;
	font-weight: 500;
	cursor: pointer;
	font-size: 0.8125rem;
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

.remove-trigger {
	align-self: flex-start;
	padding: 0.3em 0.75em;
	background: none;
	color: #b91c1c;
	border: 1px solid #fca5a5;
	border-radius: 0.3rem;
	cursor: pointer;
	font-size: 0.75rem;
}
</style>
