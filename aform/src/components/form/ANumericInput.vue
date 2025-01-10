<template>
	<div class="aform_form-element">
		<input
			class="aform_input-field"
			v-model="inputNumber"
			type="number"
			:id="uuid"
			:disabled="readonly"
			:required="required" />
		<label class="aform_field-label" :for="uuid">{{ label }}</label>
		<p class="aform_error" v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { ComponentProps } from '../../types'

const {
	schema, // don't remove to allow masking to work
	label,
	required,
	readonly,
	uuid,
	validation = { errorMessage: '&nbsp;' },
} = defineProps<ComponentProps>()
const inputNumber = defineModel<number>()
</script>
