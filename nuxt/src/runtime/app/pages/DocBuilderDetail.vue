<template>
	<div class="docbuilder-container">
		<div v-if="loading" class="loading">Loading...</div>
		<div v-else class="docbuilder-wrapper">
			<div class="docbuilder-header">
				<h1>{{ doctypeName }}</h1>
				<div class="docbuilder-actions">
					<button class="btn-secondary" :disabled="validating" @click="validateSchema">
						{{ validating ? 'Validating...' : 'Validate Schema' }}
					</button>
					<button class="btn-primary" :disabled="saving" @click="saveToDisk">
						{{ saving ? 'Saving...' : 'Save to Disk' }}
					</button>
				</div>
			</div>

			<!-- Validation Result -->
			<div v-if="validationResult" class="message-box" :class="validationResult.success ? 'success' : 'error'">
				<div class="message-header">
					<span>{{ validationResult.success ? '✓ Schema is valid!' : '✗ Validation failed' }}</span>
					<button class="dismiss-btn" @click="validationResult = null">×</button>
				</div>
				<ul v-if="!validationResult.success" class="error-list">
					<li v-for="(error, idx) in validationResult.errors" :key="idx">
						<code>{{ error.path.join('.') || 'root' }}</code
						>: {{ error.message }}
					</li>
				</ul>
			</div>

			<!-- Save Message -->
			<div v-if="saveMessage" class="message-box" :class="saveMessage.type">
				<span>{{ saveMessage.text }}</span>
				<button class="dismiss-btn" @click="saveMessage = null">×</button>
			</div>

			<!-- Fields -->
			<section class="fields-section">
				<h2>Fields ({{ doctype?.schema?.length || 0 }})</h2>
				<div v-for="field in doctype?.schema" :key="field.fieldname" class="field-item">
					<div class="field-header">
						<span class="field-name">{{ field.fieldname }}</span>
						<span class="field-type">{{ field.fieldtype }}</span>
					</div>
					<div class="field-label">{{ field.label }}</div>
					<div v-if="field.required || field.readOnly" class="field-badges">
						<span v-if="field.required" class="badge">Required</span>
						<span v-if="field.readOnly" class="badge">Read Only</span>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { ValidationResult } from '@stonecrop/schema'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'nuxt/app'

const route = useRoute()
const doctypeName = computed(() => route.params.doctype as string)

const doctype = ref<any>(null)
const loading = ref(true)
const validating = ref(false)
const saving = ref(false)
const validationResult = ref<ValidationResult | null>(null)
const saveMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

onMounted(async () => {
	try {
		const data = await $fetch(`/api/docbuilder/${doctypeName.value}`)
		doctype.value = data
	} catch (error) {
		console.error('Error loading doctype:', error)
	} finally {
		loading.value = false
	}
})

async function validateSchema() {
	validating.value = true
	validationResult.value = null
	try {
		const result = await $fetch<ValidationResult>('/api/docbuilder/validate', {
			method: 'POST',
			body: { fields: doctype.value?.schema || [] },
		})
		validationResult.value = result
	} catch (error: any) {
		validationResult.value = {
			success: false,
			errors: [{ path: [], message: error.message || 'Validation failed' }],
		}
	} finally {
		validating.value = false
	}
}

async function saveToDisk() {
	saving.value = true
	saveMessage.value = null
	try {
		await $fetch('/api/docbuilder/save', {
			method: 'POST',
			body: { doctype: doctypeName.value, schema: doctype.value?.schema || [] },
		})
		saveMessage.value = { type: 'success', text: 'Schema saved successfully!' }
	} catch (error: any) {
		saveMessage.value = { type: 'error', text: error.message || 'Failed to save' }
	} finally {
		saving.value = false
	}
}
</script>

<style scoped>
.docbuilder-container {
	min-height: 100vh;
}

.docbuilder-wrapper {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
}

.docbuilder-header {
	text-align: center;
	margin-bottom: 2rem;
}

.docbuilder-header h1 {
	font-size: 2rem;
	margin: 0 0 1rem;
	font-weight: 700;
}

.docbuilder-actions {
	display: flex;
	gap: 1rem;
	justify-content: center;
}

.btn-primary,
.btn-secondary {
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.btn-primary {
	background: #3b82f6;
	color: white;
	border: none;
}

.btn-primary:hover:not(:disabled) {
	background: #2563eb;
}

.btn-secondary {
	background: #e5e7eb;
	color: #374151;
	border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
	background: #d1d5db;
}

.btn-primary:disabled,
.btn-secondary:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.message-box {
	padding: 1rem;
	border-radius: 0.5rem;
	margin-bottom: 1rem;
}

.message-box.success {
	background: #d1fae5;
	border: 1px solid #10b981;
	color: #065f46;
}

.message-box.error {
	background: #fee2e2;
	border: 1px solid #ef4444;
	color: #991b1b;
}

.message-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.dismiss-btn {
	background: none;
	border: none;
	font-size: 1.5rem;
	cursor: pointer;
	opacity: 0.6;
}

.dismiss-btn:hover {
	opacity: 1;
}

.error-list {
	margin: 0.5rem 0 0;
	padding-left: 1.5rem;
}

.error-list code {
	background: rgba(0, 0, 0, 0.1);
	padding: 0.125rem 0.25rem;
	border-radius: 0.25rem;
}

.loading {
	text-align: center;
	padding: 4rem;
	color: #6b7280;
}

.fields-section {
	background: white;
	padding: 1.5rem;
	border-radius: 0.75rem;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.fields-section h2 {
	margin: 0 0 1rem;
	font-size: 1.25rem;
}

.field-item {
	padding: 1rem;
	background: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	margin-bottom: 0.75rem;
}

.field-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.25rem;
}

.field-name {
	font-family: monospace;
	font-weight: 600;
}

.field-type {
	font-size: 0.75rem;
	padding: 0.25rem 0.5rem;
	background: #dbeafe;
	color: #1e40af;
	border-radius: 0.25rem;
}

.field-label {
	color: #6b7280;
	font-size: 0.875rem;
}

.field-badges {
	margin-top: 0.5rem;
	display: flex;
	gap: 0.5rem;
}

.badge {
	font-size: 0.75rem;
	padding: 0.125rem 0.5rem;
	background: #e5e7eb;
	border-radius: 0.25rem;
}
</style>
