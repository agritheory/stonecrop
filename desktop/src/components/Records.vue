<template>
	<ATable v-model="stonecrop.store.records" :columns="stonecrop.schema.schema.toArray()" :config="config" />
</template>

<script setup lang="ts">
import { ATable } from '@stonecrop/atable'
import { useStonecrop } from '@stonecrop/stonecrop'

// TODO: use component if provided else call to Records Schema endpoint/ table  / lookup
// alteratively: a view: component map, eg records: Records, gantt: GanttView
// default_view key in schema
// last_used_view_type in application state

const { stonecrop } = useStonecrop()
const config = { view: 'list' }
</script>
