<template>
	<ATable
		v-if="isReady"
		:columns="stonecrop.schema.schema.toArray()"
		:rows="stonecrop.store.records"
		:config="config" />
</template>

<script setup lang="ts">
import { ATable } from '@agritheory/atable'
import { useStonecrop } from '@agritheory/stonecrop'

// TODO: use component if provided else call to Records Schema endpoint/ table  / lookup
// alteratively: a view: component map, eg records: Records, gantt: GanttView
// default_view key in schema
// last_used_view_type in application state

const { stonecrop, isReady } = useStonecrop()
const config = { view: 'list' }
</script>
