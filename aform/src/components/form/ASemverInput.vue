<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ version ?? '' }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<input
				:id="uuid"
				:value="text"
				class="aform_input-field"
				autocomplete="off"
				spellcheck="false"
				:disabled="mode === 'read'"
				:required="required"
				:aria-invalid="invalid"
				:aria-describedby="describedBy"
				@input="onInput" />
			<label class="aform_field-label" :for="uuid">{{ label }}</label>
			<p v-show="errorText" :id="errorId" class="aform_error" role="alert">{{ errorText }}</p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { isSemver, isSemverPrefix } from '@stonecrop/utilities'
import { computed, ref, watch } from 'vue'

import { fieldErrorA11y } from '../../composables/fieldErrorA11y'
import { ComponentProps } from '../../types'

const { label, required, mode, uuid, errors, validation = { errorMessage: '' } } = defineProps<ComponentProps>()

// Dynamic trigger errors take precedence over a static schema errorMessage; empty means the slot hides.
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))
const { errorId, describedBy, invalid } = fieldErrorA11y(uuid, errorText)

const version = defineModel<string | null>()

// The box can hold a version still being typed (`1.4.`), which the field holds as null until it is
// whole, the way a date box holds null until every part of the day is filled.
const text = ref('')
const versionIn = (boxText: string) => (isSemver(boxText) ? boxText : null)

// Show a value arriving from outside, unless the box already holds a draft of it. Only an edit
// reports a value, so a record loading into the form never reads as a change.
watch(
	version,
	value => {
		if (versionIn(text.value) !== (value ?? null)) text.value = value ?? ''
	},
	{ immediate: true }
)

const onInput = (event: Event) => {
	const box = event.target as HTMLInputElement

	// Refuse an edit leaving text that no version starts with, and put the caret back where it was.
	// Text already like that, saved before the field checked it, takes any edit so it can be fixed.
	if (!isSemverPrefix(box.value) && isSemverPrefix(text.value)) {
		const caret = Math.max(0, (box.selectionStart ?? box.value.length) - (box.value.length - text.value.length))
		box.value = text.value
		box.setSelectionRange(caret, caret)
		return
	}

	text.value = box.value
	const next = versionIn(box.value)
	if (next !== (version.value ?? null)) version.value = next
}
</script>
