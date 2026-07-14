<template>
	<!-- transparent ghost path gives a ~20px click zone around the 2px visible stroke -->
	<path :d="path.d" fill="none" stroke="transparent" stroke-width="20" class="vue-flow__edge-interaction" />
	<path :id="id" :style="style" class="vue-flow__edge-path" :d="path.d" :marker-end="markerEnd" />

	<EdgeLabelRenderer>
		<div
			:style="{
				pointerEvents: 'all',
				position: 'absolute',
				transform: `translate(-50%, -50%) translate(${path.labelX}px,${path.labelY}px)`,
			}"
			class="nodrag nopan editable-edge-label"
			@click="labelOnClick()"
			@contextmenu.prevent="$emit('remove', id)">
			<div class="vue-flow__edge-label">{{ label }}</div>
			<div v-if="showInput" class="label-input-wrapper">
				<input
					ref="labelInput"
					v-model="newLabel"
					class="label-input"
					@blur="showInput = false"
					@keypress.enter="submitNewLabel" />
			</div>
		</div>
	</EdgeLabelRenderer>
</template>

<script setup lang="ts">
import { type EdgeProps, EdgeLabelRenderer } from '@vue-flow/core'
import { computed, ref, nextTick, useTemplateRef } from 'vue'

const props = defineProps<EdgeProps>()
const emit = defineEmits(['change', 'remove'])

// A self-loop connects a node's source handle to its own target handle. getBezierPath draws a nearly
// straight segment across the node for that (the two handles are on the same box), so it's useless
// here — we hand-author an arc that leaves the source handle, loops up and over the node top, and
// returns to the target handle. LOOP_HEIGHT is how far above the handles the arc bulges.
const LOOP_HEIGHT = 90
const LOOP_SPREAD = 45

const path = computed(() => {
	const { sourceX, sourceY, targetX, targetY } = props
	const d = `M ${sourceX},${sourceY} C ${sourceX + LOOP_SPREAD},${sourceY - LOOP_HEIGHT} ${
		targetX - LOOP_SPREAD
	},${targetY - LOOP_HEIGHT} ${targetX},${targetY}`
	// Place the label near the arc's apex (a cubic bezier peaks around 0.75 of the control offset).
	const labelX = (sourceX + targetX) / 2
	const labelY = Math.min(sourceY, targetY) - LOOP_HEIGHT * 0.72
	return { d, labelX, labelY }
})

const inputRef = useTemplateRef<HTMLInputElement>('labelInput')
const newLabel = ref<EdgeProps['label']>('')
const showInput = ref(false)
let lastClick = 0

const labelOnClick = async () => {
	let now = Date.now()
	if (now - lastClick < 500 && !showInput.value) {
		await showLabelInput()
	}
	lastClick = now
}

const showLabelInput = async () => {
	newLabel.value = props.label
	showInput.value = true
	await nextTick()
	inputRef.value.focus()
}

const submitNewLabel = () => {
	showInput.value = false
	emit('change', newLabel.value)
}
</script>

<script lang="ts">
export default {
	inheritAttrs: false,
}
</script>

<style>
/* Label + input styles are shared with EditableEdge (defined there, global scope). */
</style>
