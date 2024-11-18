<template>
	<div class="aform_form-element aform_file-attach aform__grid--full">
		<template v-if="files">
			<div class="aform_file-attach-feedback">
				<p>
					You have selected: <b>{{ fileLengthText }}</b>
				</p>
				<li v-for="file of files" :key="file.name">
					{{ file.name }}
				</li>
			</div>
		</template>

		<button type="button" @click="open()" class="aform_form-btn">
			{{ label }}
		</button>
		<button type="button" :disabled="!files" @click="reset()" class="aform_form-btn">Reset</button>
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

<style scoped>
.aform_file-attach {
	padding: 1rem;
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border: 1px dashed var(--sc-input-border-color);
	width: 100%;
}

@media screen and (max-width: 400px) {
	.aform_file-attach > .aform_form-btn {
		width: 100%;
	}
}

.aform_file-attach-feedback {
	color: var(--sc-input-label-color);
	width: 100%;
	padding: 0.5rem;
	text-align: center;
	align-self: center;

	& > li {
		list-style: none;
		font-style: italic;
	}
	& > p {
		margin-top: 0;
	}
}

.aform_form-btn {
	padding: 0.5rem 2rem;
	width: auto;
	border: 1px solid var(--sc-input-border-color);
	color: var(--sc-input-label-color);
	cursor: pointer;
	background-color: white;
}

.aform_form-btn:disabled {
	background-color: var(--sc-gray-5);
}
</style>
