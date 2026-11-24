<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ inputNumber ?? '' }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<input
				v-if="options.arithmetic !== false"
				v-bind="arithmetic.inputAttrs"
				:id="uuid"
				class="aform_input-field anumeric__input"
				:disabled="mode === 'read'"
				:required="required"
				:aria-invalid="invalid"
				:aria-describedby="describedBy" />
			<input
				v-else
				:id="uuid"
				v-model="boxNumber"
				class="aform_input-field anumeric__input"
				type="number"
				:disabled="mode === 'read'"
				:required="required"
				:aria-invalid="invalid"
				:aria-describedby="describedBy" />
			<label class="aform_field-label" :for="uuid">{{ label }}</label>
			<p v-show="errorText" :id="errorId" class="aform_error" role="alert">{{ errorText }}</p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { roundToPrecision, useArithmeticInput } from '@stonecrop/utilities'
import { computed } from 'vue'

import { fieldErrorA11y, fieldErrorText } from '../../composables/fieldErrorA11y'
import type { ComponentProps, NumericOptions } from '../../types'
import { numberFromBox } from '../../utils/emptiedBox'

const {
	label,
	required,
	mode,
	uuid,
	errors,
	options = {},
} = defineProps<ComponentProps & { options?: NumericOptions }>()

// The errors this field is handed, already worded by AForm. Empty hides the slot.
const errorText = computed(() => fieldErrorText(errors))
const { errorId, describedBy, invalid } = fieldErrorA11y(uuid, errorText)

const inputNumber = defineModel<number | null>()

const boxNumber = computed({
	get: () => inputNumber.value,
	set: (value: number | '') => {
		const n = numberFromBox(value)
		inputNumber.value = n === null ? null : roundToPrecision(n, options.precision)
	},
})

const arithmetic = useArithmeticInput({
	value: () => inputNumber.value,
	commit: value => (inputNumber.value = value),
	round: value => roundToPrecision(value, options.precision),
})
</script>

<style scoped>
/* A number is typed, not stepped: the spinner offers nothing here. */
.anumeric__input {
	appearance: textfield;
	-moz-appearance: textfield;
}

.anumeric__input::-webkit-outer-spin-button,
.anumeric__input::-webkit-inner-spin-button {
	appearance: none;
	-webkit-appearance: none;
	margin: 0;
}
</style>
