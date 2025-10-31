<template>
	<div class="aform_form-element">
		<input
			:id="uuid"
			v-model="inputText"
			v-mask="mask"
			class="aform_input-field"
			:disabled="readonly"
			:maxlength="mask ? (maskFilled ? mask.length : undefined) : undefined"
			:required="required" />
		<label class="aform_field-label" :for="uuid">{{ label }} </label>
		<p v-show="validation.errorMessage" class="aform_error" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { /* inject, */ ref } from 'vue'

import { useStringMask as vMask } from '../../directives/mask'
import { ComponentProps } from '../../types'

const {
	_schema, // don't remove to allow masking to work
	label,
	mask,
	required,
	readonly,
	uuid,
	validation = { errorMessage: '&nbsp;' },
} = defineProps<ComponentProps>()

// TODO: setup maskFilled as a computed property
const maskFilled = ref(true)

// TODO: (state) replace with state management
// const locale = inject<string>('locale', '')

const inputText = defineModel<number | string>()
</script>
