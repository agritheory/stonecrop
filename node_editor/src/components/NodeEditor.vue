<template>
	<div class="node-editor-wrapper" :class="nodeContainerClass" @mouseover="hover = true" @mouseleave="hover = false">
		<div class="chart-controls">
			<div class="chart-controls-left">
				<div><b>Selected Node:</b> {{ activeElementKey ? activeElementKey : 'none' }}</div>
			</div>
			<div class="chart-controls-right">
				<div>
					<button class="button-default" @click="addNode">Add Node</button>
				</div>
				<div>
					<button class="button-default" @click="fitView">Center</button>
				</div>
				<div v-if="activeElementIndex > -1">
					<button class="button-default" @click="shiftInput">Shift Input Position</button>
				</div>
				<div v-if="activeElementIndex > -1">
					<button class="button-default" @click="shiftOutput">Shift Output Position</button>
				</div>
			</div>
		</div>

		<VueFlow
			v-if="vueFlowElements && vueFlowElements.length"
			class="nowheel"
			:prevent-scrolling="true"
			:zoom-on-scroll="false"
			:fit-view-on-init="true"
			v-model="vueFlowElements"
			@wheel.prevent="onWheel">
			@connect="onConnect"
			<template #node-editable="props">
				<EditableNode v-bind="props" @change="labelChanged($event, props.id)" />
			</template>
			<template #edge-editable="props">
				<EditableEdge v-bind="props" @change="labelChanged($event, props.id)" />
			</template>
		</VueFlow>
	</div>
</template>

<script setup lang="ts">
import { type VueFlowStore, Position, VueFlow, useVueFlow, Connection, Node } from '@vue-flow/core'
import { type HTMLAttributes, ref, computed, defineEmits, onBeforeUnmount, onMounted } from 'vue'

import EditableEdge from '@/components/EditableEdge.vue'
import EditableNode from '@/components/EditableNode.vue'
import type { FlowElements } from '@/types'

const { modelValue, nodeContainerClass } = defineProps<{
	modelValue: FlowElements
	nodeContainerClass?: HTMLAttributes['class']
}>()
const emit = defineEmits(['update:modelValue'])

const hover = ref(false)
const vueFlowElements = ref<FlowElements>([])
const vueFlowInstance = ref<Partial<VueFlowStore>>()

const activeElementKey = ref('')
const activeElementIndex = computed(() => {
	vueFlowElements.value.forEach((element, index) => {
		if (element.id === activeElementKey.value) {
			return index
		}
	})

	return -1
})

const elements = computed({
	get: () => {
		const _elements = modelValue

		// Add data to each element
		for (const _element of _elements) {
			_element.data = {}
			if (_element.type === 'input') {
				_element.data.hasInput = false
				_element.data.hasOutput = true
			} else if (_element.type === 'output') {
				_element.data.hasInput = true
				_element.data.hasOutput = false
			} else {
				_element.data.hasInput = true
				_element.data.hasOutput = true
			}
			_element.class = 'vue-flow__node-default'
			_element.type = 'editable'
		}

		// Add click event to each element
		for (const _element of _elements) {
			_element.events = {
				click: () => {
					activeElementKey.value = _element.id
				},
			}
		}

		return _elements
	},
	set: newValue => {
		emit('update:modelValue', JSON.parse(JSON.stringify(newValue)))
	},
})
const { onConnect, addEdges, onEdgeContextMenu, onPaneReady, removeEdges } = useVueFlow()

onMounted(() => {
	document.removeEventListener('keypress', handleKeypress)
	document.addEventListener('keypress', handleKeypress)
})

onBeforeUnmount(() => {
	document.removeEventListener('keypress', handleKeypress)
})

onPaneReady(instance => {
	vueFlowInstance.value = instance
})

vueFlowElements.value = elements.value

// Methods
const shiftTerminal = (currentTerminal: Position) => {
	return {
		[Position.Top]: Position.Right,
		[Position.Right]: Position.Bottom,
		[Position.Bottom]: Position.Left,
		[Position.Left]: Position.Top,
	}[currentTerminal]
}

const shiftOutput = () => {
	if (activeElementIndex.value > -1) {
		const activeNode = vueFlowElements.value[activeElementIndex.value] as Node
		activeNode.sourcePosition = shiftTerminal(activeNode.sourcePosition)
	}
}

const shiftInput = () => {
	if (activeElementIndex.value > -1) {
		const activeNode = vueFlowElements.value[activeElementIndex.value] as Node
		activeNode.targetPosition = shiftTerminal(activeNode.targetPosition)
	}
}

