<template>
	<div>
		<NodeEditor :elements="stateElements" />
	</div>
</template>
<script>
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import NodeEditor from './NodeEditor.vue'
export default {
	components: {
		NodeEditor: NodeEditor,
	},
	props: ['stateMachine'],
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
		}
	},
	created() {
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
	methods: {},
}
</script>
<style scoped></style>
