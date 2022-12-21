<template>
	<div style="height: 90vh; width: 100%; border: 1px solid #ccc">
		<div class="chart-controls">
			<div><b>Selected Node:</b> {{ activeElementKey ? activeElementKey : 'none' }}</div>
			<div v-if="activeElementIndex > -1"><button @click="shiftInput()">Shift Input Position</button></div>
			<div v-if="activeElementIndex > -1"><button @click="shiftOutput()">Shift Output Position</button></div>
		</div>
		<VueFlow v-model="_elements"></VueFlow>
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
	props: ['elements'],
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
		}
	},
	created() {
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
	},
}
</script>
<style scoped>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.chart-controls {
	padding: 20px;
	min-height: 80px;
}
.chart-controls div {
	margin-bottom: 5px;
}
</style>
