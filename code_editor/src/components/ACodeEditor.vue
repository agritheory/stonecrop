<template>
	<div ref="container" id="container"></div>
</template>

<script setup lang="ts">
import loader from '@monaco-editor/loader'
import { editor } from 'monaco-editor'
import { onMounted, ref } from 'vue'

import { theme } from '@/theme/code_editor/agritheory'

const props = withDefaults(
	defineProps<{
		language: editor.IStandaloneEditorConstructionOptions['language']
		initialValue?: string
		options?: editor.IEditorOptions
	}>(),
	{
		initialValue: '',
	}
)

const container = ref(null)
const editorOptions: editor.IEditorOptions = {
	...props.options,
	automaticLayout: true,
	colorDecorators: true,
	lineHeight: 24,
}

onMounted(async () => {
	const monacoInstance = await loader.init()
	const editor = monacoInstance.editor

	editor.defineTheme('agritheory', theme)
	editor.setTheme('agritheory')

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	editor.create(container.value as HTMLElement, {
		...editorOptions,
		language: props.language,
		value: props.initialValue,
	})
})
</script>

<style scoped>
#container {
	width: 100%;
	height: 100%;
}
</style>
