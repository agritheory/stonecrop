<template>
	<div class="beam_day-divider">
		<h2>{{ date }}</h2>
	</div>

	<slot></slot>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ListViewItem } from '../types'

defineSlots<{ default(): any }>()
const { item } = defineProps<{ item: ListViewItem }>()

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

// Date-only ISO is UTC midnight under `new Date(...)`, so toDateString() in US timezones
// prints the previous calendar day. Build that case from local Y/M/D instead.
const parseItemDate = (value: string): Date | null => {
	const iso = value.trim().match(ISO_DATE)
	if (iso) {
		const year = Number(iso[1])
		const month = Number(iso[2])
		const day = Number(iso[3])
		const parsed = new Date(year, month - 1, day)
		if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return null
		return parsed
	}
	const parsed = new Date(value)
	return Number.isNaN(parsed.getTime()) ? null : parsed
}

const date = computed(() => {
	if (!item.date) return item.date
	const dateObj = parseItemDate(item.date)
	if (!dateObj) return item.date

	// if needed, the user can specify a Date format flag that will dictate how the output is formatted,
	// defaults to toDateString(); using switch/case here in case more values wanted to be added
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
