<template>
	<div ref="aCodeEditor" class="a-code-editor" :style="{ height }" />
</template>

<script setup lang="ts">
import loader from '@monaco-editor/loader'
import type * as Monaco from 'monaco-editor'
import type { editor } from 'monaco-editor'
import { onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { useTemplateRef } from 'vue'

import { theme } from '../theme/code_editor/agritheory'
import { detectLanguage } from '../utils/language'
import { toEditorString } from '../utils/serialization'

type EditorSchema = { fieldtype?: string; [key: string]: unknown }

const modelValue = defineModel<string>()
const {
	height = '300px',
	mode = 'edit',
	schema = undefined,
	language = undefined,
	options = undefined,
} = defineProps<{
	height?: string
	mode?: 'edit' | 'read' | 'display'
	schema?: EditorSchema
	language?: string
	options?: editor.IStandaloneEditorConstructionOptions
}>()

const editorRef = useTemplateRef<HTMLDivElement>('aCodeEditor')
const editorInstance = shallowRef<editor.IStandaloneCodeEditor | null>(null)

watch(modelValue, val => {
	const inst = editorInstance.value
	if (inst && val !== inst.getValue()) inst.setValue(val ?? '')
})

watch(
	() => mode,
	m => {
		editorInstance.value?.updateOptions({ readOnly: m !== 'edit' })
	}
)

onMounted(async () => {
	const monacoInstance: typeof Monaco = await loader.init()
	const lang = detectLanguage(schema?.fieldtype, language)

	monacoInstance.editor.defineTheme('agritheory', theme)
	monacoInstance.editor.setTheme('agritheory')

	const inst = monacoInstance.editor.create(editorRef.value!, {
		automaticLayout: true,
		colorDecorators: true,
		lineHeight: 24,
		scrollBeyondLastLine: false,
		...options,
		value: toEditorString(modelValue.value, schema?.fieldtype),
		language: lang,
		readOnly: mode !== 'edit',
	})

	inst.onDidChangeModelContent(() => {
		modelValue.value = inst.getValue()
	})

	editorInstance.value = inst

	// Sync any modelValue change that arrived during the async CDN load
	const current = modelValue.value ?? ''
	if (current !== inst.getValue()) inst.setValue(current)
})

onUnmounted(() => {
	editorInstance.value?.dispose()
	editorInstance.value = null
})
</script>

<style scoped>
.a-code-editor {
	width: 100%;
	overflow: hidden;
}
</style>
