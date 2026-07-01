<template>
	<div class="docbuilder-page">
		<div v-if="loading" style="padding: 2rem; text-align: center">Loading...</div>

		<div v-else>
			<!-- Validation Panel -->
			<div v-if="validationIssues.length > 0 && !warningsDismissed" class="validation-panel">
				<div v-if="errorCount > 0" class="validation-errors">
					<strong>⚠️ {{ errorCount }} Error(s) — Cannot Save</strong>
					<ul>
						<li v-for="(issue, idx) in validationIssues.filter(i => i.severity === 'error')" :key="`err-${idx}`">
							<code v-if="issue.fieldname">{{ issue.fieldname }}:</code> {{ issue.message }}
						</li>
					</ul>
				</div>
				<div v-if="warningCount > 0" class="validation-warnings">
					<strong>⚡ {{ warningCount }} Warning(s)</strong>
					<button class="dismiss-button" @click="warningsDismissed = true">Dismiss</button>
				</div>
			</div>

			<AFieldset label="Workflow" :collapsible="true">
				<div class="builder-workflow">
					<StateEditor
						v-if="workflowConfig && workflowConfig.states && workflowConfig.states.length > 0"
						v-model="workflowConfig"
						v-model:layout="layout"
						node-container-class="node-editor" />
					<div v-else class="empty-workflow">
						<p class="empty-workflow-hint">No workflow yet. Name the first state to start building the workflow.</p>
						<div class="empty-workflow-form">
							<input v-model="newStateName" type="text" placeholder="e.g. Draft" @keyup.enter="seedWorkflow" />
							<button class="btn-seed" type="button" :disabled="!newStateName.trim()" @click="seedWorkflow">
								Add first state
							</button>
						</div>
					</div>
				</div>
			</AFieldset>

			<AFieldset label="Actions" :collapsible="true">
				<DocBuilderActionsPanel v-model="workflowConfig" />
			</AFieldset>

			<AFieldset label="Schema" :collapsible="true">
				<DocBuilderFieldsPanel v-model="fields" />
			</AFieldset>

			<div v-if="saveMessage" class="builder-actions">
				<span class="save-message" :class="saveMessage.type">{{ saveMessage.text }}</span>
			</div>

			<ActionSet :elements="docbuilderActions" @action-click="handleAction" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { AFieldset } from '@stonecrop/aform'
import { StateEditor } from '@stonecrop/node-editor'
import type { Layout } from '@stonecrop/node-editor'
import { ActionSet } from '@stonecrop/desktop'
import type { ActionElements } from '@stonecrop/desktop/types'
import { WorkflowMeta } from '@stonecrop/schema'
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'

import DocBuilderActionsPanel from '../components/DocBuilderActionsPanel.vue'
import DocBuilderFieldsPanel from '../components/DocBuilderFieldsPanel.vue'

const route = useRoute()
const router = useRouter()
const doctypeName = computed(() => route.params.doctype as string)

const loading = ref(true)
const saving = ref(false)
const warningsDismissed = ref(false)
const saveMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const fields = ref<Record<string, unknown>[]>([])
const workflowConfig = ref<WorkflowMeta | undefined>()
const layout = ref<Layout>({})

const validationIssues = ref<{ severity: 'error' | 'warning'; message: string; fieldname?: string }[]>([])
const errorCount = computed(() => validationIssues.value.filter(i => i.severity === 'error').length)
const warningCount = computed(() => validationIssues.value.filter(i => i.severity === 'warning').length)

onMounted(async () => {
	try {
		const data = await $fetch<{
			name: string
			slug: string
			fields: Record<string, unknown>[]
			workflow: WorkflowMeta | null
		}>(`/api/_stonecrop/docbuilder/${doctypeName.value}`)
		fields.value = data.fields ?? []
		if (data.workflow) {
			workflowConfig.value = data.workflow
		}
	} catch (error) {
		console.error('Error loading doctype:', error)
	} finally {
		loading.value = false
	}
})

const newStateName = ref('Draft')
// Seed a minimal valid WorkflowMeta from the dev-typed first state. Once states.length > 0 the
// StateEditor's v-if flips and its always-present "Add Node" toolbar takes over from here.
function seedWorkflow() {
	const name = newStateName.value.trim()
	if (!name) return
	workflowConfig.value = { states: [name], actions: {} }
}

