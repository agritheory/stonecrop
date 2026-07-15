<template>
	<div ref="aCodeEditor" class="a-code-editor" :style="{ height }" />
</template>

<script lang="ts">
// Module-scoped (shared across all instances) so each Monaco model gets a unique URI. This MUST
// live in a plain <script>, not <script setup>: inside <script setup> it is re-created per instance
// and always increments to 1, so two editors mounted at once both build
// `file:///stonecrop-editor-1.js` and the second throws "ModelService: Cannot add model because it
// already exists!" — its mounted hook aborts and only one editor loads.
let editorModelCounter = 0
</script>

<script setup lang="ts">
import loader from '@monaco-editor/loader'
import type * as Monaco from 'monaco-editor'
import type { editor } from 'monaco-editor'
import { onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { useTemplateRef } from 'vue'

import { theme } from '../theme/code_editor/agritheory'
import { toEditorString } from '../utils/serialization'

type EditorSchema = { language?: string; [key: string]: unknown }

const modelValue = defineModel<string>()
const {
	height = '300px',
	mode = 'edit',
	schema = undefined,
	language = undefined,
	options = undefined,
	vsPath = undefined,
	extraLibs = undefined,
	libs = undefined,
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
	/**
	 * Restrict the JS/TS language service to these lib files (e.g. `['es2020']` to keep
	 * the JS built-ins but drop the DOM/browser globals from type-checking and autocomplete).
	 * When omitted, Monaco's default libs apply — which include `dom`.
	 */
	libs?: string[]
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
	// The field declares its own language; without one, highlight nothing rather than guess.
	const lang = schema?.language ?? language ?? 'plaintext'

	// `monaco.languages.typescript` is deprecated in favour of this top-level namespace; both name
	// the same object at runtime, but only this one is typed (the old path is a `{ deprecated: true }`
	// tombstone). Needs monaco >= 0.53, so a `vsPath` override must serve a matching version.
	const ts = monacoInstance.typescript
	if (extraLibs) {
		ts.javascriptDefaults.addExtraLib(extraLibs, 'ts:stonecrop.d.ts')
	}
	if (extraLibs || libs) {
		ts.javascriptDefaults.setCompilerOptions({
			checkJs: true,
			noImplicitAny: false,
			// `lib` is authoritative — it replaces Monaco's default set, so passing e.g.
			// ['es2020'] retains the JS built-ins (Promise/Array/JSON/…) while removing the
			// DOM/browser globals. `target` is matched so ES2020 syntax isn't flagged.
			...(libs && {
				target: ts.ScriptTarget.ES2020,
				lib: libs,
			}),
		})
	}

	monacoInstance.editor.defineTheme('agritheory', theme)
	monacoInstance.editor.setTheme('agritheory')

	// Give the model a file:// URI so the TS worker recognises it as JS/TS and can
	// run getSyntacticDiagnostics without throwing "Could not find source file".
	const ext = lang === 'typescript' ? 'ts' : lang === 'json' ? 'json' : lang === 'python' ? 'py' : 'js'
	const modelUri = monacoInstance.Uri.parse(`file:///stonecrop-editor-${++editorModelCounter}.${ext}`)
	const editorModel = monacoInstance.editor.createModel(toEditorString(modelValue.value), lang, modelUri)

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
