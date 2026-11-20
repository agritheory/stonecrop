<template>
	<!-- Not a data row: no ARow, no cells, so it takes no part in numbering, navigation, filters or paging. -->
	<tr class="atable-add-row">
		<td :colspan="colspan" class="atable-add-cell">
			<button type="button" class="atable-add" @click="emit('add')">Add row</button>
		</td>
	</tr>
</template>

<script setup lang="ts">
defineProps<{
	/** Columns the row spans: data columns, the index column (unless uncounted), and row actions when enabled. */
	colspan: number
}>()

const emit = defineEmits<{
	add: []
}>()
</script>

<style scoped>
.atable-add-cell {
	padding: 0.5rem 0.5ch;
	text-align: left;
	border-bottom: 1px solid var(--sc-row-border-color);
}

.atable-add {
	appearance: none;
	-webkit-appearance: none;
	box-sizing: border-box;
	padding: 0.25rem 0.75rem;
	background: var(--sc-btn-color);
	color: var(--sc-btn-label-color);
	border: 1px solid var(--sc-btn-border);
	border-radius: var(--sc-border-radius);
	cursor: pointer;
	font-family: var(--sc-font-family);
	font-size: var(--sc-table-font-size);
	font-weight: 400;
	line-height: 1.2;
	transition: background-color 0.15s ease;
}

.atable-add:hover {
	background: var(--sc-btn-hover);
}

.atable-add:focus-visible {
	outline: 2px solid var(--sc-input-active-border-color);
	outline-offset: 1px;
}
</style>
