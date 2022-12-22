<template>
	<Story title="default">
		<ACodeEditor :language="language" :initial-value="initialValue" />
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
