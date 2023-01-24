<template>
	<div>
		<NodeEditor :elements="elements" :node-container-class="nodeContainerClass" />
	</div>
</template>
<script lang="ts" setup>
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import NodeEditor from './NodeEditor.vue'
import { ref, computed } from 'vue'

// Props

const props = defineProps(['layout', 'nodeContainerClass', 'modelValue'])

// Emits

const emit = defineEmits(['update:modelValue'])

// Computed variables

const elements = computed({
	get: () => {
		let states = props.modelValue.states
		let stateHash = {}
		let hasInputs = {}
		let j = 0
		let stateElements = []
		for (let key in states) {
			let idx = stateElements.length
			let el = {
				id: key,
				label: key,
				position: props.layout[key] && props.layout[key].position ? props.layout[key].position : { x: 200 * j, y: 100 },
				targetPosition:
					props.layout[key] && props.layout[key].targetPosition ? props.layout[key].targetPosition : 'left',
				sourcePosition:
					props.layout[key] && props.layout[key].sourcePosition ? props.layout[key].sourcePosition : 'right',
			}
			if (states[key].type && states[key].type == 'final') {
				el.type = 'output'
				el.class = 'default-output-node'
			}
			stateHash[key] = el
			let edges = states[key].on
			for (let edgeKey in states[key].on) {
				let target = edges[edgeKey]
				if (typeof target === 'object' && target.constructor === Object) {
					target = target.target
				}
				stateElements.push({
					id: `${key}-${edges[edgeKey]}-${edgeKey}`,
					target: target,
					source: key,
					label: edgeKey,
					animated: true,
				})
				hasInputs[target] = true
			}
			j++
		}
		for (let key in stateHash) {
			if (!hasInputs[key]) {
				stateHash[key]['type'] = 'input'
				stateHash[key]['class'] = 'default-input-node'
			}
			stateElements.push(stateHash[key])
		}
		return stateElements
	},
	set: newValue => {
		// update modelValue when elements change
		onElementsChange(newValue)
		// emit('update:modelValue', props.modelValue)
	},
})

// Methods

const onElementsChange = elements => {
	let states = {}
	let edges = {}
	let idToLabel = {}
	for (let i = 0; i < elements.length; i++) {
		let el = elements[i]
		if (el.type == 'input') {
			// it's an input node
			states[el.label] = {
				on: {},
			}
		} else if (el.type == 'output') {
			// it's an output node
			states[el.label] = {
				type: 'final',
			}
		} else if (el.source && el.target) {
			// it's an edge
			edges[el.source] = edges[el.source] || {}
			edges[el.source][el.label] = {
				target: el.target,
			}
		} else {
			// it's a state
			states[el.label] = {
				on: {},
			}
		}
		idToLabel[el.id] = el.label
	}

	for (let key in edges) {
		// add edges to states
		let label = idToLabel[key]
		for (let edgeKey in edges[key]) {
			states[label].on[edgeKey] = edges[key][edgeKey]
		}
	}

	emit('update:modelValue', states)
}
</script>
<style scoped></style>
