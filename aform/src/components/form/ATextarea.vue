<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ inputText ?? '' }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<textarea
				:id="uuid"
				v-model="inputText"
				class="aform_input-field aform_textarea"
				:disabled="mode === 'read'"
				:required="required"></textarea>
			<label class="aform_field-label" :for="uuid">{{ label }} </label>
			<p v-show="errorText" class="aform_error" v-html="errorText"></p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { ComponentProps } from '../../types'

const { label, required, mode, uuid, errors, validation = { errorMessage: '' } } = defineProps<ComponentProps>()

// Dynamic trigger errors take precedence over a static schema errorMessage; empty means the slot hides.
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))

const inputText = defineModel<number | string>()
</script>