function revalidate() {
	const issues: typeof validationIssues.value = []
	if (workflowConfig.value) {
		const result = WorkflowMeta.safeParse(workflowConfig.value)
		if (!result.success) {
			for (const issue of result.error.issues) {
				issues.push({
					severity: 'error',
					message: issue.message,
					fieldname: issue.path.length > 0 ? issue.path.join('.') : undefined,
				})
			}
		}
	}
	validationIssues.value = issues
	if (issues.length > 0) warningsDismissed.value = false
}

watch(workflowConfig, revalidate, { deep: true })

async function saveToDisk() {
	if (errorCount.value > 0) return
	saving.value = true
	saveMessage.value = null
	try {
		await $fetch('/api/_stonecrop/docbuilder/save', {
			method: 'POST',
			body: { doctype: doctypeName.value, fields: fields.value, workflow: workflowConfig.value ?? null },
		})
		saveMessage.value = { type: 'success', text: 'Saved.' }
	} catch (error: any) {
		saveMessage.value = { type: 'error', text: error.message || 'Save failed.' }
	} finally {
		saving.value = false
	}
}

// The docbuilder owns its action chrome (host layout suppressed via meta.layout=false on the route),
// so Save lives in its own desktop ActionSet rather than the host app's. Back returns to the index.
const docbuilderActions = computed<ActionElements[]>(() => [
	{
		type: 'button',
		label: saving.value ? 'Saving…' : 'Save',
		action: saveToDisk,
		disabled: saving.value || errorCount.value > 0,
	},
	{ type: 'button', label: 'Back', action: () => void router.push('/docbuilder') },
])
function handleAction(_label: string, action?: () => void | Promise<void>) {
	if (action) void action()
}
</script>

<style scoped>
/* Own a full-viewport white surface: this page runs with `layout: false`, so nothing paints over
   the playground layout's global grey `body` background. Without this, the page shows grey (or a
   grey/white flicker) depending on navigation order. */
.docbuilder-page {
	background: var(--sc-form-background, #fff);
	min-height: 100vh;
	box-sizing: border-box;
	padding: 2rem;
}

.builder-workflow {
	padding: 0.5em 1em;
	min-height: 8rem;
}

:deep(.node-editor) {
	width: 100%;
	height: 40vh;
	overflow: hidden;
}

.empty-workflow {
	padding: 1rem 0;
}

.empty-workflow-hint {
	color: #9ca3af;
	font-style: italic;
	margin: 0 0 0.75rem;
}

.empty-workflow-form {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.empty-workflow-form input {
	border: 1px solid var(--sc-gray-20, #d1d5db);
	border-radius: 4px;
	padding: 0.4em 0.6em;
	font-size: 0.875rem;
	font-family: inherit;
}

.btn-seed {
	padding: 0.45em 1em;
	background: var(--sc-blue-40, #3b82f6);
	color: white;
	border: none;
	border-radius: 0.4rem;
	font-weight: 500;
	cursor: pointer;
	font-size: 0.875rem;
}

.btn-seed:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.validation-panel {
	margin-bottom: 1rem;
}

.validation-errors {
	padding: 1rem;
	background: #fee2e2;
	border: 1px solid #ef4444;
	border-radius: 6px;
	margin-bottom: 0.5rem;
	color: #991b1b;
}

.validation-warnings {
	padding: 1rem;
	background: #fef9c3;
	border: 1px solid #eab308;
	border-radius: 6px;
	color: #713f12;
}

.dismiss-button {
	margin-left: 1rem;
	background: none;
	border: 1px solid currentColor;
	border-radius: 3px;
	padding: 0.125em 0.5em;
	cursor: pointer;
	font-size: 0.75rem;
}

.builder-actions {
	padding: 1rem;
	display: flex;
	align-items: center;
	gap: 1rem;
}

.btn-primary {
	padding: 0.5rem 1.5rem;
	background: var(--sc-blue-40, #3b82f6);
	color: white;
	border: none;
	border-radius: 0.5rem;
	font-weight: 500;
	cursor: pointer;
}

.btn-primary:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.save-message {
	font-size: 0.875rem;
}

.save-message.success {
	color: #065f46;
}

.save-message.error {
	color: #991b1b;
}
</style>
