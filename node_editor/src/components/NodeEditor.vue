<template>
	<div style="width: 100%; height: 90vh">
		<baklava-editor :view-model="baklava" />
	</div>
</template>
<script>
import { defineComponent } from 'vue'
import { EditorComponent, useBaklava } from '@baklavajs/renderer-vue'
//import { NodeBuilder, Editor } from "@baklavajs/core";
import * as mod from '@baklavajs/core'

import { NodeBuilder, Editor } from '@baklavajs/core'
import { ViewPlugin } from '@baklavajs/renderer-vue'
//import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { Engine } from '@baklavajs/engine'

console.log('mode', mod)

import '@baklavajs/themes/dist/syrup-dark.css'

const mathNode = new NodeBuilder('MathNode')
	.setName('Math')
	.addInputInterface('Number 1', 'NumberOption', 1)
	.addInputInterface('Number 2', 'NumberOption', 10)
	.addOption('Operation', 'SelectOption', 'Add', undefined, {
		items: ['Add', 'Subtract'],
	})
	.addOutputInterface('Output')
	.onCalculate(n => {
		const n1 = n.getInterface('Number 1').value
		const n2 = n.getInterface('Number 2').value
		const operation = n.getOptionValue('Operation')
		let result
		if (operation === 'Add') {
			result = n1 + n2
		} else if (operation === 'Subtract') {
			result = n1 - n2
		}
		n.getInterface('Output').value = result
	})
	.build()
// const TestNode =  defineNode({
//     type: "WorkflowStateNode",
//     inputs: {
//
//     },
//     outputs: {
//
//     },
// })
///console.log("mod", mod);
export default defineComponent({
	name: 'NodeEditor',
	components: {
		'baklava-editor': EditorComponent,
	},
	setup() {
		const baklava = useBaklava()
		//baklava.editor.addNode(mathNode);
		baklava.editor.registerNodeType('My Node', mathNode)
		console.log('BAK', baklava)
		return { baklava }
	},
})
</script>
<style scoped></style>
