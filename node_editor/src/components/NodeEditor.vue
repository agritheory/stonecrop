<template>
	<div
		class="node-editor-wrapper"
		:class="nodeContainerClass"
		@contextmenu.prevent
		@mouseover="hover = true"
		@mouseleave="hover = false">
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
				<div>
					<button class="button-default" @click="autoArrange">Auto-arrange</button>
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
			v-model="vueFlowElements"
			class="nowheel"
			:prevent-scrolling="true"
			:zoom-on-scroll="false"
			:fit-view-on-init="true"
			:pan-activation-key-code="null"
			@connect="handleConnect"
			@pane-ready="setInstance"
			@node-click="handleNodeClick"
			@edge-click="handleEdgeClick"
			@edge-context-menu="handleEdgeContextMenu"
			@node-drag-stop="emitElements"
			@wheel.prevent="onWheel">
			<template #node-editable="props">
				<EditableNode v-bind="props" @change="labelChanged($event, props.id)" />
			</template>
			<template #edge-editable="props">
				<EditableEdge v-bind="props" @change="labelChanged($event, props.id)" @remove="removeEdge(props.id)" />
			</template>
			<template #edge-selfloop="props">
				<SelfLoopEdge v-bind="props" @change="labelChanged($event, props.id)" @remove="removeEdge(props.id)" />
			</template>
		</VueFlow>
	</div>
</template>

<script setup lang="ts">
import {
	type VueFlowStore,
	Position,
	VueFlow,
	useVueFlow,
	Connection,
	Node,
	NodeMouseEvent,
	EdgeMouseEvent,
	DefaultEdge,
} from '@vue-flow/core'
import { type HTMLAttributes, ref, computed, nextTick, onBeforeUnmount, onMounted } from 'vue'

import EditableEdge from './EditableEdge.vue'
import EditableNode from './EditableNode.vue'
import SelfLoopEdge from './SelfLoopEdge.vue'
import { autoLayout } from '../utils/autoLayout'
import type { FlowElements } from '../types'

const { modelValue, nodeContainerClass = '' } = defineProps<{
	modelValue: FlowElements
	nodeContainerClass?: HTMLAttributes['class']
}>()
const emit = defineEmits(['update:modelValue'])

const hover = ref(false)
const vueFlowElements = ref<FlowElements>([])
const vueFlowInstance = ref<VueFlowStore>()

const activeElementKey = ref('')
const activeElementIndex = computed(() =>
	vueFlowElements.value.findIndex(element => element.id === activeElementKey.value)
)

const elements = computed({
	get: () => {
		const items = modelValue

		// Add rendering flags without clobbering caller-provided data. Edges carry `data.actionKey`
		// (the stable action identity from stateTransforms); wiping data here would drop it before it
		// round-trips back through emitElements, silently re-keying actions on every graph edit.
		for (const element of items) {
			element.data = { ...element.data }
			if (element.type === 'input') {
				element.data.hasInput = false
				element.data.hasOutput = true
			} else if (element.type === 'output') {
				element.data.hasInput = true
				element.data.hasOutput = false
			} else {
				element.data.hasInput = true
				element.data.hasOutput = true
			}
			element.class = 'vue-flow__node-default'
			// A self-loop edge (source === target) routes to the SelfLoopEdge arc renderer; everything
			// else (nodes and cross-state edges) uses the default editable slot. getBezierPath draws a
			// useless near-straight segment for a self-loop, so it must not fall through to 'editable'.
			element.type = 'source' in element && element.source === element.target ? 'selfloop' : 'editable'
		}

		return items
	},
	set: newValue => {
		emit('update:modelValue', JSON.parse(JSON.stringify(newValue)))
	},
})
const { addEdges, removeEdges } = useVueFlow()

onMounted(() => {
	document.removeEventListener('keypress', handleKeypress)
	document.addEventListener('keypress', handleKeypress)
})

onBeforeUnmount(() => {
	document.removeEventListener('keypress', handleKeypress)
})

const setInstance = (instance: VueFlowStore) => {
	vueFlowInstance.value = instance
}

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
		if (!activeNode.sourcePosition) return
		activeNode.sourcePosition = shiftTerminal(activeNode.sourcePosition)
		emitElements()
	}
}

const shiftInput = () => {
	if (activeElementIndex.value > -1) {
		const activeNode = vueFlowElements.value[activeElementIndex.value] as Node
		if (!activeNode.targetPosition) return
		activeNode.targetPosition = shiftTerminal(activeNode.targetPosition)
		emitElements()
	}
}

const onWheel = (event: WheelEvent) => {
	window.scrollBy(0, event.deltaY)
}

const handleKeypress = (event: KeyboardEvent) => {
	if (hover.value && event.ctrlKey == true) {
		if (event.key == '+' || event.key == '=') {
			void vueFlowInstance.value?.zoomIn()
		}
		if (event.key == '-') {
			void vueFlowInstance.value?.zoomOut()
		}
	}
}

