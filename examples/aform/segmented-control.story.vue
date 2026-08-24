<template>
	<Story>
		<div class="segmented-form">
			<ASegmentedControl v-model="formValue" label="Status" :options="statusOptions" />

			<ASegmentedControl
				v-model="intervalValue"
				label="Time bucket"
				size="xs"
				hide-label
				aria-label="Time bucket"
				equal
				:options="intervalOptions" />

			<ASegmentedControl v-model="priorityValue" label="Priority" :options="priorityOptions" />
		</div>
	</Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formValue = ref('Draft')
const intervalValue = ref('1 week')
const priorityValue = ref('normal')

const statusOptions = {
	Draft: 'neutral',
	Submitted: 'success',
	Cancelled: 'danger',
}

const intervalOptions = {
	'1 day': { label: 'Day' },
	'1 week': { label: 'Week' },
	'1 month': { label: 'Month' },
}

const priorityOptions = {
	choices: ['low', 'normal', 'high'],
	badges: {
		low: { label: 'Low', variant: 'neutral' },
		normal: { label: 'Normal', variant: 'brand' },
		high: { label: 'High', variant: 'danger' },
	},
}
</script>

<style>
.segmented-form {
	min-height: 60px;
	height: 400px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 2rem;
	margin: 0;
	padding: 1rem 1ch 0;
}
</style>
