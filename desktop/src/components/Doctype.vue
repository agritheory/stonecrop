<template>
	<AForm class="aform-main" v-model="schema" />
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
		let newSchema = stonecrop.value.schema?.schema.toArray()
		if (!newSchema) {
			newSchema = []
		}
		newSchema.forEach((item, index) => {
			const record = stonecrop.value?.store.record
			const fieldValue = record?.[item.fieldname]
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
