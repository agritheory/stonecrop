<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span class="aform_display-value aform_textbox-display">{{ inputText ?? '' }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<textarea
				:id="uuid"
				v-model="inputText"
				class="aform_input-field aform_textbox"
				:placeholder="placeholder"
				:rows="rows"
				:maxlength="maxlength"
				:disabled="mode === 'read'"
				:required="required"
				:aria-invalid="invalid"
				:aria-describedby="describedBy"></textarea>
			<label class="aform_field-label" :for="uuid">{{ label }}</label>
			<p v-show="errorText" :id="errorId" class="aform_error" role="alert">{{ errorText }}</p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { fieldErrorA11y, fieldErrorText } from '../../composables/fieldErrorA11y'
import { ComponentProps } from '../../types'

const {
	label,
	required,
	mode,
	uuid,
	errors,
	placeholder = '',
	rows = 4,
	maxlength,
} = defineProps<
	ComponentProps & {
		/** Placeholder shown when the field is empty */
		placeholder?: string
		/** Visible number of text lines (maps to the textarea `rows` attribute) */
		rows?: number
		/** Maximum number of characters the field will accept */
		maxlength?: number
	}
>()

// The errors this field is handed, already worded by AForm. Empty hides the slot.
const errorText = computed(() => fieldErrorText(errors))
const { errorId, describedBy, invalid } = fieldErrorA11y(uuid, errorText)

const inputText = defineModel<string | null>()
</script>

<style scoped>
.aform_textbox {
	resize: vertical;
	line-height: 1.5;
	min-height: 4rem;
	font-family: inherit;
}

.aform_textbox-display {
	white-space: pre-wrap;
}
</style>
