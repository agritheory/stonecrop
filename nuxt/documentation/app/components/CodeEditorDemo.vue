<script setup lang="ts">
import { ref } from 'vue'
import { ACodeEditor } from '@stonecrop/code-editor'

const code = ref(`function greet(name: string): string {
	return \`Hello, \${name}!\`
}`)
</script>

<template>
	<div class="stonecrop-demo">
		<ACodeEditor v-model="code" language="typescript" height="200px" :options="{ minimap: { enabled: false } }" />
	</div>
</template>
