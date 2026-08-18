<template>
	<Story title="default">
		<Variant title="edit mode">
			<div class="story-container">
				<ACodeEditor v-model="code" language="typescript" :options="{ minimap: { enabled: false } }" />
			</div>
		</Variant>

		<Variant title="read mode">
			<ACodeEditor v-model="code" language="typescript" mode="read" :options="{ minimap: { enabled: false } }" />
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { ACodeEditor } from '@stonecrop/code-editor'

const code = ref(`type Person = {
	name: string
}

type Company = {
	name: string
	manager: Person
}`)
</script>

<style scoped>
.story-container {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.live-value {
	margin: 0;
	padding: 8px 12px;
	background: var(--sc-input-field-background);
	border: 1px solid var(--sc-form-border);
	font-size: 12px;
	font-family: monospace;
	white-space: pre-wrap;
	min-height: 40px;
}
</style>

<docs lang="md">
## Supported languages

The [Monaco editor](https://github.com/microsoft/monaco-editor) currently supports the following languages:

Standard Worker:

- `batch`
- `c#`
- `c++`
- `coffeescript`
- `diff`
- `f#`
- `java`
- `lua`
- `markdown`
- `objective-c`
- `php`
- `powershell`
- `pug`
- `python`
- `r`
- `ruby`
- `sass`
- `vb`
- `xml`

JSON worker:

- `json`

CSS worker:

- `css`
- `scss`
- `less`

HTML worker:

- `html`
- `handlebars`
- `razor`

TypeScript worker:

- `typescript`
- `javascript`
</docs>
