<template>
	<div class="aform__form-element">
		<label class="aform__field-label" :for="uuid">{{ label }} </label>
		<input
			class="aform__input-field"
			v-model="inputText"
			:id="uuid"
			:disabled="readonly"
			:maxlength="mask ? maskFilled && mask.length : undefined"
			:required="required"
			v-mask="mask" />
		<p class="error" v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'

import { FormSchema } from 'types'
import { useStringMask as vMask } from '@/directives/mask'

withDefaults(
	defineProps<{
		schema: FormSchema
		label: string
		mask?: string
		required?: boolean
		readonly?: boolean
		uuid?: string
		validation?: { errorMessage: string }
	}>(),
	{
		validation: () => ({ errorMessage: '&nbsp;' }),
	}
)

// TODO: setup maskFilled as a computed property
const maskFilled = ref(true)

// TODO: (state) replace with state management
// const locale = inject<string>('locale', '')

const inputText = defineModel<number | string>()
</script>
