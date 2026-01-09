<template>
	<div class="import-wizard">
		<div class="import-header">
			<h2>Import SQL Schema</h2>
			<button @click="$emit('close')" class="close-button">✕</button>
		</div>

		<div class="import-content">
			<!-- Step 1: File Upload -->
			<div v-if="step === 'upload'" class="import-step">
				<div
					class="upload-area"
					@drop.prevent="handleDrop"
					@dragover.prevent
					@dragenter="dragEnter"
					@dragleave="dragLeave"
					:class="{ dragging: isDragging }">
					<input ref="fileInput" type="file" accept=".sql" @change="handleFileSelect" style="display: none" />
					<div class="upload-content">
						<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="17 8 12 3 7 8" />
							<line x1="12" y1="3" x2="12" y2="15" />
						</svg>
						<p class="upload-text">
							Drag & drop SQL file here or <button @click="triggerFileInput" class="link-button">browse</button>
						</p>
						<p class="upload-hint">Supports PostgreSQL DDL (.sql files)</p>
					</div>
				</div>

				<div v-if="parseError" class="error-message"><strong>Error parsing SQL:</strong> {{ parseError }}</div>
			</div>

			<!-- Step 2: Preview & Edit -->
			<div v-if="step === 'preview'" class="import-step preview-step">
				<div class="preview-header">
					<h3>Schema Preview</h3>
					<p class="preview-info">
						{{ conversionResults.length }} table(s) found. Review and edit field mappings below.
					</p>
				</div>

				<div class="tables-preview">
					<div v-for="(result, index) in conversionResults" :key="index" class="table-preview">
						<div class="table-header">
							<h4>{{ result.doctype }}</h4>
							<span v-if="result.relationships.length > 0" class="relationship-badge">
								{{ result.relationships.length }} relationship(s)
							</span>
						</div>

						<ATable
							v-model:rows="previewRows[index]"
							v-model:columns="previewColumns"
							:config="{ view: 'grid', fullWidth: true }"
							:key="`preview-${index}`" />

						<div v-if="result.relationships.length > 0" class="relationships-info">
							<strong>Relationships:</strong>
							<ul>
								<li v-for="rel in result.relationships" :key="rel.fieldname">
									<code>{{ rel.fieldname }}</code> → <code>{{ rel.targetDoctype }}.{{ rel.targetField }}</code>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="preview-actions">
					<button @click="step = 'upload'" class="button secondary">Back</button>
					<button @click="importSchemas" class="button primary">Import Schemas</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { TableColumn, TableRow } from '@stonecrop/atable'
import { convertSQLName, type ConversionResult, introspectSQL } from '@stonecrop/utilities'
import { ref } from 'vue'

// Emits
const emit = defineEmits<{
	close: []
	import: [results: ConversionResult[]]
}>()

// State
const step = ref<'upload' | 'preview'>('upload')
const isDragging = ref(false)
const parseError = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const conversionResults = ref<ConversionResult[]>([])

// Preview table data
const previewColumns = ref<TableColumn[]>([
	{ name: 'fieldname', label: 'Field Name', type: 'Data', edit: true, width: '20ch' },
	{ name: 'label', label: 'Label', type: 'Data', edit: true, width: '20ch' },
	{ name: 'fieldtype', label: 'Type', type: 'Select', edit: true, width: '15ch' },
	{ name: 'required', label: 'Required', type: 'Check', edit: true, width: '10ch' },
	{ name: 'readonly', label: 'Read Only', type: 'Check', edit: true, width: '10ch' },
	{ name: 'options', label: 'Options', type: 'Data', edit: true, width: '20ch' },
])
const previewRows = ref<TableRow[][]>([])

// File handling
function triggerFileInput() {
	fileInput.value?.click()
}

function dragEnter() {
	isDragging.value = true
}

function dragLeave(e: DragEvent) {
	// Only set to false if leaving the entire drop area
	if (e.target === e.currentTarget) {
		isDragging.value = false
	}
}

function handleDrop(e: DragEvent) {
	isDragging.value = false
	const files = e.dataTransfer?.files
	if (files && files.length > 0) {
		processFile(files[0])
	}
}

function handleFileSelect(e: Event) {
	const input = e.target as HTMLInputElement
	if (input.files && input.files.length > 0) {
		processFile(input.files[0])
	}
}

