<template>
	<div>
		<!-- Loading state -->
		<div v-if="isLoading" style="padding: 2rem; text-align: center">Loading doctype metadata...</div>

		<!-- Main content -->
		<div v-else>
			<!-- Validation Panel -->
			<div v-if="validationResult && validationResult.issues.length > 0 && !warningsDismissed" class="validation-panel">
				<div v-if="validationResult.errorCount > 0" class="validation-errors">
					<strong>⚠️ {{ validationResult.errorCount }} Error(s) - Cannot Save</strong>
					<ul>
						<li
							v-for="(issue, idx) in validationResult.issues.filter(i => i.severity === 'error')"
							:key="`error-${idx}`">
							<code v-if="issue.fieldname">{{ issue.fieldname }}:</code> {{ issue.message }}
						</li>
					</ul>
				</div>
				<div v-if="validationResult.warningCount > 0" class="validation-warnings">
					<strong>⚡ {{ validationResult.warningCount }} Warning(s)</strong>
					<button @click="dismissWarnings" class="dismiss-button">Dismiss</button>
					<ul>
						<li
							v-for="(issue, idx) in validationResult.issues.filter(i => i.severity === 'warning')"
							:key="`warning-${idx}`">
							<code v-if="issue.fieldname">{{ issue.fieldname }}:</code> {{ issue.message }}
						</li>
					</ul>
				</div>
			</div>

			<AFieldset label="Workflow" :collapsible="true">
				<div class="builder-workflow">
					<StateEditor
						v-if="workflowConfig && workflowConfig.states && Object.keys(workflowConfig.states).length > 0"
						v-model="workflowConfig.states"
						node-container-class="node-editor"
						:layout="layout" />
				</div>
			</AFieldset>
			<AForm class="aform-main" v-model="doctypeSchema" :data="formData" :key="formKey" />
			<ActionSet :elements="actionElements" />

			<!-- Import Wizard Modal -->
			<ImportWizard v-if="showImportWizard" @close="showImportWizard = false" @import="handleImport" />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { ResolvedField } from '@stonecrop/aform'
import type { ActionElements } from '@stonecrop/desktop'
import type { Layout } from '@stonecrop/node-editor'
import { useStonecrop, type ValidationResult, validateSchema, type RouteContext } from '@stonecrop/stonecrop'
import type { ConversionResult } from '@stonecrop/utilities/sql-introspection'
import { scaffoldWorkflowFromTable, generateWorkflowLayout } from '@stonecrop/utilities/workflow-scaffolder'
import { List } from 'immutable'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { type AnyStateNodeConfig, createMachine } from 'xstate'

import doctypeSchemaJson from '../assets/doctype_schema.json'
import ImportWizard from './ImportWizard.vue'

interface BuilderFormData {
	schema_fieldset?: {
		// User-authored field definitions, not AForm's resolved schema
		schema: Record<string, unknown>[]
	}
	actions_fieldset?: {
		actions: unknown
	}
}

const route = useRoute()
const formKey = ref(0)

const { stonecrop } = useStonecrop()

const showImportWizard = ref(false)
const validationResult = ref<ValidationResult | null>(null)
const warningsDismissed = ref(false)
const isLoading = ref(true)

// Reactive data for the components
const doctypeSchema = ref<ResolvedField[]>(doctypeSchemaJson)
const formData = ref<BuilderFormData>({})
const layout = ref<Layout>({})
const workflowConfig = ref<AnyStateNodeConfig | undefined>()

// Simple direct approach to test API calls
onMounted(async () => {
	const doctype = route.params.id.toString()
	if (!stonecrop.value) {
		console.error('Stonecrop instance is not available')
		return
	}

	if (!stonecrop.value.registry.getMeta) {
		console.error(`getMeta function is not available in the registry for ${doctype}`)
		return
	}

	try {
		// Use our getMeta function to fetch all required data
		const routeContext: RouteContext = {
			path: route.path,
			segments: route.path.split('/').filter(Boolean),
		}
		const doctypeMeta = stonecrop.value.registry.getMeta
			? await stonecrop.value.registry.getMeta(routeContext)
			: undefined
		if (!doctypeMeta) {
			throw new Error(`No metadata found for doctype: ${doctype}`)
		}

		// Load the layout
		const searchParams = new URLSearchParams({ doctype })
		const layoutResponse = await fetch('/api/load_layout?' + searchParams.toString())
		const layoutResponseData = await layoutResponse.json()
		layout.value = layoutResponseData || {}

		// Set up data directly
		formData.value = {
			...formData.value,
			schema_fieldset: {
				schema: doctypeMeta.schema?.toArray() || [],
			},
			actions_fieldset: {
				actions: doctypeMeta.actions?.get('default') || [],
			},
		}

		if (doctypeMeta.workflow) {
			const stateMachine = createMachine(doctypeMeta.workflow)
			workflowConfig.value = stateMachine.config
		}

		isLoading.value = false
	} catch (error) {
		console.error('Error loading doctype metadata:', error)
		isLoading.value = false
	}
})

