<template>
	<div class="aform__form-element aform__file-attach aform__grid--full">
		<template v-if="files">
			<div class="aform__file-attach-feedback">
				<p>
					You have selected: <b>{{ fileLengthText }}</b>
				</p>
				<li v-for="file of files" :key="file.name">
					{{ file.name }}
				</li>
			</div>
		</template>

		<button type="button" @click="open()" class="aform__form-btn">
			{{ label }}
		</button>
		<button type="button" :disabled="!files" @click="reset()" class="aform__form-btn">Reset</button>
	</div>
</template>

<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'
import { computed } from 'vue'

const { label } = defineProps<{ label: string }>()
const { files, open, reset, onChange } = useFileDialog()

const fileLengthText = computed(() => {
	return `${files.value.length} ${files.value.length === 1 ? 'file' : 'files'}`
})

onChange(files => files)
</script>
