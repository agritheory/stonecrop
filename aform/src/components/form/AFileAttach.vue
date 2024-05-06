<template>
	<button type="button" @click="open()">
		{{ props.label }}
	</button>
	&nbsp;
	<button type="button" :disabled="!files" @click="reset()">Reset</button>

	<template v-if="files">
		<div>
			<p>
				You have selected: <b>{{ `${files.length} ${files.length === 1 ? 'file' : 'files'}` }}</b>
			</p>
			<li v-for="file of files" :key="file.name">
				{{ file.name }}
			</li>
		</div>
	</template>
</template>

<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'
import { SchemaTypes } from 'types/index'

const props = defineProps<{
	schema: SchemaTypes[]
	label: string
	collapsible?: boolean
	data?: any
}>()

const { files, open, reset, onChange } = useFileDialog()

onChange(files => {
	return files
})
</script>
