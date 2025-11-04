<template>
	<AForm :key="componentKey" v-model="schema" :data="schemaData" />
</template>

<script setup lang="ts">
import type { SchemaTypes } from '@stonecrop/aform'
import { useRoute } from 'nuxt/app'
import { onMounted, ref } from 'vue'

const route = useRoute()
const schema = ref<SchemaTypes[]>([])
const schemaData = ref<unknown[]>([])
const componentKey = ref(0)

onMounted(async () => {
	// wait for the route-based schema to be resolved
	schema.value = route.meta.schema as SchemaTypes[]

	const res = await $fetch(`/api${route.path}`)
	schemaData.value = res as unknown[]

	// re-render form when data is available
	componentKey.value++
})
</script>
