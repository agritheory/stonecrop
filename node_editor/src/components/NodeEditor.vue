<template>
	<div class="node-editor-wrapper" :class="containerClass" @mouseover="hover = true" @mouseleave="hover = false">
		<div class="chart-controls">
			<div class="chart-controls-left">
				<div><b>Selected Node:</b> {{ activeElementKey ? activeElementKey : 'none' }}</div>
			</div>
			<div class="chart-controls-right">
				<div>
					<button class="button-default" @click="addNode()">Add Node</button>
				</div>
				<div>
					<button class="button-default" @click="fitView()">Center</button>
				</div>
				<div v-if="activeElementIndex > -1">
					<button class="button-default" @click="shiftInput()">Shift Input Position</button>
				</div>
				<div v-if="activeElementIndex > -1">
					<button class="button-default" @click="shiftOutput()">Shift Output Position</button>
				</div>
			</div>
		</div>

		<VueFlow
			@wheel.prevent="onWheel($event)"
			class="nowheel"
			:prevent-scrolling="true"
			:zoom-on-scroll="false"
			:fit-view-on-init="true"
			v-if="_elements && _elements.length"
			v-model="_elements"
			@connect="onConnect($event)"
			@edge-double-click="onEdgeDoubleClick($event)">
			<template #node-editable="props">
				<EditableNode v-bind="props" @change="labelChanged($event, props.id)" />
			</template>
			<template #edge-editable="props">
				<EditableEdge v-bind="props" @change="labelChanged($event, props.id)" />
			</template>
		</VueFlow>
	</div>
</template>
<script lang="ts" setup>
import { VueFlow, useVueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import EditableNode from './EditableNode.vue'
import EditableEdge from './EditableEdge.vue'
import { ref, computed, defineEmits, onBeforeUnmount, onMounted } from 'vue'

// Props

const props = defineProps<{
	elements: any[]
	nodeContainerClass: string
}>()

// Emits

const emit = defineEmits(['change'])

// Computed variables

const activeElementIndex = computed(() => {
	for (let j = 0; j < _elements.value.length; j++) {
		if (_elements.value[j].id == activeElementKey.value) return j
	}
	return -1
})

// Data

const _elements = ref([])
const containerClass = ref('')
const vueFlowInstance = ref({})
const hover = ref(false)
const labelEditor = ref({
	x: 0,
	y: 0,
})

const activeElementKey = ref('')

//VueFlow

const { getNodes, onPaneReady } = useVueFlow({})

onPaneReady(i => {
	vueFlowInstance.value = i
})

// Setup

if (props.nodeContainerClass) {
	containerClass.value = props.nodeContainerClass
} else {
	containerClass.value = 'defaultContainerClass'
}

for (let j = 0; j < props.elements.length; j++) {
	props.elements[j].data = {}
	if (props.elements[j].type == 'input') {
		props.elements[j].data.hasInput = false
		props.elements[j].data.hasOutput = true
	} else if (props.elements[j].type == 'output') {
		props.elements[j].data.hasInput = true
		props.elements[j].data.hasOutput = false
	} else {
		props.elements[j].data.hasInput = true
		props.elements[j].data.hasOutput = true
	}
	props.elements[j].class = 'vue-flow__node-default'
	props.elements[j].type = 'editable'
}
_elements.value = props.elements
for (let j = 0; j < _elements.value.length; j++) {
	let key = props.elements[j].id
	let el = props.elements[j]
	_elements.value[j].events = {
		click: () => {
			activeElementKey.value = key
		},
	}
}

// Lifecycle Hooks

onMounted(() => {
	document.removeEventListener('keypress', handleKeypress)
	document.addEventListener('keypress', handleKeypress)
})

onBeforeUnmount(() => {
	document.removeEventListener('keypress', handleKeypress)
})

// Methods

const shiftTerminal = currentTerminal => {
	return {
		top: 'right',
		right: 'bottom',
		bottom: 'left',
		left: 'top',
	}[currentTerminal]
}

const shiftOutput = () => {
	if (activeElementIndex.value > -1) {
		_elements.value[activeElementIndex.value].sourcePosition = shiftTerminal(
			_elements.value[activeElementIndex.value].sourcePosition
		)
	}
}

const shiftInput = () => {
	if (activeElementIndex.value > -1) {
		_elements.value[activeElementIndex.value].targetPosition = shiftTerminal(
			_elements.value[activeElementIndex.value].targetPosition
		)
	}
}

const onWheel = $event => {
	window.scrollBy(0, $event.deltaY)
}

const handleKeypress = e => {
	if (hover.value && e.ctrlKey == true) {
		if (e.key == '+' || e.key == '=') {
			vueFlowInstance.value.zoomIn()
		}
		if (e.key == '-') {
			vueFlowInstance.value.zoomOut()
		}
	}
}

const fitView = () => {
	vueFlowInstance.value.fitView()
}

const addNode = () => {
	let newNodePosition = { x: Math.random() * 200, y: Math.random() * 200 }
	let makeEdge = false
	if (activeElementIndex.value > -1) {
		const activeNode = _elements.value[activeElementIndex.value]
		if (activeNode.data.hasOutput) {
			newNodePosition = { x: activeNode.position.x + 200, y: activeNode.position.y + 50 }
			makeEdge = true
		}
	}

	let id = _elements.value.length
	let nodeId = `node-${id}`
	_elements.value.push({
		id: nodeId,
		label: 'Node ' + id,
		sourcePosition: 'right',
		targetPosition: 'left',
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
		_elements.value.push({
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

const onConnect = e => {
	console.log('edge connect', e)
}

const onEdgeDoubleClick = e => {
	console.log('edge double click', e)
}

const labelChanged = (e, id) => {
	for (let j = 0; j < _elements.value.length; j++) {
		if (_elements.value[j].id == id) {
			_elements.value[j].label = e
			break
		}
	}
}
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
