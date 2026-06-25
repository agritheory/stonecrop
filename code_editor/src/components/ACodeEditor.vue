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

let editorModelCounter = 0

const modelValue = defineModel<string>()
const {
	height = '300px',
	mode = 'edit',
	schema = undefined,
	language = undefined,
	options = undefined,
	vsPath = undefined,
	extraLibs = undefined,
} = defineProps<{
	height?: string
	mode?: 'edit' | 'read' | 'display'
	schema?: EditorSchema
	language?: string
	options?: editor.IStandaloneEditorConstructionOptions
	/** Override the Monaco AMD loader path (e.g. for offline/local serving) */
	vsPath?: string
	/** TypeScript declaration string added as extra libs for JS type checking */
	extraLibs?: string
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
	if (vsPath) loader.config({ paths: { vs: vsPath } })

	const monacoInstance: typeof Monaco = await loader.init()
	const lang = detectLanguage(schema?.fieldtype, language)

	if (extraLibs) {
		monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(extraLibs, 'ts:stonecrop.d.ts')
		monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions({
			checkJs: true,
			noImplicitAny: false,
		})
	}

	monacoInstance.editor.defineTheme('agritheory', theme)
	monacoInstance.editor.setTheme('agritheory')

	// Give the model a file:// URI so the TS worker recognises it as JS/TS and can
	// run getSyntacticDiagnostics without throwing "Could not find source file".
	const ext = lang === 'typescript' ? 'ts' : lang === 'json' ? 'json' : lang === 'python' ? 'py' : 'js'
	const modelUri = monacoInstance.Uri.parse(`file:///stonecrop-editor-${++editorModelCounter}.${ext}`)
	const editorModel = monacoInstance.editor.createModel(
		toEditorString(modelValue.value, schema?.fieldtype),
		lang,
		modelUri
	)

	const inst = monacoInstance.editor.create(editorRef.value!, {
		automaticLayout: true,
		colorDecorators: true,
		lineHeight: 24,
		scrollBeyondLastLine: false,
		...options,
		model: editorModel,
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
	editorInstance.value?.getModel()?.dispose()
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
