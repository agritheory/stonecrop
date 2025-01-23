<template>
	<div>Stonecrop Page</div>
	<AForm v-model="schema" :data="schemaData" :key="componentKey" />
</template>

<script setup lang="ts">
import type { SchemaTypes } from '@stonecrop/aform'
import { useRoute } from 'nuxt/app'
import { onMounted, ref } from 'vue'

const route = useRoute()
const schema = ref<SchemaTypes[]>([])
const schemaData = ref<any[]>([])
const componentKey = ref(0)

onMounted(async () => {
	// wait for the route-based schema to be resolved
	schema.value = route.meta.schema as SchemaTypes[]

	const res = await $fetch(`/api${route.path}`)
	schemaData.value = res as any[]

	// re-render form when data is available
	componentKey.value++
})
</script>
