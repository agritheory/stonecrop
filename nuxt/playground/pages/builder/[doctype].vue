<template>
	<div class="builder-container">
		<div v-if="loading" class="loading">Loading DocBuilder...</div>
		<div v-else class="builder-wrapper">
			<!-- Title Section -->
			<div class="builder-title">
				<h1>DocBuilder: {{ doctypeName }}</h1>
				<div class="builder-actions">
					<button class="btn-secondary" :disabled="validating" @click="validateSchema">
						{{ validating ? 'Validating...' : 'Validate Schema' }}
					</button>
					<button class="btn-primary" :disabled="saving" @click="saveToDisk">
						{{ saving ? 'Saving...' : 'Save to Disk' }}
					</button>
				</div>
			</div>

			<!-- Validation Result -->
			<div v-if="validationResult" class="validation-result" :class="validationResult.success ? 'success' : 'error'">
				<div class="validation-header">
					<span class="validation-icon">{{ validationResult.success ? '✓' : '✗' }}</span>
					<span class="validation-title">{{
						validationResult.success ? 'Schema is valid!' : 'Schema validation failed'
					}}</span>
					<button class="dismiss-btn" @click="dismissValidation">×</button>
				</div>
				<ul v-if="!validationResult.success && validationResult.errors.length > 0" class="validation-errors">
					<li v-for="(error, index) in validationResult.errors" :key="index">
						<code>{{ error.path.join('.') || 'root' }}</code
						>: {{ error.message }}
					</li>
				</ul>
			</div>

			<!-- Save Message -->
			<div v-if="saveMessage" class="save-message" :class="saveMessage.type">
				<span>{{ saveMessage.text }}</span>
				<button class="dismiss-btn" @click="dismissSaveMessage">×</button>
			</div>

			<!-- Main Content -->
			<div class="builder-content">
				<!-- DocType Information -->
				<section class="builder-section">
					<h2>DocType Information</h2>
					<div class="info-grid">
						<div class="info-item">
							<label>Name:</label>
							<span>{{ doctype?.name }}</span>
						</div>
						<div class="info-item">
							<label>Module:</label>
							<span>{{ doctype?.module }}</span>
						</div>
						<div class="info-item">
							<label>Submittable:</label>
							<span>{{ doctype?.is_submittable ? 'Yes' : 'No' }}</span>
						</div>
						<div class="info-item">
							<label>Tree:</label>
							<span>{{ doctype?.is_tree ? 'Yes' : 'No' }}</span>
						</div>
					</div>
					<div class="info-description">
						<label>Description:</label>
						<p>{{ doctype?.description || 'No description provided' }}</p>
					</div>
				</section>

				<!-- Fields -->
				<section class="builder-section">
					<h2>Fields ({{ doctype?.fields?.length || 0 }})</h2>
					<div class="fields-list">
						<div v-for="field in doctype?.fields" :key="field.fieldname" class="field-item">
							<div class="field-header">
								<span class="field-name">{{ field.fieldname }}</span>
								<span class="field-type">{{ field.fieldtype }}</span>
							</div>
							<div class="field-label">
								{{ field.label }}
							</div>
							<div class="field-attrs">
								<span v-if="field.required" class="attr-badge">Required</span>
								<span v-if="field.read_only" class="attr-badge">Read Only</span>
								<span v-if="field.options" class="attr-badge">Options: {{ field.options }}</span>
							</div>
						</div>
					</div>
				</section>

				<!-- Ability Rules -->
				<section class="builder-section">
					<div class="section-header">
						<h2>Ability Rules ({{ abilityRules.length }})</h2>
						<button class="btn-primary" @click="handleNewRule">New Rule</button>
					</div>
					<ATable
						v-if="abilityRules.length > 0"
						:columns="rulesColumns"
						:rows="abilityRules"
						:config="config"
						@row-click="handleRuleClick" />
					<p v-else class="empty-state">No ability rules configured for this DocType</p>
				</section>

				<!-- Workflow -->
				<section class="builder-section">
					<h2>Workflow</h2>
					<div v-if="stateMachine">
						<div class="workflow-info">
							<div class="info-grid">
								<div class="info-item">
									<label>Machine ID:</label>
									<span>{{ stateMachine.machine_id }}</span>
								</div>
								<div class="info-item">
									<label>Name:</label>
									<span>{{ stateMachine.name }}</span>
								</div>
								<div class="info-item">
									<label>Version:</label>
									<span>{{ stateMachine.version }}</span>
								</div>
								<div class="info-item">
									<label>Initial State:</label>
									<span class="state-badge">{{ stateMachine.initial_state }}</span>
								</div>
							</div>
						</div>

						<!-- Visual Workflow Editor -->
						<div v-if="workflowConfig && Object.keys(workflowConfig).length > 0" class="workflow-editor">
							<ClientOnly>
								<StateEditor v-model="workflowConfig" node-container-class="node-editor" :layout="layout" />
							</ClientOnly>
						</div>
					</div>
					<p v-else class="empty-state">No workflow configured for this DocType</p>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { TableConfig } from '@stonecrop/atable'