const onWheel = (event: WheelEvent) => {
	window.scrollBy(0, event.deltaY)
}

const handleKeypress = (event: KeyboardEvent) => {
	if (hover.value && event.ctrlKey == true) {
		if (event.key == '+' || event.key == '=') {
			void vueFlowInstance.value.zoomIn()
		}
		if (event.key == '-') {
			void vueFlowInstance.value.zoomOut()
		}
	}
}

const fitView = async () => {
	await vueFlowInstance.value.fitView()
}

const addNode = () => {
	let makeEdge = false
	let newNodePosition = { x: Math.random() * 200, y: Math.random() * 200 }
	if (activeElementIndex.value > -1) {
		const activeNode = vueFlowElements.value[activeElementIndex.value]
		if (activeNode.data.hasOutput) {
			newNodePosition = { x: (activeNode as Node).position.x + 200, y: (activeNode as Node).position.y + 50 }
			makeEdge = true
		}
	}

	const id = vueFlowElements.value.length
	const nodeId = `node-${id}`
	vueFlowElements.value.push({
		id: nodeId,
		label: 'Node ' + id,
		sourcePosition: Position.Right,
		targetPosition: Position.Left,
		class: 'vue-flow__node-default',
		type: 'editable',
		data: {
			hasInput: true,
			hasOutput: true,
		},
		events: {
			click: () => {
				activeElementKey.value = nodeId
			},
		},
		// position: { x: Math.random() * vueFlowInstance.value.dimensions.width, y: Math.random() * vueFlowInstance.value.dimensions.height }
		position: newNodePosition,
	})

	if (makeEdge) {
		let edgeId = `edge-${id + 1}`
		vueFlowElements.value.push({
			id: edgeId,
			source: activeElementKey.value,
			target: nodeId,
			type: 'editable',
			label: `EDGE ${id + 1}`,
			animated: true,
			events: {
				click: () => {
					activeElementKey.value = edgeId
				},
			},
		})
	}
}

const labelChanged = (e, id) => {
	for (let j = 0; j < vueFlowElements.value.length; j++) {
		if (vueFlowElements.value[j].id == id) {
			vueFlowElements.value[j].label = e
			break
		}
	}
}

const handleConnect = (connection: Connection) => {
	const id = vueFlowElements.value.length
	const newEdge = {
		id: `edge-${id}`,
		source: connection.source,
		target: connection.target,
		type: 'editable',
		label: `New Edge`,
		interactionWidth: 400,
		animated: true,
		events: {
			click: () => {
				activeElementKey.value = newEdge.id
			},
		},
	}
	addEdges([newEdge])
}

onConnect(handleConnect)

const handleEdgeRemove = edgeId => {
	removeEdges(edgeId)
}

onEdgeContextMenu(({ event, edge }) => {
	handleEdgeRemove(edge.id)
})
</script>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.chart-controls-left,
.chart-controls-right {
	height: 1.8em;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-top: 0.2em;
}

.chart-controls-right div {
	margin-left: 5px;
}

.chart-controls {
	padding-left: 20px;
	padding-right: 20px;
	height: 1.8em;
	border-bottom: 1px solid #ccc;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.chart-controls div {
	margin-bottom: 5px;
}

.defaultContainerClass {
	height: 90vh;
	width: 100%;
	border: 1px solid #ccc;
}

.default-input-node.vue-flow__node-input,
.default-output-node.vue-flow__node-output {
	border-color: #000;
}

.default-input-node.vue-flow__node-input .vue-flow__handle,
.default-output-node.vue-flow__node-output .vue-flow__handle {
	background-color: #000;
}

.default-input-node.vue-flow__node-input.selected,
.default-output-node.vue-flow__node-output.selected {
	box-shadow: 0 0 0 0.5px #000;
}

button.button-default {
	background-color: #ffffff;
	padding: 1px 12px;
	border-radius: 3px;
	border: 1px solid #ccc;
	cursor: pointer;
	white-space: nowrap;
}

button.button-default:hover {
	background-color: #f2f2f2;
}

.vue-flow {
	background-size: 40px 40px;
	background-image: linear-gradient(to right, #ccc 1px, transparent 1px),
		linear-gradient(to bottom, #ccc 1px, transparent 1px);
}

input.label-editor {
	position: absolute;
}

.node-editor-wrapper {
	position: relative;
}
</style>