const fitView = async () => {
	await vueFlowInstance.value?.fitView()
}

const autoArrange = async () => {
	// Read measured node sizes from the VueFlow store so the layout fits actual box widths (state
	// labels differ in length); autoLayout falls back to default dimensions for any unmeasured node.
	const store = vueFlowInstance.value
	const dimensions: Record<string, { width: number; height: number }> = {}
	for (const el of vueFlowElements.value) {
		if ('source' in el) continue
		const dims = store?.findNode?.(el.id)?.dimensions
		if (dims?.width && dims?.height) dimensions[el.id] = { width: dims.width, height: dims.height }
	}

	const laid = autoLayout(vueFlowElements.value, { dimensions })
	const positionById = new Map<string, { x: number; y: number }>()
	for (const el of laid) {
		if ('source' in el) continue
		positionById.set(el.id, el.position)
	}
	// Apply positions onto the v-model elements — VueFlow reacts to these, same as shiftInput/Output.
	for (const el of vueFlowElements.value) {
		if ('source' in el) continue
		const position = positionById.get(el.id)
		if (position) el.position = position
	}

	emitElements()
	await nextTick()
	await fitView()
}

const addNode = () => {
	let makeEdge = false
	let newNodePosition = { x: Math.random() * 200, y: Math.random() * 200 }
	if (activeElementIndex.value > -1) {
		const activeNode = vueFlowElements.value[activeElementIndex.value]
		if (activeNode.data?.hasOutput) {
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
		position: newNodePosition,
	})

	if (makeEdge) {
		const edgeId = `edge-${id + 1}`
		vueFlowElements.value.push({
			id: edgeId,
			source: activeElementKey.value,
			target: nodeId,
			type: 'editable',
			label: `EDGE ${id + 1}`,
			animated: true,
		})
	}
	emitElements()
}

const labelChanged = (event: DefaultEdge['label'], id: DefaultEdge['id']) => {
	for (let j = 0; j < vueFlowElements.value.length; j++) {
		if (vueFlowElements.value[j].id == id) {
			vueFlowElements.value[j].label = event
			break
		}
	}
	emitElements()
}

const handleNodeClick = ({ node }: NodeMouseEvent) => {
	activeElementKey.value = node.id
}

const handleEdgeClick = ({ edge }: EdgeMouseEvent) => {
	activeElementKey.value = edge.id
}

const handleConnect = async (event: Connection) => {
	const id = vueFlowElements.value.length
	// A node connected to itself is a self-transition (mutate-in-place) — render it as a loop.
	const isSelfLoop = event.source === event.target
	const newEdge = {
		id: `edge-${id}`,
		source: event.source,
		target: event.target,
		type: isSelfLoop ? 'selfloop' : 'editable',
		label: `New Edge`,
		interactionWidth: 400,
		animated: true,
	}
	addEdges([newEdge])
	await nextTick()
	emitElements()
}

const handleEdgeContextMenu = async (event: EdgeMouseEvent) => {
	removeEdges([event.edge.id])
	await nextTick()
	emitElements()
}

const removeEdge = async (id: string) => {
	removeEdges([id])
	await nextTick()
	emitElements()
}

const emitElements = () => {
	emit('update:modelValue', JSON.parse(JSON.stringify(vueFlowElements.value)))
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
	position: absolute;
	bottom: 0.5rem;
	left: 0.5rem;
	z-index: 10;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.35rem;
	padding: 0.4rem 0.5rem;
	background: var(--sc-overlay-background);
	border: 1px solid var(--sc-form-border);
	border-radius: var(--sc-border-radius);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.chart-controls div {
	margin-bottom: 0;
}

.defaultContainerClass {
	height: 90vh;
	width: 100%;
	border: 1px solid var(--sc-form-border);
}

.default-input-node.vue-flow__node-input,
.default-output-node.vue-flow__node-output {
	border-color: var(--sc-gray-80);
}

.default-input-node.vue-flow__node-input .vue-flow__handle,
.default-output-node.vue-flow__node-output .vue-flow__handle {
	background-color: var(--sc-gray-80);
}

.default-input-node.vue-flow__node-input.selected,
.default-output-node.vue-flow__node-output.selected {
	box-shadow: 0 0 0 0.5px var(--sc-gray-80);
}

button.button-default {
	background-color: var(--sc-btn-color);
	padding: 1px 12px;
	border-radius: var(--sc-border-radius);
	border: 1px solid var(--sc-btn-border);
	cursor: pointer;
	white-space: nowrap;
}

button.button-default:hover {
	background-color: var(--sc-btn-hover);
}

.vue-flow {
	background-size: 40px 40px;
	background-image:
		linear-gradient(to right, var(--sc-gray-20) 1px, transparent 1px),
		linear-gradient(to bottom, var(--sc-gray-20) 1px, transparent 1px);
}

input.label-editor {
	position: absolute;
}

.node-editor-wrapper {
	position: relative;
}
</style>
