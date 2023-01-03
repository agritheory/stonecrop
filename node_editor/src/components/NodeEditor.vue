<template>
	<div :class="containerClass" @mouseover="hover = true" @mouseleave="hover = false">
		<div class="chart-controls">
			<div><b>Selected Node:</b> {{ activeElementKey ? activeElementKey : 'none' }}</div>
			<div v-if="activeElementIndex > -1">
				<button class="button-default" @click="shiftInput()">Shift Input Position</button>
			</div>
			<div v-if="activeElementIndex > -1">
				<button class="button-default" @click="shiftOutput()">Shift Output Position</button>
			</div>
		</div>

		<VueFlow
			@keypress="zoomIn()"
			@pane-ready="onPaneReady"
			@wheel.prevent="onWheel($event)"
			class="nowheel"
			:prevent-scrolling="true"
			:zoom-on-scroll="false"
			v-if="_elements && _elements.length"
			v-model="_elements"></VueFlow>
	</div>
</template>
<script>
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
export default {
	components: {
		VueFlow: VueFlow,
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
		}
	},
	created() {
		// console.log("NodeEditor mounted")
		if (this.nodeContainerClass) {
			this.containerClass = this.nodeContainerClass
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
	},
}
</script>
<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.chart-controls {
	padding: 20px;
	border-bottom: 1px solid #ccc;
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
	padding: 5px 12px;
	border-radius: 3px;
	box-shadow: rgba(0, 0, 0, 0.05) 0px 0.5px 0px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px,
		rgba(0, 0, 0, 0.05) 0px 2px 4px 0px;
	border: none;
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
</style>
