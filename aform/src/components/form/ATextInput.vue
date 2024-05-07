<template>
	<div class="aform__form-element">
		<label class="aform__field-label" :for="uuid">{{ label }} </label>
		<input
			class="aform__input-field"
			v-model="inputText"
			:id="uuid"
			:disabled="readonly"
			:maxlength="mask ? maskFilled && mask.length : undefined"
			:required="required"
			v-mask="mask" />
		<p class="error" v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, ref, computed } from 'vue'

import { FormSchema } from 'types'
import { useStringMask } from '@/directives/mask'

// TODO: when moving to composition API, figure out how to provide mask
// as a custom directive
export default defineComponent({
	name: 'ATextInput',
	props: {
		schema: {
			type: Object as PropType<FormSchema>,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		modelValue: {
			type: null as unknown as PropType<string | number>,
		},
		mask: {
			type: String,
		},
		required: {
			type: Boolean,
		},
		readonly: {
			type: Boolean,
		},
		uuid: {
			type: String,
		},
		validation: {
			type: Object,
			default: () => ({ errorMessage: '&nbsp;' }),
		},
	},
	setup(props, context) {
		const maskFilled = ref(false)

		// TODO: (state) replace with state management
		const locale = inject<string>('locale', '')

		const inputText = computed({
			get() {
				return props.modelValue
			},
			set(newValue) {
				context.emit('update:modelValue', newValue)
			},
		})

		return { inputText, locale, maskFilled }
	},
	directives: {
		mask: useStringMask,
	},
})
</script>