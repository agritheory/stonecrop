<template>
	<div class="aform__form-element">
		<label class="aform__field-label" :for="uuid">{{ label }}</label>
		<input
			class="aform__input-field"
			v-model="inputNumber"
			type="number"
			:id="uuid"
			:disabled="readOnly"
			:required="required" />
		<p class="error" v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
const {
	label,
	required,
	readOnly,
	uuid,
	validation = { errorMessage: '&nbsp;' },
} = defineProps<{
	label?: string
	required?: boolean
	readOnly?: boolean
	uuid?: string
	validation?: Record<string, any>
}>()

const inputNumber = defineModel<number>()
</script>
