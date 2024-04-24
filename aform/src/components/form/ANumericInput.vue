<template>
	<div class="form-element">
		<label class="field-label" :for="uuid">{{ label }}</label>
		<input class="input-field" v-model="inputNumber" type="number" :id="uuid" :disabled="readonly" :required="required" />
		<p class="error" v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		label: string
		required?: boolean
		readonly?: boolean
		uuid?: string
		validation?: Record<string, any>
	}>(),
	{
		validation: () => ({ errorMessage: '&nbsp;' }),
	}
)

const inputNumber = defineModel<number>()
</script>

<style>
@import url('@/theme/fields.css');
</style>
