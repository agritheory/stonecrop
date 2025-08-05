<template>
	<ATable v-model:rows="rows" v-model:columns="columns" :config="config" />
</template>

<script setup lang="ts">
import { ATable, TableColumn } from '@stonecrop/atable'
import { useStonecrop, HST } from '@stonecrop/stonecrop'
import type { SchemaTypes } from '@stonecrop/aform'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { stonecrop } = useStonecrop()

// Get doctype slug from route parameters
const doctypeSlug = computed(() => route?.params?.records?.toString().toLowerCase())

// HST-based data access using the new API
const rows = computed(() => {
	if (!stonecrop.value || !doctypeSlug.value) return []

	try {
		// Get all records for this doctype using HST
		const recordsNode = stonecrop.value.records(doctypeSlug.value)
		const recordsData = recordsNode.get('')

		// Convert records hash to array format expected by ATable
		if (recordsData && typeof recordsData === 'object' && !Array.isArray(recordsData)) {
			return Object.values(recordsData as Record<string, unknown>)
		}
		return []
	} catch {
		// Silently handle errors and return empty array
		return []
	}
})

const columns = computed((): TableColumn[] => {
	if (!stonecrop.value || !doctypeSlug.value) return []

	try {
		// Use HST to get doctype metadata from the global registry
		const hst = HST.getInstance()
		const doctype = hst.getDoctypeMeta(doctypeSlug.value)

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (!doctype?.schema) return []

		// Convert schema to table columns
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		const schemaArray = doctype.schema.toArray() as SchemaTypes[]
		return schemaArray.map((field: SchemaTypes) => ({
			name: field.fieldname,
			fieldname: field.fieldname,
			label: ('label' in field && field.label) || field.fieldname,
			type: ('fieldtype' in field && field.fieldtype) || 'Data',
			component: field.component,
		}))
	} catch {
		// Silently handle errors and return empty array
		return []
	}
})

const config = { view: 'list' as const }
</script>
