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
			<p v-show="validation.errorMessage" class="aform_error" v-html="validation.errorMessage"></p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { /* inject, */ ref } from 'vue'

import { useStringMask as vMask } from '../../directives/mask'
import { ComponentProps } from '../../types'

const { label, mask, required, mode, uuid, validation = { errorMessage: '&nbsp;' } } = defineProps<ComponentProps>()

// TODO: setup maskFilled as a computed property
const maskFilled = ref(true)

// TODO: (state) replace with state management
// const locale = inject<string>('locale', '')

const inputText = defineModel<number | string>()
</script>
