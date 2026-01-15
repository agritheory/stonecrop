<template>
	<div id="editor-container" ref="aCodeEditor" />
</template>

<script setup lang="ts">
import loader from '@monaco-editor/loader'
import { editor } from 'monaco-editor'
import { onMounted, useTemplateRef } from 'vue'

import { theme } from '../theme/code_editor/agritheory'

const { options = {} } = defineProps<{ options?: editor.IStandaloneEditorConstructionOptions }>()

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
	const editorInstance = monacoInstance.editor

	editorInstance.defineTheme('agritheory', theme)
	editorInstance.setTheme('agritheory')

	if (editorRef.value) {
		editorInstance.create(editorRef.value, editorOptions)
	}
})
</script>

<style>
#editor-container {
	width: 100%;
	height: 100%;
}
</style>
