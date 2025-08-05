<template>
	<AForm class="aform-main" v-model="schema" :data="formData" />
</template>

<script setup lang="ts">
import { AForm } from '@stonecrop/aform'
import type { SchemaTypes } from '@stonecrop/aform'
import { useStonecrop, HST } from '@stonecrop/stonecrop'
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { stonecrop } = useStonecrop()

const schema = ref<SchemaTypes[]>([])
const formData = ref<Record<string, any>>({})

// Get route parameters
const doctypeSlug = computed(() => route?.params?.records?.toString().toLowerCase())
const recordId = computed(() => route?.params?.record?.toString())

// Watch for stonecrop initialization and route changes
watch(
	[stonecrop, doctypeSlug, recordId],
	() => {
		if (!stonecrop.value || !doctypeSlug.value) return

		try {
			// Use HST to get doctype metadata from the global registry
			const hst = HST.getInstance()
			const doctype = hst.getDoctypeMeta(doctypeSlug.value)

			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (!doctype?.schema) return

			// Get schema from the doctype
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			const newSchema = doctype.schema.toArray() as SchemaTypes[]

			// Get current record data if recordId is provided
			if (recordId.value) {
				const currentRecord = stonecrop.value.currentRecord(doctypeSlug.value)
				if (currentRecord) {
					// Extract form data from the current record
					const recordData = currentRecord.get('')
					formData.value = recordData || {}

					// Set field values in schema
					newSchema.forEach((item, index) => {
						if (formData.value && item.fieldname in formData.value) {
							newSchema[index] = { ...item, value: formData.value[item.fieldname] }
						}
					})
				}
			}

			schema.value = newSchema
		} catch {
			// Silently handle errors
			schema.value = []
			formData.value = {}
		}
	},
	{ immediate: true }
)
</script>