async function processFile(file: File) {
	parseError.value = null

	try {
		// Read file content
		const text = await file.text()

		// Parse SQL and convert to Stonecrop schema
		const results = introspectSQL(text, convertSQLName)

		if (results.length === 0) {
			parseError.value = 'No tables found in SQL file. Please check the file format.'
			return
		}

		conversionResults.value = results

		// Build preview rows for each table
		previewRows.value = results.map(result =>
			result.schema.map((field, idx) => ({
				id: `${result.doctype}-${idx}`,
				fieldname: field.fieldname,
				label: field.label,
				fieldtype: field.fieldtype,
				required: field.required || false,
				readonly: field.readonly || false,
				options: field.options || '',
			}))
		)

		// Move to preview step
		step.value = 'preview'
	} catch (error) {
		console.error('Error processing SQL file:', error)
		parseError.value = error instanceof Error ? error.message : 'Unknown error occurred'
	}
}

function importSchemas() {
	// Update conversion results with edited values from preview tables
	conversionResults.value = conversionResults.value.map((result, index) => ({
		...result,
		schema: previewRows.value[index].map(row => ({
			fieldname: row.fieldname as string,
			label: row.label as string,
			fieldtype: row.fieldtype as any,
			required: row.required as boolean,
			readonly: row.readonly as boolean,
			options: row.options as string,
			default: result.schema.find(f => f.fieldname === row.fieldname)?.default,
		})),
	}))

	emit('import', conversionResults.value)
}
</script>

<style scoped>
.import-wizard {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: white;
	z-index: 1000;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.import-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.5rem 2rem;
	border-bottom: 1px solid #e5e7eb;
}

.import-header h2 {
	margin: 0;
	font-size: 1.5rem;
	font-weight: 600;
}

.close-button {
	background: none;
	border: none;
	font-size: 1.5rem;
	cursor: pointer;
	padding: 0.5rem;
	color: #6b7280;
	line-height: 1;
}

.close-button:hover {
	color: #374151;
}

.import-content {
	flex: 1;
	overflow: auto;
	padding: 2rem;
}

.import-step {
	max-width: 800px;
	margin: 0 auto;
}

.preview-step {
	max-width: 100%;
}

.upload-area {
	border: 2px dashed #d1d5db;
	border-radius: 8px;
	padding: 3rem;
	text-align: center;
	transition: all 0.2s;
	cursor: pointer;
}

.upload-area:hover,
.upload-area.dragging {
	border-color: #3b82f6;
	background: #eff6ff;
}

.upload-content svg {
	margin: 0 auto 1rem;
	color: #6b7280;
}

.upload-text {
	font-size: 1rem;
	color: #374151;
	margin: 0 0 0.5rem 0;
}

.link-button {
	background: none;
	border: none;
	color: #3b82f6;
	cursor: pointer;
	text-decoration: underline;
	padding: 0;
	font: inherit;
}

.link-button:hover {
	color: #2563eb;
}

.upload-hint {
	font-size: 0.875rem;
	color: #6b7280;
	margin: 0;
}

.error-message {
	margin-top: 1rem;
	padding: 1rem;
	background: #fef2f2;
	border: 1px solid #fecaca;
	border-radius: 6px;
	color: #991b1b;
}

.preview-header {
	margin-bottom: 2rem;
}

.preview-header h3 {
	margin: 0 0 0.5rem 0;
	font-size: 1.25rem;
	font-weight: 600;
}

.preview-info {
	margin: 0;
	color: #6b7280;
}

.tables-preview {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.table-preview {
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	padding: 1.5rem;
	background: #f9fafb;
}

.table-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
}

.table-header h4 {
	margin: 0;
	font-size: 1.125rem;
	font-weight: 600;
}

.relationship-badge {
	background: #dbeafe;
	color: #1e40af;
	padding: 0.25rem 0.75rem;
	border-radius: 999px;
	font-size: 0.875rem;
	font-weight: 500;
}

.relationships-info {
	margin-top: 1rem;
	padding: 1rem;
	background: white;
	border-radius: 6px;
	font-size: 0.875rem;
}

.relationships-info ul {
	margin: 0.5rem 0 0 0;
	padding-left: 1.5rem;
}

.relationships-info li {
	margin: 0.25rem 0;
}

.relationships-info code {
	background: #f3f4f6;
	padding: 0.125rem 0.375rem;
	border-radius: 3px;
	font-family: monospace;
	font-size: 0.875em;
}

.preview-actions {
	display: flex;
	justify-content: flex-end;
	gap: 1rem;
	margin-top: 2rem;
	padding-top: 2rem;
	border-top: 1px solid #e5e7eb;
}

.button {
	padding: 0.625rem 1.25rem;
	border-radius: 6px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	border: none;
	font-size: 0.9375rem;
}

.button.primary {
	background: #3b82f6;
	color: white;
}

.button.primary:hover {
	background: #2563eb;
}

.button.secondary {
	background: white;
	color: #374151;
	border: 1px solid #d1d5db;
}

.button.secondary:hover {
	background: #f9fafb;
}
</style>
