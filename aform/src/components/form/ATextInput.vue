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

import { fieldErrorA11y, fieldErrorText } from '../../composables/fieldErrorA11y'
import { useStringMask as vMask } from '../../directives/mask'
import { ComponentProps } from '../../types'

const { label, mask, required, mode, uuid, errors, validation = { errorMessage: '' } } = defineProps<ComponentProps>()

// Only the errors the host reports; the schema's errorMessage words one that has no text. Empty hides the slot.
const errorText = computed(() => fieldErrorText(errors, validation))
const { errorId, describedBy, invalid } = fieldErrorA11y(uuid, errorText)

// TODO: setup maskFilled as a computed property
const maskFilled = ref(true)

// TODO: (state) replace with state management
// const locale = inject<string>('locale', '')

const inputText = defineModel<number | string>()
</script>
