<template>
	<!-- Not a data row: no ARow, no cells, so it takes no part in numbering, filters or paging, and it
	sits in its own tbody so row navigation never lands on it. Drawn as a row, not a button. -->
	<tr class="atable-add-row">
		<td :colspan="colspan" class="atable-add-cell">
			<!-- The label sticks to the left edge, so a table scrolled sideways (pinned columns) still shows it. -->
			<button type="button" class="atable-add" @click="emit('add')">
				<span class="atable-add-label">Add row</span>
			</button>
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
	padding: 0;
	border-bottom: 1px solid var(--sc-row-border-color);
}

.atable-add {
	appearance: none;
	-webkit-appearance: none;
	box-sizing: border-box;
	display: block;
	width: 100%;
	min-height: var(--sc-atable-row-height);
	margin: 0;
	padding: var(--sc-atable-row-padding) 0;
	background: transparent;
	color: var(--sc-gray-60);
	border: none;
	border-radius: 0;
	cursor: pointer;
	font-family: var(--sc-atable-font-family);
	font-size: var(--sc-table-font-size);
	font-weight: 400;
	line-height: var(--sc-atable-row-height);
	text-align: left;
}

.atable-add-label {
	position: sticky;
	left: 0;
	display: inline-block;
	padding-left: 0.5ch;
}

/* Empty alternative text: the "+" is drawn, not read, so screen readers announce "Add row". */
.atable-add-label::before {
	content: '+';
	content: '+' / '';
	display: inline-block;
	width: 2ch;
}

.atable-add:hover {
	background: var(--sc-row-hover-color);
	color: var(--sc-cell-text-color);
}

.atable-add:focus-visible {
	outline: var(--sc-atable-cell-border-width) solid var(--sc-focus-cell-outline);
	outline-offset: calc(-1 * var(--sc-atable-cell-border-width));
}
</style>
