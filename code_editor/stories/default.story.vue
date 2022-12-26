<template>
	<Story title="default">
		<ACodeEditor :language="language" :initialValue="initialValue" :options="options" style="height: 400px" />
	</Story>
</template>

<script setup lang="ts">
import { editor } from 'monaco-editor'

import { ACodeEditor } from '@/index'

const language = 'typescript'
const initialValue = `
type Person = {
  name: string
}

type Company = {
  name: string
  manager: Person
}
`

const options: editor.IEditorOptions = {
	minimap: {
		enabled: false,
	},
}
</script>

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
