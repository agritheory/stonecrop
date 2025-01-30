<template>
	<BeamHeading class="beam_filter-option-heading">{{ title }}</BeamHeading>
	<div @click="open = !open" class="beam_filter-option">
		<div class="beam_filter-option-select">
			<div class="beam_filter-arrow">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.36 70.71">
					<polygon points="0 70.71 0 0 35.36 35.36 0 70.71" />
				</svg>
			</div>
			<div class="beam_filter-label">
				<label>{{ label }}</label>
			</div>
		</div>

		<ul ref="menu" v-if="open" class="beam_filter-select-menu">
			<li
				v-for="choice in choices"
				:class="{ selected: label == choice.label }"
				:data-value="choice.value"
				:key="choice.value"
				class="beam_filter-select-option"
				@click="selectChoice(choice)">
				{{ choice.label }}
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { BeamFilterChoice } from '../types'

const emit = defineEmits<{
	select: [choice: BeamFilterChoice]
}>()

const { title = 'title', choices = [] } = defineProps<{
	choices: BeamFilterChoice[]
	title?: string
}>()

const open = ref(false)
const label = ref(choices[0].label)
const value = ref(choices[0].value)

const selectChoice = (data: BeamFilterChoice) => {
	label.value = data.label
	value.value = data.value
	emit('select', data)
}
</script>

<style scoped>
.beam_filter-option {
	cursor: pointer;
	position: relative;
	margin-bottom: 1rem;
}

.beam_filter-option-heading {
	font-size: 1rem;
	padding-bottom: 0.25rem;
}

.beam_filter-option-select {
	position: relative;
	appearance: none;
	border: 1px solid var(--sc-row-border-color);
	font-weight: bold;
	color: var(--sc-primary-text-color);
	font-size: 0.8rem;
	font-family: var(--sc-font-family);
	display: flex;
	align-items: stretch;
}

label {
	cursor: pointer;
	padding: 0.5rem;
}

.beam_filter-arrow {
	background: var(--sc-primary-color);
	color: var(--sc-primary-text-color);
	cursor: pointer;
	display: flex;
	align-items: center;
	width: 5px;
	padding: 0.5rem 0.7rem;
}

.beam_filter-label {
	display: flex;
	align-items: center;
}

svg {
	fill: var(--sc-primary-text-color);
	width: 5px;
	transform: rotate(90deg);
}

.beam_filter-select-menu {
	/* position: absolute; */
	z-index: 100;
	border-top: none;
	left: 0;
	border: 1px solid var(--sc-row-border-color);
	padding: 0rem;
	list-style: none;
	width: 100%;
	box-sizing: border-box;
	max-height: 200px;
	overflow-y: scroll;
	margin: 0;
}

.beam_filter-select-option {
	font-size: 0.8rem;
	font-family: var(--sc-font-family);
	font-weight: bold;
	color: var(--sc-primary-text-color);
	border-bottom: 1px solid var(--sc-row-border-color);
	padding: 0.5rem;
	&:hover {
		background: var(--sc-primary-color);
	}
}

.selected {
	background: var(--sc-row-border-color);

	&:hover {
		background: var(--sc-row-border-color);
	}
}
</style>
