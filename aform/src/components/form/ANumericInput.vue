<template>
	<div class="aform__form-element">
		<label class="aform__field-label" :for="uuid">{{ label }}</label>
		<input class="aform__input-field" v-model="inputNumber" type="number" :id="uuid" :disabled="readonly" :required="required" />
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


