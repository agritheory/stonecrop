<template>
	<td class="atable-cell" :style="cellStyle" tabindex="0" @click="openListRow(row)">{{ label }}</td>
</template>

<script setup lang="ts">
import { computed, inject, type CSSProperties } from 'vue'

import { openListRowKey } from '../row-link'

// ATable draws a column's cell component in place of its own cell, handing it the table and the cell's position.
const { store, rowIndex, colIndex } = defineProps<{
	store: {
		rows: Record<string, unknown>[]
		columns: { name: string; align?: CSSProperties['textAlign']; width?: string }[]
	}
	rowIndex: number
	colIndex: number
	pinned?: boolean
}>()

const openListRow = inject(openListRowKey)!

const row = computed(() => store.rows[rowIndex])
const column = computed(() => store.columns[colIndex])
const label = computed(() => String(row.value[column.value.name]))

// The inline style ACell gives a cell, so the link looks like the cells beside it.
const cellStyle = computed((): CSSProperties => ({
	textAlign: column.value.align || 'center',
	width: column.value.width || '40ch',
	fontWeight: 'inherit',
}))
</script>
