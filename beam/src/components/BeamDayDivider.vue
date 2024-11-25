<template>
	<div class="beam_day-divider">
		<h2>{{ getDate }}</h2>
	</div>
	<slot></slot>
</template>
<script setup lang="ts">
import { defineProps, ref, computed } from 'vue'

import type { ListViewItem } from '@/types'

const { item } = defineProps<{ item: ListViewItem }>()

const getDate = computed(() => {
	// if needed, the user can specify a Date format flag that will dictate how the output is formatted, defaults to toDateString()
	// using switch/case here in case more values wanted to be added
	if (item.dateFormat) {
		switch (item.dateFormat.toLowerCase()) {
			case 'iso':
				return item.date.toISOString()
		}
	}
	return item.date.toDateString()
})
</script>
<style scoped>
.beam_day-divider {
	text-align: left;
	padding: 1rem;
	background: var(--sc-primary-color);
	border: 1px solid var(--sc-row-border-color);
	border-right: none;
	border-left: none;
	box-sizing: border-box;
	margin: 1rem 0;

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
