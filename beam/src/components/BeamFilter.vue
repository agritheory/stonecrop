<template>
	<div ref="beam-filters" class="beam_filters" :style="{ height: isOpen ? '100%' : headerHeight }">
		<div ref="beam-filters-header" @click="toggle" class="beam_filters-heading">
			<ToggleArrow :open="isOpen" />
			<BeamHeading> Filter </BeamHeading>
		</div>
		<div class="beam_filters-options">
			<slot>
				<p>OPTIONS GO HERE</p>
			</slot>
		</div>
	</div>
</template>
<script setup lang="ts">
import BeamHeading from './BeamHeading.vue'
import { ref, onMounted, useTemplateRef } from 'vue'

let isOpen = ref(false)
const header = useTemplateRef('beam-filters-header')
const beamFilters = useTemplateRef('beam-filters')

let totalHeight
let headerHeight

const toggle = () => {
	isOpen.value = !isOpen.value
}

onMounted(() => {
	headerHeight = getTotalHeight(header.value)
	totalHeight = getTotalHeight(beamFilters.value)
	beamFilters.value.style.height = headerHeight
})

const getTotalHeight = el => {
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
	border-bottom: 1px solid var(--row-border-color);
	/* background:var(--primary-color); */
	background: white;
}
.beam_filters-heading {
	background: var(--primary-color);
	cursor: pointer;
	display: flex;
	align-items: center;
	padding-left: 1rem;
	box-sizing: border-box;
	font-size: 1rem;
	padding: 0 2rem;
}
.beam_filters-options {
	background: white;
	margin: 1rem;
	box-sizing: border-box;
	padding: 0 2rem;
	margin-bottom: 2rem;
}
</style>
