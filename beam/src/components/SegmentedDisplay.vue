<template>
	<div class="segmented-display" :style="{ background: getColor(displayColor) }">
		<h1 class="segmented-display-output" :style="{ color: getColor(textColor) }">{{ getOutput }}</h1>
	</div>
</template>
<script setup lang="ts">
import { ref, defineProps, computed } from 'vue'

const {
	displayInput = 120.2568,
	decimalPlaces = 2,
	displayColor = 'gray',
	textColor = 'white',
} = defineProps<{
	displayInput?: number
	decimalPlaces?: number
	displayColor?: Color
	textColor?: Color
}>()

const getOutput = computed(() => {
	if (displayInput.length == 0) return Number(0).toFixed(decimalPlaces)
	return displayInput.toFixed(decimalPlaces)
})

const getColor = color => {
	return color.substr(0, 2) == '--' ? `var(${color})` : color
}
</script>

<style scoped>
.segmented-display {
	width: 100%;
	padding: 1rem;
	box-sizing: border-box;
	display: flex;
	background: var(--sc-segmented-display-background);
	align-items: center;
	justify-content: flex-end;
}
.segmented-display-output {
	text-align: right;
	font-family: Segment7, Arimo, sans-serif;
	font-weight: normal;
	font-size: var(--sc-segemented-display-font-size);
	padding: 0;
	margin: 0;
	letter-spacing: 0.3rem;
	margin-bottom: -0.7rem;
	color: var(--sc-segmented-display-color);
}
</style>
