<template>
	<AFormLoading v-bind="$attrs" :is-fieldset="true" :field-count="fieldCount" :fields="fields" :legend="legend" />
</template>

<script setup lang="ts">
import AFormLoading, { type FieldDescriptor } from '../AFormLoading.vue'

defineOptions({ name: 'AFieldsetLoading' })

const {
	fieldCount = 4,
	fields,
	legend,
} = defineProps<{
	fieldCount?: number
	fields?: FieldDescriptor[]
	legend?: string
}>()
</script>
