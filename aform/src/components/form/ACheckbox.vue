<template>
	<div class="aform_form-element" :style="{ width: getElementwidth }">
		<template v-if="mode === 'display'">
			<label class="aform_field-label">{{ label }}</label>
			<span class="aform_display-value">{{ checkbox ? '✓' : '✗' }}</span>
		</template>
		<template v-else>
			<span class="aform_checkbox-container aform_input-field">
				<input
					:id="uuid"
					v-model="checkbox"
					type="checkbox"
					class="aform_checkbox"
					:disabled="mode === 'read'"
					:required="required" />
			</span>
			<label ref="label" class="aform_field-label" :for="uuid">{{ label }}</label>
			<p v-show="validation.errorMessage" class="aform_error" v-html="validation.errorMessage"></p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { InputHTMLAttributes, ref, onMounted, useTemplateRef, computed } from 'vue'

import { ComponentProps } from '../../types'

const { label, required, mode, uuid, validation = { errorMessage: '&nbsp;' } } = defineProps<ComponentProps>()
const checkbox = defineModel<InputHTMLAttributes['checked']>()

const totalWidth = ref(0)
const labelRef = useTemplateRef('label')
const paddingAmount = 20

onMounted(() => {
	totalWidth.value = labelRef.value.offsetWidth
	console.log(totalWidth.value)
})

const getElementwidth = computed(() => {
	return totalWidth.value + paddingAmount + 'px'
})
</script>

<style scoped>
.aform_form-element {
	min-width: auto;
	flex-grow: 0;
}
.aform_checkbox {
	cursor: pointer;
	width: auto;
	margin-top: 0;
	display: block;
}

.aform_checkbox:checked {
	accent-color: var(--sc-primary-color);
	border: 1px solid black;
}

.aform_checkbox-container {
	width: 100%;
	display: inline-block;
	text-align: left;
	height: 100%;
}

.aform_checkbox-container input {
	width: auto;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
}

.aform_checkbox-container:hover + .aform_field-label {
	color: var(--sc-input-active-label-color);
}
</style>
