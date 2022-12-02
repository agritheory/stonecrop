<template>
	<div style="width: 100%; height: 90vh">
		<baklava-editor :view-model="baklava" />
	</div>
</template>
<script>
import { defineComponent } from 'vue'
import '@baklavajs/themes/dist/syrup-dark.css'
import { default as WorkflowConnection } from './WorkflowConnection.vue'
import * as baklavajs from 'baklavajs'
console.log('baklava', baklavajs.Components)
//baklavajs.Components.Connection = WorkflowConnection
const myNode = baklavajs.defineNode({
	type: 'MyNode',
	inputs: {
		number1: () => new baklavajs.NumberInterface('Number', 1),
		number2: () => new baklavajs.NumberInterface('Number', 10),
		operation: () => new baklavajs.SelectInterface('Operation', 'Add', ['Add', 'Subtract']).setPort(false),
	},
	outputs: {
		output: () => new baklavajs.NodeInterface('Output', 0),
	},
})

export default defineComponent({
	components: {
		'baklava-editor': baklavajs.EditorComponent,
	},
	setup() {
		const baklava = baklavajs.useBaklava()
		baklava.editor.registerNodeType(myNode)
		console.log('instance', baklava)
		console.log('more', baklava)
		return { baklava }
	},
})
</script>
<style scoped></style>
