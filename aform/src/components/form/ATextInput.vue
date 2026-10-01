<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ inputText ?? '' }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<input
				:id="uuid"
				v-model="inputText"
				v-mask="mask"
				class="aform_input-field"
				:disabled="mode === 'read'"
				:maxlength="mask ? (maskFilled ? mask.length : undefined) : undefined"
				:required="required"
				:aria-invalid="invalid"
				:aria-describedby="describedBy" />
			<label class="aform_field-label" :for="uuid">{{ label }} </label>
			<p v-show="errorText" :id="errorId" class="aform_error" role="alert">{{ errorText }}</p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { /* inject, */ computed, ref } from 'vue'

import { fieldErrorA11y } from '../../composables/fieldErrorA11y'
import { useStringMask as vMask } from '../../directives/mask'
import { ComponentProps } from '../../types'

const { label, mask, required, mode, uuid, errors, validation = { errorMessage: '' } } = defineProps<ComponentProps>()

// Dynamic trigger errors take precedence over a static schema errorMessage; empty means the slot hides.
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))
const { errorId, describedBy, invalid } = fieldErrorA11y(uuid, errorText)

// TODO: setup maskFilled as a computed property
const maskFilled = ref(true)

// TODO: (state) replace with state management
// const locale = inject<string>('locale', '')

const inputText = defineModel<number | string>()
</script>
