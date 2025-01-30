<template>
	<div ref="beam-filters" class="beam_filters" :style="{ height: isOpen ? '100%' : headerHeight }">
		<div ref="beam-filters-header" @click="toggle" class="beam_filters-heading">
			<ToggleArrow :open="isOpen" />
			<BeamHeading>Filter</BeamHeading>
		</div>

		<div class="beam_filters-options">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue'

defineSlots<{ default(): any }>()

const header = useTemplateRef('beam-filters-header')
const beamFilters = useTemplateRef('beam-filters')

const isOpen = ref(false)
const headerHeight = ref<string>()
const totalHeight = ref<string>()

const toggle = () => {
	isOpen.value = !isOpen.value
}

onMounted(() => {
	if (header.value && beamFilters.value) {
		headerHeight.value = getTotalHeight(header.value)
		totalHeight.value = getTotalHeight(beamFilters.value)
		beamFilters.value.style.height = headerHeight.value
	}
})

const getTotalHeight = (el: HTMLDivElement) => {
	const height = el.getBoundingClientRect().height
	const marginTop = parseInt(getComputedStyle(el).marginTop)
	const marginBottom = parseInt(getComputedStyle(el).marginBottom)
	return height + marginTop + marginBottom + 'px'
}
</script>

<style scoped>
.beam_filters {
	overflow: hidden;
	box-sizing: border-box;
	transition: all 0.2s ease-in-out;
	border-bottom: 1px solid var(--sc-row-border-color);
	background: white;
}

.beam_filters-heading {
	background: var(--sc-primary-color);
	cursor: pointer;
	display: flex;
	align-items: center;
	padding-left: 1rem;
	box-sizing: border-box;
	font-size: 1rem;
	padding: 0 2rem;

	& > h1 {
		font-size: 1rem;
	}
}

.beam_filters-options {
	background: white;
	margin: 1rem;
	box-sizing: border-box;
	padding: 0 2rem;
	margin-bottom: 2rem;
}
</style>
