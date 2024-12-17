<template>
	<div class="aform_form-element">
		<input
			class="aform_input-field"
			v-model="inputText"
			:id="uuid"
			:disabled="readonly"
			:maxlength="mask ? maskFilled && mask.length : undefined"
			:required="required"
			v-mask="mask" />
		<label class="aform_field-label" :for="uuid">{{ label }} </label>
		<p class="aform_error" v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { /* inject, */ ref } from 'vue'

import { useStringMask as vMask } from '../../directives/mask'
import { ComponentProps } from '../../types'

const { label, mask, required, readonly, uuid, validation = { errorMessage: '&nbsp;' } } = defineProps<ComponentProps>()

// TODO: setup maskFilled as a computed property
const maskFilled = ref(true)

// TODO: (state) replace with state management
// const locale = inject<string>('locale', '')

const inputText = defineModel<number | string>()
</script>
