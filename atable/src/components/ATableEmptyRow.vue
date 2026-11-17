<template>
	<!-- Not a data row: no ARow, no cells, so it takes no part in numbering, navigation, filters or paging. -->
	<tr class="atable-empty-row">
		<td :colspan="colspan" class="atable-empty-cell">
			<p class="atable-empty-message">
				<slot :filtered="filtered">{{ filtered ? 'No matching records' : 'No data' }}</slot>
			</p>
			<button v-if="showAdd" type="button" class="atable-empty-add" @click="emit('add')">Add row</button>
		</td>
	</tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	/** Columns the row spans: data columns, the index column (unless uncounted), and row actions when enabled. */
	colspan: number
	/** Whether the host lets this table take a new row. The component never infers it. */
	addable?: boolean
	/** Whether rows exist but the active filters hide them all. */
	filtered?: boolean
}>()

const emit = defineEmits<{
	add: []
}>()

// A row added while filters hide everything would likely be hidden too, so the row would not go
// away; adding belongs to the truly empty list.
const showAdd = computed(() => Boolean(props.addable) && !props.filtered)
</script>

<style scoped>
.atable-empty-cell {
	padding: 2rem 0.5ch;
	text-align: center;
	border-top: 1px solid var(--sc-row-border-color);
	border-bottom: 1px solid var(--sc-row-border-color);
}

.atable-empty-message {
	margin: 0;
	font-size: var(--sc-table-font-size);
	color: var(--sc-gray-60);
}

.atable-empty-add {
	appearance: none;
	-webkit-appearance: none;
	box-sizing: border-box;
	margin-top: 1rem;
	padding: 0.5rem 1rem;
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

.atable-empty-add:hover {
	background: var(--sc-btn-hover);
}

.atable-empty-add:focus-visible {
	outline: 2px solid var(--sc-input-active-border-color);
	outline-offset: 1px;
}
</style>
