<template>
	<div class="items-table-section">
		<h4 class="items-table-section__heading">{{ label ?? 'Items' }}</h4>
		<ATable v-bind="$attrs as any" />
	</div>
</template>

<script setup lang="ts">
import ATable from './ATable.vue'

defineOptions({ inheritAttrs: false })

defineProps<{
	label?: string
}>()
</script>

<style scoped>
.items-table-section__heading {
	margin: 0 0 0.5rem;
}
</style>
