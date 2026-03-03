<template>
	<div class="stonecrop-detail-page">
		<ClientOnly>
			<AForm v-if="!loading" :model-value="formSchema" :data="formData" />
			<div v-else class="loading-state">Loading...</div>
			<template #fallback>
				<div class="loading-state">Loading...</div>
			</template>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
/**
 * StonecropDetailPage — Renders a form view for a single record.
 *
 * Used by the 'resource' route strategy. Reads schema fields from `route.meta`
 * and builds an AForm schema. Fetches the record by `:id` from the route params.
 */
import { getDefaultComponent, type StonecropFieldType } from '@stonecrop/schema'
import { onMounted, ref, computed, watch } from 'vue'

import { useRoute } from 'nuxt/app'

interface FieldMeta {
	fieldname: string
	fieldtype: StonecropFieldType
	label?: string
	width?: string
	readOnly?: boolean
	required?: boolean
	hidden?: boolean
	options?: string[]
	default?: unknown
	component?: string
}

interface DoctypeMeta {
	name: string
	slug?: string
	tableName?: string
	fields?: FieldMeta[]
	schema?: FieldMeta[]
}

const route = useRoute()
const loading = ref(true)
const formData = ref<Record<string, unknown>>({})

const doctype = computed(() => route.meta.doctype as DoctypeMeta | undefined)
const schemaFields = computed(() => (route.meta.schema ?? []) as FieldMeta[])
const recordId = computed(() => route.params.id as string | undefined)

// Build AForm schema from doctype fields
const formSchema = computed(() => {
	return schemaFields.value
		.filter(f => f.fieldtype !== 'Doctype') // Exclude child tables
		.map(f => ({
			fieldname: f.fieldname,
			label: f.label || f.fieldname,
			component: f.component || getDefaultComponent(f.fieldtype),
			fieldtype: f.fieldtype,
			required: f.required,
			readOnly: f.readOnly,
			options: f.options,
			default: f.default,
		}))
})

async function fetchData() {
	loading.value = true

	const doctypeName = doctype.value?.name
	const id = recordId.value
	if (!doctypeName) {
		loading.value = false
		return
	}

	// New record — no fetch needed
	if (!id || id === 'new') {
		formData.value = {}
		loading.value = false
		return
	}

	try {
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
				variables: { doctype: doctypeName, id },
			},
		})) as { data?: { stonecropRecord?: { data: Record<string, unknown> } } }

		formData.value = response.data?.stonecropRecord?.data ?? {}
	} catch (e) {
		console.warn('[@stonecrop/nuxt] Could not fetch record:', e)
		formData.value = {}
	}

	loading.value = false
}

onMounted(fetchData)
watch(() => route.params.id, fetchData)
</script>

<style scoped>
.stonecrop-detail-page {
	width: 100%;
}

.loading-state {
	padding: 2rem;
	text-align: center;
	color: var(--sc-gray-50);
}
</style>
