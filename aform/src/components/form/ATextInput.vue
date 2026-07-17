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
				:required="required" />
			<label class="aform_field-label" :for="uuid">{{ label }} </label>
			<p v-show="errorText" class="aform_error" v-html="errorText"></p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { /* inject, */ computed, ref } from 'vue'

import { useStringMask as vMask } from '../../directives/mask'
import { ComponentProps } from '../../types'

const { label, mask, required, mode, uuid, errors, validation = { errorMessage: '' } } = defineProps<ComponentProps>()

// Dynamic trigger errors take precedence over a static schema errorMessage; empty means the slot hides.
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))

// TODO: setup maskFilled as a computed property
const maskFilled = ref(true)

// TODO: (state) replace with state management
// const locale = inject<string>('locale', '')

const inputText = defineModel<number | string>()
</script>