import type { Layout } from '@stonecrop/node-editor'
import type { ValidationResult } from '@stonecrop/schema'
import { ref, computed, onMounted, nextTick } from 'vue'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const route = useRoute()
const router = useRouter()
const doctypeName = computed(() => route.params.doctype as string)

const doctype = ref<any>(null)
const abilityRules = ref<any[]>([])
const stateMachine = ref<any>(null)
const workflowConfig = ref<any>({})
const layout = ref<Layout>({})
const loading = ref(true)
const validationResult = ref<ValidationResult | null>(null)
const validating = ref(false)
const saving = ref(false)
const saveMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const config: TableConfig = {
	view: 'uncounted',
}

// Convert our state machine format to XState config format
function convertToXStateConfig(machine: any) {
	if (!machine || !machine.states) {
		return {}
	}

	const states: any = {}

	// Build states object
	for (const state of machine.states) {
		states[state.state_key] = {
			type: state.state_type,
			meta: {
				displayName: state.display_name,
			},
			on: {}, // Transitions will be added next
		}
	}

	// Add transitions
	if (machine.transitions) {
		for (const transition of machine.transitions) {
			const sourceState = states[transition.source_state_key]
			if (sourceState && sourceState.on) {
				sourceState.on[transition.event_type] = {
					target: transition.target_state_key,
					...(transition.guard_name && { cond: transition.guard_name }),
				}
			}
		}
	}

	return states
}

// Generate layout positions for state machine nodes
function generateLayout(machine: any): Layout {
	if (!machine || !machine.states) return {}

	const layout: Layout = {}
	machine.states.forEach((state: any, index: number) => {
		layout[state.state_key] = {
			position: { x: 250 * index, y: 150 },
			targetPosition: 'left' as any,
			sourcePosition: 'right' as any,
		}
	})

	return layout
}

// Load doctype, ability rules, and state machine
onMounted(async () => {
	try {
		// Load DocType
		const [doctypeData, rulesData, machineData] = await Promise.all([
			$fetch(`/api/doctypes/${doctypeName.value}`),
			$fetch(`/api/ability-rules?doctype=${doctypeName.value}`),
			$fetch(`/api/state-machines?entity_type=${doctypeName.value}`),
		])

		doctype.value = doctypeData
		abilityRules.value = rulesData as any[]
		stateMachine.value = machineData

		// Convert state machine to XState format for StateEditor
		if (stateMachine.value) {
			workflowConfig.value = convertToXStateConfig(stateMachine.value)
			layout.value = generateLayout(stateMachine.value)
		}

		// Add classes to edge labels after they render for better styling control
		await nextTick()
		setTimeout(() => {
			document.querySelectorAll('.vue-flow__edge-label').forEach(label => {
				const text = label.textContent?.trim()
				if (text) {
					label.classList.add(`edge-label-${text.toLowerCase()}`)
				}
			})
		}, 100)
	} catch (error) {
		console.error('Error loading builder data:', error)
	} finally {
		loading.value = false
	}
})

