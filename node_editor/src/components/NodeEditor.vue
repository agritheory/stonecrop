<template>
	<div style="width: 100%; height: 90vh">
		<baklava-editor :view-model="baklava" />
	</div>
</template>
<script>
import { defineComponent } from 'vue'
import { EditorComponent, useBaklava } from '@baklavajs/renderer-vue'
import '@baklavajs/themes/dist/syrup-dark.css'
import WorkflowStateNode from '@/nodes/WorkflowStateNode'

export default defineComponent({
	name: 'NodeEditor',
	components: {
		'baklava-editor': EditorComponent,
	},
	setup() {
		const baklava = useBaklava()
		//baklava.editor.registerNodeType(WorkflowStateNode);
		console.log('BAK', baklava)
		return { baklava }
	},
})
</script>
<style scoped></style>
