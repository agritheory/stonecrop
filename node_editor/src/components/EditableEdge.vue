<script lang="ts" setup>
import type { EdgeProps, Position } from '@vue-flow/core'
import { EdgeLabelRenderer, getBezierPath, useVueFlow } from '@vue-flow/core'
import type { CSSProperties } from 'vue'
import { computed, ref, nextTick } from 'vue'

interface CustomEdgeProps<T = any> extends EdgeProps<T> {
	id: string
	sourceX: number
	sourceY: number
	targetX: number
	targetY: number
	sourcePosition: Position
	targetPosition: Position
	data: T
	markerEnd: string
	style: CSSProperties
	label: string
}

const props = defineProps<CustomEdgeProps>()

const { removeEdges } = useVueFlow()

const emit = defineEmits(['change'])

const labelInput = ref()
const newLabel = ref('')
const showInput = ref(false)
let lastClick = 0

const labelOnClick = () => {
	let now = Date.now()
	if (now - lastClick < 500 && !showInput.value) {
		showLabelInput()
	}
	lastClick = now
}

const showLabelInput = async () => {
	newLabel.value = props.label
	showInput.value = true
	await nextTick()
	labelInput.value.focus()
}

const submitNewLabel = () => {
	showInput.value = false
	emit('change', newLabel.value)
}

const path = computed(() => getBezierPath(props))
</script>

<script lang="ts">
export default {
	inheritAttrs: false,
}
</script>

<template>
	<path :id="id" :style="style" class="vue-flow__edge-path" :d="path[0]" :marker-end="markerEnd" />

	<EdgeLabelRenderer>
		<div
			:style="{
				pointerEvents: 'all',
				position: 'absolute',
				transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
			}"
			class="nodrag nopan editable-edge-label"
			@click="labelOnClick()">
			<div class="vue-flow__edge-label">{{ props.label }}</div>
			<div v-if="showInput" class="label-input-wrapper">
				<input
					ref="labelInput"
					class="label-input"
					v-model="newLabel"
					@blur="showInput = false"
					@keypress.enter="submitNewLabel" />
			</div>
		</div>
	</EdgeLabelRenderer>
</template>

<style>
.editable-edge-label {
	background-color: white;
	position: relative;
}
.label-input-wrapper {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
.label-input {
	text-align: center;
}
</style>
