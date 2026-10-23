<template>
	<div class="aform_form-element a-editor" :class="`a-editor--${mode}`">
		<div
			v-if="mode === 'edit'"
			:id="uuid"
			ref="holder"
			class="aform_input-field a-editor__holder"
			role="group"
			:aria-labelledby="labelId"
			:aria-required="required || undefined"
			:aria-invalid="invalid"
			:aria-describedby="describedBy" />
		<!-- Rendered by renderBlocks, which rebuilds every stored tag, so v-html takes no markup from the value -->
		<!-- oxlint-disable-next-line vue/no-v-html -->
		<div
			v-else
			class="a-editor__static"
			:class="{ 'aform_input-field': mode === 'read' }"
			:aria-labelledby="labelId"
			v-html="staticHtml" />
		<label :id="labelId" class="aform_field-label">{{ label }}</label>
		<p v-if="mode === 'edit'" v-show="errorText" :id="errorId" class="aform_error" role="alert">{{ errorText }}</p>
	</div>
</template>

<script setup lang="ts">
import type EditorJS from '@editorjs/editorjs'
import { computed, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'

import type { EditorDocument } from '../types'
import { loadEditor } from '../utils/load'
import { renderBlocks } from '../utils/render'

const {
	label = '',
	mode = 'edit',
	uuid = undefined,
	required = false,
	errors = undefined,
	placeholder = '',
	validation = undefined,
} = defineProps<{
	/** The field's label */
	label?: string
	/** `edit` mounts Editor.js; `read` and `display` render the saved blocks as static HTML. */
	mode?: 'edit' | 'read' | 'display'
	/** The id that ties the label and error message to the editor */
	uuid?: string
	/** Whether the field must hold a document */
	required?: boolean
	/** Errors for this field, as AForm passes them */
	errors?: string[]
	/** Shown in the first empty block */
	placeholder?: string
	/** A static error message from the schema, shown when there are no `errors` */
	validation?: { errorMessage?: string }
}>()

/**
 * The document: Editor.js `OutputData` (`time`, `blocks`, `version`), or `null` for a field never edited. Each
 * change is emitted as the new object `save()` returns, and nothing here mutates an object once it is emitted.
 */
const model = defineModel<EditorDocument | null>({ default: null })

const labelId = computed(() => (uuid ? `${uuid}-label` : undefined))
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation?.errorMessage ?? '')))
const errorId = computed(() => (uuid ? `${uuid}-error` : undefined))
const describedBy = computed(() => (errorText.value ? errorId.value : undefined))
const invalid = computed(() => (errorText.value ? true : undefined))

const staticHtml = computed(() => renderBlocks(model.value))

const holder = useTemplateRef<HTMLDivElement>('holder')
const editor = shallowRef<EditorJS | null>(null)

/** The blocks of a document, as the text they compare by. A field never edited holds no blocks. */
const blocksKey = (value: EditorDocument | null | undefined) => JSON.stringify(value?.blocks ?? [])

/**
 * A copy of the bound value for Editor.js to hold. Editor.js keeps the object it is handed, and the bound one may
 * be the record's own value, which the operation log keeps by reference for undo.
 */
const editorData = (value: EditorDocument | null | undefined): EditorDocument | undefined =>
	value?.blocks?.length ? (JSON.parse(JSON.stringify(value)) as EditorDocument) : undefined

// Each mount gets its own number, so a mode change that destroys an editor while another is still starting
// leaves the newer one alone.
let generation = 0
// The last document this editor emitted. When it comes back bound, the editor already shows it.
let lastEmitted: EditorDocument | undefined

async function mountEditor() {
	const current = ++generation
	const el = holder.value
	if (!el) return
	const { EditorJS: Editor, tools } = await loadEditor()
	if (current !== generation || !holder.value) return

	const instance = new Editor({
		holder: el,
		data: editorData(model.value),
		placeholder: placeholder || undefined,
		minHeight: 0,
		tools,
		onChange: async api => {
			const saved = await api.saver.save()
			// Editor.js reports a change for a render or a focus as well as an edit. Only a change to the blocks is
			// emitted, so a field the user has not edited stays null.
			if (current !== generation || blocksKey(saved) === blocksKey(model.value)) return
			lastEmitted = saved
			model.value = saved
		},
	})
	editor.value = instance
	await instance.isReady
}

async function destroyEditor() {
	generation++
	const instance = editor.value
	editor.value = null
	if (!instance) return
	try {
		await instance.isReady
		instance.destroy()
	} catch {
		// It failed to start, so there is nothing to tear down.
	}
}

// A value set from outside, such as undo or a reloaded record, is shown in the editor. A value this editor
// emitted already matches its blocks, so it is not rendered again, which would move the caret.
watch(
	() => model.value,
	async value => {
		const instance = editor.value
		if (!instance || value === lastEmitted) return
		await instance.isReady
		if (instance !== editor.value) return
		const shown = await instance.save()
		if (blocksKey(shown) === blocksKey(value)) return
		const data = editorData(value)
		if (data) await instance.render(data)
		else instance.clear()
	}
)

watch(
	() => mode,
	async m => {
		await destroyEditor()
		if (m === 'edit') await mountEditor()
	},
	// After the render, so the holder the mode change brings in is there to mount on.
	{ flush: 'post' }
)

onMounted(() => {
	if (mode === 'edit') void mountEditor()
})

onBeforeUnmount(() => {
	void destroyEditor()
})
</script>

<style>
.a-editor__holder {
	min-height: 6rem;
	padding: 0.5rem 0.75rem;
}

.a-editor__holder .codex-editor__redactor {
	padding-bottom: 1rem !important;
}

.a-editor__holder .ce-block__content,
.a-editor__holder .ce-toolbar__content {
	max-width: none;
}

.a-editor__static {
	display: block;
	padding: 0.5rem;
	min-height: 2rem;
	color: var(--sc-cell-text-color);
	word-break: break-word;
}

.a-editor__static > :first-child {
	margin-top: 0;
}

.a-editor__static > :last-child {
	margin-bottom: 0;
}

.a-editor__static blockquote {
	margin: 0.75rem 0;
	padding-left: 1rem;
	border-left: 3px solid var(--sc-input-border-color);
}

.a-editor__static blockquote cite {
	display: block;
	font-size: 0.875em;
	opacity: 0.75;
}

.a-editor__static .a-editor__quote--center {
	text-align: center;
}

.a-editor__static hr {
	border: none;
	text-align: center;
	margin: 1rem 0;
}

.a-editor__static hr::before {
	content: '***';
	letter-spacing: 0.5em;
}

.a-editor__static .a-editor__checklist {
	list-style: none;
	padding-left: 0.25rem;
}

.a-editor__static .a-editor__checked {
	text-decoration: line-through;
	opacity: 0.75;
}
</style>
