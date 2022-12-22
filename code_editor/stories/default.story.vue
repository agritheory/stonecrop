<template>
	<Story title="default">
		<ACodeEditor :language="language" :initialValue="initialValue" />
	</Story>
</template>

<script setup lang="ts">
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
</script>

<docs lang="md">
## Supported languages

The [Monaco editor](https://github.com/microsoft/monaco-editor) currently supports the following languages:

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
