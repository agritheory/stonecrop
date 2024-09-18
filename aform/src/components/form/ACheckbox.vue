<template>
	<div class="aform__form-element">
		<label class="aform__field-label" :for="uuid">{{ label }}</label>
		<span class="aform__checkbox-container aform__input-field">
			<input
				v-model="checkbox"
				type="checkbox"
				:id="uuid"
				class="aform__checkbox"
				:readonly="readonly"
				:required="required" />
		</span>
		<p class="error" v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script setup lang="ts">
import { InputHTMLAttributes } from 'vue'

import { ComponentProps } from '@/types'

const { label, required, readonly, uuid, validation = { errorMessage: '&nbsp;' } } = defineProps<ComponentProps>()
const checkbox = defineModel<InputHTMLAttributes['checked']>()
</script>
