<template>
	<div class="form-element">
		<label class="field-label" :for="uuid">{{ label }}</label>
		<label class="checkbox-container input-field">
			<input v-model="checkbox" type="checkbox" :id="uuid" class="checkbox" :readonly="readOnly" :required="required" />
			<span class="custom-checkbox">{{ checkbox }}</span>
		</label>
		<p class="error" v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { InputHTMLAttributes } from 'vue'

withDefaults(
	defineProps<{
		label?: string
		required?: boolean
		readOnly?: boolean
		uuid?: string
		validation?: Record<string, any>
	}>(),
	{
		validation: () => ({ errorMessage: '&nbsp;' }),
	}
)

const checkbox = defineModel<InputHTMLAttributes['checked']>()
</script>

<style>
@import url('@/theme/fields.css');

</style>
