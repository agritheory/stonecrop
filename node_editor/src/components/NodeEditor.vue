<template>
	<div class="node-editor-wrapper" :class="containerClass" @mouseover="hover = true" @mouseleave="hover = false">
		<div class="chart-controls">
			<div class="chart-controls-left">
				<div><b>Selected Node:</b> {{ activeElementKey ? activeElementKey : 'none' }}</div>
			</div>
			<div class="chart-controls-right">
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
			@pane-ready="onPaneReady"
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
<script lang="ts">
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import EditableNode from './EditableNode.vue'
import EditableEdge from './EditableEdge.vue'
export default {
	components: {
		VueFlow: VueFlow,
		EditableNode: EditableNode,
		EditableEdge: EditableEdge,
	},
	props: ['elements', 'nodeContainerClass'],
	computed: {
		activeElementIndex() {
			for (let j = 0; j < this._elements.length; j++) {
				if (this._elements[j].id == this.activeElementKey) return j
			}
			return -1
		},
	},
	data() {
		return {
			activeElementKey: '',
			_elements: [],
			containerClass: 'defaultContainerClass',
			vueFlowInstance: null,
			hover: false,
			labelEditor: {
				x: 0,
				y: 0,
			},
		}
	},
	created() {
		// console.log("NodeEditor mounted")
		if (this.nodeContainerClass) {
			this.containerClass = this.nodeContainerClass
		}

		for (let j = 0; j < this.elements.length; j++) {
			this.elements[j].data = {}
			if (this.elements[j].type == 'input') {
				this.elements[j].data.hasInput = false
				this.elements[j].data.hasOutput = true
			} else if (this.elements[j].type == 'output') {
				this.elements[j].data.hasInput = true
				this.elements[j].data.hasOutput = false
			} else {
				this.elements[j].data.hasInput = true
				this.elements[j].data.hasOutput = true
			}
			this.elements[j].class = 'vue-flow__node-default'
			this.elements[j].type = 'editable'
		}
		this._elements = this.elements
		for (let j = 0; j < this._elements.length; j++) {
			let key = this.elements[j].id
			let el = this.elements[j]
			this._elements[j].events = {
				click: () => {
					this.activeElementKey = key
				},
			}
		}
	},
	mounted() {
		document.removeEventListener('keypress', this.handleKeypress)
		document.addEventListener('keypress', this.handleKeypress)
	},
	beforeDestroy() {
		document.removeEventListener('keypress', this.handleKeypress)
	},
	methods: {
		shiftTerminal(currentTerminal) {
			return {
				top: 'right',
				right: 'bottom',
				bottom: 'left',
				left: 'top',
			}[currentTerminal]
		},
		shiftOutput() {
			if (this.activeElementIndex > -1) {
				this._elements[this.activeElementIndex].sourcePosition = this.shiftTerminal(
					this._elements[this.activeElementIndex].sourcePosition
				)
			}
		},
		shiftInput() {
			if (this.activeElementIndex > -1) {
				this._elements[this.activeElementIndex].targetPosition = this.shiftTerminal(
					this._elements[this.activeElementIndex].targetPosition
				)
			}
		},
		onWheel($event) {
			window.scrollBy(0, $event.deltaY)
		},
		onPaneReady(vueFlowInstance) {
			this.vueFlowInstance = vueFlowInstance
		},
		handleKeypress(e) {
			if (this.hover && e.ctrlKey == true) {
				if (e.key == '+' || e.key == '=') {
					this.vueFlowInstance.zoomIn()
				}
				if (e.key == '-') {
					this.vueFlowInstance.zoomOut()
				}
			}
		},
		fitView() {
			this.vueFlowInstance.fitView()
		},
		onConnect(e) {
			console.log('edge connect', e)
		},
		onEdgeDoubleClick(e) {
			console.log('edge double click', e)
		},
		labelChanged(e, id) {
			for (let j = 0; j < this._elements.length; j++) {
				if (this._elements[j].id == id) {
					this._elements[j].label = e
					break
				}
			}
		},
	},
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
