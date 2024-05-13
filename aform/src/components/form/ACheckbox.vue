<template>
	<div class="aform__form-element">
		<label class="aform__field-label" :for="uuid">{{ label }}</label>
		<span class="aform__checkbox-container aform__input-field">
			<input v-model="checkbox" type="checkbox" :id="uuid" class="aform__checkbox" :readonly="readOnly" :required="required" />
		</span>
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
