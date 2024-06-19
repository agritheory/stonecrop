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
		<Handle v-if="props.data.hasInput" id="a" type="target" :position="props.targetPosition" />
		<Handle v-if="props.data.hasOutput" id="b" type="source" :position="props.sourcePosition" />
	</div>
</template>

<script setup lang="ts">
import { NodeProps, Handle } from '@vue-flow/core'
import { ref, nextTick } from 'vue'

const props = defineProps<NodeProps>()
const emit = defineEmits(['change'])

const labelInput = ref<HTMLInputElement>()
const newLabel = ref<NodeProps['label']>('')
const showInput = ref(false)
let lastClick = 0

const nodeOnClick = async () => {
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
</script>

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
