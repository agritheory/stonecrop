<template>
	<div style="width: 100%; height: 90vh">
		<baklava-editor :view-model="baklava" />
	</div>
</template>
<script>
import { defineComponent } from 'vue'
import { EditorComponent, useBaklava } from '@baklavajs/renderer-vue'
import { defineNode, NodeInterface } from '@baklavajs/core'
import * as mod from '@baklavajs/interface-types'
import { NumberInterface, SelectInterface } from 'baklavajs'
import '@baklavajs/themes/dist/syrup-dark.css'
console.log('DF')

const myNode = defineNode({
	type: 'MyNode',
	inputs: {
		number1: () => new NumberInterface('Number', 1),
		number2: () => new NumberInterface('Number', 10),
		operation: () => new SelectInterface('Operation', 'Add', ['Add', 'Subtract']).setPort(false),
	},
	outputs: {
		output: () => new NodeInterface('Output', 0),
	},
})

export default defineComponent({
	components: {
		'baklava-editor': EditorComponent,
	},
	setup() {
		const baklava = useBaklava()
		baklava.editor.registerNodeType(myNode)
		return { baklava }
	},
})
</script>
<style scoped></style>
