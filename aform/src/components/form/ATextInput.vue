<template>
	<div>
		<input
			v-model="inputText"
			:id="uuid"
			:disabled="readonly"
			:maxlength="mask ? maskFilled && mask.length : undefined"
			:required="required"
			v-mask="mask" />
		<label :for="uuid">{{ label }} </label>
		<p v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
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

<style scoped>
div {
	min-width: 40ch;
	border: 1px solid transparent;
	padding: 0rem;
	margin: 0rem;
	margin-right: 1ch;
}

input {
	width: calc(100% - 1ch);
	outline: 1px solid transparent;
	border: 1px solid var(--input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	min-height: 1.15rem;
	border-radius: 0.25rem;
}

p,
label {
	color: var(--input-label-color);
	display: block;
	min-height: 1.15rem;
	padding: 0rem;
	margin: 0rem;
	border: 1px solid transparent;
	margin-bottom: 0.25rem;
}

p {
	width: 100%;
	color: red;
	font-size: 85%;
}

label {
	z-index: 2;
	font-size: 80%;
	position: absolute;
	background: white;
	margin: calc(-1.5rem - calc(2.15rem / 2)) 0 0 1ch;
	padding: 0 0.25ch 0 0.25ch;
}

input:focus {
	border: 1px solid var(--input-active-border-color);
}

input:focus + label {
	color: var(--input-active-label-color);
}
</style>
