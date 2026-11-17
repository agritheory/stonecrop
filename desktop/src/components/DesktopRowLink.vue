<template>
	<span class="desktop-row-link" @click="openListRow(row)">{{ value }}</span>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

import { openListRowKey } from '../row-link'

// ACell draws a column's cell component inside its own cell, handing it the cell's value, the column's props,
// and the table and the row's position, which is how the link finds the row it opens.
const { store, rowIndex, value } = defineProps<{
	store: { rows: Record<string, unknown>[] }
	rowIndex: number
	colIndex?: number
	value?: unknown
}>()

const openListRow = inject(openListRowKey)!

const row = computed(() => store.rows[rowIndex])
</script>

<style>
.desktop-row-link {
	cursor: pointer;
}
</style>
