<template>
	<AForm v-model="schema" class="aform-main" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
// import { useRoute } from 'vue-router'

import { AForm } from '@stonecrop/aform'
import type { SchemaTypes } from '@stonecrop/aform'
import { /* DoctypeMeta, */ useStonecrop } from '@stonecrop/stonecrop'

const { stonecrop } = useStonecrop()
const schema = ref<SchemaTypes[]>([])

watch(stonecrop, () => {
	if (stonecrop.value) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		let newSchema = stonecrop.value.schema?.schema.toArray()
		if (!newSchema) {
			newSchema = []
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		newSchema.forEach((item, index) => {
			const record = stonecrop.value?.store.record
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const fieldValue = record?.[item.fieldname]
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			newSchema[index].value = fieldValue
		})

		schema.value = newSchema
	}
})

// const route = useRoute()
// const doctypeSlug = route.params.records?.toString().toLowerCase()
// const recordId = route.params.record?.toString().toLowerCase()

// const saveRecord = async () => {
// 	const doctype: DoctypeMeta = await stonecrop.value.registry.getMeta(doctypeSlug)
// 	stonecrop.value.runAction(doctype, 'save', recordId ? [recordId] : [])
// }
</script>
