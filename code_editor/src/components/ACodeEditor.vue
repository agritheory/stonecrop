<template>
	<div ref="container" id="container"></div>
</template>

<script setup lang="ts">
import loader from '@monaco-editor/loader'
import { onMounted, ref } from 'vue'

import { theme } from '@/theme/agritheory'

const props = defineProps<{
	language: string
	initialValue?: string
}>()

const editorOptions = {
	colorDecorators: true,
	lineHeight: 24,
	dimension: {
		width: 800,
		height: 600,
	},
}

const container = ref(null)

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