// Watch for schema changes and validate
watch(
	() => formData.value,
	() => {
		if (!stonecrop.value || !stonecrop.value.registry) return

		const doctype = route.params.id.toString()
		const schemaData = formData.value.schema_fieldset?.schema
		const actionsData = formData.value.actions_fieldset?.actions

		if (schemaData) {
			// Convert to List if needed
			const schemaList = Array.isArray(schemaData) ? List(schemaData) : schemaData

			// Type guard for actions - ensure it's Map or undefined
			const actions = actionsData instanceof Map ? actionsData : undefined

			// Validate
			validationResult.value = validateSchema(
				doctype,
				schemaList,
				stonecrop.value.registry,
				workflowConfig.value,
				actions
			)

			// Reset warnings dismissed when new validation occurs
			if (validationResult.value.issues.length > 0) {
				warningsDismissed.value = false
			}
		}
	},
	{ deep: true }
)

function dismissWarnings() {
	warningsDismissed.value = true
}

// Handle SQL import
function handleImport(results: ConversionResult[]) {
	if (!stonecrop.value || results.length === 0) return

	// For now, import the first table
	// In a full implementation, you'd handle multiple tables
	const result = results[0]

	// Update schema
	formData.value = {
		...formData.value,
		schema_fieldset: {
			schema: result.schema,
		},
	}

	// Try to scaffold workflow if available
	// Note: We need the original SQLTable for this, so we'll need to enhance the flow
	// For now, this is a placeholder for future enhancement

	showImportWizard.value = false
	formKey.value++
}

// Setup page actions
const actionElements = [
	{
		type: 'button',
		label: 'Save',
		action: function () {
			// Check validation before saving
			if (validationResult.value && validationResult.value.errorCount > 0) {
				alert('Cannot save: Please fix validation errors first.')
				return
			}
			// TODO: Implement actual save logic
			console.log('Saving...', formData.value)
		},
		// Disable if there are validation errors
		disabled: () => (validationResult.value?.errorCount ?? 0) > 0,
	},
	{
		type: 'button',
		label: 'Import SQL',
		action: function () {
			showImportWizard.value = true
		},
	},
	{
		type: 'dropdown',
		label: 'Actions',
		actions: [
			{
				label: 'Print',
				action: function () {},
			},
			{
				label: 'Email',
				action: function () {},
			},
			{
				label: 'Duplicate',
				action: function () {},
			},
		],
	},
] as ActionElements[]
</script>

<style>
html,
body {
	height: 100%;
	font-family: Arimo, sans-serif;
	font-size: 11pt;
}

.builder-container {
	display: flex;
	flex-direction: column;
	justify-content: start;
}

.builder-schema,
.builder-hooks,
.builder-events {
	border: 1px solid var(--sc-gray-20);
	padding: 1em;
	margin-bottom: 1em;
}

.builder-workflow {
	padding: 1em;
	margin-bottom: 3em;
}

.node-editor {
	width: 100%;
	height: 40vh;
	overflow: hidden;
}

.validation-panel {
	margin-bottom: 1rem;
}

.validation-errors,
.validation-warnings {
	padding: 1rem;
	border-radius: 6px;
	margin-bottom: 0.5rem;
}

.validation-errors {
	background: #fef2f2;
	border: 1px solid #fecaca;
	color: #991b1b;
}

.validation-warnings {
	background: #fffbeb;
	border: 1px solid #fde68a;
	color: #92400e;
	position: relative;
}

.validation-errors strong,
.validation-warnings strong {
	display: block;
	margin-bottom: 0.5rem;
	font-size: 0.9375rem;
}

.validation-errors ul,
.validation-warnings ul {
	margin: 0;
	padding-left: 1.5rem;
	font-size: 0.875rem;
}

.validation-errors li,
.validation-warnings li {
	margin: 0.25rem 0;
}

.validation-errors code,
.validation-warnings code {
	background: rgba(0, 0, 0, 0.05);
	padding: 0.125rem 0.375rem;
	border-radius: 3px;
	font-family: monospace;
	font-size: 0.875em;
}

.dismiss-button {
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: none;
	border: none;
	color: #92400e;
	cursor: pointer;
	text-decoration: underline;
	font-size: 0.875rem;
	padding: 0;
}

.dismiss-button:hover {
	color: #78350f;
}

footer {
	bottom: 15px !important;
	right: 15px !important;
}
</style>
