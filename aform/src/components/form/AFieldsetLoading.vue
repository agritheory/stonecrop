<template>
	<!--
		AFieldsetLoading
		A convenience wrapper around AFormLoading that pre-sets isFieldset=true.
		Use this wherever <AFieldset> would normally render, while its data is loading.

		Example:
		  <AFieldsetLoading :fieldCount="6" />
	-->
	<AFormLoading v-bind="$attrs" :is-fieldset="true" :field-count="fieldCount" />
</template>

<script setup lang="ts">
import AFormLoading from '../AFormLoading.vue'

const { fieldCount = 4 } = defineProps<{
	fieldCount?: number
}>()
</script>
