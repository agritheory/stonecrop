<template>
	<div style="height: 90vh; width: 100%; border: 1px solid #ccc">
		<div class="chart-controls">
			<div><b>Selected Node:</b> {{ activeElementKey ? activeElementKey : 'none' }}</div>
			<div v-if="activeElementIndex > -1"><button @click="shiftInput()">Shift Input Position</button></div>
			<div v-if="activeElementIndex > -1"><button @click="shiftOutput()">Shift Output Position</button></div>
		</div>
		<VueFlow v-model="stateElements"></VueFlow>
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
	props: ['stateMachine'],
	computed: {
		activeElementIndex() {
			for (let j = 0; j < this.stateElements.length; j++) {
				if (this.stateElements[j].id == this.activeElementKey) return j
			}
			return -1
		},
	},
	data() {
		return {
			stateElements: [],
			savedData: {
				idle: {
					position: { x: 100, y: 50 },
				},
				loading: {
					position: { x: 400, y: 50 },
				},
				failure: {
					position: { x: 400, y: 250 },
					targetPosition: 'right',
					sourcePosition: 'left',
				},
				success: {
					position: { x: 700, y: 50 },
				},
			},
			activeElementKey: '',
		}
	},
	created() {},
	mounted() {
		if (this.stateMachine) {
			let states = this.stateMachine.config.states
			let stateHash = {}
			let hasInputs = {}
			for (let key in states) {
				let idx = this.stateElements.length
				let el = {
					id: key,
					label: key,
					position:
						this.savedData[key] && this.savedData[key].position ? this.savedData[key].position : { x: 200 * j, y: 100 },
					targetPosition:
						this.savedData[key] && this.savedData[key].targetPosition ? this.savedData[key].targetPosition : 'left',
					sourcePosition:
						this.savedData[key] && this.savedData[key].sourcePosition ? this.savedData[key].sourcePosition : 'right',
					events: {
						click: () => {
							this.activeElementKey = key
						},
					},
				}
				if (states[key].type && states[key].type == 'final') {
					el.type = 'output'
				}

				stateHash[key] = el

				let edges = states[key].on
				for (let edgeKey in states[key].on) {
					let target = edges[edgeKey]
					if (typeof target === 'object' && target.constructor === Object) {
						target = target.target
					}
					this.stateElements.push({
						id: `${key}-${edges[edgeKey]}-${edgeKey}`,
						target: target,
						source: key,
						label: edgeKey,
						animated: true,
					})
					hasInputs[target] = true
				}
			}

			for (let key in stateHash) {
				if (!hasInputs[key]) {
					stateHash[key]['type'] = 'input'
				}
				this.stateElements.push(stateHash[key])
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
				this.stateElements[this.activeElementIndex].sourcePosition = this.shiftTerminal(
					this.stateElements[this.activeElementIndex].sourcePosition
				)
			}
		},
		shiftInput() {
			if (this.activeElementIndex > -1) {
				this.stateElements[this.activeElementIndex].targetPosition = this.shiftTerminal(
					this.stateElements[this.activeElementIndex].targetPosition
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
