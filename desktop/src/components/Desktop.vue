<template>
	<pre>Stonecrop: {{ stonecropInfo }}</pre>
	<pre>Route Info: {{ route }}</pre>

	<!-- elements -->
	<ActionSet id="desktop-action-set" :elements="elements" />
	<SheetNav id="desktop-sheet-nav" :breadcrumbs="breadcrumbs" />

	<!-- content -->
	<AForm id="desktop-content" v-model="formSchema" :data="formData" />

	<!-- modals -->
	<CommandPalette
		id="desktop-command-palette"
		v-if="search"
		:search="search"
		:is-open="isCommandPaletteOpen"
		:placeholder="placeholder"
		:max-results="maxResults"
		@select="$emit('select', $event)"
		@close="$emit('close')">
		<template #title="{ result }">
			<slot name="searchTitle" :result="result" />
		</template>
		<template #content="{ result }">
			<slot name="searchContent" :result="result" />
		</template>
		<template #empty>
			<slot name="searchEmpty" />
		</template>
	</CommandPalette>
</template>

<script setup lang="ts" generic="T">
import { AForm, SchemaTypes } from '@stonecrop/aform'
import { HST, useStonecrop } from '@stonecrop/stonecrop'
import { computed, ref, unref, watch } from 'vue'

import ActionSet from './ActionSet.vue'
import CommandPalette from './CommandPalette.vue'
import SheetNav from './SheetNav.vue'
import { ActionElements } from '../types'

type ActionSetProps = {
	// action elements to display in the action set
	elements?: ActionElements[]
}

type SheetNavProps = {
	// breadcrumbs for navigation
	breadcrumbs?: { title: string; to: string }[]
}

type CommandPaletteProps = {
	search?: (query: string) => T[]
	isCommandPaletteOpen?: boolean
	placeholder?: string
	maxResults?: number
}

type Slots = { searchTitle?: { result: T }; searchContent?: { result: T }; searchEmpty?: null }
type Props = ActionSetProps & SheetNavProps & CommandPaletteProps
type Emits = { select: [T]; close: [] }

defineSlots<Slots>()
defineProps<Props>()
defineEmits<Emits>()

const { stonecrop } = useStonecrop()
const route = computed(() => stonecrop.value?.registry.router?.currentRoute)
const formSchema = ref<SchemaTypes[]>([])
const formData = ref<Record<string, unknown>>({})

const stonecropInfo = computed(() => {
	if (!stonecrop.value) {
		return 'Stonecrop not initialized'
	}

	// Get store info without circular references
	const store = stonecrop.value.getStore()

	// Try to get store keys safely without triggering circular ref issues
	try {
		// Get just the top-level keys of the store structure
		const storeData = store.get('')
		const storeKeys = typeof storeData === 'object' && storeData !== null ? Object.keys(storeData) : []

		return {
			initialized: !!stonecrop.value,
			storeKeys,
			message: 'Stonecrop with HST initialized successfully',
		}
	} catch (error) {
		return {
			initialized: !!stonecrop.value,
			error: 'Error accessing store data',
			message: 'Stonecrop initialized but store data not accessible',
		}
	}
})

watch(
	route,
	newRoute => {
		if (!stonecrop.value) return

		const params = unref(newRoute)?.params.pathMatch

		if (!params || params.length === 0) {
			// root route
		} else {
			formData.value = {}
			const doctype = params[0].toLowerCase()
			console.log('Doctype:', doctype)

			if (doctype) {
				// Use HST to get doctype metadata from the global registry
				const hst = HST.getInstance()
				const meta = hst.getDoctypeMeta(doctype)
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (!meta?.schema) formData.value.columns = []
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
				const schemaArray = (meta?.schema.toArray() || []) as SchemaTypes[]

				if (params.length === 1) {
					// doctype list route

					// Get all records for this doctype using HST
					const recordsNode = stonecrop.value.records(doctype)
					const recordsData = recordsNode?.get('')
					console.log('Records data:', recordsData)

					// Convert records hash to array format expected by ATable
					if (recordsData && typeof recordsData === 'object' && !Array.isArray(recordsData)) {
						formData.value.rows = Object.values(recordsData as Record<string, unknown>)
					} else {
						formData.value.rows = []
					}

					// Convert schema to table columns
					formData.value.columns = schemaArray.map((field: SchemaTypes) => ({
						name: field.fieldname,
						fieldname: field.fieldname,
						label: ('label' in field && field.label) || field.fieldname,
						type: ('fieldtype' in field && field.fieldtype) || 'Data',
						component: field.component,
					}))
					console.log('Records columns:', formData.value.columns)
				} else {
					const recordId = params[1]
					// doctype form route
					// Get current record data if recordId is provided
					if (recordId) {
						const currentRecord = stonecrop.value.currentRecord(doctype)
						if (currentRecord) {
							// Extract form data from the current record
							const recordData = currentRecord.get('')
							formData.value = recordData || {}

							// Set field values in schema
							schemaArray.forEach((item, index) => {
								if (formData.value && item.fieldname in formData.value) {
									schemaArray[index] = { ...item, value: formData.value[item.fieldname] }
								}
							})
						}
					}

					console.log('Form data:', formData.value)
					formSchema.value = schemaArray
				}
			}
		}
	},
	{ immediate: true }
)
</script>
