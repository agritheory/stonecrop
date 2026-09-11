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

			<!-- `schema` is empty on purpose: AFieldset renders an AForm from it only as slot fallback,
			     and each of these fieldsets fills the slot with its own panel. -->
			<AFieldset label="Workflow" :schema="[]" :collapsible="true">
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

			<AFieldset label="Actions" :schema="[]" :collapsible="true">
				<DocBuilderActionsPanel v-model="workflowConfig" />
			</AFieldset>

			<AFieldset label="Schema" :schema="[]" :collapsible="true">
				<DocBuilderFieldsPanel v-model="fields" />
			</AFieldset>

			<div v-if="saveMessage" class="builder-actions">
				<span class="save-message" :class="saveMessage.type">{{ saveMessage.text }}</span>
			</div>

			<ActionSet :elements="docbuilderActions" @action-click="handleAction" />
		</div>
	</div>
</template>

<script setup>
import { AFieldset } from '@stonecrop/aform'
import { StateEditor } from '@stonecrop/node-editor'
import { ActionSet } from '@stonecrop/desktop'
import { WorkflowMeta } from '@stonecrop/schema'
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'
import DocBuilderActionsPanel from '../components/DocBuilderActionsPanel.vue'
import DocBuilderFieldsPanel from '../components/DocBuilderFieldsPanel.vue'
const route = useRoute()
const router = useRouter()
const doctypeName = computed(() => route.params.doctype)
const loading = ref(true)
const saving = ref(false)
const warningsDismissed = ref(false)
const saveMessage = ref(null)
const fields = ref([])
const workflowConfig = ref()
const layout = ref({})
const validationIssues = ref([])
const errorCount = computed(() => validationIssues.value.filter(i => i.severity === 'error').length)
const warningCount = computed(() => validationIssues.value.filter(i => i.severity === 'warning').length)
onMounted(async () => {
	try {
		const data = await $fetch(`/api/_stonecrop/docbuilder/${doctypeName.value}`)
		fields.value = data.fields ?? []
		if (data.workflow) {
			const { layout: savedLayout, ...topology } = data.workflow
			workflowConfig.value = topology
			if (savedLayout) layout.value = savedLayout
		}
	} catch (error) {
		console.error('Error loading doctype:', error)
	} finally {
		loading.value = false
	}
})
const newStateName = ref('Draft')
function seedWorkflow() {
	const name = newStateName.value.trim()
	if (!name) return
	workflowConfig.value = { states: [name], actions: {} }
}
function revalidate() {
	const issues = []
	if (workflowConfig.value) {
		const result = WorkflowMeta.safeParse(workflowConfig.value)
		if (!result.success) {
			for (const issue of result.error.issues) {
				issues.push({
					severity: 'error',
					message: issue.message,
					fieldname: issue.path.length > 0 ? issue.path.join('.') : void 0,
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
			body: {
				doctype: doctypeName.value,
				fields: fields.value,
				// Merge the author's node arrangement back into the workflow (WorkflowMeta.layout) so it
				// persists. The layout ref is kept separate in memory (topology-only workflowConfig) and
				// only rejoined here at the I/O boundary; omitted when empty to avoid churn on doctypes
				// that were never manually arranged.
				workflow: workflowConfig.value
					? { ...workflowConfig.value, ...(Object.keys(layout.value).length > 0 && { layout: layout.value }) }
					: null,
			},
		})
		saveMessage.value = { type: 'success', text: 'Saved.' }
	} catch (error) {
		saveMessage.value = { type: 'error', text: error.message || 'Save failed.' }
	} finally {
		saving.value = false
	}
}
const docbuilderActions = computed(() => [
	{
		type: 'button',
		label: saving.value ? 'Saving\u2026' : 'Save',
		action: saveToDisk,
		disabled: saving.value || errorCount.value > 0,
	},
	{ type: 'button', label: 'Back', action: () => void router.push('/docbuilder') },
])
function handleAction(_label, action) {
	if (action) void action()
}
</script>

<style scoped>
.docbuilder-page {
	background: var(--sc-form-background, #fff);
	box-sizing: border-box;
	min-height: 100vh;
	padding: 2rem;
}
.builder-workflow {
	min-height: 8rem;
	padding: 0.5em 1em;
}
:deep(.node-editor) {
	height: 40vh;
	overflow: hidden;
	width: 100%;
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
	align-items: center;
	display: flex;
	gap: 0.5rem;
}
.empty-workflow-form input {
	border: 1px solid var(--sc-gray-20, #d1d5db);
	border-radius: 4px;
	font-family: inherit;
	font-size: 0.875rem;
	padding: 0.4em 0.6em;
}
.btn-seed {
	background: var(--sc-blue-40, #3b82f6);
	border: none;
	border-radius: 0.4rem;
	color: #fff;
	cursor: pointer;
	font-size: 0.875rem;
	font-weight: 500;
	padding: 0.45em 1em;
}
.btn-seed:disabled {
	cursor: not-allowed;
	opacity: 0.5;
}
.validation-panel {
	margin-bottom: 1rem;
}
.validation-errors {
	background: #fee2e2;
	border: 1px solid #ef4444;
	border-radius: 6px;
	color: #991b1b;
	margin-bottom: 0.5rem;
	padding: 1rem;
}
.validation-warnings {
	background: #fef9c3;
	border: 1px solid #eab308;
	border-radius: 6px;
	color: #713f12;
	padding: 1rem;
}
.dismiss-button {
	background: none;
	border: 1px solid;
	border-radius: 3px;
	cursor: pointer;
	font-size: 0.75rem;
	margin-left: 1rem;
	padding: 0.125em 0.5em;
}
.builder-actions {
	align-items: center;
	display: flex;
	gap: 1rem;
	padding: 1rem;
}
.btn-primary {
	background: var(--sc-blue-40, #3b82f6);
	border: none;
	border-radius: 0.5rem;
	color: #fff;
	cursor: pointer;
	font-weight: 500;
	padding: 0.5rem 1.5rem;
}
.btn-primary:disabled {
	cursor: not-allowed;
	opacity: 0.6;
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
