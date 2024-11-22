<template>
	<div class="beam_day-divider">
		<h2>{{ listItem.date }}</h2>
	</div>
	<slot></slot>
</template>
<script setup lang="ts">
import { defineProps, computed, ref } from 'vue'
// const props = defineProps(['month', 'day', 'year'])

import type { ListViewItem } from '@/types'

const { item } = defineProps<{ item: ListViewItem }>()

const listItem = ref(item)

const getDate = computed(() => {
	const date = String(listItem.date)
	const newDate = new Date(date).toISOString()
	return newDate
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
