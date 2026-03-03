<template>
	<div class="stonecrop-list-page">
		<ClientOnly>
			<ATable v-if="!loading" :columns="columns" :rows="rows" @row-click="handleRowClick" />
			<div v-else class="loading-state">Loading...</div>
			<template #fallback>
				<div class="loading-state">Loading...</div>
			</template>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
/**
 * StonecropListPage — Renders a table view for a doctype collection.
 *
 * Used by the 'resource' route strategy. Reads schema fields from `route.meta`
 * and builds table columns automatically. Navigates to the detail route on row click.
 */
import type { StonecropFieldType } from '@stonecrop/schema'
import { onMounted, ref, computed, watch } from 'vue'

import { useRoute, useRouter } from 'nuxt/app'

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
const router = useRouter()
const loading = ref(true)
const rows = ref<Record<string, unknown>[]>([])

const doctype = computed(() => route.meta.doctype as DoctypeMeta | undefined)
const schemaFields = computed(() => (route.meta.schema ?? []) as FieldMeta[])

// Fieldtypes that should not appear as table columns
const EXCLUDE_COLUMN_TYPES = new Set(['Text', 'Attach', 'JSON', 'Doctype', 'Link', 'Code'])

// Build table columns from the doctype fields
const columns = computed(() => {
	return schemaFields.value
		.filter(f => !f.hidden && !EXCLUDE_COLUMN_TYPES.has(f.fieldtype))
		.slice(0, 8) // reasonable default column limit
		.map(f => ({
			name: f.fieldname,
			label: f.label || f.fieldname,
			fieldtype: f.fieldtype,
			width: f.width || '15ch',
		}))
})

async function fetchData() {
	loading.value = true

	const doctypeName = doctype.value?.name
	if (!doctypeName) {
		loading.value = false
		return
	}

	try {
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
		})) as { data?: { stonecropRecords?: { data: Record<string, unknown>[] } } }

		rows.value = response.data?.stonecropRecords?.data ?? []
	} catch (e) {
		console.warn('[@stonecrop/nuxt] Could not fetch list data:', e)
		rows.value = []
	}

	loading.value = false
}

function handleRowClick(row: Record<string, unknown>) {
	const id = row.id ?? row.rowId ?? row.name ?? row.slug
	if (id != null) {
		const basePath = route.path.replace(/\/$/, '')
		router.push(`${basePath}/${id}`)
	}
}

onMounted(fetchData)
watch(() => route.fullPath, fetchData)
</script>

<style scoped>
.stonecrop-list-page {
	width: 100%;
}

.loading-state {
	padding: 2rem;
	text-align: center;
	color: var(--sc-gray-50);
}
</style>
