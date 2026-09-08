<template>
	<div class="actions-panel">
		<ATable v-if="hasRows" :columns="ACTION_COLUMNS" :rows="rows" :config="{ view: 'list-expansion', fullWidth: true }">
			<!--
				ATable owns the frame (header, filter row, expansion chrome). We override #body to keep
				the per-row #content editor and to bind cells straight to the source via the write helpers
				— ATable never calls setCellData/handleRowAction, so it never mutates the projection it renders.
			-->
			<template #body="{ data: store }">
				<ARow v-for="row in actionRows(store)" :key="String(row.__key)" :row-index="row.originalIndex" :store="store">
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
								@input="onFieldInput(row, 'label', $event.target.value)" />
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
									@input="onOnInput(row, $event.target.value)" />
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

<script setup>
import { ATable, ARow } from '@stonecrop/atable'
import { ACodeEditor } from '@stonecrop/code-editor'
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
} from './docbuilderActions'
function actionRows(store) {
	return store.filteredRows
}
const TRANSITION_NAME_HINT = 'Rename this transition on its edge in the workflow graph above'
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
const TRIGGER_API_STUBS = `
declare const record: Record<string, unknown>
declare const value: unknown
declare function setError(field: string, message: string): void
`
const VS_PATH = '/stonecrop-monaco/vs'
const EDITOR_OPTIONS = {
	placeholder: "e.g.  await runAction('Submit');  router.push(`/issue/${record.id}`)",
}
const TRIGGER_EDITOR_OPTIONS = {
	placeholder: "e.g.  if (value < 0) setError('amount', 'Must be positive')",
}
const EDITOR_LIBS = ['es2020']
const ACTION_COLUMNS = [
	{ name: 'label', label: 'Label', sortable: false },
	{ name: 'type', label: 'Type', sortable: false, filterable: true, filterType: 'select' },
]
const props = defineProps({
	modelValue: { type: null, required: true },
})
const emit = defineEmits(['update:modelValue'])
const rows = computed(() => projectWorkflowRows(props.modelValue))
const hasRows = computed(() => rows.value.length > 0)
function onFieldInput(row, field, value) {
	if (!props.modelValue) return
	const next =
		row.kind === 'trigger'
			? writeTriggerField(props.modelValue, row.__key, field, value)
			: writeActionField(props.modelValue, row.__key, field, value)
	emit('update:modelValue', next)
}
const onDrafts = reactive({})
function onDisplay(row) {
	const draft = onDrafts[row.__key]
	return draft ?? row.on
}
function onOnInput(row, value) {
	if (!props.modelValue) return
	onDrafts[row.__key] = value
	emit('update:modelValue', writeTriggerField(props.modelValue, row.__key, 'on', parseOnInput(value)))
}
function onAddTrigger() {
	emit('update:modelValue', addTrigger(props.modelValue))
}
function onAddCommand() {
	emit('update:modelValue', addCommand(props.modelValue))
}
function onRemoveRow(row) {
	if (!props.modelValue) return
	onDrafts[row.__key] = void 0
	const next =
		row.kind === 'trigger' ? removeTrigger(props.modelValue, row.__key) : removeAction(props.modelValue, row.__key)
	emit('update:modelValue', next)
}
</script>

<style scoped>
.actions-panel {
	padding: 0.5em 1em;
}
.actions-panel :deep(.atable-row > td) {
	border-top: 1px solid var(--sc-row-border-color, #e5e7eb);
	padding: var(--sc-atable-row-padding, 0.25rem) 0.75em;
	vertical-align: middle;
}
.actions-panel :deep(input[type='text']) {
	border: 1px solid var(--sc-gray-20, #d1d5db);
	border-radius: 3px;
	font-family: inherit;
	font-size: inherit;
	padding: 0.25em 0.5em;
	width: 100%;
}
.actions-panel :deep(input[type='text']:focus) {
	border-color: var(--sc-blue-40, #3b82f6);
	outline: none;
}
.cell-readonly {
	color: var(--sc-gray-60, #4b5563);
	cursor: default;
}
.badge {
	border-radius: 9999px;
	display: inline-block;
	font-size: 0.75rem;
	font-weight: 500;
	padding: 0.125em 0.5em;
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
	background: var(--sc-blue-40, #3b82f6);
	border: none;
	border-radius: 0.4rem;
	color: #fff;
	cursor: pointer;
	font-size: 0.8125rem;
	font-weight: 500;
	padding: 0.4em 0.9em;
}
.row-detail {
	gap: 0.75rem;
}
.detail-field,
.row-detail {
	display: flex;
	flex-direction: column;
}
.detail-field {
	gap: 0.25rem;
}
.detail-label {
	color: var(--sc-header-text-color, #374151);
	font-size: 0.75rem;
	font-weight: 600;
	letter-spacing: 0.05em;
	text-transform: uppercase;
}
.detail-value {
	color: var(--sc-gray-60, #4b5563);
	font-size: 0.8125rem;
}
.client-handler-editor {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
.handler-label {
	color: var(--sc-header-text-color, #374151);
	font-size: 0.75rem;
	font-weight: 600;
	letter-spacing: 0.05em;
	text-transform: uppercase;
}
.remove-row {
	align-self: flex-start;
	background: none;
	border: 1px solid #fca5a5;
	border-radius: 0.3rem;
	color: #b91c1c;
	cursor: pointer;
	font-size: 0.75rem;
	padding: 0.3em 0.75em;
}
</style>
