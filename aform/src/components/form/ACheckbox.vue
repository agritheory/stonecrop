<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<label class="aform_field-label">{{ label }}</label>
			<span class="aform_display-value">{{ checkbox ? '✓' : '✗' }}</span>
		</template>
		<template v-else>
			<label class="aform_field-label" :for="uuid">{{ label }}</label>
			<span class="aform_checkbox-container aform_input-field">
				<input
					:id="uuid"
					v-model="checkbox"
					type="checkbox"
					class="aform_checkbox"
					:disabled="mode === 'read'"
					:required="required" />
			</span>
			<p v-show="errorText" class="aform_error" v-html="errorText"></p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, InputHTMLAttributes } from 'vue'

import { ComponentProps } from '../../types'

const { label, required, mode, uuid, errors, validation = { errorMessage: '' } } = defineProps<ComponentProps>()

// Dynamic trigger errors take precedence over a static schema errorMessage; empty means the slot hides.
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))

const checkbox = defineModel<InputHTMLAttributes['checked']>()
</script>

<style scoped>
.aform_checkbox {
	cursor: pointer;
	width: auto;
	margin-top: 0;
	display: block;
}

.aform_checkbox:checked {
	accent-color: var(--sc-primary-color);
	border: 1px solid black;
}

.aform_checkbox-container {
	width: 100%;
	display: inline-block;
	text-align: left;
}

.aform_checkbox-container input {
	width: auto;
}

.aform_checkbox-container:hover + .aform_field-label {
	color: var(--sc-input-active-label-color);
}
</style>
