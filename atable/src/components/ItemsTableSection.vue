<template>
	<div class="items-table-section">
		<h4 class="items-table-section__heading">{{ label ?? 'Items' }}</h4>
		<!-- $attrs carries ATable's actual props (rows required among them) but is typed as
		     Record<string, unknown> by Vue itself, so vue-tsc can't verify it against ATable's
		     props here — the real check happens at runtime, same as any other attrs passthrough. -->
		<ATable v-bind="$attrs as any" />
	</div>
</template>

<script setup lang="ts">
import ATable from './ATable.vue'

// Registered as a table field's own component (kind stays 'table', not 'fieldset') so it never
// touches AForm's fieldset data-nesting logic — that logic regroups scalar fields under a
// fieldset key and appears to desync Stonecrop's reactive record tracking for a table-shaped
// (array) field nested the same way. This is a transparent passthrough to the real ATable, just
// adding a heading — every prop AForm already sends (schema/columns, rows, mode, errors, config,
// getRecords, sourceKey, …) reaches ATable unchanged via $attrs, since none of them are declared
// as explicit props here.
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
