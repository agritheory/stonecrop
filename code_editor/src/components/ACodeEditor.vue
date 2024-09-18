<template>
	<div id="editor-container">
		<div ref="aCodeEditor" id="editor-area"></div>
	</div>
</template>

<script setup lang="ts">
import loader from '@monaco-editor/loader'
import { editor } from 'monaco-editor'
import { onMounted, useTemplateRef } from 'vue'

import { theme } from '@/theme/code_editor/agritheory'

const { options } = defineProps<{ options?: editor.IStandaloneEditorConstructionOptions }>()

const editorRef = useTemplateRef<HTMLDivElement>('aCodeEditor')
const editorOptions = {
	...options,
	automaticLayout: true,
	colorDecorators: true,
	lineHeight: 24,
	scrollBeyondLastLine: false,
}

onMounted(async () => {
	const monacoInstance = await loader.init()
	const editor = monacoInstance.editor

	editor.defineTheme('agritheory', theme)
	editor.setTheme('agritheory')
	editor.create(editorRef.value, editorOptions)
})
</script>

<style scoped>
#editor-area {
	width: 100%;
	height: 100%;
}
</style>
