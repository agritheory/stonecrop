<template>
	<div class="beam_day-divider">
		<h2>{{ date }}</h2>
	</div>

	<slot></slot>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

import type { ListViewItem } from '../types'

defineSlots<{ default(): any }>()
const { item } = defineProps<{ item: ListViewItem }>()

const date = computed(() => {
	if (!item.date || isNaN(Date.parse(item.date))) {
		return item.date
	}

	// if needed, the user can specify a Date format flag that will dictate how the output is formatted,
	// defaults to toDateString(); using switch/case here in case more values wanted to be added
	const dateObj = new Date(item.date)
	if (item.dateFormat) {
		switch (item.dateFormat.toLowerCase()) {
			case 'iso':
				return dateObj.toISOString()
		}
	}
	return dateObj.toDateString()
})
</script>

<style scoped>
.beam_day-divider {
	text-align: left;
	padding: 1rem;
	background: var(--sc-cell-changed-color);
	border-bottom: 1px solid var(--sc-row-border-color);
	box-sizing: border-box;
	margin-bottom: 1rem;

	/* reverse margins only for day-divider elements in list */
	margin-left: calc(-1 * var(--sc-list-margin));
	margin-right: calc(-1 * var(--sc-list-margin));

	& h2 {
		text-align: left;
		font-size: 1rem;
		color: var(--sc-primary-text-color);
		margin: 0;
		padding: 0;
	}
}

.beam_day-divider:first-of-type {
	margin-top: 0;
}
</style>
