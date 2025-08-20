<template>
	<div class="desktop">
		<!-- Debug info -->
		<pre v-if="showDebug" class="debug-info">Route: {{ route }}</pre>

		<!-- Main content based on route -->
		<div v-if="currentView === 'doctypes'" class="doctype-list">
			<h1>Available Doctypes</h1>
			<div class="doctype-grid">
				<div
					v-for="doctype in availableDoctypes"
					:key="doctype"
					class="doctype-card"
					@click="navigateToDoctype(doctype)">
					<h3>{{ formatDoctypeName(doctype) }}</h3>
					<p>{{ getRecordCount(doctype) }} records</p>
				</div>
			</div>
		</div>

		<div v-else-if="currentView === 'records'" class="records-list">
			<div class="header">
				<nav class="breadcrumbs">
					<router-link to="/">Home</router-link>
					<span class="separator">/</span>
					<span class="current">{{ formatDoctypeName(currentDoctype) }}</span>
				</nav>
				<h1>{{ formatDoctypeName(currentDoctype) }} Records</h1>
			</div>

			<div class="actions">
				<button @click="createNewRecord" class="btn-primary">New {{ formatDoctypeName(currentDoctype) }}</button>
			</div>

			<div v-if="loading" class="loading">Loading records...</div>

			<div v-else-if="records.length === 0" class="empty-state">
				<p>No {{ currentDoctype }} records found.</p>
				<button @click="createNewRecord" class="btn-primary">Create First Record</button>
			</div>

			<div v-else class="records-table">
				<div class="table-header">
					<div v-for="column in columns" :key="column.fieldname" class="header-cell">
						{{ column.label }}
					</div>
					<div class="header-cell">Actions</div>
				</div>

				<div v-for="record in records" :key="record.id" class="table-row" @click="openRecord(record.id)">
					<div v-for="column in columns" :key="column.fieldname" class="table-cell">
						{{ record[column.fieldname] || '-' }}
					</div>
					<div class="table-cell actions-cell">
						<button @click.stop="openRecord(record.id)" class="btn-secondary btn-sm">Edit</button>
						<button @click.stop="deleteRecord(record.id)" class="btn-danger btn-sm">Delete</button>
					</div>
				</div>
			</div>
		</div>

		<div v-else-if="currentView === 'record'" class="record-form">
			<div class="header">
				<nav class="breadcrumbs">
					<router-link to="/">Home</router-link>
					<span class="separator">/</span>
					<router-link :to="`/${currentDoctype}`">{{ formatDoctypeName(currentDoctype) }}</router-link>
					<span class="separator">/</span>
					<span class="current">{{ isNewRecord ? 'New Record' : currentRecordId }}</span>
				</nav>
				<h1>
					{{ isNewRecord ? `New ${formatDoctypeName(currentDoctype)}` : `Edit ${formatDoctypeName(currentDoctype)}` }}
				</h1>
			</div>

			<div class="actions">
				<button @click="saveRecord" class="btn-primary" :disabled="saving">
					{{ saving ? 'Saving...' : 'Save' }}
				</button>
				<button @click="cancelEdit" class="btn-secondary">Cancel</button>
				<button v-if="!isNewRecord" @click="deleteRecord(currentRecordId)" class="btn-danger">Delete</button>
			</div>

			<div v-if="loading" class="loading">Loading record...</div>

			<div v-else-if="formSchema.length > 0" class="form-container">
				<AForm v-model="formSchema" :data="formData" @update:data="handleFormDataUpdate" />
			</div>

			<div v-else class="error-state">
				<p>Unable to load form schema for {{ currentDoctype }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useStonecrop } from '@stonecrop/stonecrop'
import { AForm, type SchemaTypes } from '@stonecrop/aform'
import { computed, ref, unref, watch } from 'vue'

type Props = {
	availableDoctypes?: string[]
	showDebug?: boolean
}

withDefaults(defineProps<Props>(), {
	availableDoctypes: () => ['to-do', 'issue'],
	showDebug: false,
})

const { stonecrop } = useStonecrop()

// State
const loading = ref(false)
const saving = ref(false)
const formSchema = ref<SchemaTypes[]>([])
const formData = ref<Record<string, any>>({})

// Computed properties for current route context
const route = computed(() => unref(stonecrop.value?.registry.router?.currentRoute))
const router = computed(() => stonecrop.value?.registry.router)
const currentDoctype = computed(() => route.value?.params.doctype as string)
const currentRecordId = computed(() => route.value?.params.recordId as string)
const isNewRecord = computed(() => currentRecordId.value?.startsWith('new-'))

