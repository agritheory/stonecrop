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
						<td>
							<!-- A Transition is named on its edge in the graph (single source of truth), so its
								name is read-only here; Commands and Triggers have no graph, so they're named here. -->
							<span
								v-if="row.kind === 'transition' || row.kind === 'self-transition'"
								class="cell-readonly"
								:title="TRANSITION_NAME_HINT">
								{{ row.label }}
							</span>
							<input
								v-else
								type="text"
								:value="row.label"
								placeholder="Name"
								@input="onFieldInput(row, 'label', ($event.target as HTMLInputElement).value)" />
						</td>
						<td>
							<span class="badge" :class="`badge-${row.kind}`">
								{{ row.type }}
							</span>
						</td>
					</template>
					<template #content>
						<div class="row-detail">
							<!-- Type-specific fields live here so the collapsed row keeps to the common columns. -->
							<div v-if="row.kind === 'trigger'" class="detail-field">
								<label class="detail-label">On (fields)</label>
								<input
									type="text"
									:value="onDisplay(row)"
									placeholder="fields, comma-separated"
									@input="onOnInput(row, ($event.target as HTMLInputElement).value)" />
							</div>
							<template v-else>
								<div class="detail-field">
									<label class="detail-label">Allowed States</label>
									<span class="detail-value">{{ row.allowedStates }}</span>
								</div>
								<div v-if="row.kind === 'transition'" class="detail-field">
									<label class="detail-label">Next State</label>
									<span class="detail-value">{{ row.nextState }}</span>
								</div>
							</template>

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
							</div>

							<!-- Transitions and self-transitions are graph-owned — removed by deleting their
								edges (a self-loop is an edge too), not here. -->
							<button
								v-if="row.kind !== 'transition' && row.kind !== 'self-transition'"
								type="button"
								class="remove-row"
								@click="onRemoveRow(row)">
								Remove {{ row.kind }}
							</button>
						</div>
					</template>
				</ARow>
			</template>
		</ATable>
		<p v-else class="actions-empty">
			No actions or triggers yet. Draw transitions in the workflow graph above, or add a command or trigger below.
		</p>
		<div class="panel-footer">
			<button type="button" class="add-row" @click="onAddCommand">+ Add Command</button>
			<button type="button" class="add-row" @click="onAddTrigger">+ Add Trigger</button>
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
	addCommand,
	addTrigger,
	parseOnInput,
	projectWorkflowRows,
	removeAction,
	removeTrigger,
	writeActionField,
	writeTriggerField,
	type ActionRow,
} from './docbuilderActions'

// A Transition's name is edited on its edge in the graph (the single source of truth for its
// identity), so the panel shows it read-only and points the author there.
const TRANSITION_NAME_HINT = 'Rename this transition on its edge in the workflow graph above'

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

// The collapsed row shows only the columns common to every kind — Label and Type. The type-specific
// columns (on / allowedStates / nextState) moved into the per-row expansion. `sortable: false`
// suppresses click-to-sort (row order is the keyed object's order); `filterable` on Type opts it into
// the header filter row so the table can be narrowed to just Transitions/Commands/Triggers.
const ACTION_COLUMNS: TableColumn[] = [
	{ name: 'label', label: 'Label', sortable: false },
	{ name: 'type', label: 'Type', sortable: false, filterable: true, filterType: 'select' },
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

/** Append a stateless Command (seeds the workflow if there is none yet). */
function onAddCommand() {
	emit('update:modelValue', addCommand(props.modelValue))
}

/** Remove a Command or Trigger, routed to the correct sibling map by kind. Transitions never reach
 *  here — their Remove button is not rendered (they are deleted from the graph). */
function onRemoveRow(row: ActionRow) {
	if (!props.modelValue) return
	// Clear any stale draft so a later row that reuses this key (keygen fills the lowest free slot)
	// doesn't inherit it — undefined falls back to the model in onDisplay.
	onDrafts[row.__key] = undefined
	const next =
		row.kind === 'trigger' ? removeTrigger(props.modelValue, row.__key) : removeAction(props.modelValue, row.__key)
	emit('update:modelValue', next)
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
	border-radius: var(--sc-border-radius);
	padding: 0.25em 0.5em;
	font-size: inherit;
	font-family: inherit;
}

.actions-panel :deep(input[type='text']:focus) {
	outline: none;
	border-color: var(--sc-blue-40, #3b82f6);
}

/* A Transition's name is read-only in the panel (edited on its graph edge); render it as static
   text, visually distinct from the editable Command/Trigger name inputs. */
.cell-readonly {
	color: var(--sc-gray-60, #4b5563);
	cursor: default;
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

.badge-self-transition {
	background: #fef3c7;
	color: #92400e;
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
	display: flex;
	gap: 0.5rem;
	padding: 0.75rem 0 0.25rem;
}

.add-row {
	padding: 0.4em 0.9em;
	background: var(--sc-blue-40, #3b82f6);
	color: white;
	border: none;
	border-radius: var(--sc-border-radius);
	font-weight: 500;
	cursor: pointer;
	font-size: 0.8125rem;
}

/* Expansion detail: type-specific fields (on / states) above the handler editor. */
.row-detail {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.detail-field {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.detail-label {
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--sc-header-text-color, #374151);
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.detail-value {
	font-size: 0.8125rem;
	color: var(--sc-gray-60, #4b5563);
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

.remove-row {
	align-self: flex-start;
	padding: 0.3em 0.75em;
	background: none;
	color: #b91c1c;
	border: 1px solid #fca5a5;
	border-radius: var(--sc-border-radius);
	cursor: pointer;
	font-size: 0.75rem;
}
</style>
