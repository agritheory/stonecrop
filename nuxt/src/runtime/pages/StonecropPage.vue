<template>
	<div class="stonecrop-page">
		<ClientOnly>
			<component v-if="!loading" :is="rootComponent" v-bind="componentProps" @row-click="handleRowClick" />
			<div v-else class="loading-state">Loading...</div>
			<template #fallback>
				<div class="loading-state">Loading...</div>
			</template>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
/**
 * StonecropPage - Universal page component that renders based on doctype schema
 *
 * The schema defines what component(s) to render:
 * - Schema with ATable component → renders table view
 * - Schema with form fields → renders AForm
 * - Schema with custom component → renders that component
 *
 * Route params are passed to the component for data fetching.
 */
import { useRoute, useRouter } from 'nuxt/app'
import { onMounted, ref, computed, watch, markRaw, type Component } from 'vue'
import { getDefaultComponent } from '@stonecrop/schema'

interface FieldMeta {
	fieldname: string
	fieldtype: string
	label?: string
	width?: string
	readOnly?: boolean
	required?: boolean
	options?: string[]
	default?: unknown
	component?: string
	columns?: unknown[]
	config?: Record<string, unknown>
}

interface DoctypeMeta {
	name: string
	slug?: string
	fields?: FieldMeta[]
	schema?: FieldMeta[]
	dataSource?: string // GraphQL query name or API endpoint
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const data = ref<unknown>(null)

// Get doctype metadata from route
const doctype = computed(() => route.meta.doctype as DoctypeMeta | undefined)
const schemaFields = computed(() => route.meta.schema as FieldMeta[] | undefined)

// Determine root component based on schema content
const rootComponent = computed<Component | string>(() => {
	const fields = schemaFields.value || []

	// Only treat a field as a "root component" if it explicitly defines a Doctype/ATable view.
	// CLI-generated schemas set `component` on every field (e.g., ATextInput, ANumericInput),
	// so checking for any field with `component` would incorrectly pick the first scalar field.
	const rootField = fields.find(f => f.fieldtype === 'Doctype' && f.component === 'ATable')
	if (rootField?.component) {
		return rootField.component
	}

	// Default to AForm for field-based schemas
	return 'AForm'
})

// Build props for the root component
const componentProps = computed(() => {
	const fields = schemaFields.value || []
	const rootField = fields.find(f => f.fieldtype === 'Doctype' && f.component === 'ATable')

	if (rootField?.component === 'ATable') {
		// Table view: pass columns and rows
		return {
			columns: rootField.columns || buildColumnsFromFields(fields),
			rows: data.value || [],
			config: rootField.config || { view: 'list' },
		}
	}

	// Form view: pass schema and data
	return {
		modelValue: buildFormSchema(fields),
		data: data.value || {},
	}
})

// Build table columns from fields
function buildColumnsFromFields(fields: FieldMeta[]) {
	const excludeTypes = ['Text', 'Attach', 'JSON', 'Table', 'Doctype', 'Link']
	return fields
		.filter(f => !excludeTypes.includes(f.fieldtype))
		.slice(0, 8)
		.map(f => ({
			name: f.fieldname,
			label: f.label || f.fieldname,
			fieldtype: f.fieldtype,
			width: f.width || '15ch',
		}))
}

// Build AForm schema from doctype fields
function buildFormSchema(fields: FieldMeta[]) {
	return fields
		.filter(f => f.fieldtype !== 'Doctype') // Exclude child tables (require special rendering)
		.map(f => ({
			fieldname: f.fieldname,
			label: f.label || f.fieldname,
			component: f.component || getDefaultComponent(f.fieldtype as any),
			fieldtype: f.fieldtype,
			required: f.required,
			readOnly: f.readOnly,
			options: f.options,
			default: f.default,
		}))
}

// Determine if this is a list view or detail view
const isListView = computed(() => {
	const fields = schemaFields.value || []
	const rootField = fields.find(f => f.fieldtype === 'Doctype' && f.component === 'ATable')
	return rootField?.component === 'ATable'
})

// Fetch data based on view type and route params
async function fetchData() {
	loading.value = true

	const doctypeName = doctype.value?.name
	if (!doctypeName) {
		loading.value = false
		return
	}

	try {
		if (isListView.value) {
			// Fetch list data
			const query = `
				query GetRecords($doctype: String!) {
					stonecropRecords(doctype: $doctype) {
						data
						count
					}
				}
			`
			const response = (await $fetch('/graphql/', {
				method: 'POST',
				body: {
					query,
					variables: { doctype: doctypeName },
				},
			})) as { data?: { stonecropRecords?: { data: unknown[] } } }

			data.value = response.data?.stonecropRecords?.data || []
		} else {
			// Fetch single record
			const recordId = route.params.id as string
			if (!recordId || recordId === 'new') {
				data.value = {}
				loading.value = false
				return
			}

			const query = `
				query GetRecord($doctype: String!, $id: String!) {
					stonecropRecord(doctype: $doctype, id: $id) {
						data
					}
				}
			`
			const response = (await $fetch('/graphql/', {
				method: 'POST',
				body: {
					query,
					variables: { doctype: doctypeName, id: recordId },
				},
			})) as { data?: { stonecropRecord?: { data: unknown } } }

			data.value = response.data?.stonecropRecord?.data || {}
		}
	} catch (e) {
		console.warn('[@stonecrop/nuxt] Could not fetch data:', e)
		data.value = isListView.value ? [] : {}
	}

	loading.value = false
}

// Handle table row click - navigate to detail view
function handleRowClick(row: Record<string, unknown>) {
	const id = row.id || row.name || row.slug
	if (id && isListView.value) {
		// Navigate from /user to /user/:id
		// The detail doctype should have slug "user/:id"
		const basePath = route.path.replace(/\/$/, '')
		router.push(`${basePath}/${id}`)
	}
}

onMounted(fetchData)

// Re-fetch when route params change
watch(() => route.params, fetchData, { deep: true })
</script>

<style scoped>
.stonecrop-page {
	width: 100%;
}

.loading-state {
	padding: 2rem;
	text-align: center;
	color: var(--sc-gray-50);
}
</style>
