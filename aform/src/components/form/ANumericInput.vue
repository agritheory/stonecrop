<template>
	<div class="aform_form-element">
		<input
			:id="uuid"
			v-model="inputNumber"
			class="aform_input-field"
			type="number"
			:disabled="readonly"
			:required="required" />
		<label class="aform_field-label" :for="uuid">{{ label }}</label>
		<p v-show="validation.errorMessage" class="aform_error" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { ComponentProps } from '../../types'

const {
	_schema, // don't remove to allow masking to work
	label,
	required,
	readonly,
	uuid,
	validation = { errorMessage: '&nbsp;' },
} = defineProps<ComponentProps>()
const inputNumber = defineModel<number>()
</script>
