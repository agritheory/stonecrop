<template>
	<ATable v-model:rows="rows" v-model:columns="columns" :config="config" />
</template>

<script setup lang="ts">
import { ATable, TableColumn } from '@stonecrop/atable'
import { useStonecrop } from '@stonecrop/stonecrop'
import { computed } from 'vue'

// TODO: use component if provided else call to Records Schema endpoint/ table  / lookup
// alteratively: a view: component map, eg records: Records, gantt: GanttView
// default_view key in schema
// last_used_view_type in application state

const { stonecrop } = useStonecrop()
const rows = computed(() => stonecrop.value?.store.records)
const columns = computed((): TableColumn[] => stonecrop.value?.schema?.schema?.toArray())
const config = { view: 'list' }
</script>