// Ability rules columns
const rulesColumns = [
	{ label: 'Role', name: 'role_id', fieldname: 'role_id', fieldtype: 'Link', width: '20ch' },
	{ label: 'Action', name: 'action', fieldname: 'action', fieldtype: 'Select', width: '15ch' },
	{ label: 'Subject', name: 'subject', fieldname: 'subject', fieldtype: 'Select', width: '15ch' },
	{ label: 'Inverted', name: 'inverted', fieldname: 'inverted', fieldtype: 'Check', width: '10ch' },
]

function handleRuleClick(rule: any) {
	router.push(`/ability-rules/${rule.id}`)
}

function handleNewRule() {
	router.push(`/ability-rules/new?doctype=${doctypeName.value}`)
}

async function validateSchema() {
	validating.value = true
	validationResult.value = null
	try {
		const result = await $fetch<ValidationResult>('/api/builder/validate', {
			method: 'POST',
			body: {
				doctype: doctypeName.value,
				fields: doctype.value?.fields || [],
			},
		})
		validationResult.value = result
	} catch (error: any) {
		validationResult.value = {
			success: false,
			errors: [{ path: [], message: error.message || 'Validation request failed' }],
		}
	} finally {
		validating.value = false
	}
}

async function saveToDisk() {
	saving.value = true
	saveMessage.value = null
	try {
		await $fetch('/api/builder/save', {
			method: 'POST',
			body: {
				doctype: doctypeName.value,
				schema: doctype.value?.fields || [],
			},
		})
		saveMessage.value = { type: 'success', text: 'Schema saved successfully!' }
	} catch (error: any) {
		saveMessage.value = { type: 'error', text: error.message || 'Failed to save schema' }
	} finally {
		saving.value = false
	}
}

function dismissValidation() {
	validationResult.value = null
}

function dismissSaveMessage() {
	saveMessage.value = null
}
</script>

<style scoped>
.builder-container {
	min-height: 100vh;
	padding: 0;
	margin: 0;
}

.builder-wrapper {
	max-width: 1400px;
	margin: 0 auto;
	padding: 2rem;
}

.builder-title {
	text-align: center;
	padding: 2rem 0 1rem;
}

.builder-title h1 {
	font-size: 2.5rem;
	margin: 0 0 1rem 0;
	font-weight: 700;
	color: var(--sc-gray-80);
}

.builder-actions {
	display: flex;
	gap: 1rem;
	justify-content: center;
}

.btn-secondary {
	padding: 0.5rem 1rem;
	background: var(--sc-btn-color);
	color: var(--sc-btn-label-color);
	border: 1px solid var(--sc-btn-border);
	border-radius: 0.25rem;
	cursor: pointer;
	font-weight: 500;
}

.btn-secondary:hover:not(:disabled) {
	background: var(--sc-btn-hover);
}

.btn-secondary:disabled,
.btn-primary:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.validation-result {
	padding: 1rem 1.5rem;
	border-radius: 0.25rem;
	margin-bottom: 1rem;
}

.validation-result.success {
	background: var(--sc-form-background);
	border: 1px solid var(--sc-brand-success);
}

.validation-result.error {
	background: var(--sc-form-background);
	border: 1px solid var(--sc-brand-danger);
}

