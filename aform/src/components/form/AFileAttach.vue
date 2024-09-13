<template>
	<div class="aform__form-element aform__file-attach aform__grid--full">
		
		
		<template v-if="files">
			<div class="aform__file-attach-feedback">
				<p>
					You have selected: <b>{{ `${files.length} ${files.length === 1 ? 'file' : 'files'}` }}</b>
				</p>
				<li v-for="file of files" :key="file.name">
					{{ file.name }}
				</li>
			</div>
		</template>
		<button type="button" @click="open()" class="aform__form-btn">
			{{ props.label }}
		</button>
		<button type="button" :disabled="!files" @click="reset()" class="aform__form-btn">Reset</button>
	</div>
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
