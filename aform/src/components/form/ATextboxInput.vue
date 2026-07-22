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
				:required="required"></textarea>
			<label class="aform_field-label" :for="uuid">{{ label }}</label>
			<p v-show="errorText" class="aform_error" v-html="errorText"></p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
	validation = { errorMessage: '' },
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

// Dynamic trigger errors take precedence over a static schema errorMessage; empty means the slot hides.
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))

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
