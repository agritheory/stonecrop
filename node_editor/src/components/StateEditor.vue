<template>
	<div>
		<NodeEditor :elements="stateElements" :node-container-class="nodeContainerClass" />
	</div>
</template>
<script lang="ts" setup>
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import NodeEditor from './NodeEditor.vue'
import { ref } from 'vue'

// Props

const props = defineProps(['value', 'stateMachine', 'layout', 'nodeContainerClass'])

// Data

const stateElements = ref([])

// Setup

if (props.stateMachine) {
	let states = props.stateMachine.config.states
	let stateHash = {}
	let hasInputs = {}
	let j = 0
	for (let key in states) {
		let idx = stateElements.value.length
		let el = {
			id: key,
			label: key,
			position: props.layout[key] && props.layout[key].position ? props.layout[key].position : { x: 200 * j, y: 100 },
			targetPosition: props.layout[key] && props.layout[key].targetPosition ? props.layout[key].targetPosition : 'left',
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
			stateElements.value.push({
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
		stateElements.value.push(stateHash[key])
	}
}
</script>
<style scoped></style>
