<template>
	<div class="beam_filters">
		<div @click="toggle" class="beam_filters-heading">
			<ToggleArrow :open="isOpen" />
			<BeamHeading>Filter</BeamHeading>
		</div>

		<div v-if="isOpen" class="beam_filters-options">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineSlots<{ default(): any }>()

const isOpen = ref(false)

const toggle = () => {
	isOpen.value = !isOpen.value
}
</script>

<style scoped>
.beam_filters {
	background-color: var(--sc-primary-color);
	border-bottom: 1px solid var(--sc-row-border-color);
	box-sizing: border-box;
	min-height: 2em;
	overflow: visible;
	padding: 0.625rem;
	transition: all 0.2s ease-in-out;
}

.beam_filters-heading {
	align-items: center;
	background-color: var(--sc-primary-color);
	box-sizing: border-box;
	cursor: pointer;
	display: flex;
	font-size: 1rem;

	& > h1 {
		font-size: 1rem;
	}
}

.beam_filters-options {
	background-color: var(--sc-primary-color);
	box-sizing: border-box;
	column-gap: 1rem;
	display: flex;
	flex-direction: row;
	margin: 1rem 0;
	padding: 0 1rem;

	@media (max-width: 479px) {
		flex-direction: column;
	}
}
</style>
