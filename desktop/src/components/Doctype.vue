<template>
	<AForm v-if="isReady" class="aform-main" v-model="schema" :data="stonecrop.data" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { AForm } from '@agritheory/aform'
import type { SchemaTypes } from '@agritheory/aform/types'
import { Doctype, useStonecrop } from '@agritheory/stonecrop'

const { stonecrop, isReady } = useStonecrop()
const schema = ref<SchemaTypes[]>([])

watch(isReady, () => {
	if (isReady.value) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		schema.value = stonecrop.value.schema.schema.toArray()
	}
})

// const route = useRoute()
// const doctypeSlug = route.params.records?.toString().toLowerCase()
// const recordId = route.params.record?.toString().toLowerCase()

// const saveRecord = async () => {
// 	const doctype: Doctype = await stonecrop.value.registry.doctypeLoader(doctypeSlug)
// 	stonecrop.value.runAction(doctype, 'save', recordId ? [recordId] : [])
// }
</script>