// Determine current view based on route
const currentView = computed(() => {
	if (!route.value) return 'doctypes'

	const routeName = route.value.name as string
	const { doctype, recordId } = route.value.params

	// Check route name first for most accurate determination
	if (routeName === 'record-form' || recordId) {
		return 'record'
	} else if (routeName === 'records-list' || doctype) {
		return 'records'
	} else if (routeName === 'home' || route.value.path === '/') {
		return 'doctypes'
	}

	// Fallback logic for catch-all route using pathMatch
	const pathParams = route.value.params.pathMatch as string[] | undefined
	if (pathParams && pathParams.length > 0) {
		if (pathParams.length === 1) {
			return 'records'
		} else if (pathParams.length === 2) {
			return 'record'
		}
	}

	// Default fallback
	return 'doctypes'
})

// Get records for current doctype
const records = computed(() => {
	if (!stonecrop.value || !currentDoctype.value) return []

	const recordsNode = stonecrop.value.records(currentDoctype.value)
	const recordsData = recordsNode?.get('')

	if (recordsData && typeof recordsData === 'object' && !Array.isArray(recordsData)) {
		return Object.values(recordsData as Record<string, any>)
	}

	return []
})

// Get columns for records table
const columns = computed(() => {
	if (!stonecrop.value || !currentDoctype.value) return []

	try {
		const registry = stonecrop.value.registry
		const meta = registry.registry[currentDoctype.value]

		if (meta?.schema) {
			const schemaArray = 'toArray' in meta.schema ? meta.schema.toArray() : meta.schema
			return schemaArray.map(field => ({
				fieldname: field.fieldname,
				label: ('label' in field && field.label) || field.fieldname,
				fieldtype: ('fieldtype' in field && field.fieldtype) || 'Data',
			}))
		}
	} catch (error) {
		// Error getting schema - return empty array
	}

	return []
})

// Watch for route changes to load appropriate data
watch(
	[currentView, currentDoctype, currentRecordId],
	() => {
		if (currentView.value === 'record') {
			loadRecordData()
		}
	},
	{ immediate: true }
)

// Methods
const formatDoctypeName = (doctype: string): string => {
	return doctype
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

const getRecordCount = (doctype: string): number => {
	if (!stonecrop.value) return 0
	const recordIds = stonecrop.value.getRecordIds(doctype)
	return recordIds.length
}

const navigateToDoctype = (doctype: string) => {
	void router.value?.push(`/${doctype}`)
}

const openRecord = (recordId: string) => {
	void router.value?.push(`/${currentDoctype.value}/${recordId}`)
}

const createNewRecord = () => {
	const newId = `new-${Date.now()}`
	void router.value?.push(`/${currentDoctype.value}/${newId}`)
}

const loadRecordData = () => {
	if (!stonecrop.value || !currentDoctype.value) return

	loading.value = true

	try {
		// Get schema from registry
		const registry = stonecrop.value.registry
		const meta = registry.registry[currentDoctype.value]

		if (meta?.schema) {
			const schemaArray = 'toArray' in meta.schema ? meta.schema.toArray() : meta.schema
			formSchema.value = [...schemaArray]
		}

		if (isNewRecord.value) {
			// Initialize empty form data for new record
			formData.value = {}
			formSchema.value = formSchema.value.map(field => ({
				...field,
				value: '',
			}))
		} else {
			// Load existing record data
			const currentRecord = stonecrop.value.currentRecord(currentDoctype.value)
			if (currentRecord) {
				const recordData = currentRecord.get('') || {}
				formData.value = { ...recordData }

				formSchema.value = formSchema.value.map(field => ({
					...field,
					value: (recordData as Record<string, any>)[field.fieldname] || '',
				}))
			}
		}
	} catch (error) {
		// Error loading record data
	} finally {
		loading.value = false
	}
}

const handleFormDataUpdate = (newData: Record<string, any>) => {
	formData.value = { ...newData }
}

const saveRecord = () => {
	if (!stonecrop.value) return

	saving.value = true

	try {
		const recordData = { ...formData.value }

		if (isNewRecord.value) {
			const newId = `record-${Date.now()}`
			recordData.id = newId

			stonecrop.value.addRecord(currentDoctype.value, newId, recordData)
			stonecrop.value.setCurrentRecord(currentDoctype.value, newId)

			void router.value?.replace(`/${currentDoctype.value}/${newId}`)
		} else {
			stonecrop.value.addRecord(currentDoctype.value, currentRecordId.value, recordData)
		}
	} catch (error) {
		// Error saving record
	} finally {
		saving.value = false
	}
}

const cancelEdit = () => {
	if (isNewRecord.value) {
		void router.value?.push(`/${currentDoctype.value}`)
	} else {
		loadRecordData()
	}
}

const deleteRecord = (recordId: string) => {
	if (!stonecrop.value) return

	if (confirm('Are you sure you want to delete this record?')) {
		stonecrop.value.removeRecord(currentDoctype.value, recordId)

		if (currentView.value === 'record') {
			void router.value?.push(`/${currentDoctype.value}`)
		}
	}
}
</script>
