<template>
	<div>
		<NodeEditor :elements="stateElements" :node-container-class="nodeContainerClass" />
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
	props: ['stateMachine', 'layout', 'nodeContainerClass'],
	data() {
		return {
			stateElements: [],
		}
	},
	created() {
		//console.log("StateEditor mounted")
		if (this.stateMachine) {
			let states = this.stateMachine.config.states
			let stateHash = {}
			let hasInputs = {}
			let j = 0
			for (let key in states) {
				let idx = this.stateElements.length
				let el = {
					id: key,
					label: key,
					position: this.layout[key] && this.layout[key].position ? this.layout[key].position : { x: 200 * j, y: 100 },
					targetPosition:
						this.layout[key] && this.layout[key].targetPosition ? this.layout[key].targetPosition : 'left',
					sourcePosition:
						this.layout[key] && this.layout[key].sourcePosition ? this.layout[key].sourcePosition : 'right',
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
				j++
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
