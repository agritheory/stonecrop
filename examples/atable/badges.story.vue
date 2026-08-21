<template>
	<Story title="badges">
		<Variant title="select badge cells">
			<p class="badge-story-note">
				Columns with badge options render cell-fill badges in the table body, whether the schema component is
				<code>ADropdown</code> or <code>ASegmentedControl</code>.
			</p>
			<ATable v-model:rows="table.rows" v-model:columns="table.columns" :config="table.config" />
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import type { TableColumn } from '@stonecrop/atable'
import { reactive } from 'vue'

const table = reactive({
	rows: [
		{ task: 'Review invoice', status_dropdown: 'Open', status_segmented: 'Draft' },
		{ task: 'Ship order', status_dropdown: 'Closed', status_segmented: 'Done' },
		{ task: 'Cancel subscription', status_dropdown: 'Cancelled', status_segmented: 'Submitted' },
	],
	columns: [
		{
			label: 'Task',
			name: 'task',
			align: 'left',
			edit: false,
			width: '24ch',
		},
		{
			label: 'Status (dropdown)',
			name: 'status_dropdown',
			component: 'ADropdown',
			align: 'center',
			edit: true,
			width: '14ch',
			options: {
				Open: 'warning',
				Closed: 'success',
				Cancelled: 'danger',
			},
		},
		{
			label: 'Status (segmented)',
			name: 'status_segmented',
			component: 'ASegmentedControl',
			align: 'center',
			edit: true,
			width: '14ch',
			options: {
				choices: ['Draft', 'Submitted', 'Done'],
				badges: {
					Draft: 'neutral',
					Submitted: 'brand',
					Done: 'success',
				},
			},
		},
	] as TableColumn[],
	config: { view: 'list' as const, fullWidth: true },
})
</script>

<style>
.badge-story-note {
	margin: 0 0 1rem;
	padding: 0 1ch;
	max-width: 60ch;
	font-size: var(--sc-font-size);
	color: var(--sc-cell-text-color);
}
</style>
