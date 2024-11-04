<template>
	<div class="beam_day-divider">
		<h2>{{ getDate }}</h2>
	</div>
</template>
<script setup lang="ts">
import { defineProps, computed } from 'vue'
const props = defineProps(['month', 'day', 'year'])

const getDate = computed(() => {
	const date = []
	if (props.year) date.push(props.year)
	if (props.month) date.push(props.month)
	if (props.day) date.push(props.day)
	const formattedDate = date.join(' - ')
	return formattedDate
})
</script>
<style scoped>
.beam_day-divider {
	text-align: center;
	padding: 0.4rem;
	background: var(--primary-color);
	border: 1px solid var(--row-border-color);
	border-right: none;
	border-left: none;
	box-sizing: border-box;
	margin-bottom: 1rem;

	& h2 {
		text-align: center;
		font-size: 1rem;
		color: var(--primary-text-color);
		margin: 0;
		padding: 0;
	}
}
</style>
