<script lang="ts" setup>
import { NodeProps, Handle, Position, NodeEventsOn } from '@vue-flow/core'
import { computed, ref, nextTick } from 'vue'

interface EditableNodeProps extends NodeProps {
	id: string
	label: string
	sourcePosition: Position
	targetPosition: Position
	data: any
}

const props = defineProps<EditableNodeProps>()

const emit = defineEmits(['change'])

const positionMap = {
	top: Position.Top,
	right: Position.Right,
	bottom: Position.Bottom,
	left: Position.Left,
}

const sourcePosition = computed(() => positionMap[props.sourcePosition])
const targetPosition = computed(() => positionMap[props.targetPosition])

const labelInput = ref()
const newLabel = ref('')
const showInput = ref(false)
let lastClick = 0

const nodeOnClick = () => {
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
</script>

<template>
	<div @click="nodeOnClick()">
		<div>{{ props.label }}</div>
		<div v-if="showInput" class="label-input-wrapper">
			<input
				ref="labelInput"
				class="label-input"
				v-model="newLabel"
				@blur="showInput = false"
				@keypress.enter="submitNewLabel" />
		</div>
		<Handle v-if="props.data.hasInput" id="a" type="target" :position="targetPosition" />
		<Handle v-if="props.data.hasOutput" id="b" type="source" :position="sourcePosition" />
	</div>
</template>

<style>
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
