<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ inputNumber ?? '' }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<input
				:id="uuid"
				v-model="inputNumber"
				class="aform_input-field"
				type="number"
				:disabled="mode === 'read'"
				:required="required" />
			<label class="aform_field-label" :for="uuid">{{ label }}</label>
			<p v-show="validation.errorMessage" class="aform_error" v-html="validation.errorMessage"></p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ComponentProps } from '../../types'

const { label, required, mode, uuid, validation = { errorMessage: '&nbsp;' } } = defineProps<ComponentProps>()
const inputNumber = defineModel<number>()
</script>