.validation-header {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.validation-icon {
	font-size: 1.25rem;
	font-weight: bold;
}

.validation-result.success .validation-icon {
	color: var(--sc-brand-success);
}

.validation-result.error .validation-icon {
	color: var(--sc-brand-danger);
}

.validation-title {
	font-weight: 600;
	flex: 1;
}

.validation-result.success .validation-title {
	color: var(--sc-brand-success);
}

.validation-result.error .validation-title {
	color: var(--sc-brand-danger);
}

.dismiss-btn {
	background: none;
	border: none;
	font-size: 1.5rem;
	cursor: pointer;
	padding: 0;
	line-height: 1;
	opacity: 0.6;
}

.dismiss-btn:hover {
	opacity: 1;
}

.validation-errors {
	margin: 1rem 0 0 0;
	padding-left: 1.5rem;
	list-style-type: disc;
}

.validation-errors li {
	margin-bottom: 0.5rem;
	color: var(--sc-brand-danger);
}

.validation-errors code {
	background: var(--sc-gray-5);
	padding: 0.125rem 0.375rem;
	border-radius: 0.25rem;
	font-size: 0.875rem;
}

.save-message {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 1.5rem;
	border-radius: 0.25rem;
	margin-bottom: 1rem;
}

.save-message.success {
	background: var(--sc-form-background);
	border: 1px solid var(--sc-brand-success);
	color: var(--sc-brand-success);
}

.save-message.error {
	background: var(--sc-form-background);
	border: 1px solid var(--sc-brand-danger);
	color: var(--sc-brand-danger);
}

.loading {
	text-align: center;
	padding: 4rem;
	color: var(--sc-gray-50);
	font-size: 1.25rem;
}

.builder-content {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.builder-section {
	background: var(--sc-form-background);
	padding: 2rem;
	border-radius: 0.25rem;
	border: 1px solid var(--sc-form-border);
}

.builder-section h2 {
	margin: 0 0 1.5rem 0;
	font-size: 1.5rem;
	font-weight: 600;
	color: var(--sc-gray-80);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
}

.section-header h2 {
	margin: 0;
	color: var(--sc-gray-80);
}

.btn-primary {
	padding: 0.5rem 1rem;
	background: var(--sc-primary-color);
	color: var(--sc-primary-text-color);
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
	font-weight: 500;
}

.btn-primary:hover {
	opacity: 0.9;
}

.info-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1rem;
	margin-bottom: 1rem;
}

.info-item {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.info-item label {
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--sc-gray-50);
}

.info-item span {
	font-size: 1rem;
	color: var(--sc-gray-80);
}

.info-description {
	margin-top: 1rem;
}

.info-description label {
	display: block;
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--sc-gray-50);
	margin-bottom: 0.5rem;
}

.info-description p {
	margin: 0;
	color: var(--sc-gray-80);
}

.fields-list {
	display: grid;
	gap: 1rem;
}

.field-item {
	padding: 1rem;
	background: var(--sc-gray-5);
	border: 1px solid var(--sc-gray-10);
	border-radius: 0.25rem;
}

.field-item:hover {
	background: var(--sc-gray-10);
}

.field-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.5rem;
}

.field-name {
	font-family: 'Monaco', 'Courier New', monospace;
	font-weight: 600;
	color: var(--sc-gray-80);
}

.field-type {
	font-size: 0.875rem;
	padding: 0.25rem 0.5rem;
	background: var(--sc-cell-changed-color);
	color: var(--sc-primary-color);
	border-radius: 0.25rem;
	font-weight: 500;
}

.field-label {
	color: var(--sc-gray-50);
	margin-bottom: 0.5rem;
}

.field-attrs {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.attr-badge {
	font-size: 0.75rem;
	padding: 0.25rem 0.5rem;
	background: var(--sc-gray-10);
	color: var(--sc-gray-80);
	border-radius: 0.25rem;
}

.empty-state {
	padding: 2rem;
	text-align: center;
	color: var(--sc-gray-50);
	background: var(--sc-gray-5);
	border-radius: 0.25rem;
	font-style: italic;
}

.workflow-info h3 {
	margin: 1.5rem 0 1rem 0;
	font-size: 1.125rem;
	font-weight: 600;
}

.state-badge {
	padding: 0.25rem 0.75rem;
	background: var(--sc-cell-changed-color);
	color: var(--sc-primary-color);
	border-radius: 0.25rem;
	font-weight: 600;
}

.states-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1rem;
}

.state-card {
	padding: 1rem;
	background: var(--sc-gray-5);
	border: 2px solid var(--sc-gray-10);
	border-radius: 0.25rem;
}

.state-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.5rem;
}

.state-key {
	font-weight: 600;
	color: var(--sc-gray-80);
}

.state-type {
	font-size: 0.75rem;
	padding: 0.25rem 0.5rem;
	background: var(--sc-gray-10);
	color: var(--sc-gray-80);
	border-radius: 0.25rem;
}

.state-name {
	color: var(--sc-gray-50);
	font-size: 0.875rem;
}

.transitions-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.transition-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem;
	background: var(--sc-gray-5);
	border: 1px solid var(--sc-gray-10);
	border-radius: 0.25rem;
	font-size: 0.875rem;
}

.transition-source,
.transition-target {
	font-weight: 600;
	color: var(--sc-gray-80);
}

