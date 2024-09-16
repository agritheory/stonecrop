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
			<div class="vue-flow__edge-label">{{ label }}</div>
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

<script setup lang="ts">
import { type EdgeProps, EdgeLabelRenderer, getBezierPath /* useVueFlow */ } from '@vue-flow/core'
import { computed, ref, nextTick, useTemplateRef } from 'vue'

const props = defineProps<EdgeProps>()
const emit = defineEmits(['change'])

// TODO: Implement edge removal
// const { removeEdges } = useVueFlow()

const labelInput = useTemplateRef<HTMLInputElement>('labelInput')
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

<style>
.editable-edge-label {
	background-color: white;
	position: relative;
	font-size: 12px;
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
