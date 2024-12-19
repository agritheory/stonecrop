<template>
	<div class="aform_form-element">
		<label class="aform_field-label" :for="uuid">{{ label }}</label>
		<span class="aform_checkbox-container aform_input-field">
			<input
				v-model="checkbox"
				type="checkbox"
				:id="uuid"
				class="aform_checkbox"
				:readonly="readonly"
				:required="required" />
		</span>
		<p class="aform_error" v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { InputHTMLAttributes } from 'vue'

import { ComponentProps } from '../../types'

const { label, required, readonly, uuid, validation = { errorMessage: '&nbsp;' } } = defineProps<ComponentProps>()
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
