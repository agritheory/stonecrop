<template>
	<h3>Monaco Editor Vue3</h3>
	<MonacoEditor theme="vs" :options="options" language="javascript" :width="800" :height="600" v-model:value="test">
	</MonacoEditor>
</template>

<script setup lang="ts">
import MonacoEditor from 'monaco-editor-vue3'
import { ref } from 'vue'

const test = ref('')
const options = {
	colorDecorators: true,
	lineHeight: 24,
	tabSize: 2,
}
</script>