.transition-arrow {
	color: var(--sc-gray-50);
	font-size: 1.25rem;
}

.transition-event {
	padding: 0.25rem 0.5rem;
	background: var(--sc-cell-changed-color);
	color: var(--sc-primary-color);
	border-radius: 0.25rem;
}

.transition-guard {
	padding: 0.25rem 0.5rem;
	background: var(--sc-form-background);
	color: var(--sc-brand-warning);
	border: 1px solid var(--sc-brand-warning);
	border-radius: 0.25rem;
}

.workflow-editor {
	margin-top: 1.5rem;
	background: var(--sc-form-background);
	border: 2px solid var(--sc-primary-color);
	border-radius: 0.25rem;
	overflow: hidden;
}

.workflow-editor :deep(.vue-flow) {
	width: 100%;
	height: 500px;
	background: var(--sc-gray-5);
}

.workflow-editor :deep(.vue-flow__node) {
	background: var(--sc-form-background);
	border: 2px solid var(--sc-primary-color);
	border-radius: 0.25rem;
	padding: 1rem;
	font-weight: 600;
	z-index: 10;
}

.workflow-editor :deep(.vue-flow__edge) {
	z-index: 5;
}

.workflow-editor :deep(.vue-flow__edge-label) {
	background: var(--sc-form-background) !important;
	border: 1px solid var(--sc-primary-color) !important;
	border-radius: 0.25rem !important;
	padding: 0.25rem 0.5rem !important;
	font-size: 0.75rem !important;
	font-weight: 600 !important;
	color: var(--sc-primary-color) !important;
	white-space: nowrap !important;
	pointer-events: all !important;
}

/* Offset specific edge labels to prevent overlap on bidirectional edges */
.workflow-editor :deep(.vue-flow__edge-label.edge-label-suspend) {
	transform: translate(0, -15px);
}

.workflow-editor :deep(.vue-flow__edge-label.edge-label-reactivate) {
	transform: translate(0, 15px);
}

.workflow-editor :deep(.vue-flow__edge-path) {
	stroke: var(--sc-primary-color);
	stroke-width: 2.5;
	marker-end: url(#arrowclosed);
}

.workflow-editor :deep(.vue-flow__edge-text) {
	fill: var(--sc-primary-color);
	font-size: 0.75rem;
	font-weight: 600;
	dominant-baseline: central;
	text-anchor: middle;
}

.workflow-editor :deep(.vue-flow__edge-textbg) {
	fill: var(--sc-form-background);
	fill-opacity: 1;
	rx: 4;
	ry: 4;
}

.machine-controls {
	display: flex;
	gap: 0.75rem;
	padding: 1rem;
	background: var(--sc-gray-5);
	border-bottom: 1px solid var(--sc-gray-10);
	align-items: center;
}

.machine-controls p {
	margin: 0;
	font-size: 0.875rem;
	color: var(--sc-gray-50);
}

.machine-controls strong {
	color: var(--sc-gray-80);
}

.machine-controls button {
	padding: 0.5rem 1rem;
	background: var(--sc-primary-color);
	color: var(--sc-primary-text-color);
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
	font-size: 0.875rem;
	font-weight: 500;
}

.machine-controls button:hover {
	opacity: 0.9;
}

/* Style the node editor chart controls */
.workflow-editor :deep(.chart-controls) {
	padding: 0.75rem 1rem;
	background: var(--sc-gray-5);
	border-bottom: 1px solid var(--sc-gray-10);
	height: auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.workflow-editor :deep(.chart-controls-left) {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.875rem;
	color: var(--sc-gray-80);
}

.workflow-editor :deep(.chart-controls-left b) {
	font-weight: 600;
	color: var(--sc-gray-80);
}

.workflow-editor :deep(.chart-controls-right) {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.workflow-editor :deep(.chart-controls-right div) {
	margin-left: 0;
}

.workflow-editor :deep(.button-default) {
	padding: 0.5rem 1rem;
	background: var(--sc-primary-color);
	color: var(--sc-primary-text-color);
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
	font-size: 0.875rem;
	font-weight: 600;
}

.workflow-editor :deep(.button-default:hover) {
	opacity: 0.9;
}
</style>
